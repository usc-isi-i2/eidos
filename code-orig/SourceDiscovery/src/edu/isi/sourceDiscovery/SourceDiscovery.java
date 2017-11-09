package edu.isi.sourceDiscovery;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.PrintStream;
import java.net.URL;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.jdom.JDOMException;

import com.fetch.naturallanguage.formextractor.FormElement;
import com.fetch.naturallanguage.formextractor.FormFieldElement;
import com.fetch.naturallanguage.formextractor.HtmlDocument;
import com.fetch.naturallanguage.formextractor.FormFieldElement.ElementType;

import edu.isi.semanticMapper.labeler.ComplexTypeSemanticLabeler;
import edu.isi.semanticMapper.labeler.ILabelScore;
import edu.isi.semanticMapper.labeler.ISemanticLabeler;
import edu.isi.semanticMapper.labeler.InvalidDataTypeException;
import edu.isi.sourceDiscovery.autowrap.AutoWrapInterface;
import edu.isi.sourceDiscovery.common.PermutationGenerator;
import edu.isi.sourceDiscovery.common.Util;
import edu.isi.sourceDiscovery.config.ConfigurationParser;
import edu.isi.sourceDiscovery.config.Domain;
import edu.isi.sourceDiscovery.config.InputSet;
import edu.isi.sourceDiscovery.config.Output;
import edu.isi.sourceDiscovery.config.OutputSet;
import edu.isi.sourceDiscovery.config.SampleConfiguration;
import edu.isi.sourceDiscovery.config.SampleException;
import edu.isi.sourceDiscovery.formInvocation.FormInvoker;
import edu.isi.sourceDiscovery.formInvocation.HttpMethod;
import edu.isi.sourceDiscovery.logreg.FormElementTranslator;
import edu.isi.sourceDiscovery.logreg.LogRegTestDLLCaller;

public class SourceDiscovery {

	private static String CLASSIFIER_INPUT_FILENAME = System.getProperty("user.dir") + "/data/logreg_input.txt";

	private static String CLASSIFIER_OUTPUT_PROBABILITY = System.getProperty("user.dir") + "/data/logreg_output_probability.txt";

	private static String CLASSIFIER_OUTPUT_SORTED = System.getProperty("user.dir") + "/data/logreg_output_sorted.txt";
		
		
	public static String domainConfigurationFilename = "config/DomainConfig.xml";
		
	public static float MINIMUM_LABELING_CONFIDENCE = 1.0f;
	
	private ConfigurationParser configParser;
	private PrintStream log;
	private int verboseLevel = 1;
	
	private LogRegTestDLLCaller logregClassifier;
	private String classifierIndexFilename;
	private String classifierModelFilename;
	
	private int numExamplePages;
	private AutoWrapInterface autowrap;
	
	private ISemanticLabeler semanticLabeler;
	
	public boolean formMatchedDomain = false;
	
	public Domain doFormClassification(FormElement form) throws Exception {	
		//Store the form inputs into the file required by the classifier
		FormElementTranslator.generateLogRegInputFile(form, 
				classifierIndexFilename, CLASSIFIER_INPUT_FILENAME);
		//Execute the classifier		
		logregClassifier.run();
		int matchedIndex = logregClassifier.getIndexOfHighestProbabilityMatch();
		Domain matchedDomain = configParser.getDomain(matchedIndex);
		
		return matchedDomain;
	}
	
	public List<HashMap<String, String>> generateMappingsFromFormFieldsToSampleName(
			FormElement form, List<String> sampleNames) {

		List<HashMap<String, String>> mappings = new ArrayList<HashMap<String, String>>();

		List<String> fieldNames = new ArrayList<String>();
		for (FormFieldElement formElement : form.getFields()) {
			if (formElement.getType() == ElementType.TEXT
					|| formElement.getType() == ElementType.SELECT)
				fieldNames.add(formElement.getName());
		}

		if(fieldNames.size() >= sampleNames.size()) {
			PermutationGenerator<String> permGen = new PermutationGenerator<String>();
			List<String[]> permGenInitValues = new ArrayList<String[]>();
			int numCols = sampleNames.size();
			for (int i = 0; i < numCols; i++) {
				permGenInitValues.add(new String[numCols]);
			}
			for (int i = 0; i < numCols; i++) {
				for (int j = 0; j < numCols; j++) {
					permGenInitValues.get(i)[j] = sampleNames.get(j);
				}
			}
			permGen.initialize(permGenInitValues);
	
			while (permGen.hasMorePermutation()) {
				List<String> permutation = permGen.getNextPermutation();
				HashMap<String, String> mapping = new HashMap<String, String>();
				boolean invalidMapping = false;
				
				for (int i = 0; i < permutation.size() && i < fieldNames.size(); i++) {
					String value = permutation.get(i);
					if(mapping.containsValue(value)) {
						invalidMapping = true;
						break;
					}
					mapping.put(fieldNames.get(i), permutation.get(i));
				}
				
				if(!invalidMapping)
					mappings.add(mapping);
			}
		}
		
		return mappings;
	}
	
	public String getSemanticType(String fieldName, InputSet inputSet) {
		SampleConfiguration sampleConfig = configParser.getSampleConfiguration(
				inputSet.getSampleConfig());
		return sampleConfig.getSemanticTypeOfField(fieldName);
	}
	
	/**
	 * It runs the source modeling algorithm on the passed URL and if a model 
	 * can be constructed, it generates one and returns it
	 * If it is expected that the web page should be modeled to belong to a
	 * particular domain, modelDomain should be set as the name of the domain.
	 * In that case, if the form classification does not classify any of the 
	 * forms to belong to the that domain, it does not run the algorithm any further (invoking the form..)
	 * 
	 * It extracts all forms from the webpages and runs the classifier on them to
	 * indenitify the domain. Then it gets the sample inputs for the domain,
	 * invokes the forms, gets back the result pages, gives the result pages to autowrap to
	 * extract data, and then runs semantic labeler on the extracted data to
	 * know the semantic types of the resulting data. If the resulting data has 
	 * some X% of semantic types that belong to the outputs of the domain, it
	 * constructs a Source Model and returns it.
	 * 
	 * It runs till it can find the first form for which it can generate the
	 * model successfully.
	 * 
	 * @param url - The URL of the source
	 * @param modelDomain - The domain in which thpage should be classified into. 
	 * 	It should be set to NULL if its fine that the web page could be classified into
	 * any of the domains
	 * @return
	 * @throws Exception
	 */
	public SourceModel modelSource(String url, String modelDomain) throws Exception {		
				
		HtmlDocument doc = new HtmlDocument(new URL(url));		
		List<FormElement> forms = doc.execute();
		url = doc.getURL().toString(); //URL might have been redirected. Get back the actual URL
		
		if(forms == null)	
			return null;
		
		formMatchedDomain = false;
		
		for(int formIdx=0; formIdx<forms.size(); formIdx++) {
			
			FormElement form = forms.get(formIdx);
			if(form != null) {					
				if(verboseLevel > 0) {
					log.println("\n---------------------------------------------------------------------");
					log.println("Form: " + form.getName() + ":" + form.getUrl() + ":" + form.getMethod());
				}
				
				Domain domain = this.doFormClassification(form);
								
				if(verboseLevel > 0)				
					log.println("Matched domain: " + domain.getName());
				
				if(!domain.isUnknown() && (modelDomain == null || modelDomain.equalsIgnoreCase(domain.getName()))) {
					formMatchedDomain = true;
					
					List<InputSet> inputSets = domain.getInputSets();
					
					for(int inputNum=0; inputNum<inputSets.size(); inputNum++) {
						InputSet inputSet = inputSets.get(inputNum);
						
						List<HashMap<String, String>> fieldSampleMappings = 
								this.generateMappingsFromFormFieldsToSampleName(form, inputSet.getInputNames());
						
						for(int mapIdx=0; mapIdx<fieldSampleMappings.size(); mapIdx++) {
							HashMap<String, String> formFieldSampleMapping = fieldSampleMappings.get(mapIdx);
						
							List<String> outputWebpages = this.invokeForm(url, form, inputSet, formFieldSampleMapping);
							ArrayList<ArrayList<String>> extractedData = this.invokeAutowrap(outputWebpages);
							if(extractedData != null && extractedData.size() > 0) {
								if(verboseLevel > 0) {
									log.println("\nFlattened Data after Autowrap:");
									Util.printMatrix(extractedData, log, ",", true);
								}
								ArrayList<ILabelScore[]> topColumnLabels = this.semanticallyLabelData(extractedData);									
								if(topColumnLabels != null) {
									for(OutputSet outputSet : domain.getOutputSets()) {
										HashMap<Integer, ILabelScore> matchedDatatypes = this.validateDomainOutputsWithColumnLabels(outputSet, topColumnLabels);
										if(matchedDatatypes != null) {
											SourceModel sourceModel = new SourceModel(domain.getName(),
																					url, 
																					form.getName(), 
																					HttpMethod.getMethod(form.getMethod()),
																					form.getWellformedURL(url));
											//Add the inputs to the model
											for(String fieldName : formFieldSampleMapping.keySet()) {
												String sampleName = formFieldSampleMapping.get(fieldName);
												String sampleType = this.getSemanticType(sampleName, inputSet);
												sourceModel.addInputField(fieldName, sampleType);
											}
											
											//Set the outputs of the model
											for(ILabelScore[] columnLabel : topColumnLabels) {
												sourceModel.addOutputFieldType(columnLabel);
											}
											//Set the outputs that match the domain
											for(Integer columnNum : matchedDatatypes.keySet()) {
												sourceModel.addOutputColumnMatchingDomain(columnNum, matchedDatatypes.get(columnNum));
											}
											
											return sourceModel;
										}
									}
								}
							} else {
								log.println("\nFlattened Data after Autowrap: NO DATA EXTRACTED");
							}
							
						}
					}
				}
			}
		}
		return null;
	}
	
	/**
	 * Initializes the Source Discovery Worflow
	 * @param configurationFilename - The name of the domain and samples configutaion file (.XML file)
	 * @param numExamplePages	- The number of samples to use for invoking forms / giving sample pages to autowrap
	 * @param classsifierModelFilename	- Full Path to the model.mat file required by the log reg classfier
	 * @param classifierIndexFilename - Full Path to the index.dat file required by the log reg classfier
	 * @param semanticLabelerModelFilename - Full Path to the patterns file required by the semantic labeler
	 * @param semanticLabelerNumberOfPredictions - Number of predictions that the semantic labeler should generate
	 * @param log	- Stream for logging all steps that are performed
	 * @param verboseLevel - Level of logging. Use 0 for none, 1 for normal, 2 for extensive
	 * @throws JDOMException
	 * @throws ClassNotFoundException
	 * @throws SQLException
	 * @throws IOException
	 * @throws InvalidDataTypeException
	 */
	public void initialize(String configurationFilename, int numExamplePages,
							String classsifierModelFilename,
							String classifierIndexFilename,
							String semanticLabelerModelFilename,
							int semanticLabelerNumberOfPredictions,
							PrintStream log,
							int verboseLevel) throws JDOMException, 
																			ClassNotFoundException, 
																			SQLException, 
																			IOException,
																			InvalidDataTypeException{
		this.numExamplePages = numExamplePages;
		this.classifierModelFilename = classsifierModelFilename;
		this.classifierIndexFilename = classifierIndexFilename;
		this.log = log;
		this.verboseLevel = verboseLevel;
		
		//Parse the Domain and Samples Configuration files
		SampleConfiguration.MAX_SAMPLES = numExamplePages;
		configParser = new ConfigurationParser(domainConfigurationFilename);
		
		
		//Initialize the logreg classifier for classifying the forms
		logregClassifier = new LogRegTestDLLCaller(CLASSIFIER_INPUT_FILENAME, 
				this.classifierModelFilename, 
				CLASSIFIER_OUTPUT_SORTED, 
				CLASSIFIER_OUTPUT_PROBABILITY);
		
		FormInvoker.log = log;
		HtmlDocument.log = log;
		FormElementTranslator.log = log;
		
		autowrap = new AutoWrapInterface();
		
		semanticLabeler = new ComplexTypeSemanticLabeler();
		ComplexTypeSemanticLabeler._USE_META_LABELER = false; //disable Meta Labeler for performace reasons
		ComplexTypeSemanticLabeler._verboseLevel = verboseLevel;
		ComplexTypeSemanticLabeler._log = log;
		semanticLabeler.initialize(new FileInputStream(semanticLabelerModelFilename), 
								semanticLabelerNumberOfPredictions);
	}
	
	public ArrayList<ArrayList<String>> invokeAutowrap(List<String> samplePages) {
		if(samplePages.size() > 0) {
			try {
				autowrap.invokeAutoWrap(samplePages);
				return autowrap.getFlattenedResultsOneRowPerPage();
			} catch (Exception e) {
				e.printStackTrace();
				return null;
			}
		}	
		return null;
	}
	
	public ArrayList<String> invokeForm(String webpageURL, FormElement form, InputSet inputSet, HashMap<String, String> fieldSampleMapping) throws SQLException, ClassNotFoundException, SampleException {
		
		ArrayList<String> outputPages = new ArrayList<String>();
		
		String url = form.getWellformedURL(webpageURL);
		if(!url.equals("")) {
			FormInvoker invoker = new FormInvoker(url,
												  HttpMethod.getMethod(form.getMethod()));
					
			SampleConfiguration sampleConfig = configParser.getSampleConfiguration(
															inputSet.getSampleConfig());
	
			// Load the samples if they are not already loaded
			if(sampleConfig.isLazyLoad() && !sampleConfig.isDataLoaded())
				sampleConfig.loadSamples();
	
				
			// Get the sample values from the configuration
			ArrayList<ArrayList<String>> samples = sampleConfig.getSamples(inputSet.getInputNames(), 
																		numExamplePages);
			
			for(int k=0; k<samples.size(); k++) {										
				ArrayList<String> formFieldNames = new ArrayList<String>();
				ArrayList<String> formFieldValues = new ArrayList<String>();
	
				generateFieldNamesAndValues(form, fieldSampleMapping, inputSet.getInputNames(), samples.get(k), formFieldNames, formFieldValues);
				try {
					String html = invoker.invoke(formFieldNames, formFieldValues);
					outputPages.add(html);
					if(verboseLevel > 0 && k==0) {
						log.println();
						log.println(html);
						log.println();
					}
				} catch (Exception e) {
					e.printStackTrace(log);
				}
				
			}
		}
		return outputPages;
	}
	
	public ArrayList<ILabelScore[]> semanticallyLabelData(ArrayList<ArrayList<String>> examples) {
		int numCols = semanticLabeler.labelExamples(examples);
		
		ArrayList<ILabelScore[]> topLabels = new ArrayList<ILabelScore[]>();
		
		for(int i=0; i<numCols; i++) {
			ILabelScore[] topColumnLabels = semanticLabeler.getColumnLabels(i);			
			topLabels.add(topColumnLabels);
		}
		
		return topLabels;
	}

	public HashMap<Integer, ILabelScore> validateDomainOutputsWithColumnLabels(OutputSet outputSet, List<ILabelScore[]> columnLabels) {
		boolean validated = false;
		
		float percentageMatches = outputSet.getPercentageMatchesRequired();
		int numOutputs = outputSet.getNumberOfOutputs();
		int numRequiredOutputs = 0;
		
		//Create List allOutputs = {all required outputs followed by all optional outputs }
		ArrayList<Output> allOutputs = new ArrayList<Output>();
		ArrayList<Output> optionalOutputs = new ArrayList<Output>();
		ArrayList<ArrayList<Integer>> outputMatchingLabels = new ArrayList<ArrayList<Integer>>();
		for(Output output : outputSet.getOutputs()) {
			if(output.isRequired()) {
				allOutputs.add(output);
				numRequiredOutputs++;
			} else {
				optionalOutputs.add(output);
			}
			outputMatchingLabels.add(new ArrayList<Integer>());
		}
		
		allOutputs.addAll(optionalOutputs);
		
		//Find columns that match each output
		for(int col=0; col<columnLabels.size(); col++) {			
			for(ILabelScore labelScore : columnLabels.get(col)) {
				if(labelScore.getScore() < MINIMUM_LABELING_CONFIDENCE)
					continue;
				
				for(int i=0; i<allOutputs.size(); i++) {
					Output output = allOutputs.get(i);
					if(output.getValueDomains().contains(labelScore.getLabelName())) {
						ArrayList<Integer> matchingLabels = outputMatchingLabels.get(i);
						Integer colObj = new Integer(col);
						if(!matchingLabels.contains(colObj))
							matchingLabels.add(colObj);
					}
				}
			}
		}
		
		//Check that all required labels have an assignment
		for(int i=0; i<allOutputs.size(); i++) {
			Output output = allOutputs.get(i);
			if(!output.isRequired())
				break;
			if(outputMatchingLabels.get(i).size() == 0) {
				if(verboseLevel > 0)
					log.println("Required attribute: " + output + " got no assignment!");
				return null; //Was not validated as a required attribute had no match
			}
		}
		
		int sizeBiggestAssignment = 0;
		for(int col=0; col<outputMatchingLabels.size(); col++) {			
			if(outputMatchingLabels.get(col).size() > 0)
				sizeBiggestAssignment++;
		}
		
		PermutationGenerator<Integer> permGen = new PermutationGenerator<Integer>();
		permGen.initialize2(outputMatchingLabels);
		int sizeValidAsssignment = 0;
		List<Integer> biggestValidAssign = new ArrayList<Integer>();
		int weightOfValidAssignment = 0;
		
		while(permGen.hasMorePermutation()) {
			ArrayList<Integer> perm = permGen.getNextPermutation();
			boolean validPerm = true;
			List<Integer> validAssignment = new ArrayList<Integer>();
			int numNotNull = 0;
			int weight = 0;
			
			int numNotNullInPerm = 0;
			for(int i=0; i<perm.size(); i++) {				
				Integer value = perm.get(i);
				if(value != null) {
					numNotNullInPerm++;					
				}
			}
			
			for(int i=0; i<perm.size(); i++) {
				Output output = allOutputs.get(i);
				Integer value = perm.get(i);
				if(value == null) {
					validAssignment.add(null);
					continue;
				}
				
				if(validAssignment.contains(value)) {
					if(output.isRequired()) {
						validPerm = false;
						break;
					} else {
						validAssignment.add(null);
					}
				} else {
					validAssignment.add(value);
					numNotNull++;
					weight += output.getWeight();
				}
				
				if(validPerm && (numNotNull > sizeValidAsssignment)) {
					sizeValidAsssignment = numNotNull;					
					if(weight > weightOfValidAssignment) {
						weightOfValidAssignment = weight;
						biggestValidAssign.clear();
						biggestValidAssign.addAll(validAssignment);
					}
					if(sizeValidAsssignment >= numNotNullInPerm)
						break; //Maximum size assignment is found
				}
			}
			if(sizeValidAsssignment >= sizeBiggestAssignment)
				break;
		}
		
		if(weightOfValidAssignment > 0) {
			int numOptionals = weightOfValidAssignment - numRequiredOutputs;
			int numOptionalRequired = (int)((numOutputs - numRequiredOutputs) * percentageMatches)/100;
			if(numOptionals >= numOptionalRequired) {
				validated = true;
				if(verboseLevel > 0)
					log.println("Domain validated. Number Found=" + numOptionals + " Num Required:" + numOptionalRequired);
			} else if (verboseLevel > 0) {
				log.println("Domain could not be validated. Number Found=" + numOptionals + " Num Required:" + numOptionalRequired);
				for(int i=0; i<biggestValidAssign.size(); i++) {					
					log.println(allOutputs.get(i) + " ---> matches column " + biggestValidAssign.get(i));					
				}
			}
				
		}
				
		if(validated) {
			HashMap<Integer, ILabelScore> matchedTypes = new HashMap<Integer, ILabelScore>();
			
			if(verboseLevel > 0)
				log.println("\n\nDomain validated. The output assignment are: ");
			
			for(int i=0; i<biggestValidAssign.size(); i++) {
				Integer columnNumber = biggestValidAssign.get(i);
				if(verboseLevel > 0)	
					log.println(allOutputs.get(i) + " ---> matches column " + columnNumber);
				if(columnNumber != null) {
					ILabelScore[] labels = columnLabels.get(columnNumber.intValue());
					ILabelScore matchingType = null;
					List<String> domainValues = allOutputs.get(i).getValueDomains();
					for(ILabelScore label : labels) {
						if(domainValues.contains(label.getLabelName())) {
							matchingType = label;
							break;
						}
					}
					
					matchedTypes.put(columnNumber, matchingType);
				}
			}
			return matchedTypes;
		}
		
		return null;
	}
	
	private void generateFieldNamesAndValues(FormElement form,
			HashMap<String, String> formSampleMapping,
			List<String> sampleNames, List<String> sampleValues,
			List<String> fieldNames, List<String> fieldValues) {

		for (FormFieldElement formField : form.getFields()) {
			String name = formField.getName();
			if (name != null) {
				fieldNames.add(name);

				String sampleName = formSampleMapping.get(name);

				if (sampleName != null) {
					int idx = sampleNames.indexOf(sampleName);
					fieldValues.add(sampleValues.get(idx));
				} else {
					String value = formField.getValue();
					if (value == null)
						value = "";
					fieldValues.add(value);
				}
			}
		}
	}
}
