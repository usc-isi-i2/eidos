package edu.isi.sourceDiscovery;

import java.net.URL;
import java.util.ArrayList;
import java.util.List;

import com.fetch.naturallanguage.formextractor.FormElement;
import com.fetch.naturallanguage.formextractor.HtmlDocument;

import edu.isi.sourceDiscovery.logreg.FormElementTranslator;

/**
 * Query delicious and get the list of URLS of the tagged pages
 * For each page, fetch the page and extract the forms using fetch's formextractor
 * Convert the form into format required by the logreg classifier
 * Use the logreg classifier to classify the form and the inputs 
 * 
 * @author dipsy
 *
 */
public class MainInputClassification {
	public static String CLASSIFIER_INPUT_FILENAME = System.getProperty("user.dir") + "/data/logreg_input.txt";

	public static String CLASSIFIER_INDEX_DATFILE = System.getProperty("user.dir") + "/data/classifier/index.dat";

	public static String CLASSIFIER_OUTPUT_SORTED = System.getProperty("user.dir") + "/data/logreg_output_sorted.txt";

	public static String CLASSIFIER_OUTPUT_PROBABILITY = System.getProperty("user.dir") + "/data/logreg_output_probability.txt";

	public static String CLASSIFIER_MODEL_FILENAME = System.getProperty("user.dir") + "/data/classifier/model.mat";
	
	//public static String CLASSIFIER_BASE_PATH = System.getProperty("user.dir") + "/logreg";	

	//public static String CLASSIFIER_EXECUTABLE = CLASSIFIER_BASE_PATH + "/main2.exe";
	
	public static void main(String[] args) {

		try {
			//1. Invoke Delicious and get the list of pages (their URLs) that are tagged
			//	 with the resarch terms
	//		String searchTerms = "weather +rss +feed";
		//	List<Object> results = DeliciousWrapper.getSearchResults(searchTerms);
			
//			List<String> results = new ArrayList<String>();
//			//results.add("http://www.weather.com/");
//			results.add("http://www.cnn.com/");
			
			List<String> results = getTrainingDomains();			
		
//			LogRegCaller logReg = new LogRegCaller(CLASSIFIER_INPUT_FILENAME, 
//								CLASSIFIER_MODEL_FILENAME, 
//								CLASSIFIER_OUTPUT_SORTED, 
//								CLASSIFIER_OUTPUT_PROBABILITY);
			
			for (int i = 0; i < results.size(); i++) {
				String resultPageURL = results.get(i).toString();
				System.out.println("\nSearchResult " + (i + 1) + ": "
						+ resultPageURL);

				try {
					
					//Extract the forms from the web-page
					HtmlDocument doc = new HtmlDocument(new URL(resultPageURL));
					List<FormElement> formElements = doc.execute();
					System.out.println(formElements);

					if (formElements != null) {
						
						//Generate the inputs required by the input Classifier
						for (FormElement formElement : formElements) {
							FormElementTranslator.generateLogRegInputFile(formElement, 
									CLASSIFIER_INDEX_DATFILE, CLASSIFIER_INPUT_FILENAME);
//							logReg.run();
//							System.exit(0); // Just do 1 for now
						}
						
						
						
					}
					
					System.out.println("\n-----------------------------------------------------------\n");

				} catch (Exception e) {
					System.err.println("Error parsing document - "
							+ resultPageURL + ":" + e.getMessage());
					e.printStackTrace();
				}
			}
		} catch (Exception ie) {
			ie.printStackTrace();
		}
	}

	public static List<String> getTrainingDomains() {
		List<String> results = new ArrayList<String>();
						
		//Domain: Weather
//		results.add("http://www.usatoday.com/weather/default.htm");
//		results.add("http://www.noaa.gov/");
//		results.add("http://www.weather.com/");
//		results.add("http://www.weatherunderground.com/");
//		
//		//Domain: Flight
//		results.add("http://edit.travel.yahoo.com/config/ytravel_checkflight");
//		results.add("http://www.flytecomm.com/cgi-bin/trackflight");
//		
//		//Domain: Directory
//		results.add("http://www.whitepages.com/");
//		results.add("http://people.yahoo.com/");
//		
//		//Domain: Purchasing
//		results.add("http://www.gateway.com/home/deals/index.php");
//		results.add("http://www.compusa.com/");
//		results.add("http://www.newegg.com/");
//		results.add("http://www.tigerdirect.com/");
//		results.add("http://www.staples.com/");
//		results.add("http://www.overstock.com/");
//		
//		//Domain: Hotels
//		results.add("http://www.online-reservationz.com/");
//		results.add("http://www.hotels.com/");
		
		//Domain: Geospatial
		results.add("http://ashburnarcweb.esri.com/livesamples/v2/addressfinder/index.jsp");
		results.add("http://geocoder.us");
		results.add("http://risearch.org/cgi-bin/demo/ricoord/find.pl?addr=&town=&zip=90292&state=ca&action=coord");
		results.add("http://www.census.gov/cgi-bin/gazetteer"); 
				
		return results;
	}
	
//	public static int invokeProgram(String[] program, String[] environment, File workingDir) throws java.io.IOException,
//			java.lang.InterruptedException {
//		System.out.println("invoking program: " + Arrays.toString(program));
//		
//		//setCurrentDirectory(workingDir);
//		
//		Process p = Runtime.getRuntime().exec(program, environment, workingDir);
//
//		// any error message?
//        StreamGobbler errorGobbler = new 
//            StreamGobbler(p.getErrorStream(), "ERROR", System.err);            
//        
//        // any output?
//        StreamGobbler outputGobbler = new 
//            StreamGobbler(p.getInputStream(), "OUTPUT", System.out);
//            
//        // kick them off
//        errorGobbler.start();
//        outputGobbler.start();
//        
//		int exitValue = p.waitFor();
//		return exitValue;
//	}
	
}



//class StreamGobbler extends Thread {
//	InputStream is;
//	String type;
//	PrintStream out;
//
//	StreamGobbler(InputStream is, String type, PrintStream out) {
//		this.is = is;
//		this.type = type;
//		this.out = out;
//	}
//
//	@Override
//	public void run() {
//		try {
//			InputStreamReader isr = new InputStreamReader(is);
//			BufferedReader br = new BufferedReader(isr);
//			String line = null;
//			while ((line = br.readLine()) != null)
//				out.println(type + ">" + line);
//		} catch (IOException ioe) {
//			ioe.printStackTrace();
//		}
//	}
//}