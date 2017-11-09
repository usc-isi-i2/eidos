package wrappers;

import invocation.Wrapper;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

import relational.Table;

public class YahooFinance implements Wrapper {

	public Table invoke(String[] endpoint, List<String> inputTuple) {

		String url = "";
		Table output = null;

		if (endpoint[1].equalsIgnoreCase("GetQuote")) { // input: $ticker

			// ex. call:	http://finance.yahoo.com/d/quotes.csv?s=BHP&f=sl1d1t1c1ohgv&e=.csv
			// meta-data:	ticker,last_trade,date,time,change,open,high,low,volume
			// ex. data:	"BHP",38.78,"1/25/2006","4:01pm",+1.43,38.05,38.87,38.05,3074000

			output = new Table(new String[] {"ticker","last_trade","date","time","change","open","high","low","volume"});

			try {

				url = "http://finance.yahoo.com/d/quotes.csv?s="+java.net.URLEncoder.encode(inputTuple.get(0),"UTF-8")+"&f=sl1d1t1c1ohgv&e=.csv";

		    	// invoke source and parse xml output
				BufferedReader in = new BufferedReader(new InputStreamReader((new URL(url)).openStream()));
				String data;
				while ((data=in.readLine()) != null) {
					String[] values = data.split(",");
					if (output.arity()!=values.length) {
						System.err.println("Error in wrapper: "+ this.getClass().getName());
						System.exit(9);
					}
					// check the ticker symbol is valid
					if (Float.parseFloat(values[1]) != 0.00) {
						ArrayList<String> tuple = new ArrayList<String>();
						for (String val: values) { tuple.add(val.replaceAll("\"","")); }
						output.insertDistinct(tuple);
					}
				}

		    }
			catch (Exception e) {
				return null;
	    	}

			return output;

		}
		else if (endpoint[1].equalsIgnoreCase("GetExchangeRate")) { // input: $currency,$currency

			// ex. call:	http://finance.yahoo.com/d/quotes.csv?s=USDJPY=X&f=sl1d1t1ba&e=.csv
			// meta-data:	?, rate, date, time, bid, ask
			// ex. data:	"USDJPY=X",113.825,"4/28/2006","5:26pm",113.80,113.85

			output = new Table(new String[] {"currency1","currency2","rate","date","time","bid","ask"});

			try {

				url = "http://finance.yahoo.com/d/quotes.csv?s="+java.net.URLEncoder.encode(inputTuple.get(0)+inputTuple.get(1),"UTF-8")+"=X&f=sl1d1t1ba&e=.csv";

		    	// invoke source and parse xml output
				BufferedReader in = new BufferedReader(new InputStreamReader((new URL(url)).openStream()));
				String data;
				while ((data=in.readLine()) != null) {
					String[] values = data.split(",");
					if (values.length!=6) {
						System.err.println("Error in wrapper: "+ this.getClass().getName());
						System.exit(9);
					}
					ArrayList<String> tuple = new ArrayList<String>();
					tuple.add(inputTuple.get(0));
					tuple.add(inputTuple.get(1));
					for (int i=1; i<values.length; i++) {
						tuple.add(values[i].replaceAll("\"",""));
					}
					output.insertDistinct(tuple);
				}


			}
			catch (Exception e) {
				return null;
	    	}

			return output;

		}
		else {
    		System.err.println("Error: No method called " + endpoint[1] + " in wrapper: " + this.getClass().getName());
			System.err.println("Please update source definition and restart system .... exiting");
    		System.exit(9);
		}
    	return output;

	}


	public void testWrapper() {
		YahooFinance r = new YahooFinance();
		String[] endpoint;
		ArrayList<String> input;

		// test 0:
		endpoint = new String[2];
		endpoint[1] = "GetQuote";
		input = new ArrayList<String>();
		input.add("ibm");
		r.invoke(endpoint,input).print();

		// test 1:
		endpoint = new String[2];
		endpoint[1] = "GetQuote";
		input = new ArrayList<String>();
		input.add("msft");
		r.invoke(endpoint,input).print();

		// test 2:
		endpoint = new String[2];
		endpoint[1] = "GetQuote";
		input = new ArrayList<String>();
		input.add("yhoo");
		r.invoke(endpoint,input).print();

		// test 3:
		endpoint = new String[2];
		endpoint[1] = "GetExchangeRate";
		input = new ArrayList<String>();
		input.add("USD");
		input.add("EUR");
		r.invoke(endpoint,input).print();

		// test 4:
		endpoint = new String[2];
		endpoint[1] = "GetExchangeRate";
		input = new ArrayList<String>();
		input.add("EUR");
		input.add("USD");
		r.invoke(endpoint,input).print();

		// test 5:
		endpoint = new String[2];
		endpoint[1] = "GetExchangeRate";
		input = new ArrayList<String>();
		input.add("AUD");
		input.add("JPY");
		r.invoke(endpoint,input).print();

	}

}
