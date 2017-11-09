package wrappers;

import invocation.Wrapper;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

import relational.Table;

public class USGeocoder implements Wrapper {


	public Table invoke(String[] endpoint, List<String> inputTuple) {

		Table output = null;
		String url = "";

		try {

			if (endpoint[1].equalsIgnoreCase("geocode")) {

	    		/*
	    		 * example:
	    		 * http://geocoder.us/service/csv/geocode?address=4676%20Admiralty%20Way%2C+90292
	    		 *
	    		 * returns:
	    		 * 33.980305,-118.440470,4676 Admiralty Way,Marina del Rey,CA,90292
	    		 *
	    		 */

				url = "http://geocoder.us/service/csv/geocode?address="+java.net.URLEncoder.encode(inputTuple.get(0)+", "+inputTuple.get(1),"UTF-8");

				output = new Table(new String[] {"address","zip","city","state","latitude","longitude"});

				//	invoke source
				BufferedReader in = new BufferedReader(new InputStreamReader((new URL(url)).openStream()));
				String data = in.readLine();
				if (data != null) {
					String[] values = data.split(",");
					if (values.length >= 6) {
						ArrayList<String> tuple = new ArrayList<String>();
						tuple.add(inputTuple.get(0)); //tuple.add(values[2].trim());
						tuple.add(inputTuple.get(1)); //tuple.add(values[5].trim());
						tuple.add(values[3].trim());
						tuple.add(values[4].trim());
						tuple.add(values[0].trim());
						tuple.add(values[1].trim());
						output.insertDistinct(tuple);
					}
				}


	    	}
			else if (endpoint[1].equalsIgnoreCase("address")) {

	    		/*
	    		 * example:
	    		 * http://geocoder.us/service/csv/geocode?address=4676%20Admiralty%20Way%2C+90292
	    		 *
	    		 * returns:
	    		 * 33.980305,-118.440470,4676 Admiralty Way,Marina del Rey,CA,90292
	    		 *
			 * source USGeocoder($CT-Address,CT-Street,PR-City,PR-State-Abbr,
			 *                   PR-Latitude,PR-Longitude) :- 
			 *          Address(CT-Address,CT-Street,PR-City,PR-State-Abbr,PR-State,PR-ZIP,
			 *                  PR-Country-Abbr,PR-Country,PR-Latitude,PR-Longitude).
			 *   {wrappers.USGeocoder; address}
	    		 */

				url = "http://geocoder.us/service/csv/geocode?address="+java.net.URLEncoder.encode(inputTuple.get(0),"UTF-8");

				output = new Table(new String[] {"address","street","city","state","zip","latitude","longitude"});

				//	invoke source
				BufferedReader in = new BufferedReader(new InputStreamReader((new URL(url)).openStream()));
				String data = in.readLine();
				System.out.println("url = "+url);
				System.out.println("data= "+data);
				if (data != null) {
					String[] values = data.split(",");
					if (values.length >= 6) {
						ArrayList<String> tuple = new ArrayList<String>();
						tuple.add(inputTuple.get(0));
						tuple.add(values[2].trim());
						tuple.add(values[3].trim());
						tuple.add(values[4].trim());
						tuple.add(values[5].trim());
						tuple.add(values[0].trim());
						tuple.add(values[1].trim());
						System.out.println("tuple= "+tuple);
						output.insertDistinct(tuple);
					}
				}


	    	}
			else if (endpoint[1].equalsIgnoreCase("latlon")) {
	    		/*
	    		 * example:
	    		 * http://geocoder.us/service/csv/geocode?address=4676%20Admiralty%20Way%2C+90292
	    		 *
	    		 * returns:
	    		 * 33.980305,-118.440470,4676 Admiralty Way,Marina del Rey,CA,90292
	    		 *
			 * source USGeocoder($CT-Address,PR-Latitude,PR-Longitude) :- 
			 *          Address(CT-Address,CT-Street,PR-City,PR-State-Abbr,PR-State,PR-ZIP,
			 *                  PR-Country-Abbr,PR-Country,PR-Latitude,PR-Longitude).
			 *   {wrappers.USGeocoder; latlon}
	    		 */

				url = "http://geocoder.us/service/csv/geocode?address="+java.net.URLEncoder.encode(inputTuple.get(0),"UTF-8");

				output = new Table(new String[] {"address","latitude","longitude"});

				//	invoke source
				BufferedReader in = new BufferedReader(new InputStreamReader((new URL(url)).openStream()));
				String data = in.readLine();
				System.out.println("url = "+url);
				System.out.println("data= "+data);
				if (data != null) {
					String[] values = data.split(",");
					if (values.length >= 3) {
						ArrayList<String> tuple = new ArrayList<String>();
						tuple.add(inputTuple.get(0));
						tuple.add(values[0].trim());
						tuple.add(values[1].trim());
						output.insertDistinct(tuple);
					}
				}


	    	}
			else if (endpoint[1].equalsIgnoreCase("centroid")) {

	    		/*
	    		 * example:
	    		 * http://geocoder.us/service/csv/geocode?zip=90292
	    		 *
	    		 * returns:
	    		 * 33.976373, -118.45458, Marina Del Rey, CA, 90292
	    		 *
	    		 */

				url = "http://geocoder.us/service/csv/geocode?zip="+java.net.URLEncoder.encode(inputTuple.get(0),"UTF-8");

				output = new Table(new String[] {"zip","latitude","longitude","city","state"});

				//	invoke source
				BufferedReader in = new BufferedReader(new InputStreamReader((new URL(url)).openStream()));
				String data = in.readLine();
				if (data != null) {
					String[] values = data.split(",");
					if (values.length >= 5) {

						ArrayList<String> tuple = new ArrayList<String>();
						tuple.add(values[4].trim());
						tuple.add(values[0].trim());
						tuple.add(values[1].trim());
						tuple.add(values[2].trim());
						tuple.add(values[3].trim());
						output.insertDistinct(tuple);

					}
				}


	    	}
			else {
				System.err.println("Error: No method called " + endpoint[1] + " in wrapper: " + this.getClass().getName());
				System.err.println("Please update source definition and restart system .... exiting");
	    		System.exit(9);
	    	}


		}
		catch (Exception e) {
			return null;
    	}

    	return output;

	}


	public void testWrapper() {
		USGeocoder r = new USGeocoder();
		String[] endpoint;
		ArrayList<String> input;

		endpoint = new String[2];
		endpoint[1] = "geocode";
		input = new ArrayList<String>();
		input.add("1440 E MARKET ST");
		input.add("22801-5110");
		r.invoke(endpoint,input).print();

		endpoint = new String[2];
		endpoint[1] = "geocode";
		input = new ArrayList<String>();
		input.add("8700 RESEARCH DR");
		input.add("28262-8570");
		r.invoke(endpoint,input).print();

		endpoint = new String[2];
		endpoint[1] = "geocode";
		input = new ArrayList<String>();
		input.add("1440 East Market Street");
		input.add("22801");
		r.invoke(endpoint,input).print();

		endpoint = new String[2];
		endpoint[1] = "geocode";
		input = new ArrayList<String>();
		input.add("1 Lincoln Blvd");  // this address doesn't exist!
		input.add("90292");
		r.invoke(endpoint,input).print();

		endpoint = new String[2];
		endpoint[1] = "geocode";
		input = new ArrayList<String>();
		input.add("12012 Washington Place");
		input.add("90066");
		r.invoke(endpoint,input).print();

		endpoint = new String[2];
		endpoint[1] = "centroid";
		input = new ArrayList<String>();
		input.add("90266");
		r.invoke(endpoint,input).print();

		endpoint = new String[2];
		endpoint[1] = "centroid";
		input = new ArrayList<String>();
		input.add("90066");
		r.invoke(endpoint,input).print();

		endpoint = new String[2];
		endpoint[1] = "centroid";
		input = new ArrayList<String>();
		input.add("90292");
		r.invoke(endpoint,input).print();


	}

}