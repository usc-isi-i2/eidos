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

public class YahooAutos implements Wrapper {

	XPath xpath;

	public YahooAutos() {
		xpath = XPathFactory.newInstance().newXPath();
	}


	public Table invoke(String[] endpoint, List<String> inputTuple) {

		Table output = null;
		String url = "http://autos.yahoo.com/usedcars/rss/rss.php?vtype=autos";

		if (endpoint[1].equalsIgnoreCase("usedCars")) {

			try {

				url += "&csz="+java.net.URLEncoder.encode(inputTuple.get(0),"UTF-8");
				url += "&mk="+java.net.URLEncoder.encode(inputTuple.get(1),"UTF-8");

				/*
				 * http://autos.yahoo.com/usedcars/rss/rss.php?csz=90066&vtype=autos&mk=Audi
				 *
				 * <?xml version="1.0" encoding="iso-8859-1"?>
				 * <rss version="2.0" >
				 *  <channel>
				 *   <title> Yahoo! Autos used Audi  near 90066 </title>
				 *   <item>
				 *    <title> 2002 Audi TT - Price: USD 26995 Miles: 29262 PostDate: Thu, 18 May 2006 02:28:35 -0700 </title>
				 *    ....
				 *    <pubDate> Thu, 18 May 2006 02:19:50 PDT </pubDate>
				 *    <imagesrc> http://images.autotrader.com/images/2006/5/17/202/190/492743592.202190266.IM1.MAIN.60x45_A.60x41.jpg </imagesrc>
				 *    <year> 2002 </year>
				 *    <make> Audi </make>
				 *    <model> TT </model>
				 *    <vin> TRUTC28N821040622 </vin>
				 *    <mileage> 29262 </mileage>
				 *    <price> 26995 </price>
				 *    <listing> premium </listing>
				 *    <distance> 5.05 </distance>
				 *    <seller> dealer </seller>
				 *   </item>
				 *   <item>
 				 *    ....
				 */

		    	String[] columns = new String[] {"zip","make","pubDate","year","model","vin","mileage","price","distance"};
		    	output = new Table(columns);

				// invoke source and parse xml output
				NodeList itemElements = (NodeList) xpath.evaluate("//*[local-name()='item']",new InputSource(url),XPathConstants.NODESET);
				for (int i=0; i<itemElements.getLength(); i++) {
			    	ArrayList<String> tuple = new ArrayList<String>();
			    	tuple.add(inputTuple.get(0));
			    	tuple.add(inputTuple.get(1));
			    	Node itemElement = itemElements.item(i);
			    	for (String col: output.colNames.subList(2,output.colNames.size())) {
				    	tuple.add((String) xpath.evaluate("./*[local-name()='"+col+"'][1]/text()",itemElement,XPathConstants.STRING));
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
		YahooAutos r = new YahooAutos();
		String[] endpoint;
		ArrayList<String> input;

		// test 0:
		endpoint = new String[] {"", "usedCars"};
		input = new ArrayList<String>();
		input.add("90292");
		input.add("Audi");
		r.invoke(endpoint,input).print();

		// test 1:
		endpoint = new String[] {"", "usedCars"};
		input = new ArrayList<String>();
		input.add("90066");
		input.add("Toyota");
		r.invoke(endpoint,input).print();

		endpoint = new String[] {"", "usedCars"};
		input = new ArrayList<String>();
		input.add("37076");
		input.add("FORD");
		r.invoke(endpoint,input).print();

		endpoint = new String[] {"", "usedCars"};
		input = new ArrayList<String>();
		input.add("95978");
		input.add("MITSUBISHI");
		r.invoke(endpoint,input).print();

		endpoint = new String[] {"", "usedCars"};
		input = new ArrayList<String>();
		input.add("90266");
		input.add("HONDA");
		r.invoke(endpoint,input).print();

		endpoint = new String[] {"", "usedCars"};
		input = new ArrayList<String>();
		input.add("90266");
		input.add("HONDA");
		r.invoke(endpoint,input).print();

		endpoint = new String[] {"", "usedCars"};
		input = new ArrayList<String>();
		input.add("90266");
		input.add("HONDA");
		r.invoke(endpoint,input).print();

	}

}
