package wrappers;

import invocation.Wrapper;
import relational.Table;
import java.util.ArrayList;

import javax.xml.xpath.*;
import org.w3c.dom.*;
import org.xml.sax.InputSource;

public class WeatherBug implements Wrapper {
	
	XPath xpath;
	
	public WeatherBug() {
		xpath = XPathFactory.newInstance().newXPath();
	}
	
	
	public Table invoke(String[] endpoint, ArrayList<String> inputTuple) {
    	
		Table output = null;
		String url = null;
		
		try {
			
			if (endpoint[1].equalsIgnoreCase("getLiveCompactWeather")) {
				
				/*
				 * http://a5565463665.api.wxbug.net/getLiveCompactWeather.aspx?acode=A5565463665&zipcode=90066
				 * 
				 * <?xml version="1.0" encoding="utf-8"?>
				 * <aws:weather xmlns:aws="http://www.aws.com/aws">
				 *  <aws:station id="KSMO" name="Santa Monica Municipal Airport" city="Santa Monica" state=" CA" zipcode="90405" />
				 *  <aws:temp units="&amp;deg;F">72.0</aws:temp>
				 *  <aws:rain-today units="&quot;">N/A</aws:rain-today>
				 *  <aws:wind-speed units="mph">10</aws:wind-speed>
				 *  <aws:wind-direction>WSW</aws:wind-direction>
				 *  <aws:gust-speed units="mph">10</aws:gust-speed>
				 *  <aws:gust-direction>SW</aws:gust-direction>
				 * </aws:weather>
				 */
				
				url = "http://a5565463665.api.wxbug.net/getLiveCompactWeather.aspx?acode=A5565463665&zipcode="+java.net.URLEncoder.encode(inputTuple.get(0),"UTF-8");
				
				
				output = new Table(new String[] {"zipcode","@city","@state","@zipcode","temp","rain-today","wind-speed","wind-direction","gust-speed","gust-direction"});
				
								
				// invoke source and parse xml output
				Node weatherElement = ((NodeList) xpath.evaluate("//*[local-name()='weather']",new InputSource(url),XPathConstants.NODESET)).item(0);
				
		    	// top level fields
		    	ArrayList<String> tuple = new ArrayList<String>();
		    	
		    	tuple.add(inputTuple.get(0));
		    	
		    	Node stationElement = ((NodeList) xpath.evaluate("./*[local-name()='station']",weatherElement,XPathConstants.NODESET)).item(0);
		    	
		    	for (int i=1; i<4; i++) {
		    		tuple.add((String) xpath.evaluate("./"+output.colNames.get(i),stationElement,XPathConstants.STRING));
		    	}
		    	
		    	for (int i=4; i<output.colNames.size(); i++) {
		    		tuple.add((String) xpath.evaluate("./*[local-name()='"+output.colNames.get(i)+"'][1]/text()",weatherElement,XPathConstants.STRING));
			    }
		    	
		    	output.insertDistinct(tuple);
			
			}
			else if (endpoint[1].equalsIgnoreCase("getFullForecast")) {
				
				/*
				 * http://a5565463665.api.wxbug.net/getFullForecast.aspx?acode=A5565463665&zipcode=90292
				 * 
				 * <?xml version="1.0" encoding="utf-8"?>
				 * <aws:weather xmlns:aws="http://www.aws.com/aws">
				 *  <aws:forecasts type="detailed" date="4/18/2006 2:14:00 PM">
				 *   <aws:location>
				 *    <aws:city>Marina del Rey</aws:city>
				 *    <aws:state>CA</aws:state>
				 *    <aws:zip>90292</aws:zip>
				 *    <aws:zone>CA041</aws:zone>
				 *   </aws:location>
				 *   <aws:forecast>
				 *    <aws:title>Tonight</aws:title>
				 *    <aws:short-title>Partly Cloudy</aws:short-title>
				 *    <aws:image icon="cond002.gif">http://deskwx.weatherbug.com/images/Forecast/icons/cond002.gif</aws:image>
				 *    <aws:description>Tonight</aws:description>
				 *    <aws:prediction>Clear early...becoming partly cloudy. Lows in the 50s. West winds around 15 mph in the evening.</aws:prediction>
				 *    <aws:high unit="&amp;deg;F">--</aws:high>
				 *    <aws:low unit="&amp;deg;F">55</aws:low>
				 *   </aws:forecast>
				 *   <aws:forecast>
				 *    <aws:title>Wednesday</aws:title>
				 *    <aws:short-title>Partly Cloudy</aws:short-title>
				 *    <aws:image icon="cond003.gif">http://deskwx.weatherbug.com/images/Forecast/icons/cond003.gif</aws:image>
				 *    <aws:description>Wednesday</aws:description>
				 *    <aws:prediction>Partly cloudy in the morning then clearing. Highs in the 70s. Southwest winds around 15 mph in the afternoon.</aws:prediction>
				 *    <aws:high unit="&amp;deg;F">75</aws:high>
				 *    <aws:low unit="&amp;deg;F">--</aws:low>
				 *   </aws:forecast>
				 *   ...
				 *  </aws:forecasts>
				 * </aws:weather>
				 * 
				 */
				
				url = "http://a5565463665.api.wxbug.net/getFullForecast.aspx?acode=A5565463665&zipcode="+java.net.URLEncoder.encode(inputTuple.get(0),"UTF-8");
				
				
				output = new Table(new String[] {"zipcode","city","state","zip","day","sky","high","low"});
				
								
				// invoke source and parse xml output
				Node forecastsElement = ((NodeList) xpath.evaluate("//*[local-name()='forecasts']",new InputSource(url),XPathConstants.NODESET)).item(0);
				
		    	// top level fields
		    	ArrayList<String> tuple = new ArrayList<String>();
		    	
		    	tuple.add(inputTuple.get(0));
		    	
		    	Node locationElement = ((NodeList) xpath.evaluate("./*[local-name()='location']",forecastsElement,XPathConstants.NODESET)).item(0);
		    	
		    	tuple.add((String) xpath.evaluate("./*[local-name()='city'][1]/text()",locationElement,XPathConstants.STRING));
		    	tuple.add((String) xpath.evaluate("./*[local-name()='state'][1]/text()",locationElement,XPathConstants.STRING));
		    	tuple.add((String) xpath.evaluate("./*[local-name()='zip'][1]/text()",locationElement,XPathConstants.STRING));
		    			    	
		    	NodeList forecastElements = (NodeList) xpath.evaluate("./*[local-name()='forecast']",forecastsElement,XPathConstants.NODESET);
		    	
		    	for (int e=0; e<forecastElements.getLength(); e++) {
		    		Node forecastElement = forecastElements.item(e);
		    		
		    		ArrayList<String> fullTuple = new ArrayList<String>();
		    		fullTuple.addAll(tuple); 
		    		String day = (String) xpath.evaluate("./*[local-name()='title'][1]/text()",forecastElement,XPathConstants.STRING);
		    		int index = day.indexOf(" "); if ((index = day.indexOf(" ",index+1))!=-1) {day = day.substring(0,index);} 
		    		fullTuple.add(day);
		    		fullTuple.add((String) xpath.evaluate("./*[local-name()='short-title'][1]/text()",forecastElement,XPathConstants.STRING));
		    		fullTuple.add((String) xpath.evaluate("./*[local-name()='high'][1]/text()",forecastElement,XPathConstants.STRING));
		    		fullTuple.add((String) xpath.evaluate("./*[local-name()='low'][1]/text()",forecastElement,XPathConstants.STRING));

		    		output.insertDistinct(fullTuple);
			    	
				}
		    	
			}
			else {
	    		System.err.println("Error: No method called " + endpoint[1] + " in wrapper: " + this.getClass().getName());
				System.err.println("Please update source definition and restart system .... exiting");
	    		System.exit(9);
			}
			
	    }
		catch (Exception e) {
			return null;
		}
    	
		return output;
    	
	}


	public void testWrapper() {
		WeatherBug r = new WeatherBug();
		String[] endpoint;
		ArrayList<String> input;
		
		System.out.println("WeatherBug.getFullForecast");
		
		endpoint = new String[2];
		endpoint[1] = "getFullForecast";
		input = new ArrayList<String>();
		input.add("90292");
		r.invoke(endpoint,input).print();
		
		//---------------------------------
		
		System.out.println("WeatherBug.getLiveCompactWeather");
		
		endpoint = new String[2];
		endpoint[1] = "getLiveCompactWeather";
		input = new ArrayList<String>();
		input.add("90292");
		r.invoke(endpoint,input).print();
						
		
	}
	
}
