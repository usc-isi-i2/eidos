package wrappers;

import invocation.Wrapper;
import relational.Table;
import java.util.ArrayList;

import javax.xml.xpath.*;
import org.w3c.dom.*;
import org.xml.sax.InputSource;

public class YahooLocal implements Wrapper {
	
	XPath xpath;
	
	public YahooLocal() {
		xpath = XPathFactory.newInstance().newXPath();
	}
	
	
	public Table invoke(String[] endpoint, ArrayList<String> inputTuple) {
    	
		Table output = null;
		String url = "http://api.local.yahoo.com/LocalSearchService/V3/localSearch?appid=sourcemodeling";
		
		if (endpoint[1].equalsIgnoreCase("hotelsByZipRadius")) {
			
			try {
				
				url += "&query=*&category=96929265&results=20"; // Category: Hotels & Motels
				url += "&zip="+java.net.URLEncoder.encode(inputTuple.get(0),"UTF-8");
				url += "&radius="+java.net.URLEncoder.encode(inputTuple.get(1),"UTF-8");
				
				/*
				 * http://api.local.yahoo.com/LocalSearchService/V3/localSearch?appid=sourcemodeling&query=*&category=96929265&zip=90066&radius=1
				 * 
<?xml version="1.0"?>
<ResultSet xmlns:xsi=....>
	<ResultSetMapUrl>http://local.yahoo.com/mapview?stx=%2A&amp;csz=Los+Angeles%2C+CA+90066&amp;city=Los+Angeles&amp;state=CA&amp;radius=1&amp;ed=QHiw1K131DyY0prgOEWZJm6pAkYmHoJJNVaylRQ-</ResultSetMapUrl>
	<Result id="32279516">
		<Title>Super 8 Motel</Title>
		<Address>12568 W Washington Blvd</Address>
		<City>Los Angeles</City>
		<State>CA</State>
		<Phone>(310) 306-9021</Phone>
		<Latitude>33.996663</Latitude>
		<Longitude>-118.43188</Longitude>
		<Rating><AverageRating>NaN</AverageRating><TotalRatings>0</TotalRatings><TotalReviews>0</TotalReviews><LastReviewDate>0</LastReviewDate><LastReviewIntro></LastReviewIntro></Rating>
		<Distance>0.31</Distance>
		<Url>http://local.yahoo.com/details?id=32279516&amp;stx=%2A&amp;csz=Los+Angeles+CA&amp;ed=QWICnq160SxyWEhE3NF5ejTeP5LQMHD94KVEWNmDHBy66s3RwciB7AnxabdTiTMf0v9w7kYh0E7YqmVYVf0-</Url>
		<ClickUrl>http://local.yahoo.com/details?id=32279516&amp;stx=%2A&amp;csz=Los+Angeles+CA&amp;ed=QWICnq160SxyWEhE3NF5ejTeP5LQMHD94KVEWNmDHBy66s3RwciB7AnxabdTiTMf0v9w7kYh0E7YqmVYVf0-</ClickUrl>
		<MapUrl>http://maps.yahoo.com/maps_result?name=Super+8+Motel&amp;desc=3103069021&amp;csz=Los+Angeles+CA&amp;qty=9&amp;cs=9&amp;ed=QWICnq160SxyWEhE3NF5ejTeP5LQMHD94KVEWNmDHBy66s3RwciB7AnxabdTiTMf0v9w7kYh0E7YqmVYVf0-</MapUrl>
		<BusinessUrl>http://www.super8.com/</BusinessUrl>
		<BusinessClickUrl>http://www.super8.com/</BusinessClickUrl>
		<Categories><Category id="96929265">Hotels &amp; Motels</Category></Categories>
	</Result>
	...
	<Result id="20452332">
		<Title>Econo Lodge Los Angeles</Title>
		<Address>11933 W Washington Blvd</Address>
		<City>Los Angeles</City>
		<State>CA</State>
		<Phone>(310) 398-1651</Phone>
		<Latitude>33.997981</Latitude>
		<Longitude>-118.420954</Longitude>
		<Rating><AverageRating>2</AverageRating><TotalRatings>3</TotalRatings><TotalReviews>0</TotalReviews><LastReviewDate>0</LastReviewDate><LastReviewIntro></LastReviewIntro></Rating>
		<Distance>0.50</Distance>
		<Url>http://local.yahoo.com/details?id=20452332&amp;stx=%2A&amp;csz=Los+Angeles+CA&amp;ed=C5c_Da160SzhdxZegOc72JJx5Vh8O4JYrRH7ivl82Emio5U9J4DAzNT6ffCEOYDZH9yaLTpNOdSOiYjAahZm</Url>
		<ClickUrl>http://local.yahoo.com/details?id=20452332&amp;stx=%2A&amp;csz=Los+Angeles+CA&amp;ed=C5c_Da160SzhdxZegOc72JJx5Vh8O4JYrRH7ivl82Emio5U9J4DAzNT6ffCEOYDZH9yaLTpNOdSOiYjAahZm</ClickUrl>
		<MapUrl>http://maps.yahoo.com/maps_result?name=Econo+Lodge+Los+Angeles&amp;desc=3103981651&amp;csz=Los+Angeles+CA&amp;qty=9&amp;cs=9&amp;ed=C5c_Da160SzhdxZegOc72JJx5Vh8O4JYrRH7ivl82Emio5U9J4DAzNT6ffCEOYDZH9yaLTpNOdSOiYjAahZm</MapUrl>
		<BusinessUrl>http://www.econolodge.com/</BusinessUrl>
		<BusinessClickUrl>http://www.econolodge.com/</BusinessClickUrl>
		<Categories><Category id="96929265">Hotels &amp; Motels</Category><Category id="96929268">Other Lodging</Category></Categories>
	</Result>
	...
</ResultSet>
				 *
				 */
				
		    	String[] columns = new String[] {"Zip","Radius","Title","Address","City","State","Phone","Latitude","Longitude","Distance","BusinessUrl"};
		    	output = new Table(columns);
				
				// invoke source and parse xml output
				NodeList resultElements = (NodeList) xpath.evaluate("//*[local-name()='Result']",new InputSource(url),XPathConstants.NODESET);
				for (int i=0; i<resultElements.getLength(); i++) {
			    	ArrayList<String> tuple = new ArrayList<String>();
			    	tuple.add(inputTuple.get(0));
			    	tuple.add(inputTuple.get(1));
			    	Node resultElement = resultElements.item(i);
			    	for (int j=2; j<columns.length; j++) {
				    	tuple.add((String) xpath.evaluate("./*[local-name()='"+columns[j]+"'][1]/text()",resultElement,XPathConstants.STRING));
				    }
				    output.insertDistinct(tuple);
				}
		    	
		    }
			catch (Exception e) {
				return null;
	    	}
	    	
		}
		else if (endpoint[1].equalsIgnoreCase("hotelsByZip")) {
			
			try {
				
				url += "&query=*&category=96929265&results=20"; // Category: Hotels & Motels
				url += "&zip="+java.net.URLEncoder.encode(inputTuple.get(0),"UTF-8");
				
		    	String[] columns = new String[] {"Zip","Title","Address","City","State","Phone","Latitude","Longitude","Distance","BusinessUrl"};
		    	output = new Table(columns);
				
				// invoke source and parse xml output
				NodeList resultElements = (NodeList) xpath.evaluate("//*[local-name()='Result']",new InputSource(url),XPathConstants.NODESET);
				for (int i=0; i<resultElements.getLength(); i++) {
			    	ArrayList<String> tuple = new ArrayList<String>();
			    	tuple.add(inputTuple.get(0));
			    	Node resultElement = resultElements.item(i);
			    	for (int j=1; j<columns.length; j++) {
				    	tuple.add((String) xpath.evaluate("./*[local-name()='"+columns[j]+"'][1]/text()",resultElement,XPathConstants.STRING));
				    }
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
		YahooLocal r = new YahooLocal();
		String[] endpoint;
		ArrayList<String> input;
		
		// test 0:
		endpoint = new String[] {"", "hotelsByZipRadius"};
		input = new ArrayList<String>();
		input.add("90292");
		input.add("2");
		r.invoke(endpoint,input).print();
						
		// test 1:
		endpoint = new String[] {"", "hotelsByZip"};
		input = new ArrayList<String>();
		input.add("90066");
		r.invoke(endpoint,input).print();
						
	}
	
}
