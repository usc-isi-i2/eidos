package wrappers;

import invocation.Wrapper;
import relational.Table;
import java.util.ArrayList;

import javax.xml.xpath.*;
import org.w3c.dom.*;
import org.xml.sax.InputSource;

public class YahooMaps implements Wrapper {
	
	XPath xpath;
	
	public YahooMaps() {
		xpath = XPathFactory.newInstance().newXPath();
	}
	
	
	public Table invoke(String[] endpoint, ArrayList<String> inputTuple) {
    	
		Table output = null;
		String url = null;
		
		if (endpoint[1].equalsIgnoreCase("geocode")) {
			
			try {
				
				url = "http://api.local.yahoo.com/MapsService/V1/geocode?appid=sourcemodeling";
				url += "&street="+java.net.URLEncoder.encode(inputTuple.get(0),"UTF-8");
				url += "&zip="+java.net.URLEncoder.encode(inputTuple.get(1),"UTF-8");
				
				/*
				 * http://api.local.yahoo.com/MapsService/V1/geocode?appid=sourcemodeling&street=4676+Admiralty+Way&zip=90292
				 * 
				 * <ResultSet xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" .....>
				 *   <Result precision="address">
				 *     <Latitude>33.980546</Latitude>
				 *     <Longitude>-118.440376</Longitude>
				 *     <Address>4676 ADMIRALTY WAY</Address>
				 *     <City>MARINA DEL REY</City>
				 *     <State>CA</State>
				 *     <Zip>90292-6601</Zip>
				 *     <Country>US</Country>
				 *   </Result>
				 * </ResultSet>
				 */
				
				// the metadata 
		    	String[] columns = new String[] {"Address","Zip","City","State","Country","Latitude","Longitude"};
		    	output = new Table(columns);
				
				// invoke source and parse xml output
				Node resultElement = (Node) xpath.evaluate("//*[local-name()='Result'][1]",new InputSource(url),XPathConstants.NODE);
				
				if (resultElement.getAttributes().getNamedItem("precision").getTextContent().equals("address")) {
			    	// the data
			    	ArrayList<String> tuple = new ArrayList<String>();
				    tuple.add(inputTuple.get(0));
				    tuple.add(inputTuple.get(1));
			    	for (String col: new String[] {"City","State","Country","Latitude","Longitude"}) {
				    	tuple.add((String) xpath.evaluate("./*[local-name()='"+col+"'][1]/text()",resultElement,XPathConstants.STRING));
				    }
				    output.insertDistinct(tuple);
				}
			    
			}
			catch (Exception e) { return null; }
	    	
		}
		else {
    		System.err.println("Error: No method called " + endpoint[1] + " in wrapper: " + this.getClass().getName());
			System.err.println("Please update source definition and restart system .... exiting");
    		System.exit(9);
		}
		
		return output;
		
	}


	public void testWrapper() {
		YahooMaps r = new YahooMaps();
		String[] endpoint;
		ArrayList<String> input;
		
		endpoint = new String[2];
		endpoint[1] = "geocode";
		input = new ArrayList<String>();
		input.add("4676 ADMIRALTY WAY");
		input.add("90292");
		r.invoke(endpoint,input).print();
						
		endpoint = new String[2];
		endpoint[1] = "geocode";
		input = new ArrayList<String>();
		input.add("1 Lincoln Blvd");  // this address doesn't exist!
		input.add("90292");
		r.invoke(endpoint,input).print();
						
		endpoint = new String[2];
		endpoint[1] = "geocode";
		input = new ArrayList<String>();
		input.add("12012 Washington Place");
		input.add("90066");
		r.invoke(endpoint,input).print();
						
	}
	
}
