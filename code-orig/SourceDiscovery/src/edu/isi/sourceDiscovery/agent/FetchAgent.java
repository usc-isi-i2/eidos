package edu.isi.sourceDiscovery.agent;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/** Class to read data from a Fetch Agent
*
*   Copyright 2006, University of Southern California
*   All rights reserved.
*
* $Id: 
*
* @author  dipsy
* @version 
*
*/

public class FetchAgent {
		
	private String url;
	private final static int BUFSZ = 16384;
	private String outputXML;
	
	public FetchAgent(String serverName, String serverPort,	String agentName) {
		StringBuffer urlBuffer = new StringBuffer("http://");
		urlBuffer.append(serverName).append(":").append(serverPort).append("/agent/runner");
		urlBuffer.append("?plan=").append(agentName).append("%2Fplans%2Fproduction");
		url = urlBuffer.toString();
	}
	
	public void executeAgent(String[] inputParameterNames, String[] inputParameterValues) throws IOException {
		StringBuffer urlBuffer = new StringBuffer(url);
		if(inputParameterNames != null) {
			for(int i=0; i<inputParameterNames.length; i++) {
				urlBuffer.append("&").append(inputParameterNames[i]).append("=").append(inputParameterValues[i]);
			}
		}
		URL agentURL = new URL(urlBuffer.toString().replace(' ', '+'));
		outputXML = downloadPage(agentURL);
	}
	
	public String getXMLOutput() {
		return outputXML;
	}
	
	public Object extractElement(List<String> columnNames) {
		FetchOutputParser parser = new FetchOutputParser(outputXML, columnNames);
		parser.parseOutput();
		
		Object result = parser.getExtractedElement();
		return result;
	}
	
	public List<Object> extractElementList(List<String> columnNames) {
		FetchOutputParser parser = new FetchOutputParser(outputXML, columnNames);
		parser.parseOutput();
		
		ArrayList<Object> result =  parser.getExtractedElementList();
		return result;
	}
	
	public List<? extends List<? extends Object>> extractTuple(String xml, 
										List<String> agentColumnNames,
										List<String> outputColumnNames,
										List columnGroupings) {
		FetchOutputParser parser = new FetchOutputParser(outputXML, agentColumnNames);
		parser.parseOutput();
		
		Tuple tuple = parser.getExtractedTuple();
		HashMap<String, List<List<String>>> groupings = new HashMap<String, List<List<String>>>();
		for(int i=0; i<columnGroupings.size(); i++) {
			List grouping = (List)columnGroupings.get(0);
			String key = (String)grouping.get(0);
			List<List<String>> value = (List<List<String>>)grouping.get(1);
			groupings.put(key, value);
		}
		if(groupings.size() > 0)
			return tuple.asList(outputColumnNames, groupings);
		return tuple.asList();
	}
	
	public List extractTuples(List<String> agentColumnNames,
										List<String> outputColumnNames,
										List columnGroupings) {
		FetchOutputParser parser = new FetchOutputParser(outputXML, agentColumnNames);
		parser.parseOutput();
		
		ArrayList<Tuple> tuples = parser.getExtractedTuples();
		
		HashMap<String, List<List<String>>> groupings = new HashMap<String, List<List<String>>>();
		boolean groupingPresent = false;
		for(int i=0; i<columnGroupings.size(); i++) {
			groupingPresent = true;
			List grouping = (List)columnGroupings.get(i);
			String key = (String)grouping.get(0);
			List<List<String>> value = grouping.subList(1, grouping.size());
			groupings.put(key, value);
		}
		
		List tuplesArr = 
					new ArrayList<ArrayList<ArrayList<? extends Object>>>();
		
		for(Tuple tuple : tuples) {
			if(groupingPresent) {
				tuplesArr.add(tuple.asList(outputColumnNames, groupings));
			} else {
				tuplesArr.add(tuple.asList());
			}
		}
		
		return tuplesArr;
		
	}
	
	private synchronized String downloadPage(URL agentURL) throws IOException {
		HttpURLConnection connection = null;
		System.out.println("Executing agent: " + agentURL);
		try {
			connection = (HttpURLConnection)agentURL.openConnection();
		
			connection.setRequestMethod("GET");
	
			char[] buf = new char[BUFSZ];
			StringBuffer page = new StringBuffer(BUFSZ);
			BufferedReader input = new BufferedReader(
										new InputStreamReader(connection.getInputStream()));
			
			int iRead = 1;
			while (input != null) {
				iRead = input.read(buf, 0, BUFSZ - 1);
				if (iRead < 0)
					break;
				buf[iRead] = '\0';
				page.append(buf, 0, iRead);
			}
			
			input.close();
			return page.toString();
		} finally {
			if(connection != null)
				connection.disconnect();
		}
		
	}
}
