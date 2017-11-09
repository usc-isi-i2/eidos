package invocation.wrappers;

import invocation.Client;
import relational.Table;
import java.util.ArrayList;

import javax.xml.xpath.*;
import org.w3c.dom.*;
import org.xml.sax.InputSource;

public class Google extends Client {
	
	XPath xpath;
	
	public Google() {
		xpath = XPathFactory.newInstance().newXPath();
	}
	
	public Table invoke(String[] endpoint, ArrayList<String> inputTuple) {
    	
		// example: http://www.google.com/search?q=1.50+eur+in+usd
		String url = "http://www.google.com/search?q=";
	    
		try {
			
			if (endpoint[1].equalsIgnoreCase("CurrencyConverter")) {
				url += java.net.URLEncoder.encode(inputTuple.get(0)+" "+inputTuple.get(1)+" in "+inputTuple.get(2),"UTF-8");
				// the metadata 
		    	ArrayList<String> columns = new ArrayList<String>();
		    	columns.add("price");
		    	// the data
		    	Table output = new Table(columns);
		    	ArrayList<String> tuple = new ArrayList<String>();
		    	// invoke source and parse xml output
		    	Node rowElement = ((NodeList) xpath.evaluate("//*[local-name()='tr'][/*[local-name()='td']/*[local-name()='img']/[@src='/images/calc_img.gif']]",new InputSource(url),XPathConstants.NODESET)).item(0);
			    tuple.add(rowElement.getTextContent());
		    	output.insert(tuple);
				return output;
			}
			else {
	    		System.err.println("Error: No method called " + endpoint[1] + " in wrapper: " + this.getClass().getName());
	    		System.exit(9);
	    	}
			
		}
		catch (Exception e) {
			System.err.println("Error parsing file: " + url + " when invoking method: " + endpoint[1] + " in wrapper: " + this.getClass().getName());
			e.printStackTrace();
		}
    	return null;
    	
	}


	public static void testWrapper() {
		Google r = new Google();
		String[] endpoint;
		ArrayList<String> input;
		
// test 0:
		endpoint = new String[3];
		endpoint[1] = "CurrencyConverter";
		input = new ArrayList<String>();
		input.add("1.70");
		input.add("USD");
		input.add("EUR");
		r.invoke(endpoint,input).print();
// test 1:
		endpoint = new String[3];
		endpoint[1] = "CurrencyConverter";
		input = new ArrayList<String>();
		input.add("10.704");
		input.add("gbp");
		input.add("aud");
		r.invoke(endpoint,input).print();
						
	}
	
}
