package com.fetch.naturallanguage.formextractor;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.List;

public class TestFormExtraction {

	private static String[] domains = {
			//flight Trackers
			"http://www.flytecomm.com/cgi-bin/trackflight",
			"http://www.flightview.com/traveltools/",
			"http://flightaware.com/live/airport/KORD",
			"http://www.flightview.com/TravelTools/FlightTrackerQueryResults.asp",
			"http://www.aircanada.com/en/home.html",
			
			//geocoders
			"http://www.geocoder.us/",
			"http://www.gpsvisualizer.com/geocoder",
			"http://stevemorse.org/jcal/latlon.php",
			"http://www.travelgis.com/geocode/Default.aspx",
			"http://www.mapquest.com/maps/latlong.adp",
			"http://mapper.acme.com/",
			"http://www.mapbuilder.net/index.php",
			"http://ejohn.org/apps/gaddress/",
			
			//weather
			"http://mobile.wunderground.com/",
			"http://www.weather.com/",
			"http://www.intellicast.com/",
			"http://www.nws.noaa.gov/",
			"http://www.wunderground.com/",
			"http://wwwa.accuweather.com/index.asp?partner=accuweather",
			"http://cirrus.sprl.umich.edu/wxnet/",
			"http://asp.usatoday.com/weather/weatherfront.aspx",
			"http://weather.yahoo.com/ "
	};
	
    /**
     * This is a test class for the Form Extraction Project
     * Its only purpose is to demonstrate how to call the APIs 
     * @param args - the path to an html page on disk 
     */
    public static void main(String[] args) {
//        if(args.length != 1){
//            System.err.println("must indicate an input file");
//            return;
//        }

        try{
        	for(String domain : domains) {
        		System.out.println("\n\n--------------------------------------------------------------");
        		System.out.println("Using domain :" + domain);
        		URL url = new URL(domain);
        		String html = getURLContents(url);
        		//System.out.println("Page Contents: \n" + html);
        		
	            // read the content of the file that is the first command line parameter
	            // note: you might wanna change the next line if you want to reuse this code
	            //String html = Files.contentsAsString(args[0], "UTF-8");
	            // create a document instance
	            HtmlDocument doc = new HtmlDocument(html);
	            //System.out.println("processing " + args[0]);
	            // call the main worker
	            List<FormElement> forms = doc.execute();
	            // display the results
	            if(forms == null){
	                System.out.println("There were no forms!");
	            }
	            else{
	                System.out.println(forms.toString());
	            }
        	}
        }
        catch (Exception e){
            //Catch exception if any
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public static String getURLContents(URL url) throws IOException {
    	BufferedReader in = new BufferedReader(new InputStreamReader(url.openStream()));
    	StringBuffer buffer = new StringBuffer("");
    	String inputLine;
    	String lineseperator = System.getProperty("line.separator");
    	
    	while ((inputLine = in.readLine()) != null)
    		buffer.append(inputLine).append(lineseperator);

    	in.close();
    	
    	return buffer.toString();
    }
}
