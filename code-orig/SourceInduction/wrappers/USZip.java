package wrappers;

import invocation.Wrapper;
import relational.Table;
import java.util.ArrayList;

public class USZip implements Wrapper {

	public Table invoke(String[] endpoint, ArrayList<String> inputTuple) {
    	
		Table output = null;
		
		if (endpoint[1].equals("GetInfoByState")) {
        	output = getInfoByState(inputTuple);
    	}
    	else if (endpoint[1].equals("GetInfoByZip")) {
        	output = getInfoByZip(inputTuple);
    	}
    	else {
    		System.err.println("Error: No method called " + endpoint[1] + " in wrapper: " + this.getClass().getName());
			System.err.println("Please update source definition and restart system .... exiting");
    		System.exit(9);
    	}
        
    	return output;
        
    }

	private Table getInfoByState(ArrayList<String> inputTuple) {
	    
		ArrayList<String> columns = new ArrayList<String>(4); 
		columns.add("STATE");
	    columns.add("CITY");
	    columns.add("ZIP");
	    columns.add("AREA_CODE");
	    columns.add("TIME_ZONE");
		
		Table output = new Table(columns);
		String urlString = null;
		
	    try {
	        
	       urlString = "http://www.webservicex.net/uszip.asmx/GetInfoByState?USState="+inputTuple.get(0).trim();
	       java.io.BufferedReader br = new java.io.BufferedReader(new java.io.InputStreamReader((new java.net.URL(urlString)).openStream()));
	       
	       String line;
	       while ((line = br.readLine()) != null) {
	    	   if (line.indexOf("<Table>") != -1) {
	    		   // create output tuple
	    		   ArrayList<String> tuple = new ArrayList<String>(); 
		           // initialize values to null
	    		   for (int i=0; i<columns.size(); i++) { 
	    			   tuple.add(null); 
	    		   }
		           while ((line = br.readLine()) != null && line.indexOf("</Table>") == -1) {
	    			   for (int i=0; i<columns.size(); i++) {
	    				   String col = columns.get(i);
	    				   if (line.indexOf("<"+col+">") != -1) {
	 	    				  tuple.set(i,line.substring(line.indexOf("<"+col+">")+(col.length()+2), line.indexOf("</"+col+">")));
	 	    				  break;
	    				   } 
	    			   }
	    		   }
		           output.insertDistinct(tuple);
	    	   }
	       }     
	        
	    } catch (Exception e) { return null; }
	    
	    return output;
	    
	}

	private Table getInfoByZip(ArrayList<String> inputTuple) {
	    
		ArrayList<String> columns = new ArrayList<String>(); 
	    columns.add("ZIP");
	    columns.add("CITY");
	    columns.add("STATE");
	    columns.add("AREA_CODE");
	    columns.add("TIME_ZONE");
		
		Table output = new Table(columns);
		String urlString = null;
		
	    try {
	        
	       urlString = "http://www.webservicex.net/uszip.asmx/GetInfoByZIP?USZip="+inputTuple.get(0).trim();
	       java.io.BufferedReader br = new java.io.BufferedReader(new java.io.InputStreamReader((new java.net.URL(urlString)).openStream()));
	       
	       String line;
	       while ((line = br.readLine()) != null) {
	    	   if (line.indexOf("<Table>") != -1) {
	    		   // create output tuple
	    		   ArrayList<String> outputTuple = new ArrayList<String>(columns.size()); 
		           // initialize values to null
	    		   for (int i=0; i<columns.size(); i++) { 
	    			   outputTuple.add(null); 
	    		   }
		           while ((line = br.readLine()) != null && line.indexOf("</Table>") == -1) {
	    			   for (int i=0; i<columns.size(); i++) {
	    				   String col = columns.get(i);
	    				   if (line.indexOf("<"+col+">") != -1) {
	 	    				  outputTuple.set(i,line.substring(line.indexOf("<"+col+">")+(col.length()+2), line.indexOf("</"+col+">")));
	 	    				  break;
	    				   } 
	    			   }
	    		   }
		           output.insertDistinct(outputTuple);
	    	   }
	       }     
	    
	    } catch (Exception e) { return null; }

	    
	    return output;
	    
	}

	public void testWrapper() {
		USZip r = new USZip();
		String[] endpoint;
		ArrayList<String> input;
		
		// test 0:
		endpoint = new String[2];
		endpoint[1] = "GetInfoByZip";
		input = new ArrayList<String>();
		input.add("90266");
		r.invoke(endpoint,input).print();
	
		// test 0:
		endpoint = new String[2];
		endpoint[1] = "GetInfoByState";
		input = new ArrayList<String>();
		input.add("NV");
		r.invoke(endpoint,input).print();
	
	
	}
	
}
