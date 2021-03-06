package wrappers;

import invocation.Wrapper;
import relational.Table;

import java.util.ArrayList;

import javax.xml.xpath.*;
import org.w3c.dom.*;
import org.xml.sax.InputSource;

public class InvestBot implements Wrapper {
	
	XPath xpath;
	
	public InvestBot() {
		xpath = XPathFactory.newInstance().newXPath();
	}
	
	
	public Table invoke(String[] endpoint, ArrayList<String> inputTuple) {
    	
		Table output = null;
		String url = null;
		
		if (endpoint[1].equalsIgnoreCase("getQuote")) {
			
			/*
			 * http://ws.invesbot.com/stockquotes.asmx/GetQuote?symbol=msft
			 * 
<?xml version="1.0" encoding="utf-8"?>
<StockQuote>
  <Symbol>MSFT</Symbol>
  <Company>MICROSOFT CP</Company>
  <Price>&lt;big&gt;&lt;b&gt;22.62&lt;/b&gt;&lt;/big&gt;</Price>
  <Time>2:35PM ET</Time>
  <Change>&lt;img width="10" height="14" border="0" src="http://us.i1.yimg.com/us.yimg.com/i/us/fi/03rd/up_g.gif" alt="Up"&gt; &lt;b style="color:#008800;"&gt;0.14&lt;/b&gt; &lt;b style="color:#008800;"&gt; (0.62%)&lt;/b&gt;</Change>
  <PrevClose>22.48</PrevClose>
  <Open>22.60</Open>
  <Bid>22.61&lt;small&gt; x 52900&lt;/small&gt;</Bid>
  <Ask>22.62&lt;small&gt; x 23800&lt;/small&gt;</Ask>
  <YearTarget>29.00</YearTarget>
  <DayRange>22.48 - 22.76</DayRange>
  <YearRange>21.46 - 28.38</YearRange>
  <Volume>40,968,973</Volume>
  <AvgVol>92,523,500</AvgVol>
  <MarketCap>230.75B</MarketCap>
  <PE>17.92</PE>
  <EPS>1.26</EPS>
  <DivYield>0.36 (1.60%)</DivYield>
  <WebSite>&lt;a href="http://www.microsoft.com"&gt;http://www.microsoft.com&lt;/a&gt;</WebSite>
  <Business>Microsoft Corporation engages in the development, manufacture, license, and support of software products for various computing devices worldwide. Its Client segment offers operating systems for servers, personal computers (PCs), and intelligent devices. The company�s Server and Tools segment provides server applications and developer tools, as well as training and certification services. Its products provide messaging and collaboration, database management, e-commerce, and mobile information access capabilities. It also offers consulting services. Microsoft�s Information Worker segment offers business and personal productivity software applications, including collaboration tools and document management and messaging applications for personal computers. Its Microsoft Business Solutions segment offers software solutions to manage financial, customer relationship, and supply chain management functions. Its products consist of business solutions, customer relationship management software, retail solutions, and related services. The company�s MSN segment provides online communication and information services, including email and instant messaging, and online search and premium content. It also provides Internet access, and Web and mobile services. Its Mobile and Embedded Devices segment offers mobile software platform; embedded device software platforms used in consumer electronics devices and enterprise devices; a hosted programmable XML Web service; and software platform to create telematics solutions for vehicles. Microsoft�s Home and Entertainment segment offers the Xbox video game system; PC software games, online games, and console games; television platform products for the interactive television industry; and consumer software and hardware products, such as learning products and services, application software for Macintosh computers, and PC peripherals. Microsoft was founded in 1975 by William H. Gates III. The company is headquartered in Redmond, Washington.</Business>
  <sic>7372</sic>
  <sicname>Services-Prepackaged Software</sicname>
</StockQuote>
			 * 
			 */
			
			try {
				
				url = "http://ws.invesbot.com/stockquotes.asmx/GetQuote";
				url += "?symbol=" + java.net.URLEncoder.encode(inputTuple.get(0).trim(),"UTF-8"); // symbol
				
				//System.err.println("url = "+url);
				
				// the metadata 
		    	String[] columns = new String[] {"Symbol","Company","Price","Time","Change","PrevClose","Open","Bid","Ask","YearTarget","DayRange","YearRange","Volume","AvgVol","MarketCap","PE","EPS","DivYield","WebSite"};
		    	output = new Table(columns);
				
		    	// invoke source and parse xml output
				Node stockquote = (Node) xpath.evaluate("//*[local-name()='StockQuote'][1]",new InputSource(url),XPathConstants.NODE);
				
		    	ArrayList<String> tuple = new ArrayList<String>();
			    tuple.addAll(inputTuple);
			    	
			    for (int i=1; i<columns.length; i++) {
			    	String tag = columns[i];
			    	String content = (String) xpath.evaluate("./*[local-name()='"+tag+"'][1]/text()",stockquote,XPathConstants.STRING);
				   	tuple.add(removeTags(content));
			    }
			    output.insertDistinct(tuple);
		    	
		    }
			catch (Exception e) {
				return null;
			}
	    	
		}
		else {
			System.err.println("Error: No method called " + endpoint[1] + " in wrapper: " + this.getClass().getName());
			System.err.println("Please update source definition and restart system .... exiting");
    		System.exit(9);
		}
		
		return output;
		
	}

	public static String removeTags(String input) {
		String output;
		int index;
		while ((index = input.indexOf("<"))!=-1) {
			output = input.substring(0,index);
			if ((index = input.indexOf(">",index))!=-1) {
				output += input.substring(index+1);
			}
			input = output;
		}
		return input;
	}

	
	public void testWrapper() {
		InvestBot r = new InvestBot();
		String[] endpoint;
		ArrayList<String> input;
		
		System.out.println("InvestBot.getQuote");
		
		endpoint = new String[2];
		endpoint[1] = "getQuote";
		input = new ArrayList<String>();
		input.add("IBM");
		r.invoke(endpoint,input).print();
		
		//--------------------------------
	
		System.out.println("InvestBot.getQuote");
		
		endpoint = new String[2];
		endpoint[1] = "getQuote";
		input = new ArrayList<String>();
		input.add("YHOO");
		r.invoke(endpoint,input).print();
		
		//--------------------------------
	
	}
	
}
