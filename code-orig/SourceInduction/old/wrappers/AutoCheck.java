package wrappers;

import invocation.Wrapper;
import relational.Table;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.ArrayList;

public class AutoCheck implements Wrapper {
	
	long timestamp = 0;
	
	public AutoCheck() {
	}
	
	
	public Table invoke(String[] endpoint, ArrayList<String> inputTuple) {
 
		/* 
		 * http://www.autocheck.com/consumers/vinSearchAction.do?vin=19UUA66284A048695
		 * 
		 * .....      
      <!--START VEHICLE DESCRIPTION-->
      <table cellpadding="3" cellspacing="0" border="0">
        ...
        <tr> 
          <td class="sticky_text">
            &nbsp;
            <strong>
              VIN:
            </strong>
            19UUA66284A048695
          </td>
        </tr>
        <tr>
          <td class="sticky_text">
            &nbsp;
            <strong>
              Year:
            </strong> 
            2004
          </td>
        </tr>
        <tr>
          <td class="sticky_text">
            &nbsp;
            <strong>
              Make:
            </strong>
            Acura
          </td>
        </tr>
        <tr>
           <td class="sticky_text">
            &nbsp;
            <strong>
              Model:
            </strong> 
            TL 
          </td>
        </tr>
        <tr>
          <td class="sticky_text">
            &nbsp;
            <strong>
              Style/Body:
            </strong>
            Sedan 4 Door
          </td>
        </tr>
        <tr>
          <td class="sticky_text">
            &nbsp;
            <strong>
              Engine:
            </strong>
            3.2L V6 EFI SOHC
          </td>
        </tr>
        <tr>
          <td class="sticky_text">
            &nbsp;
            <strong>
              Country of Assembly:
            </strong>
            United States
            <br>
          </td>
        </tr>
      </table>
      <!--END VEHICLE DESCRIPTION-->
		 *  
		 */
			
		Table output = null;
		String url = "http://www.autocheck.com/consumers/vinSearchAction.do";
		
		if (endpoint[1].equalsIgnoreCase("VinInfo")) {
			
			try {
				
				url += "?vin="+java.net.URLEncoder.encode(inputTuple.get(0),"UTF-8"); // vin
				
				long delay = 100; // millisecond delay between source invocations
				long interval = System.currentTimeMillis() - timestamp;
				if (interval < delay) { Thread.sleep(delay-interval); }
				timestamp = System.currentTimeMillis();
				
		    	String[] columns = new String[] {"vin","year","make","model","trim","engine","country"};
		    	output = new Table(columns);
				
				// invoke source 
		    	
		    	String doc = loadURL(url);
		    	int index = doc.indexOf("<!--START VEHICLE DESCRIPTION-->");
		    	
		    	if (index!=-1) {

		    		doc = doc.substring(index);

		    		ArrayList<String> tuple = new ArrayList<String>();
			    	tuple.add(inputTuple.get(0));
			    				    	
			    	for (String label: new String[] {"Year:","Make:","Model","Style/Body:","Country of Assembly:"}) {
				    	index = doc.indexOf(label);
			    		if (index!=-1) {
			    			index = index + label.length();
				    		int start = doc.indexOf(">",index);
				    		int end = doc.indexOf("<",start);
					    	tuple.add(doc.substring(start,end).trim());
					    }
				    	else {
				    		tuple.add("N/A");
				    	}
				    }
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
	

	
	
	public void testWrapper() {
		
		AutoCheck r = new AutoCheck();
		String[] endpoint;
		ArrayList<String> input;
		
		// test 0:
		endpoint = new String[] {"", "VinInfo"};
		input = new ArrayList<String>();
		input.add("JH4CL96815C028173");
		r.invoke(endpoint,input).print();
		
		// test 1:
		endpoint = new String[] {"", "VinInfo"};
		input = new ArrayList<String>();
		input.add("JH4CL96824C006195");
		r.invoke(endpoint,input).print();
		
		// test 2:
		endpoint = new String[] {"", "VinInfo"};
		input = new ArrayList<String>();
		input.add("19UUA56652A060863");
		r.invoke(endpoint,input).print();
						
	}
	
}
