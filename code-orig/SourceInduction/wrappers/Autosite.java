package wrappers;

import invocation.Wrapper;
import relational.Table;

import java.util.ArrayList;

import javax.xml.xpath.*;
import org.w3c.dom.*;
import org.xml.sax.InputSource;

public class Autosite implements Wrapper {
	
	XPath xpath;
	
	public Autosite() {
		xpath = XPathFactory.newInstance().newXPath();
	}
	
	
	public Table invoke(String[] endpoint, ArrayList<String> inputTuple) {
    	
		Table output = null;
		String url = null;
		
		if (endpoint[1].equalsIgnoreCase("getCars")) {
			
			/*
			 * http://www.autosite.com/syndication/rss/UsedCarInventoryRSS.cfm?ma=BMW&mo=3%20Series&zcode=90066&rad=50
			 * 
<?xml version="1.0" encoding="utf-8" ?>
<?xml-stylesheet type='text/xsl' href='/syndication/used_inv_rss.xsl' version='1.0'?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:wfw="http://wellformedweb.org/CommentAPI/">
 <channel>
  <item>
   <title>2000 WHITE BMW 3 SERIES $25,995,  Miles: 56,059  Distance: 20.9</title>
   <pubDate>Tue, 11 Jul 2006 10:10:49 EST</pubDate>
   ...
  </item>
   ...
			 * 
			 */
			
			try {
				
				url = "http://www.autosite.com/syndication/rss/UsedCarInventoryRSS.cfm";
				
				url += "?ma="    + java.net.URLEncoder.encode(inputTuple.get(0).trim(),"UTF-8"); // make
				url += "&mo="    + java.net.URLEncoder.encode(inputTuple.get(1).trim(),"UTF-8"); // model
				url += "&zcode=" + java.net.URLEncoder.encode(inputTuple.get(2).trim(),"UTF-8"); // zipcode
				url += "&rad="   + java.net.URLEncoder.encode(inputTuple.get(3).trim(),"UTF-8"); // radius
						
				// the metadata 
		    	String[] columns = new String[] {"Make","Model","Zipcode","Radius","Year","Colour","Price","Mileage","Distance","PubDate"};
		    	output = new Table(columns);
				
		    	// invoke source and parse xml output
				NodeList itemElements = (NodeList) xpath.evaluate("//*[local-name()='channel']/*[local-name()='item']",new InputSource(url),XPathConstants.NODESET);
				
		    	for (int i=0; i<itemElements.getLength(); i++) {
		    	
		    		Node itemElement = itemElements.item(i);
			    	ArrayList<String> tuple = new ArrayList<String>();
			    	tuple.addAll(inputTuple);
			    	
			    	String title = (String) xpath.evaluate("./*[local-name()='title'][1]/text()",itemElement,XPathConstants.STRING);
			    	
			    	tuple.add(title.substring(0,4)); //year
			    	tuple.add(title.substring(4,title.indexOf(inputTuple.get(0).trim().toUpperCase())).trim()); // colour
			    	tuple.add(title.substring(title.indexOf("$"),title.indexOf(", "))); // price
			    	tuple.add(title.substring(title.indexOf("Miles:")+6,title.indexOf("Distance:")).trim()); // mileage
			    	tuple.add(title.substring(title.indexOf("Distance:")+9).trim()); // distance
			    	
			    	String pubDate = (String) xpath.evaluate("./*[local-name()='pubDate'][1]/text()",itemElement,XPathConstants.STRING);
			    	
			    	tuple.add(pubDate); // pubdate
			    	
			    	output.insertDistinct(tuple);
		    	
		    	}
			    
			
			    
			}
			catch (Exception e) {
				return null;
			}
	    	
		}
		else {
			System.err.println("Error: No method called " + endpoint[1] + " in wrapper: " + this.getClass().getName());
			System.err.println("Please update source definition and restart system .... exiting");
    		System.exit(9);
		}
		
		return output;
		
	}

	
	
	public void testWrapper() {
		Autosite r = new Autosite();
		String[] endpoint;
		ArrayList<String> input;
		
		System.out.println("Autosite.getCars");
		
		endpoint = new String[2];
		endpoint[1] = "getCars";
		input = new ArrayList<String>();
		input.add("Ford");
		input.add("Explorer");
		input.add("90066");
		input.add("40");
		r.invoke(endpoint,input).print();
		
		//--------------------------------

		System.out.println("Autosite.getCars");
		
		endpoint = new String[2];
		endpoint[1] = "getCars";
		input = new ArrayList<String>();
		input.add("BMW");
		input.add("3 Series");
		input.add("90210");
		input.add("10");
		r.invoke(endpoint,input).print();
		
		//--------------------------------

	}
	
}
