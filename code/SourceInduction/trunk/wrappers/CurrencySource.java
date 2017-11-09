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

public class CurrencySource implements Wrapper {

	XPath xpath;

	public CurrencySource() {
		xpath = XPathFactory.newInstance().newXPath();
	}


	public Table invoke(String[] endpoint, List<String> inputTuple) {

		Table output = null;
		String url = null;

		if (endpoint[1].equalsIgnoreCase("getRates")) {

			/*
			 * http://currencysource.com/RSS/AUD.xml
			 *
<?xml version="1.0" ?>
 <rss version='2.0'>
  <channel>
   <title>Exchange Rates: Australian Dollar</title>
   ...
   <item>
    <title>1 AUD = AED (2.749603)</title>
    ...
   </item>
   ...
			 *
			 */

			try {

				url = "http://currencysource.com/RSS/";
				url += java.net.URLEncoder.encode(inputTuple.get(0).trim(),"UTF-8") + ".xml"; // currency

				// the metadata
		    	String[] columns = new String[] {"Currency1","Currency2","Rate"};
		    	output = new Table(columns);

		    	// invoke source and parse xml output
				NodeList itemElements = (NodeList) xpath.evaluate("//*[local-name()='channel']/*[local-name()='item']",new InputSource(url),XPathConstants.NODESET);

		    	for (int i=0; i<itemElements.getLength(); i++) {

		    		Node itemElement = itemElements.item(i);
			    	ArrayList<String> tuple = new ArrayList<String>();
			    	tuple.add(inputTuple.get(0));

			    	String title = (String) xpath.evaluate("./*[local-name()='title'][1]/text()",itemElement,XPathConstants.STRING);

			    	title = title.substring(title.indexOf("=") + 1).trim();

			    	String val1 = title.substring(0,title.indexOf(" "));
			    	String val2 = title.substring(title.indexOf("(")+1,title.indexOf(")"));

			    	tuple.add(val1);
			    	tuple.add(val2);

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
		CurrencySource r = new CurrencySource();
		String[] endpoint;
		ArrayList<String> input;

		System.out.println("CurrencySource.getRates");

		endpoint = new String[2];
		endpoint[1] = "getRates";
		input = new ArrayList<String>();
		input.add("AUD");
		r.invoke(endpoint,input).print();

		//--------------------------------
	}

}
