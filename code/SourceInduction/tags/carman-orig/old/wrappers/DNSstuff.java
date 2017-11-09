package wrappers;

import invocation.Wrapper;
import relational.Table;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.ArrayList;

public class DNSstuff extends Wrapper {
	
	long timestamp = 0;
	
	public DNSstuff() {
	}
	
	
	public Table invoke(String[] endpoint, ArrayList<String> inputTuple) {
 
			
		Table output = null;
		String url;
		
		if (endpoint[1].equalsIgnoreCase("geocode")) {

			/* 
			 * http://backup.dnsstuff.com/tools/geocoder.ch?name=12012+Washington+Pl+90066
			 * 
Your input was:<BR><PRE>
12012 Washington Pl 90066
</PRE>
I parsed out:<BR><PRE>
Street Number:        12012
Direction Prefix:       
Street Name:          Washington
Street Type:          PL
Street Suffix:          
ZIP:                  90066-0000
</PRE>
My results:<BR><PRE>
The ZIP+4 code is:    90066-0000
The street range is:  12001 to 12099
The street is:        12012 WASHINGTON PL 
Start Lat-lon is:     34.001911 -118.425713
End Lat-lon is:       34.001514 -118.426476
Estimated Lat-lon is: <B>34.001865 -118.425797</B>   (based on 11%)<!-- latend=34.001514 latstart=34.001911 lonend=-118.426476 lonstart=-118.425713 mstart: 12012 pzstart: 12001 -->
</PRE>
<BR><BR>

Ideal input is a street name/number and a ZIP code, such as '1234 Main St 01234'.
<BR><BR>
<HR><CENTER><H6>(C) Copyright 2000-2006 DNSstuff.com</H6></CENTER>
</BODY></HTML>
			 * 
			 */			
			
			url = "http://backup.dnsstuff.com/tools/geocoder.ch?name=";
			
			try {
				
				url += java.net.URLEncoder.encode(inputTuple.get(0),"UTF-8");     // street (number and name)
				url += "+"+java.net.URLEncoder.encode(inputTuple.get(1),"UTF-8"); // zip
				
				long delay = 100; // millisecond delay between source invocations
				long interval = System.currentTimeMillis() - timestamp;
				if (interval < delay) { Thread.sleep(delay-interval); }
				timestamp = System.currentTimeMillis();
				
		    	String[] columns = new String[] {"street","zip","latitude","longitude"};
		    	output = new Table(columns);
				
		    	// invoke source
				String doc = loadURL(url);
		    	
		    	String startTag = "Estimated Lat-lon is: <B>";
		    	String endTag = "</B>";
		    	
		    	int index = doc.indexOf(startTag);
		    	
		    	if (index!=-1) {
		    		
		    		ArrayList<String> tuple = new ArrayList<String>();
			    	tuple.add(inputTuple.get(0));
			    	tuple.add(inputTuple.get(1));
			    
			    	int start = index + startTag.length();
		    		int end = doc.indexOf(endTag,start);
		    		String[] location = doc.substring(start,end).split("-");
		    		
		    		tuple.add(location[0]); // lat
		    		tuple.add(location[1]); // long
		    		
		    		output.insertDistinct(tuple);
				}
		    	
		    }
			catch (Exception e) {
				System.err.println("Error invoking method called " + endpoint[1] + " in wrapper: " + this.getClass().getName() + " with url="+url);
			}
	    	
		}
		else {
    		System.err.println("Error: No method called " + endpoint[1] + " in wrapper: " + this.getClass().getName());
    		System.exit(9);
		}
		
		return output;
		
	}

	private String loadURL(String url) {
		// load the document
		String doc = "";
		try {
			BufferedReader in = new BufferedReader(new InputStreamReader((new URL(url)).openStream()));
			String line;
			while ((line = in.readLine()) != null) {
				System.out.println(line);
				doc += line;
			}
		}
		catch (Exception e) {
			System.err.println("Error invoking URL: "+url);
		}
		return doc;
	}
	

	public static void testWrapper() {
		DNSstuff r = new DNSstuff();
		String[] endpoint;
		ArrayList<String> input;
		
		endpoint = new String[] {"", "geocode"};
		input = new ArrayList<String>();
		input.add("5933 W Century Blvd");
		input.add("90045");
		r.invoke(endpoint,input).print();
						
		endpoint = new String[] {"", "geocode"};
		input = new ArrayList<String>();
		input.add("4676 Admiralty Way");
		input.add("90292");
		r.invoke(endpoint,input).print();
						
		endpoint = new String[] {"", "geocode"};
		input = new ArrayList<String>();
		input.add("910 Lincoln Blvd");
		input.add("90291");
		r.invoke(endpoint,input).print();
						
	}
	
}
