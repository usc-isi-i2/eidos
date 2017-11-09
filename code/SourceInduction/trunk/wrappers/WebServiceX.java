package wrappers;

import invocation.Wrapper;

import java.util.ArrayList;
import java.util.List;

import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathFactory;

import org.xml.sax.InputSource;

import relational.Table;

public class WebServiceX implements Wrapper {

	XPath xpath;

	public WebServiceX() {
		xpath = XPathFactory.newInstance().newXPath();
	}


	public Table invoke(String[] endpoint, List<String> inputTuple) {

		if (endpoint[1].equalsIgnoreCase("GetQuote")) {
			// the metadata
	    	ArrayList<String> columns = new ArrayList<String>();
	    	columns.add("Symbol");
	    	columns.add("Last");
	    	columns.add("Date");
	    	columns.add("Time");
	    	columns.add("Change");
	    	columns.add("Open");
	    	columns.add("High");
	    	columns.add("Low");
	    	columns.add("Volume");
	    	columns.add("MktCap");
	    	columns.add("PreviousClose");
	    	columns.add("PercentageChange");
	    	columns.add("AnnRange");
	    	columns.add("Earns");
	    	columns.add("P-E");
	    	columns.add("Name");

	    	/*
	    	<StockQuotes>
	    		<Stock>
	    			<Symbol>MSFT</Symbol>
	    			<Last>26.42</Last>
	    			<Date>1/26/2006</Date>
	    			<Time>2:05pm</Time>
	    			<Change>+0.02</Change>
	    			<Open>26.57</Open>
	    			<High>26.72</High>
	    			<Low>26.31</Low>
	    			<Volume>42415520</Volume>
	    			<MktCap>281.2B</MktCap>
	    			<PreviousClose>26.40</PreviousClose>
	    			<PercentageChange>+0.08%</PercentageChange>
	    			<AnnRange>23.82 - 28.25</AnnRange>
	    			<Earns>1.184</Earns>
	    			<P-E>22.30</P-E>
	    			<Name>MICROSOFT CP</Name>
				</Stock>
			</StockQuotes>
	    	*/

	    	Table output = new Table(columns);

	    	try {

				// invoke source and parse xml output
	    		String url = "http://www.webservicex.net/stockquote.asmx/GetQuote?symbol="+java.net.URLEncoder.encode(inputTuple.get(0),"UTF-8");
				String quote = (String) xpath.evaluate("//*[local-name()='string'][1]/text()",new InputSource(url),XPathConstants.STRING);

				String startTag = "<Stock>";
		    	String endTag   = "</Stock>";
		    	quote = quote.substring(quote.indexOf(startTag) + startTag.length(), quote.indexOf(endTag));

		    	startTag = "<Last>";
		    	endTag   = "</Last>";

		    	// make sure input was valid stock ticker:
		    	if (Float.parseFloat(quote.substring(quote.indexOf(startTag) + startTag.length(), quote.indexOf(endTag)))!=0.00) {
		    		ArrayList<String> tuple = new ArrayList<String>();
			    	for (String tag: columns) {
				    	startTag = "<"+tag+">";
				    	endTag   = "</"+tag+">";
			    		tuple.add(quote.substring(quote.indexOf(startTag) + startTag.length(), quote.indexOf(endTag)).trim().replaceAll("\"",""));
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

    	return null;

	}



	public void testWrapper() {
		WebServiceX r = new WebServiceX();
		String[] endpoint;
		ArrayList<String> input;

		// test 2:
		endpoint = new String[2];
		endpoint[1] = "GetQuote";
		input = new ArrayList<String>();
		input.add("BHP");
		r.invoke(endpoint,input).print();

		// test 2:
		endpoint = new String[2];
		endpoint[1] = "GetQuote";
		input = new ArrayList<String>();
		input.add("YHOO");
		r.invoke(endpoint,input).print();

	}

}
