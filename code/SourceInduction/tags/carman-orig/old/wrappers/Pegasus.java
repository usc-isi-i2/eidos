package wrappers;

import invocation.Wrapper;
import relational.Table;
import java.util.ArrayList;
import java.net.URLEncoder;

import javax.xml.xpath.*;
import org.w3c.dom.*;
import org.xml.sax.InputSource;

public class Pegasus implements Wrapper {
	
	XPath xpath;
	
	public Pegasus() {
		xpath = XPathFactory.newInstance().newXPath();
	}
	
	
	public Table invoke(String[] endpoint, ArrayList<String> inputTuple) {
    	
		Table output = null;
		String url = null;
		
		try {
			
			url = "http://pegasus2.isi.edu:8080/agent/runner";
	    	
			url += "?plan=" + URLEncoder.encode(endpoint[1],"UTF-8") + "%2Fplans%2Fproduction";
			
			int index = 2;
			String[] columns = new String[endpoint.length - index];
			for (int i=0; i<columns.length; i++) { columns[i] = endpoint[i+index]; }
			
			for (int i=0; i<inputTuple.size(); i++) {
				url += "&" + URLEncoder.encode(columns[i],"UTF-8") + "=" + URLEncoder.encode(inputTuple.get(i),"UTF-8");
			}
			
			output = new Table(columns);
			
			// invoke source and parse xml output
			NodeList rowElements = (NodeList) xpath.evaluate("//*[local-name()='AgentExecution']/*[local-name()='ExtractedData']/*[local-name()='Data']/*[local-name()='Row']",new InputSource(url),XPathConstants.NODESET);
			
			for (int i=0; i<rowElements.getLength(); i++) {
				ArrayList<String> tuple = new ArrayList<String>();
		    	for (String val: inputTuple) {
		    		tuple.add(val);
		    	}
		    	Node rowElement = rowElements.item(i);
		    	for (int j=inputTuple.size(); j<columns.length; j++) {
		    		tuple.add((String) xpath.evaluate("./*[local-name()='"+columns[j]+"']/*[local-name()='Value']/text()",rowElement,XPathConstants.STRING));
				}	
		    	output.insertDistinct(tuple);
			}
	    	
			
			
		}
		catch (Exception e) {
			return null;
		}
    	
		return output;
    	
	}


	public void testWrapper() {
		Pegasus r = new Pegasus();
		String[] endpoint;
		ArrayList<String> input;
		
//		 test 0:
		endpoint = new String[] {"", "weather/accuweather", "zipcodeorcitycommastate", "sky", "temperature"};
		input = new ArrayList<String>();
		input.add("90292");
		r.invoke(endpoint,input).print();
						
//		 test 1:
		endpoint = new String[] {"", "weather/accuweather", "zipcodeorcitycommastate", "sky", "temperature"};
		input = new ArrayList<String>();
		input.add("90066");
		r.invoke(endpoint,input).print();
						
						
	}
	
}