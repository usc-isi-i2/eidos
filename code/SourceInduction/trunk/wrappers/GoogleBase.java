package wrappers;

import invocation.Wrapper;

import java.util.ArrayList;
import java.util.List;

import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathFactory;

import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;

import relational.Table;

public class GoogleBase implements Wrapper {

	XPath xpath;

	public GoogleBase() {
		xpath = XPathFactory.newInstance().newXPath();
	}


	public Table invoke(String[] endpoint, List<String> inputTuple) {


		Table output = null;
		String url;

		if (endpoint[1].equalsIgnoreCase("getCars")) {

			/*
			 * http://base.google.com/base/search?a_n506=vehicles&a_y506=9&a_o506=&gl=US&hl=en&nd=1&showrefine=1&q=&btnG=Search+Vehicles&a_n296=make&a_y296=1&a_o296=0&a_v296=&a_n335=model&a_y335=1&a_o335=0&a_v335=&a_v335=&sl=true&a_n152=location&a_y152=6&a_o152=0&a_t152=30&a_n208=condition&a_y208=1&a_o208=0&a_v208=used&a_v208=&a_n303=price&a_u303=usd&a_y303=8&a_o303=4&a_v303=&a_f303=&a_t303=&a_n920=color&a_y920=1&a_o920=0&a_v920=&a_v920=&scoring=r&us=0&output=rss&a_v296=bmw&a_v152=90066
			 *
			 * <rss version="2.0">
			 	<channel>
			 	<title>Google Base - Vehicles - Make: bmw, Location: within 30 miles of 90066, Condition: used</title>
			 	<item>
			 	 <title>1998 BMW 740 Los Angeles California - SellMyCar.com</title>
			 	 <link>http://www.sellmycar.com/74198.htm</link>
			 	 <guid isPermaLink="false">9872795738677653201></guid>
			 	 <pubDate>Fri, 09 Jun 2006 00:27:26 GMT</pubDate>
			 	 <description>
	&lt;br&gt;
	&lt;table cellpadding=5 cellspacing=0&gt;
	&lt;tr&gt;&lt;td style=&quot;padding-bottom:1px&quot; style=&quot;width:43em&quot; &gt;

	&lt;style&gt;
	a.title:link {color:#00c; text-decoration: underline;}
	a.title:visited {color:#551a8b; text-decoration: underline;}
	a.title:active {color:#f00; text-decoration: underline;}
	&lt;/style&gt;
	&lt;font size=&quot;+0&quot;&gt;&lt;a class=&quot;title&quot; href=&quot;http://www.sellmycar.com/74198.htm&quot;&gt;1998 BMW 740 Los Angeles California&lt;/a&gt;&lt;/font&gt;
	&lt;br&gt;

	&lt;a href=&quot;http://www.sellmycar.com/74198.htm&quot;&gt;
	&lt;img style=&quot;margin-right:10px; margin-top: 3px; border:1px solid #7777cc;&quot; src=&quot;http://base.google.com/base_image?q=http://www.sellmycar.com/pictures/127754.jpg&amp;dhm=86c26280&amp;hl=en&quot; border=&quot;0&quot; align=&quot;left&quot; /&gt;&lt;/a&gt;

	&lt;font color=&quot;#7777cc&quot; size=&quot;-1&quot;&gt;
	Make:
	bmw
	&amp;nbsp;&amp;nbsp;
	Model:
	740
	&amp;nbsp;&amp;nbsp;
	Condition:
	used
	&amp;nbsp;&amp;nbsp;
	Price:
	$19,000.00
	&amp;nbsp;&amp;nbsp;
	Color:
	biaritz blue
	&amp;nbsp;&amp;nbsp;
	Year:
	1998

	&amp;nbsp;&amp;nbsp;
	BMW &amp;nbsp;&amp;nbsp;
	&lt;/font&gt;
	&lt;br/&gt;
	&lt;font size=&quot;-1&quot;&gt;1998 BMW 740 for sale in Los Angeles California at SellMyCar.com --- excellen t condition,all maint. records. runs like a champ!&lt;/font&gt;&lt;br/&gt;
	&lt;font color=&quot;#008000&quot; size=-1&gt;http://www.sellmycar.com
	- posted on Jun 8
	by&amp;nbsp;SellMyCar.com

	&lt;/font&gt;
	&lt;/td&gt;&lt;/tr&gt;
	&lt;/table&gt;
				</description>
			   </item>
			   ....
			 *
			 */

			url = "http://base.google.com/base/search?a_n506=vehicles&a_y506=9&a_o506=&gl=US&hl=en&nd=1&showrefine=1&q=&btnG=Search+Vehicles&a_n296=make&a_y296=1&a_o296=0&a_v296=&a_n335=model&a_y335=1&a_o335=0&a_v335=&a_v335=&sl=true&a_n152=location&a_y152=6&a_o152=0&a_t152=30&a_n208=condition&a_y208=1&a_o208=0&a_v208=used&a_v208=&a_n303=price&a_u303=usd&a_y303=8&a_o303=4&a_v303=&a_f303=&a_t303=&a_n920=color&a_y920=1&a_o920=0&a_v920=&a_v920=&scoring=r&us=0&output=rss";

			try {

				url += "&a_v152="+java.net.URLEncoder.encode(inputTuple.get(0),"UTF-8"); // zip
				url += "&a_v296="+java.net.URLEncoder.encode(inputTuple.get(1),"UTF-8"); // make

		    	String[] columns = new String[] {"zip","make","pubDate","model","price","trim","color","year"};
		    	output = new Table(columns);

				// invoke source and parse xml output
				NodeList itemElements = (NodeList) xpath.evaluate("//*[local-name()='item']",new InputSource(url),XPathConstants.NODESET);
				for (int i=0; i<itemElements.getLength(); i++) {
			    	ArrayList<String> tuple = new ArrayList<String>();
			    	tuple.add(inputTuple.get(0));
			    	tuple.add(inputTuple.get(1));
			    	Node itemElement = itemElements.item(i);
			    	tuple.add((String) xpath.evaluate("./*[local-name()='pubDate'][1]/text()",itemElement,XPathConstants.STRING));
				    String description = (String) xpath.evaluate("./*[local-name()='description'][1]/text()",itemElement,XPathConstants.STRING);
				    //System.out.println(description);
				    for (String label: new String[] {"Model:","Price:","Trim:","Color:","Year:"}) {
				    	if (description.indexOf(label)!=-1) {
				    		int start = description.indexOf(label)+label.length();
				    		int end = description.indexOf("&",start);
					    	tuple.add(description.substring(start,end).trim());
					    }
				    	else {
				    		tuple.add("N/A");
				    	}
				    }
				    int yearIndex = output.colNames.indexOf("year");
				    if (tuple.get(yearIndex).equals("N/A")) {
				    	// see if the year is in the title:
				    	String title = (String) xpath.evaluate("./*[local-name()='title'][1]/text()",itemElement,XPathConstants.STRING);
				    	java.util.regex.Matcher matcher = java.util.regex.Pattern.compile("(19|20)\\d{2}").matcher( title );
				    	if ( matcher.find() )  {
				            tuple.set(yearIndex, matcher.group());
				        }
					}

				    output.insertDistinct(tuple);
				}

		    }
			catch (Exception e) {
				return null;
			}

		}
		else if (endpoint[1].equalsIgnoreCase("getHotels")) {

			/*
			 * http://base.google.com/base/search?a_n318=hotels&a_y318=9&a_o318=&nd=1&q=&btnG=Search+Hotels&a_n303=price&a_u303=usd&a_y303=8&a_o303=4&a_v303=&a_f303=&a_t303=&a_n44=product+type&a_y44=1&a_o44=0&a_v44=hotels&a_v44=&sl=true&a_n152=location&a_y152=6&a_o152=0&a_t152=30&scoring=r&us=0&a_n490=rating&a_y490=2&a_s490=0&a_r=1&showrefine=1&hl=en&gl=US&output=rss&a_v152=90066
			 *
<rss version="2.0">
<channel>
<title>Google Base - Hotels - Product type: hotels, Location: within 30 miles of 90066</title>

<item>
<title>SUPER 8 LOS ANGELES ,LOS ANGELES ,CA ,US - www.earthbooker.com - 80.000 hotels for the best price all over the Globe</title>

<pubDate>Sat, 18 Mar 2006 14:57:49 GMT</pubDate>

<description>
&lt;br&gt;
&lt;table cellpadding=5 cellspacing=0&gt;
&lt;tr&gt;&lt;td style=&quot;width:43em&quot; &gt;

&lt;style&gt;
a.title:link {color:#00c; text-decoration: underline;}
a.title:visited {color:#551a8b; text-decoration: underline;}
a.title:active {color:#f00; text-decoration: underline;}
&lt;/style&gt;
&lt;font size=&quot;+0&quot;&gt;&lt;a class=&quot;title&quot; href=&quot;http://www.xsweb.com/php/earthbooker.php?p=hotInfo&amp;h=202483&quot;&gt;SUPER 8 LOS ANGELES ,LOS ANGELES ,CA ,US&lt;/a&gt;&lt;/font&gt;

&lt;br&gt;
&lt;font color=&quot;#7777cc&quot; size=&quot;-1&quot;&gt;
Price:
$67.00
&amp;nbsp;&amp;nbsp;
Product type:
hotels
&amp;nbsp;&amp;nbsp;
Location:
33.99669,-118.43440
&amp;nbsp;&amp;nbsp;
Rating:
5
&amp;nbsp;&amp;nbsp;

&lt;/font&gt;
&lt;br/&gt;
&lt;font size=&quot;-1&quot;&gt;Year Built 1960 Year Remodeled 1999Famous Beaches, Shopping Malls, Restaurants W/WalkingDistance, Theatres, Sony Studios, Getty Museum, HealthClubs, ...&lt;/font&gt;&lt;br/&gt;
&lt;font color=&quot;#008000&quot; size=-1&gt;http://www.xsweb.com
- posted on Mar 18
by&amp;nbsp;www.earthbooker.com - 80.000 hotels for the best price all over the Globe
&lt;/font&gt;

&lt;/td&gt;&lt;/tr&gt;
&lt;/table&gt;
</description>
</item>
			   ....
			 *
			 */

			url = "http://base.google.com/base/search?a_n318=hotels&a_y318=9&a_o318=&nd=1&q=&btnG=Search+Hotels&a_n303=price&a_u303=usd&a_y303=8&a_o303=4&a_v303=&a_f303=&a_t303=&a_n44=product+type&a_y44=1&a_o44=0&a_v44=hotels&a_v44=&sl=true&a_n152=location&a_y152=6&a_o152=0&a_t152=30&scoring=r&us=0&a_n490=rating&a_y490=2&a_s490=0&a_r=1&showrefine=1&hl=en&gl=US&output=rss";

			try {

				url += "&a_v152="+java.net.URLEncoder.encode(inputTuple.get(0),"UTF-8"); // zip

		    	String[] columns = new String[] {"zip","hotel","city","state","pubDate","price","latitude","longitude","rating"};
		    	output = new Table(columns);

				// invoke source and parse xml output
				NodeList itemElements = (NodeList) xpath.evaluate("//*[local-name()='item']",new InputSource(url),XPathConstants.NODESET);
				for (int i=0; i<itemElements.getLength(); i++) {
			    	ArrayList<String> tuple = new ArrayList<String>();
			    	tuple.add(inputTuple.get(0)); // zip
			    	Node itemElement = itemElements.item(i);
			    	String title = (String) xpath.evaluate("./*[local-name()='title'][1]/text()",itemElement,XPathConstants.STRING);
			    	String[] titleComponents = title.split(",");
			    	tuple.add(titleComponents[0]); // hotel
			    	tuple.add(titleComponents[1]); // city
			    	tuple.add(titleComponents[2]); // state
			    	tuple.add((String) xpath.evaluate("./*[local-name()='pubDate'][1]/text()",itemElement,XPathConstants.STRING)); // pubDate

			    	String description = (String) xpath.evaluate("./*[local-name()='description'][1]/text()",itemElement,XPathConstants.STRING);
				    //System.out.println(description);

			    	String label;
				    label = "Price:";
				    if (description.indexOf(label)!=-1) {
				    	int start = description.indexOf(label)+label.length();
				    	int end = description.indexOf("&",start);
					   	tuple.add(description.substring(start,end).trim());
					}
				    else { tuple.add("N/A"); }
				    label = "Location:";
				    if (description.indexOf(label)!=-1) {
				    	int start = description.indexOf(label)+label.length();
				    	int end = description.indexOf("&",start);
					   	String[] location = description.substring(start,end).trim().split(",");
				    	tuple.add(location[0].trim()); // latitude
				    	tuple.add(location[1].trim()); // longitude
					}
				    else { tuple.add("N/A"); }
				    label = "Rating:";
				    if (description.indexOf(label)!=-1) {
				    	int start = description.indexOf(label)+label.length();
				    	int end = description.indexOf("&",start);
					   	tuple.add(description.substring(start,end).trim());
					}
				    else { tuple.add("N/A"); }

				    output.insertDistinct(tuple);
				}

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


	public void testWrapper() {
		GoogleBase r = new GoogleBase();
		String[] endpoint;
		ArrayList<String> input;

		// test 0:
		endpoint = new String[] {"", "getCars"};
		input = new ArrayList<String>();
		input.add("90292");
		input.add("Audi");
		r.invoke(endpoint,input).print();

		// test 1:
		endpoint = new String[] {"", "getCars"};
		input = new ArrayList<String>();
		input.add("90066");
		input.add("Toyota");
		r.invoke(endpoint,input).print();

		endpoint = new String[] {"", "getHotels"};
		input = new ArrayList<String>();
		input.add("37076");
		r.invoke(endpoint,input).print();

		endpoint = new String[] {"", "getHotels"};
		input = new ArrayList<String>();
		input.add("90066");
		r.invoke(endpoint,input).print();

		endpoint = new String[] {"", "getHotels"};
		input = new ArrayList<String>();
		input.add("90266");
		r.invoke(endpoint,input).print();


	}

}