package invocation.wrappers;

import invocation.Client;
import relational.Table;
import java.util.ArrayList;
import java.util.List;

import net.sf.saxon.Configuration;
import net.sf.saxon.query.StaticQueryContext;
import net.sf.saxon.query.DynamicQueryContext;
import net.sf.saxon.query.XQueryExpression;
import net.sf.saxon.om.Item;
import net.sf.saxon.om.NodeInfo;

import javax.xml.xpath.*;
import org.w3c.dom.*;

public class XQueryWrapper extends Client {
	
	XPath xpath;
	Configuration config;
	StaticQueryContext sqc;
	
	public XQueryWrapper() {
		xpath = XPathFactory.newInstance().newXPath();
		config = new Configuration();
		sqc = new StaticQueryContext(config);
	}
	
	
	public Table invoke(String[] endpoint, ArrayList<String> inputTuple) {
    	
		try {
			
			XQueryExpression xe = sqc.compileQuery("let $d := doc(\"http://xml.weather.yahoo.com/forecastrss?p=90266\") return <table> <tr><td>blah</td></tr> <tr><td>{3+2}</td></tr> </table>");
			DynamicQueryContext dqc = new DynamicQueryContext(config);
			Item item = (Item) xe.evaluateSingle(dqc);

			System.out.println(item.getStringValue());
			
			// invoke source and parse resulting table
			NodeList rows = (NodeList) xpath.evaluate("//table/tr",((NodeInfo) item).getDocumentRoot(),XPathConstants.NODESET);
	    	
			// get the metadata (first row of table)
	    	ArrayList<String> columns = new ArrayList<String>();
			
	    	Node row = rows.item(0);
	    	NodeList fields = (NodeList) xpath.evaluate("./td",row,XPathConstants.NODESET);
	    	for (int i=0; i<fields.getLength(); i++) {
	    		columns.add(fields.item(i).getTextContent());
	    	}
	    	
	    	// get the data
	    	Table output = new Table(columns);
	    	ArrayList<String> tuple;
	    	for (int i=1; i<rows.getLength(); i++) {
	    		tuple = new ArrayList<String>();
				row = rows.item(i);
		    	fields = (NodeList) xpath.evaluate("./td",row,XPathConstants.NODESET);
		    	for (int j=0; j<fields.getLength(); j++) {
		    		tuple.add(fields.item(j).getTextContent());
		    	}
		    	output.insert(tuple);
	    	}	
			
	    	return output;
			
		}
		catch (Exception e) {
			System.err.println("Error invoking method called " + endpoint[1] + " in wrapper: " + this.getClass().getName());
    		e.printStackTrace();
			System.exit(9);
    	}
    	return null;
    	
	}


	public static void testWrapper() {
		XQueryWrapper r = new XQueryWrapper();
		String[] endpoint;
		ArrayList<String> input;
		
		endpoint = new String[2];
		endpoint[1] = "YahooWeather.xq";
		input = new ArrayList<String>();
		
		r.invoke(endpoint,input).print();
		
	}
	
}