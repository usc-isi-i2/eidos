package edu.isi.sourceDiscovery.logreg;

import java.io.FileWriter;
import java.io.PrintStream;
import java.util.Hashtable;

import com.fetch.naturallanguage.formextractor.FormElement;
import com.fetch.naturallanguage.formextractor.FormFieldElement;

/**
 * Translates the Fetch FormElement into a format required by the logreg classifier
 * This class parses the Form, removes the stop words from the form and generates a list
 * of keywords describing the form. Then keywords are them stemmed using PortStemmer and then
 * they are mapped to indexes using a Master Index File (conatins unique indexes for stemmed keywords)
 * The indexes are then stored in a file that can be used as an input for the logreg classifier.
 * 
 * Parts of this class are functions that are picked up from Anon's code for converting WSDL
 * file inputs into a format required by logreg
 * 
 * @author dipsy
 *
 */
public class FormElementTranslator {
	
	public static PrintStream log = System.out;

	/**
	 * Translates the form into format required by the logreg classifier and stores the
	 * result back in the passed output file
	 * @param form - Form to translate
	 * @param indexFilename - Filename of the index file containing the indexes to stemmed keywords
	 * @param outputFilename - Name of the file in which the output will get stored
	 * @throws Exception
	 */
	public static void generateLogRegInputFile(FormElement form,
			String indexFilename, String outputFilename) throws Exception {
		Hashtable[] indexForTesting = Util.loadFileIntoHashtable(indexFilename);

		StringBuilder formText = new StringBuilder("");
		for (String txt : form.getFormText())
			formText.append(txt).append(" ");

		for (FormFieldElement formField : form.getFields()) {
			if (formField.getValue() != null
					&& !formField.getValue().equals(""))
				formText.append(" ").append(formField.getValue());
			if (formField.getLabel() != null
					&& !formField.getLabel().equals(""))
				formText.append(" ").append(formField.getLabel());

			String facets = formField.getOptionsValueAsString();
			if (facets != null && !facets.equals(""))
				formText.append(" ").append(facets);
		}

		String formTitle = form.getPageTitle();
		parseLabelDataForDomainTesting(null, Util.unEscape(formTitle), Util.unEscape(formText.toString()),
				indexForTesting, outputFilename);
	}

	

	

	

	private static void parseLabelDataForDomainTesting(String domain,
			String title, String text, Hashtable[] indexForTesting,
			String targetFilename) throws Exception {
		
		log.println("Domain: " + domain + "\ttitle:" + title + "\tText: " + text);
		
		/**
		 * we have 2 feature pools for the domain learning: title terms, other
		 * text terms and we have 1 target: domain label
		 * 
		 */
		String[] titleTerms = Util.advanceBreakTermsFromParamName(title);
		String[] otherTextTerms = Util.advanceBreakTermsFromParamName(text);
		if (domain != null)
			domain = domain.toLowerCase();
		else
			domain = Features.UNKNOWN_CLASS;
		
		FileWriter fw = new FileWriter(targetFilename);
		String temp;
		int total = 0;
		temp = Util.generateSparseFeatureRows(1, total,
				indexForTesting[Features.DOMAIN_FEATURE_TITLE_INDEX], titleTerms);
		if (temp != null)
			fw.write("\n" + temp);
		total += indexForTesting[Features.DOMAIN_FEATURE_TITLE_INDEX].size();

		temp = Util.generateSparseFeatureRows(1, total,
				indexForTesting[Features.DOMAIN_FEATURE_OTHERTEXT_INDEX], otherTextTerms);
		if (temp != null)
			fw.write("\n" + temp);

		fw.flush();
		fw.close();
	}

	

	
}
