package edu.isi.sourceDiscovery.agent;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class DeliciousWrapper {
	private static FetchAgent agent = new FetchAgent("caloserve2.esd.sri.com", "8080", "delicious");
	
	public static List<Object> getSearchResults(String searchString) throws IOException {
		
		String[] inputNames = {"p"};
		String[] inputValues = {searchString};
		
		agent.executeAgent(inputNames, inputValues);
		ArrayList<String> outputNames = new ArrayList<String>();
		outputNames.add("match");
		return agent.extractElementList(outputNames);
	}
}
