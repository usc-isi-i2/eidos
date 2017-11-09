package edu.isi.sourceDiscovery;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.net.URL;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.jdom.JDOMException;

import com.fetch.naturallanguage.formextractor.FormElement;
import com.fetch.naturallanguage.formextractor.HtmlDocument;

import edu.isi.sourceDiscovery.config.ConfigurationParser;
import edu.isi.sourceDiscovery.config.Domain;
import edu.isi.sourceDiscovery.logreg.FormElementTranslator;
import edu.isi.sourceDiscovery.logreg.LogRegTestDLLCaller;


public class MainInputClassificationDCPComparison {
	public static String CLASSIFIER_INPUT_FILENAME = System.getProperty("user.dir") + "/data/logreg_input.txt";

	public static String CLASSIFIER_INDEX_DATFILE = System.getProperty("user.dir") + "/data/classifier/index.dat";

	public static String CLASSIFIER_OUTPUT_SORTED = System.getProperty("user.dir") + "/data/logreg_output_sorted.txt";

	public static String CLASSIFIER_OUTPUT_PROBABILITY = System.getProperty("user.dir") + "/data/logreg_output_probability.txt";

	public static String CLASSIFIER_MODEL_FILENAME = System.getProperty("user.dir") + "/data/classifier/model.mat";
	
	public static void main(String[] args) throws IOException, JDOMException, SQLException, ClassNotFoundException {
		//1. Parse the Domain and Samples Configuration files
		ConfigurationParser config = new ConfigurationParser("config/DomainConfig.xml");
		
		//2. Initialize the logreg classifier for classifying the forms
		LogRegTestDLLCaller logReg = new LogRegTestDLLCaller(CLASSIFIER_INPUT_FILENAME, 
				CLASSIFIER_MODEL_FILENAME, 
				CLASSIFIER_OUTPUT_SORTED, 
				CLASSIFIER_OUTPUT_PROBABILITY);
		
		//3. Invoke Delicious and get the list of pages (their URLs) that are tagged
		//	 with the resarch terms
//		String searchTerms = "weather +rss +feed";
//		List<Object> results = DeliciousWrapper.getSearchResults(searchTerms);
		
//		List<String> results = new ArrayList<String>();
//		results.add("\"http://www.illinoistollway.com/portal/page?_pageid=57\"");
		
		List<String> results = getWebpageURL("data\\geospatial-dcp-results.csv");
		String domain = "GEOSPATIAL";
		BufferedWriter writer = new BufferedWriter(new FileWriter("data\\logreg-results-geospatial.csv"));
		BufferedWriter writerComp = new BufferedWriter(new FileWriter("data\\logreg-dcp-comp-geospatial.csv"));
		writerComp.append("URL,HandLabeled result,LogReg result\n");
		int numTruePositives = 0;
		int numTrueNegatives = 0;
		int numLabeled = 0;
		
		for (int i = 0; i < results.size() && i<101; i++) {
			String resultPageURL = results.get(i).toString();
			int colonIndex = resultPageURL.lastIndexOf(":");
			String foundByDCP = resultPageURL.substring(colonIndex+1).trim();
			int intFoundByDCP = 0;
			boolean isLabeled = false;
			
			resultPageURL = resultPageURL.substring(0, colonIndex);
			
			System.out.println("\nSearchResult " + (i + 1) + ": "
					+ resultPageURL);

			
			
			try {
				
				//Extract the forms from the web-page
				HtmlDocument doc = new HtmlDocument(new URL(resultPageURL));
				List<FormElement> formElements = doc.execute();
				System.out.println(formElements);

				if(foundByDCP != null && !foundByDCP.equals("")) {
					isLabeled = true;
					numLabeled ++;
					intFoundByDCP = Integer.parseInt(foundByDCP);
				}
				int domainFound = 0;
				
				if (formElements != null) {
					
					//Generate the inputs required by the input Classifier
					for (FormElement formElement : formElements) {
						FormElementTranslator.generateLogRegInputFile(formElement, 
								CLASSIFIER_INDEX_DATFILE, CLASSIFIER_INPUT_FILENAME);
						logReg.run();
						int matchedIndex = logReg.getIndexOfHighestProbabilityMatch();
						Domain matchedDomain = config.getDomain(matchedIndex);
						System.out.println("Matched Domain=" + matchedDomain.getName());
						writer.write(resultPageURL + "," + formElement.getName() + "," + matchedDomain.getName() + "\n");
						//System.exit(0); // Just do 1 for now
						if(matchedDomain.getName().equalsIgnoreCase(domain))
							domainFound = 1;
					}
					
				} else {
					writer.write(resultPageURL + ",No Forms in the webpage\n");
				}
				
				writerComp.append(resultPageURL + "," + foundByDCP + "," + domainFound + "\n");
		
				if(isLabeled) {
					if(intFoundByDCP == domainFound)
						numTruePositives++;
					else
						numTrueNegatives++;
				}
				System.out.println("\n-----------------------------------------------------------\n");

			} catch (Exception e) {
				String errorMsg = e.toString();
				System.err.println("Error parsing document - "
						+ resultPageURL + ":" + errorMsg);
				e.printStackTrace();
				writer.write(resultPageURL + "," + errorMsg + "\n");
				writerComp.append(resultPageURL + "," + foundByDCP + "," + errorMsg + "\n");
			}
		}
		
		writerComp.append("Num Labeled: " + numLabeled + "\n");
		writerComp.append("Num Correctly Identified: " + numTruePositives + "\n");
		writerComp.append("Num Incorrectly Identified: " + numTrueNegatives + "\n");
		
		writer.close();
		writerComp.close();
		System.exit(0);
	}
	
	public static List<String> getWebpageURL(String filename) throws IOException {
		BufferedReader reader = new BufferedReader(new FileReader(filename));
		List<String> pageURLs = new ArrayList<String>();
		String line = null;
		while((line = reader.readLine()) != null) {			
			String[] parts = line.split(",");
			String url = parts[1];
			if(url.startsWith("\"")) {
				url = url.substring(1);
				if(url.endsWith("\""))
					url = url.substring(0, url.length()-1);
			}
			if(parts.length > 2)
				pageURLs.add(parts[1] + ":" + parts[2]);
			else
				pageURLs.add(parts[1] + ":");
		}
		return pageURLs;
	}
}
