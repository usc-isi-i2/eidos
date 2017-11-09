package wrappers.imap;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;

import java.util.ArrayList;

import relational.DBConnection;

public class Cricbase {

	public static void run(DBConnection db) {
	
		File dataDir = new File("d:/raw_data/cricket/cricbase/");
		File[] listing = dataDir.listFiles();
		for (File file: listing) {
			
			System.out.println(file.getName());
			String doc = loadFile(file);
			
			try {
				
			
			/*
			 * 
<table border=0 cellspacing=1 cellpadding=1 width=250>
<tr>
<td colspan=2 bgcolor=#87481b><font face=helvetica size=-1 color="#ffffff"><b>
Susil Fernando
</td>
</tr>
<tr>
<td bgcolor=#fffc9c><font face=helvetica size=-1>Initials</td>
<td bgcolor=#fffc9c align=right><font face=helvetica size=-1>E.R.N.S.</td>
</tr>
<tr>
<td bgcolor=#fffc9c><font face=helvetica size=-1>Date of birth</td>
<td bgcolor=#fffc9c align=right><font face=helvetica size=-1>19-12-1955
</td>
</tr>
<!--
<tr>
<td bgcolor=#fffc9c><font face=helvetica size=-1>Sex</td>
<td bgcolor=#fffc9c align=right><font face=helvetica size=-1>Male</td>
</tr>
-->
<tr>
<td bgcolor=#fffc9c><font face=helvetica size=-1>Player type</td>
<td align=right bgcolor=#fffc9c><font face=helvetica size=-1>Batsman</td>
</tr>
<tr>
<td bgcolor=#fffc9c><font face=helvetica size=-1>Batting style</td>
<td align=right bgcolor=#fffc9c><font face=helvetica size=-1>Right hand bat</td>
</tr>
<tr>
<td bgcolor=#fffc9c><font face=helvetica size=-1>Bowling style</td>
<td align=right bgcolor=#fffc9c><font face=helvetica size=-1>Unknown</td>
</tr>
</table>
</td>
<td valign=top>
<table border=0 cellspacing=1 cellpadding=1 width=250>
<tr>
<td colspan=2 bgcolor=#87481b><font face=helvetica size=-1 color="#ffffff"><b>Playing for <a href=/stumpslive/?MIval=teams2&teamid=7><font color=#ffffff>Sri Lanka</font></a></b></td>
</tr>
<tr>
<td bgcolor=#fffc9c><font face=helvetica size=-1>Test caps</td>
<td bgcolor=#fffc9c align=right><font face=helvetica size=-1>5 </td>
</tr>
<tr>
<td bgcolor=#fffc9c><font face=helvetica size=-1>First test cap</td>
<td bgcolor=#fffc9c align=right><font face=helvetica size=-1>04-03-1983 </td></tr>
<tr>
<td bgcolor=#fffc9c><font face=helvetica size=-1>Last test cap</td>
<td bgcolor=#fffc9c align=right><font face=helvetica size=-1>16-03-1984</td>
</tr>
<tr>
<td bgcolor=#fffc9c><font face=helvetica size=-1>One day caps</td>
<td bgcolor=#fffc9c align=right><font face=helvetica size=-1>7 </td>
</tr>
<tr>
<td bgcolor=#fffc9c><font face=helvetica size=-1>First one day cap</td>
<td bgcolor=#fffc9c align=right><font face=helvetica size=-1>02-03-1983 </td></tr>
<tr>
<td bgcolor=#fffc9c><font face=helvetica size=-1>Last one day cap</td>
<td bgcolor=#fffc9c align=right><font face=helvetica size=-1>30-04-1983</td>
</tr>
</table>
</td>
</tr>
<tr>
<td colspan=2>
<!-- test record -->
<font face=helvetica size=-1>
<p><b><u><font color=#87481b>Test record</font></u></b><p>
<table border=0 cellspacing=1 cellpadding=1 width=520>
<tr>
<td colspan=6 bgcolor=#87481b><font face=helvetica size=-1 color="#ffffff"><b>Batting</b></td>
</tr>
<tr>
<td bgcolor=#fffc9c align=right><font face=helvetica size=-1>Matches</td>
<td bgcolor=#fffc9c align=right><font face=helvetica size=-1>Innings</td>
<td bgcolor=#fffc9c align=right><font face=helvetica size=-1>Runs</td>
<td bgcolor=#fffc9c align=right><font face=helvetica size=-1>Average</td>
<td bgcolor=#fffc9c align=right><font face=helvetica size=-1>50s</td>
<td bgcolor=#fffc9c align=right><font face=helvetica size=-1>100s</td>
</tr>
<tr>
<td bgcolor=#fffc9c align=right><font face=helvetica size=-1>5</td>
<td bgcolor=#fffc9c align=right><font face=helvetica size=-1>10</td>
<td bgcolor=#fffc9c align=right><font face=helvetica size=-1>112</td>
<td bgcolor=#fffc9c align=right><font face=helvetica size=-1>11.2</td>
<td bgcolor=#fffc9c align=right><font face=helvetica size=-1>0</td>
<td bgcolor=#fffc9c align=right><font face=helvetica size=-1>0</td>
</tr>
<tr>
<td colspan=6 bgcolor=#87481b><font face=helvetica size=-1 color="#ffffff"><b>
Highest score 46 vs New Zealand at Christchurch on 04-03-1983 (<a href=/stumpslive/?MIval=matchcard&matchid=954><font color=#ffffff>view</font></a>) 
&nbsp;
</td> 
</tr>
</table>
<!--0-->
<!-- one day international record -->
<font face=helvetica size=-1>
<p><b><u><font color=#87481b>One day international record</font></u></b><p>
<table border=0 cellspacing=1 cellpadding=1 width=500>
<tr>
<td colspan=6 bgcolor=#87481b><font face=helvetica size=-1 color="#ffffff"><b>Batting</b></td>
</tr>
<tr>
<td bgcolor=#fffc9c align=right><font face=helvetica size=-1>Matches</td>
<td bgcolor=#fffc9c align=right><font face=helvetica size=-1>Innings</td>
<td bgcolor=#fffc9c align=right><font face=helvetica size=-1>Runs</td>
<td bgcolor=#fffc9c align=right><font face=helvetica size=-1>Average</td>
<td bgcolor=#fffc9c align=right><font face=helvetica size=-1>50s</td>
<td bgcolor=#fffc9c align=right><font face=helvetica size=-1>100s</td>
</tr>
<tr>
<td bgcolor=#fffc9c align=right><font face=helvetica size=-1>7</td>
<td bgcolor=#fffc9c align=right><font face=helvetica size=-1>5</td>
<td bgcolor=#fffc9c align=right><font face=helvetica size=-1>101</td>
<td bgcolor=#fffc9c align=right><font face=helvetica size=-1>20.2</td>
<td bgcolor=#fffc9c align=right><font face=helvetica size=-1>0</td>
<td bgcolor=#fffc9c align=right><font face=helvetica size=-1>0</td>
</tr>
<tr>
<td colspan=6 bgcolor=#87481b><font face=helvetica size=-1 color="#ffffff"><b>
Highest score 36 vs New Zealand at Auckland on 20-03-1983
(<a href=/stumpslive/?MIval=matchcard&matchid=3189><font color=#ffffff>view</font></a>) 
			 * 
			 */
			
			// first pass:
			
				
				
			String[] startTag = {"color=\"#ffffff\">","Initials</td>","Date of birth</td>","Player type</td>","Batting style</td>","Bowling style</td>","Playing for","Test caps</td>","First test cap</td>","Last test cap</td>","One day caps</td>","First one day cap</td>","Last one day cap</td>"};
			String[] endTag = {"</td>","</td>","</td>","</td>","</td>","</td>","</td>","</td>","</td>","</td>","</td>","</td>","</td>"};
			String[] values = new String[startTag.length];
			
			int last = 0;
			for (int i=0; i<startTag.length; i++) {
				int index = doc.indexOf(startTag[i],last);
				if (index != -1) {
					int start = index + startTag[i].length();
					int end = doc.indexOf(endTag[i],start);
					last = end;
					values[i] = removeTags(doc.substring(start,end)).replace("\n","").trim();
				}
				//System.out.println(startTag[i] + " = " + values[i]);
			}
			//System.out.println();
			
			
			ArrayList<String> tuple = new ArrayList<String>();
			for (String s: values) {
				tuple.add(s);
			}	
			
			// parse stats:
			
			int index1 = doc.indexOf("Test record",last);
			int index2 = doc.indexOf("One day international record",last);
				
			if (index1!=-1 && index2 !=-1) {
				if (index1<index2) {
					tuple.addAll(parseStats(doc.substring(index1,index2)));
					tuple.addAll(parseStats(doc.substring(index2)));
				}
				else {
					tuple.addAll(parseStats(doc.substring(index1)));
					tuple.addAll(parseStats(doc.substring(index2,index1)));
				}
			}
			else if (index1!=-1) {
				tuple.addAll(parseStats(doc.substring(index1)));
				for (int i=0; i<16; i++) { tuple.add(null); } 
			}
			else if (index2 !=-1) {
				for (int i=0; i<16; i++) { tuple.add(null); } 
				tuple.addAll(parseStats(doc.substring(index2)));
			}
			else {
				for (int i=0; i<32; i++) { tuple.add(null); } 
			}
			
			
			String[] columns = new String[] {"name",
											"Initials",
											"Date_of_birth",
											"Player_type",
											"Batting_style",
											"Bowling_style",
											"Playing_for",
											"Test_caps",
											"First_test_cap",
											"Last_test_cap",
											"One_day_caps",
											"First_one_day_cap",
											"Last_one_day_cap",
											
											"test_matches",
											"test_innings",
											"test_runs_scored",
											"test_batting_average",
											"test_fifties",
											"test_hundreds",
											"test_highest_score",
											"test_balls",
											"test_runs_given",
											"test_wickets",
											"test_bowling_average",
											"test_bowling_strike_rate",
											"test_runs_per_over",
											"test_five_wickets",
											"test_ten_wickets",
											"test_best_performance",

											"ODI_matches",
											"ODI_innings",
											"ODI_runs_scored",
											"ODI_batting_average",
											"ODI_fifties",
											"ODI_hundreds",
											"ODI_highest_score",
											"ODI_balls",
											"ODI_runs_given",
											"ODI_wickets",
											"ODI_bowling_average",
											"ODI_bowling_strike_rate",
											"ODI_runs_per_over",
											"ODI_five_wickets",
											"ODI_ten_wickets",
											"ODI_best_performance"
											};
			
			
			//check:
			//for (int i=0; i<tuple.size(); i++) {
			//	System.out.println(columns[i] + " = " + tuple.get(i));
			//}
			System.out.println();
			
			
			String dbName = "imap.cricbase";
			int[] lengths = new int[] {200,100,100,100,100,100,100,100,100,100,100,100,100,10,10,10,10,10,10,400,10,10,10,10,10,10,10,10,400,10,10,10,10,10,10,400,10,10,10,10,10,10,10,10,400};
			
			String[] cols = new String[columns.length]; for (int i=0; i<columns.length; i++) { cols[i] = "`"+columns[i].trim()+"` varchar("+lengths[i]+")"; }
			db.createTableIfNotExists(dbName,cols,null); // no key
			db.insert(dbName,tuple);
						
			}
			catch (Exception e) {
				e.printStackTrace();
			}
			
		}
		
		
		
	}
	
	public static ArrayList<String> parseStats(String doc) {
		
		ArrayList<String> batting = new ArrayList<String>();
		ArrayList<String> bowling = new ArrayList<String>();
		
		int index;
		
		if ((index = doc.indexOf("Batting"))!=-1) {
			int start = doc.indexOf("<tr>",doc.indexOf("<tr>",index)+1);
			int end = doc.indexOf("</table>",index);
			String stats = doc.substring(start,end);
			end = 0;
			while ((start = stats.indexOf("<td",end+1))!=-1) {
				end = stats.indexOf("</td>",start);
				batting.add(removeTags(stats.substring(start,end)).replace("\n",""));
			}
		}
		else {
			for (int i=0; i<7; i++) { batting.add(null); } 
		}
		
		if ((index = doc.indexOf("Bowling"))!=-1) {
			int start = doc.indexOf("<tr>",doc.indexOf("<tr>",index)+1);
			int end = doc.indexOf("</table>",index);
			String stats = doc.substring(start,end);
			end = 0;
			while ((start = stats.indexOf("<td",end+1))!=-1) {
				end = stats.indexOf("</td>",start);
				bowling.add(removeTags(stats.substring(start,end)).replace("\n",""));
			}
			if (bowling.size()<9) {
				bowling.add(7,"0");
			}
		}
		else  {
			for (int i=0; i<9; i++) { bowling.add(null); } 
		}
		
		ArrayList<String> tuple = new ArrayList<String>();
		tuple.addAll(batting);
		tuple.addAll(bowling);
		return tuple;
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
	
	public static ArrayList<String> tokenize(String input) {
		ArrayList<String> tokens = new ArrayList<String>();
		String[] vals = input.trim().split(" ");
		for (String v: vals) {
			if (v.length()>0) {
				tokens.add(v);
			}
		}
		return tokens;
	}
	
	public static String loadFile(File file) {
		// load the document
		String doc = "";
		try {
			BufferedReader in = new BufferedReader(new InputStreamReader(file.toURL().openStream()));
			String line;
			while ((line = in.readLine()) != null) {
				doc += line + "\n";
			}
		}
		catch (Exception e) {
			System.err.println("Error invoking URL: "+file.toString());
		}
		return doc;
	}

	
}
