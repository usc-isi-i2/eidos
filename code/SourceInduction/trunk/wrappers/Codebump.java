package wrappers;

import invocation.Wrapper;

import java.util.ArrayList;
import java.util.List;

import relational.Table;


public class Codebump implements Wrapper {


	public Table invoke(String[] endpoint, List<String> inputTuple) {

		Table output = null;

		if (endpoint[1].equals("GetZipCodesWithin")) {
    		output = getZipCodesWithin(inputTuple);
    	}
    	else if (endpoint[1].equals("GetDistanceBetweenZipCodes")) {
    		output = getDistanceBetweenZipCodes(inputTuple);
    	}
    	else {
    		System.err.println("Error: No method called " + endpoint[1] + " in wrapper: " + this.getClass().getName());
			System.err.println("Please update source definition and restart system .... exiting");
    		System.exit(9);
		}

    	return output;

    }

	public static Table getDistanceBetweenZipCodes(List<String> inputTuple) {

		Table output = new Table(new String[] {"zip1","zip2","distance"});

	    try {

	       String urlString = "http://www.codebump.com/services/ZipCodeLookup.asmx/GetDistanceBetweenZipCodes?AuthenticationHeader=jHmoTUBgoLILuuhrR02%2BVVE/rPWJLZ/mIt54pih0DWAQcm%2BuNFzomO80NXKI3ta3zy%2BseCZpLrjrRfbgGyDfNU3Ko3LqQYf6&zip1="+inputTuple.get(0).trim()+"&zip2="+inputTuple.get(1).trim();

	       java.io.BufferedReader br = new java.io.BufferedReader(new java.io.InputStreamReader((new java.net.URL(urlString)).openStream()));
	       String line,last = null;
	       while ((line = br.readLine()) != null) {
	           last = line;
	       }
	       if (last != null) {
	    	   ArrayList<String> outputTuple = new ArrayList<String>();
	    	   outputTuple.addAll(inputTuple);
	    	   outputTuple.add(last.substring(last.indexOf(">")+1, last.lastIndexOf("<")));
	    	   output.insertDistinct(outputTuple);
	       }

	    } catch (Exception e) { return null; }

	    return output;

	}

	public static Table getZipCodesWithin(List<String> inputTuple) {

	    Table output = new Table(new String[] {"zip1","distance1","zip2","distance2"});

	    try {

	       String urlString = "http://www.codebump.com/services/ZipCodeLookup.asmx/GetZipCodesWithin?AuthenticationHeader=jHmoTUBgoLILuuhrR02%2BVVE/rPWJLZ/mIt54pih0DWAQcm%2BuNFzomO80NXKI3ta3zy%2BseCZpLrjrRfbgGyDfNU3Ko3LqQYf6&zip="+inputTuple.get(0).trim()+"&distance="+inputTuple.get(1).trim();

	       java.io.BufferedReader br = new java.io.BufferedReader(new java.io.InputStreamReader((new java.net.URL(urlString)).openStream()));
	       // first lines don't contain data:
	       br.readLine(); br.readLine(); br.readLine();

	       // super hack!!!!
	       String line1,line2;
	       while ((line1 = br.readLine()) != null && (line2 = br.readLine()) != null) {
	           ArrayList<String> outputTuple = new ArrayList<String>();
	    	   outputTuple.addAll(inputTuple);
	           outputTuple.add(line1.substring(line1.indexOf(">")+1, line1.lastIndexOf("<")));
	    	   outputTuple.add(line2.substring(line2.indexOf(">")+1, line2.lastIndexOf("<")));
	           output.insertDistinct(outputTuple);
	           br.readLine();
	           br.readLine();
	       }

	    } catch (Exception e) {
	    	return null;
	    }

	    return output;

	}

	public void testWrapper() {
		Codebump r = new Codebump();
		String[] endpoint;
		ArrayList<String> input;

		// test 0:
		endpoint = new String[2];
		endpoint[1] = "GetZipCodesWithin";
		input = new ArrayList<String>();
		input.add("90293");
		input.add("10.5");
		r.invoke(endpoint,input).print();

		// test 1:
		endpoint = new String[2];
		endpoint[1] = "GetDistanceBetweenZipCodes";
		input = new ArrayList<String>();
		input.add("90293");
		input.add("90266");
		r.invoke(endpoint,input).print();

	}

}
