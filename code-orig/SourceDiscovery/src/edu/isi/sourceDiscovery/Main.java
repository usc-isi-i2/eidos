package edu.isi.sourceDiscovery;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintStream;
import java.util.ArrayList;
import java.util.List;

public class Main {	

	public static String CLASSIFIER_MODEL_FILENAME = System.getProperty("user.dir") + "/data/classifier/model.mat";
	
	public static String CLASSIFIER_INDEX_FILENAME = System.getProperty("user.dir") + "/data/classifier/index.dat";
	
	public static int NUMBER_OF_EXAMPLE_PAGES = 3;
	
	public static int NUM_LABELER_PREDICTIONS = 10;
	
	public static PrintStream log = System.out;
			
	public static void main(String[] args) throws Exception {
		
		String domain = "WEATHER";
		log = new PrintStream(new java.io.FileOutputStream(new java.io.File("data\\results\\sourceDiscovery-" + domain + ".log")));
		
		SourceDiscovery sourceDiscovery = new SourceDiscovery();
		sourceDiscovery.initialize("config/DomainConfig.xml", NUMBER_OF_EXAMPLE_PAGES,
									CLASSIFIER_MODEL_FILENAME, CLASSIFIER_INDEX_FILENAME,
									"data/semanticMapper/model-complex.txt",
									NUM_LABELER_PREDICTIONS,
									log, 1);
				
		//List<Object> results = edu.isi.sourceDiscovery.agent.DeliciousWrapper.getSearchResults("weather +rss +feeds");
		
		List<String> results = new ArrayList<String>();
		List<String> foundByDCPList = new ArrayList<String>();
		
		//results.add("http://www.weatherunderground.com/");
		//results.add("http://asp.usatoday.com/weather/weatherfront.aspx");
		//results.add("http://www.aircanada.com/en/home.html");
		//results.add("http://flightaware.com/live/airport/KORD");
		//results.add("http://www.flightstats.com/go/Home/home.do");
		//results.add("http://people.yahoo.com/");
		//results.add("http://www.geocoder.us/");
		//results.add("http://www.mapquest.com/maps/latlong.adp");
		//results.add("http://maps.huge.info/geocoder/");				
		//results.add("http://www.travelocity.com/Hotels/0,,TRAVELOCITY,00.html");
		//results.add("http://www.online-reservationz.com/");
		//results.add("http://www.orbitz.com/App/ViewHotelSearch");
		//results.add("http://www.radisson.com/");
		
		readFirstTwoColumnsFromCSVFile("data\\results\\dcp-results-" + domain + ".csv", results, foundByDCPList);
		
		
		BufferedWriter writerComp = new BufferedWriter(new FileWriter("data\\results\\sourceDiscovery-" + domain + ".csv"));
		writerComp.append("URL,Manual Labeling,Log Reg,Model Source,Actual Model of the source\n");
		for(int resultIdx=0; resultIdx<results.size() && resultIdx<101; resultIdx++) {
			String url = results.get(resultIdx).toString().trim();			
			String foundByDCP = "";
			if(resultIdx < foundByDCPList.size())
				foundByDCP = foundByDCPList.get(resultIdx).trim();								
			
			log.println("\n\n=====================================================================================");
			log.println((resultIdx+1) + ". URL: " + url);
			try {
				SourceModel sourceModel = sourceDiscovery.modelSource(url, domain);
				int domainFound = 0;
				if(sourceModel != null) {
					log.println("\nSource Model: ");
					log.println(sourceModel);
					if(sourceModel.getDomain().equalsIgnoreCase(domain))
						domainFound = 1;			
					
				} else {
					log.println("No Model found!");
				}
				
				int anyFormInDomain = 0;
				if(sourceDiscovery.formMatchedDomain)
					anyFormInDomain = 1;
				
				writerComp.append(url + "," + foundByDCP + "," + anyFormInDomain + "," + domainFound + ",\"" + sourceModel + "\"\n");
			} catch(Exception e) {
				writerComp.append(url + "," + foundByDCP + "," + "Exception occured while accessing the source" + "," + e.getMessage() + "\n");
				e.printStackTrace(log);
			}
			writerComp.flush();
			log.flush();
		}
		
		log.close();
		System.exit(0);
	}
	
	public static void readFirstTwoColumnsFromCSVFile(String filename, List<String> column1, List<String> column2) throws IOException {
		BufferedReader reader = new BufferedReader(new FileReader(filename));		
		String line = null;
		while((line = reader.readLine()) != null) {			
			String[] parts = line.split(",");
			String url = parts[1];
			if(url.startsWith("\"")) {
				url = url.substring(1);
				if(url.endsWith("\""))
					url = url.substring(0, url.length()-1);
			}
			
			column1.add(url);
			if(parts.length > 2)
				column2.add(parts[2]);
			else
				column2.add("");			
		}		
	}
	
	
}
