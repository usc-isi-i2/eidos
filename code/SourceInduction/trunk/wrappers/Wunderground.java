package wrappers;

import invocation.Wrapper;

import java.util.ArrayList;
import java.util.List;

import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathFactory;

import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;

import relational.Table;

public class Wunderground implements Wrapper {

	XPath xpath;

	public Wunderground() {
		xpath = XPathFactory.newInstance().newXPath();
	}


	public Table invoke(String[] endpoint, List<String> inputTuple) {

		/*
		 * Example:
		 * http://www.wunderground.com/auto/rss_full/CA/Los_Angeles.xml?units=both
		 *
		 *
<?xml version="1.0" encoding="ISO-8859-1"?>
<rss version="2.0">
<channel>
	<title>Los Angeles, CA Weather from Weather Underground</title>
	<link>http://www.wunderground.com/</link>
	<description>Weather Underground RSS Feed for Los Angeles, CA US</description>
	<language>EN</language>
    <generator>WU-RSS</generator>
    <webMaster>aaron@wunderground.com</webMaster>
	<category>weather</category>
    <image>
        <url>http://icons.wunderground.com/graphics/smash/wunderTransparent.gif</url>
        <link>http://www.wunderground.com/</link>
        <title>Weather Underground</title>
    </image>
    <pubDate>Wed, 29 Mar 2006 12:47:00 PST</pubDate>
    <lastBuildDate>Wed, 29 Mar 2006 12:47:00 PST</lastBuildDate>
	<ttl>5</ttl>
	<item>
		<guid isPermaLink="false">1143665220</guid>
		<title><![CDATA[Current Conditions - 12:47 PM PST Mar. 29 - Temperature: 61&#176;F / 16&#176;C | Conditions: Clear]]></title>
		<link>http://www.wunderground.com/US/CA/Los_Angeles.html</link>
		<description>
			<![CDATA[Temperature: 61&#176;F / 16&#176;C | Humidity: 52% | Pressure: 29.99in / 1015hPa | Conditions: Clear | Wind Direction: Variable | Wind Speed: 7mph / 11km/h]]>
		</description>
        <pubDate>Wed, 29 Mar 2006 12:47:00 PST</pubDate>
    </item>
    <item>
    	<title>Today as of Mar. 29 3:30 AM PST</title>
    	<link>http://www.wunderground.com/US/CA/Los_Angeles.html</link>
        <description>
     		Today - Partly to mostly cloudy with scattered showers. Highs in  the lower to mid 60s. Southwest winds 15 to 20 mph this afternoon.  Chance of rain 40 percent.  as of 3:30 am PST on March 29, 2006
	    </description>
	    <pubDate>Wed, 29 Mar 2006 03:30:00 PST</pubDate>
	    <guid isPermaLink="false">1143631800</guid>
    </item>
</channel>
</rss>
		 *
		 */

		Table output = null;
		String url = null;

		try {

			url = "http://www.wunderground.com/auto/rss_full";

			if (endpoint[1].equalsIgnoreCase("wunderground")) {

				url += "/" + java.net.URLEncoder.encode(inputTuple.get(0).trim(),"UTF-8"); // state
				url += "/" + java.net.URLEncoder.encode(inputTuple.get(1).trim().replaceAll(" ","_"),"UTF-8"); // city (space replaced by underscore!)
				url += ".xml?units=both";

				output = new Table(new String[] {"state","city","tempf","tempc","humid","pressin","presshpa","sky","windir","windspd","windgsts"});

				// invoke source and parse xml output
				Node descriptionElement = ((NodeList) xpath.evaluate("//*[local-name()='channel']/*[local-name()='item'][1]/*[local-name()='description'][1]",new InputSource(url),XPathConstants.NODESET)).item(0);

				String[] data = descriptionElement.getTextContent().split("\\|");

				ArrayList<String> tuple = new ArrayList<String>();

				tuple.add(inputTuple.get(0)); // state
				tuple.add(inputTuple.get(1)); // city

				String d;
				d = data[0].trim();
				tuple.add(d.substring("Temperature:".length(),d.indexOf("/")).trim()); //tempf
				tuple.add(d.substring(d.indexOf("/")+1).trim()); //tempc

				d = data[1].trim();
				tuple.add(d.substring("Humidity:".length()).trim()); //humid

				d = data[2].trim();
				tuple.add(d.substring("Pressure:".length(),d.indexOf("/")).trim()); //pressin
				tuple.add(d.substring(d.indexOf("/")+1).trim()); //presshpa

				d = data[3].trim();
				tuple.add(d.substring("Conditions:".length()).trim()); //sky

				d = data[4].trim();
				tuple.add(d.substring("Wind Direction:".length()).trim()); //winddir

				d = data[5].trim();
				tuple.add(d.substring("Wind Speed:".length(),d.indexOf("/")).trim()); //windspd
				tuple.add(d.substring(d.indexOf("/")+1).trim()); //windgsts

				output.insertDistinct(tuple);

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
		Wunderground r = new Wunderground();
		String[] endpoint;
		ArrayList<String> input;

		System.out.println("Wunderground.wunderground");

		endpoint = new String[] {"", "wunderground"};
		input = new ArrayList<String>();
		input.add("CA");
		input.add("Marina del Rey");
		r.invoke(endpoint,input).print();


	}

}
