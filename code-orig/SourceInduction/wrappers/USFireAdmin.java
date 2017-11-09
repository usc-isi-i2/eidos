package wrappers;

import invocation.Wrapper;
import relational.Table;
import java.util.ArrayList;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;

public class USFireAdmin implements Wrapper {
	
	
	public Table invoke(String[] endpoint, ArrayList<String> inputTuple) {
    	
		// call:	http://www.usfa.fema.gov/applications/hotel/search_download.cfm?ff_city=los%20angeles
		// data:	FEMA ID	 Name                          P.O. Box	 Street	             City	         State	 Zip Code        Stories	Phone	         Property Type	Sprinklers
		//			CA1600   Adams Motel 	                         4905 W Adams Blvd 	 Los Angeles 	 CA 	 90016-2849 	 1 	        (323) 731-2165 	 Hotel/Motel 	  
		//			CA1260   Best Western Dragon Gate Inn 	  	     818 N HL St 	     Los Angeles 	 CA 	 90012-2370 	 3 	        (213) 617-3077 	 Hotel/Motel 	Sprinkler System Present 
		//			CA2806   Best Western Eagle Rock Inn  	  	     2911 Colorado Blvd  Los Angeles  	 CA 	 90041 	         3 	        (323) 256-7711 	 Hotel/Motel 	  
		// 	
		
		Table output = null;
		String url = "";
		
		try {
						
	    	String[] columns = null;			
			int[] indices = null;
	    	
			if (endpoint[1].equalsIgnoreCase("HotelsByCity")) {
				url = "http://www.usfa.fema.gov/applications/hotel/search_download.cfm?ff_city="+java.net.URLEncoder.encode(inputTuple.get(0),"UTF-8");
				columns = new String[] {"City","Name","Street","State","Zip_Code","Stories","Phone"};
				indices = new int[]    { 4    , 1    , 3      , 5     , 6        , 7       , 8     };
			}
			else if (endpoint[1].equalsIgnoreCase("HotelsByZip")) {
				url = "http://www.usfa.fema.gov/applications/hotel/search_download.cfm?ff_zip="+java.net.URLEncoder.encode(inputTuple.get(0),"UTF-8");
				columns = new String[] {"Zip_Code","Name","Street","City","State","Stories","Phone"};
				indices = new int[]    { 6        , 1    , 3      , 4    , 5     , 7       , 8     };
			}
			else {
				System.err.println("Error: No method called " + endpoint[1] + " in wrapper: " + this.getClass().getName());
				System.err.println("Please update source definition and restart system .... exiting");
	    		System.exit(9);
	    	}
			
			
			// the metadata 
	    	output = new Table(columns);

	    	// invoke source and parse tab separated output
			BufferedReader in = new BufferedReader(new InputStreamReader((new URL(url)).openStream()));
			String data;
			if (in.readLine() != null) { // first line is metadata
				while ((data=in.readLine()) != null) {
					String[] values = data.split("\t");
					if (values.length >= 11) {
						ArrayList<String> tuple = new ArrayList<String>();
						for (int i: indices) { 
							tuple.add(values[i].trim()); 
						}
						output.insertDistinct(tuple);
					}	
				}
			}
			
		}
		catch (Exception e) {
			return null;
    	}
		
    	return output;
    	
	}


	public void testWrapper() {
		USFireAdmin r = new USFireAdmin();
		String[] endpoint;
		ArrayList<String> input;
		
		// test 0:
		endpoint = new String[2];
		endpoint[1] = "HotelsByCity";
		input = new ArrayList<String>();
		input.add("San Diego");
		r.invoke(endpoint,input).print();
						
		// test 1:
		endpoint = new String[2];
		endpoint[1] = "HotelsByZip";
		input = new ArrayList<String>();
		input.add("90292");
		r.invoke(endpoint,input).print();
		
						
	}
	
}
