package edu.isi.sourceDiscovery.logreg;

import java.io.FileReader;
import java.io.FileWriter;
import java.io.LineNumberReader;
import java.util.Enumeration;
import java.util.Hashtable;
import java.util.Vector;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import edu.isi.sourceDiscovery.config.ConfigurationParser;
import edu.isi.sourceDiscovery.config.Domain;

public class LogRegTrainer {

	static final String _labelDomainLineRegex = "^l.*";

	static final String _domainLabelRegex = "l[{].*[}]";

	static final String _titleRegex = "ti[{].*[}]";

	static final String _otherTextRegex = "tx[{].*[}]";

	/**
	 * @param args
	 * @throws Exception
	 */
	public static void main(String[] args) throws Exception {
		String classifierDir = System.getProperty("user.dir") + "/data/classifier/";
		String configFile = System.getProperty("user.dir") + "/config/DomainConfig.xml";
		
		//Define all the input filenames
		String trainingFilename = classifierDir + "domain.txt";
		String featureDictionaryFile = classifierDir + "training_featureDictionary.txt";
		String featureTargetFile = classifierDir + "training_featureTarget.txt";
		String featureDataFile = classifierDir + "training_featureData.txt";
		String targetFile = classifierDir + "training_target.txt";
		
		//Define all the output filenames
		String output_modelFile = classifierDir + "model";
		String output_indexFile = classifierDir + "index.dat";
		
		//1. Get the domains from the configuration file
		ConfigurationParser configParser = new ConfigurationParser(configFile);
		Hashtable targetClass = new Hashtable();
		for(Domain domain : configParser.getAllDomains()) {
			targetClass.put(domain.getName(), domain.getIndex());
		}
		
		//2. Generate the index.dat file & training_feature.txt and the training_target.txt files
		// that are required to generate the matlab model file
		Hashtable[] index = parseLabelDataForDomainTraining(
				targetClass,
				trainingFilename, true,
				featureDictionaryFile, 
				featureTargetFile, 
				featureDataFile, 
				targetFile);
		Util.storeHashtableIntoFile(index, output_indexFile);
		
		//3. Call the logRegTrainerDLL to generate the matlab model		
		LogRegTrainerDLLCaller trainerDLL = new LogRegTrainerDLLCaller(targetFile, featureDataFile, output_modelFile);
		trainerDLL.run();
		
		System.exit(0);
	}
	
	
	//	 for domain classification
	// format would be l{}ti{}tx{}
	public static Hashtable[] parseLabelDataForDomainTraining(
			Hashtable targetClass,
			String labeledFile, boolean includedUnknownClass,
			String featureDictionaryFile,
			String featureTargetFile,
			String featureDataFile,
			String targetFile) throws Exception {
		
		/**
		 * we have 2 feature pools: titles, text from other parts
		 * and we have 1 target: domain label
		 *
		 */
		// feature data dictionary
		Hashtable[] indexForTesting = new Hashtable[3];
		Hashtable titleTermIndex = new Hashtable();
		Hashtable otherTextTermIndex = new Hashtable();
		//Hashtable targetClassIndex = new Hashtable();

		indexForTesting[Features.DOMAIN_FEATURE_TITLE_INDEX] = titleTermIndex;
		indexForTesting[Features.DOMAIN_FEATURE_OTHERTEXT_INDEX] = otherTextTermIndex;
		indexForTesting[Features.DOMAIN_FEATURE_LABEL_INDEX] = targetClass;

		// instance frame (each vector = each column; each vector row = input instance row.        
		Vector vTitleTerm = new Vector(); // vector of String[]s
		Vector vOtherTextTerm = new Vector(); // vector of String[]s
		Vector vTargetClass = new Vector(); // vector of target class        

		// need line number reader?
		LineNumberReader lr = new LineNumberReader(new FileReader(labeledFile));
		String curLine = null;
		if (lr != null)
			curLine = lr.readLine();
		Pattern labelLinePattern = Pattern.compile(_labelDomainLineRegex);

		for (; curLine != null;) {
			Matcher lm = labelLinePattern.matcher(curLine);
			if (lm.matches()) { // we then extract things
				//System.out.println("Oh yes!");                
				String[] parsedLabelData = parseDomainFeature(curLine);

				// handling domainLabel
				String curDomainLabel = parsedLabelData[0];
				// features
				String[] titleTerms = Util.advanceBreakTermsFromParamName(parsedLabelData[1]);
				String[] otherTextTerms = Util.advanceBreakTermsFromParamName(parsedLabelData[2]);

				if (curDomainLabel != null)
					curDomainLabel = curDomainLabel.toLowerCase();
				// i'm sorry that I have to discard the line that has no label except including unknown class
				if (includedUnknownClass
						|| (curDomainLabel != null && curDomainLabel.trim()
								.length() > 0)) {
					// update data dictionary

					Util.addStemmedKeysToHashtable(titleTermIndex, titleTerms);
					Util.addStemmedKeysToHashtable(otherTextTermIndex, otherTextTerms);

					if (curDomainLabel == null
							|| curDomainLabel.trim().length() == 0) {
						//updateDictionary(targetClassIndex,
						//		Features.UNKNOWN_CLASS);
						vTargetClass.addElement(Features.UNKNOWN_CLASS);
					} else {
						//updateDictionary(targetClassIndex, curDomainLabel);
						vTargetClass.addElement(curDomainLabel);
					}

					vTitleTerm.addElement(titleTerms);
					vOtherTextTerm.addElement(otherTextTerms);

				}

			}
			curLine = lr.readLine();
		}
		//updateDictionary(targetClassIndex, Features.UNKNOWN_CLASS); // incase we didn't add UNKNOW_CLASS yet

		System.out.println(vTitleTerm.size() + "," + vOtherTextTerm.size()
				+ "," + vTargetClass.size());
		//printTargetDictionary(targetClassIndex, targetDictionaryFile); // ok
		printFeatureDictionaryForDomain(titleTermIndex, otherTextTermIndex,
				featureDictionaryFile); // ok

		printFeatureTargetForDomain(titleTermIndex, vTitleTerm,
				otherTextTermIndex, vOtherTextTerm, targetClass,
				vTargetClass, featureTargetFile);
		printFeatureRowsForDomain(titleTermIndex, vTitleTerm,
				otherTextTermIndex, vOtherTextTerm, featureDataFile);

		// print targetrows (this is useful) for determining prior probability
		printTargetRows(vTargetClass, targetClass, targetFile);
		System.out.println(vTargetClass.size());

		return indexForTesting;
	}

	private static void printTargetRows(Vector targetClasses,
			Hashtable targetDictionary, String outputFile) {
		try {
			FileWriter fw = new FileWriter(outputFile);
			for (int i = 0; i < targetClasses.size(); i++) {
				int curIndex = ((Integer) targetDictionary
						.get(Features.UNKNOWN_CLASS)).intValue();
				if (targetDictionary.containsKey(targetClasses.get(i)))
					curIndex = ((Integer) targetDictionary.get(targetClasses
							.get(i))).intValue();
				if (i > 0)
					fw.write("\n" + (i + 1) + "\t" + curIndex);
				else
					fw.write((i + 1) + "\t" + curIndex);
				fw.flush();
			}
			fw.close();
		} catch (Exception e) {
			e.printStackTrace(System.out);
		}
	}

	private static void printFeatureRowsForDomain(Hashtable titleTermIndex,
			Vector titleTerms, Hashtable otherTextTermIndex,
			Vector otherTextTerms, String outputFile) {
		try {
			FileWriter fw = new FileWriter(outputFile);
			for (int i = 0; i < titleTerms.size(); i++) {
				String temp;
				int total = 0;
				temp = Util.generateSparseFeatureRows(i + 1, total, titleTermIndex,
						(String[]) titleTerms.get(i));
				if (temp != null)
					fw.write("\n" + temp);
				total += titleTermIndex.size();
				temp = Util.generateSparseFeatureRows(i + 1, total,
						otherTextTermIndex, (String[]) otherTextTerms.get(i));
				if (temp != null)
					fw.write("\n" + temp);
				fw.flush();
			}
			fw.close();
		} catch (Exception e) {
			e.printStackTrace();
		}

	}

	private static void printFeatureTargetForDomain(Hashtable titleTermIndex,
			Vector titleTerms, Hashtable otherTextTermIndex,
			Vector otherTextTerms, Hashtable targetIndex, Vector target,
			String outputFile) {
		try {
			// open file to write here.
			FileWriter fw = new FileWriter(outputFile);

			for (int i = 0; i < titleTerms.size(); i++) {
				String temp;
				int total = 0;
				int curTargetIndex = ((Integer) targetIndex.get(target.get(i)))
						.intValue();
				temp = generateSparseFeatureTargetIgnoreRowNumber(
						curTargetIndex, total, titleTermIndex,
						(String[]) titleTerms.get(i));
				if (temp != null)
					fw.write("\n" + temp);
				total += titleTermIndex.size();

				temp = generateSparseFeatureTargetIgnoreRowNumber(
						curTargetIndex, total, otherTextTermIndex,
						(String[]) otherTextTerms.get(i));
				if (temp != null)
					fw.write("\n" + temp);
				total += otherTextTermIndex.size();

				fw.flush();
			}
			fw.close();
		} catch (Exception e) {
			e.printStackTrace();
			System.exit(1);
		}
	}

	//  all features (word) are associated with the targetIndex
	private static String generateSparseFeatureTargetIgnoreRowNumber(
			int targetIndex, int startFeatureIndex, Hashtable featureIndex,
			String[] features) {
		if (features == null)
			return null;
		StringBuffer buf = new StringBuffer();
		for (int i = 0; i < features.length; i++) {
			if (features[i].length() <= 1)
				continue;
			String curTerm = PorterStemmer.stem(features[i]);
			int curFIndex = ((Integer) featureIndex.get(curTerm)).intValue()
					+ startFeatureIndex;
			if (buf.length() > 0)
				buf.append("\n" + curFIndex + " " + targetIndex);
			else
				buf.append(curFIndex + " " + targetIndex);
		}
		if (buf.length() > 0)
			return buf.toString();
		else
			return null;
	}

	private static String[] parseDomainFeature(String labelLine) {
		if (labelLine == null || labelLine.trim().length() == 0)
			return null;

		Pattern pDomain = Pattern.compile(_domainLabelRegex);
		Pattern pTitle = Pattern.compile(_titleRegex);
		Pattern pOtherText = Pattern.compile(_otherTextRegex);

		String[] ret = new String[3];

		Matcher m = pDomain.matcher(labelLine);
		if (m.find()) {
			String temp = m.group(); // would be in format l{...}
			int openBracketIndex = temp.indexOf('{');
			int closeBracketIndex = temp.indexOf('}');
			ret[0] = temp.substring(openBracketIndex + 1, closeBracketIndex);
		}

		m = pTitle.matcher(labelLine);
		if (m.find()) {
			String temp = m.group(); // would be in format ti{...}
			int openBracketIndex = temp.indexOf('{');
			int closeBracketIndex = temp.indexOf('}');
			ret[1] = temp.substring(openBracketIndex + 1, closeBracketIndex);
		}

		m = pOtherText.matcher(labelLine);
		if (m.find()) {
			String temp = m.group(); // would be in format tx{...}
			int openBracketIndex = temp.indexOf('{');
			int closeBracketIndex = temp.indexOf('}');
			ret[2] = temp.substring(openBracketIndex + 1, closeBracketIndex);
		}

		return ret;
	}


	

	private static void printFeatureDictionaryForDomain(
			Hashtable titleTermIndex, Hashtable otherTextTermIndex,
			String outputFile) {
		try {
			FileWriter fw = new FileWriter(outputFile);
			Enumeration eTitle = titleTermIndex.keys();
			int total = 0;

			fw.write("Title Terms:\n");
			// operation
			for (; eTitle.hasMoreElements();) {
				String curTerm = (String) eTitle.nextElement();
				fw.write(curTerm + "\t" + titleTermIndex.get(curTerm) + "\n");
				fw.flush();

			}
			total += titleTermIndex.size();

			fw.write("Other Text Terms:\n");
			// message
			Enumeration eOtherText = otherTextTermIndex.keys();
			for (; eOtherText.hasMoreElements();) {
				String curTerm = (String) eOtherText.nextElement();
				fw.write(curTerm
						+ "\t"
						+ (((Integer) otherTextTermIndex.get(curTerm))
								.intValue() + total) + "\n");
				fw.flush();
			}
			total += otherTextTermIndex.size();

			fw.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
