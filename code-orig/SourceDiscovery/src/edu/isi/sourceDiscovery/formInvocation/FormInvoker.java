package edu.isi.sourceDiscovery.formInvocation;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import org.apache.commons.lang.StringUtils;


/**
 * Used for invoking a webpahe usingany of the HTTP Methods
 * @author dipsy
 *
 */
public class FormInvoker {	
	
	String url;
	HttpMethod method;
	public static boolean debug = true;
	public static PrintStream log = System.out;
	/**
	 * Constructor. Sets the class attributes
	 * @param url - The URL of the webpage
	 * @param method - The method (GET/POST/PUT)
	 */
	public FormInvoker(String url, HttpMethod method) {
		this.url = url;
		this.method = method;
	}
	
	/**
	 * It invokes the web page with the form attributes and values that are passed to the function, 
	 * and then returns the resulting page that is returned by the web server
	 * @param formInputNames - The names of the form attributes to send to the server 
	 * @param formInputValues - Values of the corresponding form attributes
	 * @return - The resulting page returned by the web server.
	 * @throws IOException
	 */
	public String invoke(List<String> formInputNames, List<String> formInputValues) throws IOException {
		
		// From the form's attribute names and values, contruct the query string
		StringBuilder query = new StringBuilder("");
		for(int i=0; i<formInputNames.size(); i++) {
			query.append(formInputNames.get(i));
			
			String value = formInputValues.get(i);
			if(!StringUtils.isEmpty(value)) {
				query.append("=").append(URLEncoder.encode(value, "UTF-8"));
			}
			
			if(i < formInputNames.size()-1)
				query.append("&");
		}
		
		if(debug) {
			log.println("Invoking " + url + "?" + query.toString());
		}
		
		//Open the connection with the web page and set the proper Http Method
		HttpURLConnection uc = null;    
	    
	    if(method == HttpMethod.METHOD_GET) {
	    	//uc.setRequestMethod("GET");
	    	//uc.setDoInput(true);	    	
	    	uc = (HttpURLConnection)new URL(url + "?" + query.toString()).openConnection();
	    	
	    } else {
	    	uc = (HttpURLConnection)new URL(url).openConnection();	
	    	uc.setRequestMethod("POST");	    
	    	uc.setDoOutput(true);
	    	uc.setDoInput(true);
	    	uc.setAllowUserInteraction(false);	    
	    	uc.setUseCaches (false);	//Disable caching
	    	uc.setInstanceFollowRedirects(true);
	    
	    	DataOutputStream dos = new DataOutputStream(uc.getOutputStream());
	    
		    // The POST line, the Accept line, and
		    // the content-type headers are sent by the URLConnection.
		    // We just need to send the data
		    
		    //Send the query string to the webpage
		    dos.writeBytes(query.toString());
		    dos.close();
	    }
	    
	    //Read back the result outputted by the web server
	    StringBuilder page = new StringBuilder("");
	    BufferedReader reader = new BufferedReader(new InputStreamReader(uc.getInputStream()));
	    String nextline;
	    while ((nextline = reader.readLine()) != null) {
	      page.append(nextline).append("\n");
	    }
	    reader.close();
	  
	    return page.toString();
	}	
		
	 private static Random random = new Random();

	  protected static String randomString() {
	    return Long.toString(random.nextLong(), 36);
	  }
	  
	  
	public static void main(String[] args) throws IOException {
		
		//--------------------------------------------------------------------
		//				Test for a GET form
		//--------------------------------------------------------------------
		/*
		 * SearchResult 3: http://www.weather.com/
>>>>>> form ( whatform)
url: http://www.weather.com/search/enhanced
method: GET
fields: 
[(*) not found/HIDDEN/from/hp_promolocator
, (*) not found/HIDDEN/whatprefs/
, (*) not found/HIDDEN/what/Weather36HourPetsCommand
, (*) not found/HIDDEN/lswe/null
, (*) not found/HIDDEN/lswa/null
, (*) not found/TEXT/where/Enter city or US zip
, (*) not found/IMAGE/null/null
	 */
		
//		FormInvoker invoker = new FormInvoker("http://www.weather.com/search/enhanced", 
//												HttpMethod.METHOD_GET);
//		ArrayList<String> names = new ArrayList<String>();
//		ArrayList<String> values = new ArrayList<String>();
//		names.add("from"); values.add("hp_promolocator");
//		names.add("whatprefs"); values.add("");
//		names.add("what"); values.add("Weather36HourPetsCommand");
//		names.add("lswe"); values.add("");
//		names.add("lswa"); values.add("");		
//		names.add("where"); values.add("90292");
//		String outputPage = invoker.invoke(names, values);
//		System.out.println(outputPage);
		
		
		//--------------------------------------------------------------------
		//				Test for a POST form
		//--------------------------------------------------------------------
		/*
		 SearchResult 10: http://www.compusa.com/
[
>>>>>> form ( search_terms_form)
url: products/search.asp
method: POST
fields: 
[(*) not found/HIDDEN/oldterms/
, (*) not found/HIDDEN/olddept/
, (*)  Search:&nbsp;/TEXT/searchterms/null
, (*) &nbsp;&nbsp;/SUBMIT/null/GO!
]
		 */
		
		FormInvoker invoker2 = new FormInvoker("http://www.compusa.com/products/search.asp", 
												HttpMethod.METHOD_POST);
		ArrayList<String> names2 = new ArrayList<String>();
		ArrayList<String> values2 = new ArrayList<String>();		
		names2.add("oldterms"); values2.add("");
		names2.add("olddept"); values2.add("");
		names2.add("searchterms"); values2.add("Laptop");	
		
		String outputPage2 = invoker2.invoke(names2, values2);
		System.out.println(outputPage2);
		

	}
	
	
}
