package wrappers.imap;

import invocation.Wrapper;
import relational.DBConnection;
import relational.Table;
import java.util.ArrayList;

import javax.xml.xpath.*;
import org.w3c.dom.*;
import org.xml.sax.InputSource;

public class IMapData implements Wrapper {
	
	XPath xpath;
	String baseURL = "http://ragnarok.isi.edu/data/iMap/";
	long timestamp = 0;
	int millisecondDelay = 0;
	
	public IMapData() {
		xpath = XPathFactory.newInstance().newXPath();
	}
	
	
	public Table invoke(String[] endpoint, ArrayList<String> inputTuple) {
    	
		Table output = null;
		
		try {
			
			String url = baseURL + endpoint[1];
	    	
			// invoke source and parse xml output
			NodeList tupleElements = (NodeList) xpath.evaluate("//*[local-name()='tuple']",new InputSource(url),XPathConstants.NODESET);
			
			// get the metadata 
	    	ArrayList<String> columns = new ArrayList<String>();
	    	NodeList attributes = tupleElements.item(0).getChildNodes();
	    	for (int i=0; i<attributes.getLength(); i++) {
	    		String name = attributes.item(i).getLocalName();
	    		if (name != null) {
	    			columns.add(name);
	    		}
	    	}
	    		
			output = new Table(columns);
			
			// get the data
	    	for (int i=0; i<tupleElements.getLength(); i++) {
	    		ArrayList<String> tuple = new ArrayList<String>();
	    		for (int j=0; j<columns.size(); j++) { tuple.add(""); }
		    	NodeList tags = tupleElements.item(i).getChildNodes();
	    		for (int j=0; j<tags.getLength(); j++) {
	    			String name = tags.item(j).getNodeName();
	    			if (name != null) {
	    				int index = columns.indexOf(name);
	    				if (index!=-1) {
	    					tuple.set(index,tags.item(j).getTextContent().trim());
	    				}
	    			}
	    		}
	    		output.insertDistinct(tuple);
			}	
			
	    	
	    	
	    }
		catch (Exception e) { return null; }
    	
		return output;
    	
	}
	
	

	public void testWrapper() {
		
		DBConnection db = new DBConnection("com.mysql.jdbc.Driver","jdbc:mysql://localhost/imap","root","taipei");
		
		
		String[] fileNames = { "inventory/employees.xml",
				"inventory/order-details.xml",
				"inventory/orders.xml",
				"inventory/products.xml",
				"inventory/source1-data.xml",
				"inventory/source2-data-Employee-Info.xml",
				"inventory/source2-data-Order-Info.xml"};
		String[] tableNames = { "imap.inv_employees",
				"imap.inv_orderdetails",
				"imap.inv_orders",
				"imap.inv_products",
				"imap.inv_source1",
				"imap.inv_source2_employeeinfo",
				"imap.inv_source2_orderinfo"};
		
		IMapData r = new IMapData();
		String[] endpoint;
		ArrayList<String> input;
		
		for (int i=0;i<fileNames.length;i++) {
			endpoint = new String[2];
			endpoint[1] = fileNames[i];
			input = new ArrayList<String>();
			Table t = r.invoke(endpoint,input);
			//t.print();
			t.store(db,tableNames[i],true);
		}
		
		db.close();
		
	}
	
}
