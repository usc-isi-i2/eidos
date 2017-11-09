package wrappers.imap;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;

import java.util.ArrayList;

import relational.DBConnection;

public class Cricinfo {

	public static void run(DBConnection db) {
	
		File dataDir = new File("d:/raw_data/cricket/cricinfo/");
		File[] listing = dataDir.listFiles();
		for (File file: listing) {
			
			System.out.println(file.getName());
			String doc = loadFile(file);
			
			try {
				
			
			/*
			 * 
			 * <H2>Azhar Hossain</H2>
<STRONG>Born:</STRONG> 15 March 1964, Dhaka
<BR>
<STRONG>Major Teams:</STRONG>  Bangladesh.
<BR>
<STRONG>Known As:</STRONG> Azhar Hossain
<BR>
<STRONG>Also Known As:</STRONG> Shantu

<BR>
<STRONG>Batting Style:</STRONG> Right Hand Bat<br>
<STRONG>Bowling Style:</STRONG> Right Arm Off Break<br>
<BR CLEAR=ALL>
<HR> 

<strong>ODI Debut:</strong> <A HREF = "/link_to_database/ARCHIVE/1980S/1988-89/OD_TOURNEYS/ASIA/BDESH_IND_ASIA_ODI2_27OCT1988.html">Bangladesh v India at Chittagong, Asia Cup, 1988/89</A>
<strong><br>Latest ODI:</strong> <A HREF = "/link_to_database/ARCHIVE/1990-91/OD_TOURNEYS/ASIA/SL_BDESH_ASIA_ODI3_31DEC1990.html">Bangladesh v Sri Lanka at Calcutta, Asia Cup, 1990/91</A>

<br><HR>
<H3>Career Statistics:</H3>
<FONT FACE="COURIER NEW,COURIER,MONOSPACE"><PRE>
<strong>ONE-DAY INTERNATIONALS</strong>
 (including 31/12/1990)
                      M    I  NO  Runs   HS     Ave     SR 100  50   Ct  St
Batting & Fielding    7    7   0    96   54   13.71  36.09   0   1    2   0

                      O      M     R    W    Ave   BBI   4w  5w    SR  Econ
Bowling              43.5    1   209    4  52.25  1-20    0   0  65.7  4.76

<strong>FIRST-CLASS</strong>

                      M    I  NO  Runs   HS     Ave 100  50   Ct  St
Batting & Fielding    0    -   -     -    -     -     -   -    -   -

                    Balls    M     R    W    Ave   BBI    5  10    SR  Econ
Bowling                 0    -     -    -    -     -      -   -    -    -

<strong>LIST A LIMITED OVERS</strong>
 (1988/89 - 1990/91)
                      M    I  NO  Runs   HS     Ave 100  50   Ct  St
Batting & Fielding    7    7   0    96   54   13.71   0   1    2   0

                      O       R    W    Ave   BBI   4w  5w    SR  Econ
Bowling              43.5   209    4  52.25  1-20    0   0  65.7  4.76

- Explanations of <A HREF="/link_to_database/SOCIETIES/ENG/ACS/ARTICLES/FIRST_CLASS_STATUS.html">First-Class</A> and <A HREF="/link_to_database/SOCIETIES/ENG/ACS/ARTICLES/LIMITED_OVER_A-STATUS.html">List A</A> status courtesy of the ACS.


<strong>ICC TROPHY</strong>

                      M    I  NO  Runs   HS     Ave 100  50   Ct  St
Batting & Fielding    7    7   2    83   28   16.60   0   0    2   0

                      O      M     R    W    Ave   BBI   4w  5w    SR  Econ
Bowling              82      7   285    7  40.71  2-24    0   0  70.2  3.47

</PRE></FONT>
			 * 
			 * 
			 */
			
			// first pass:
			
			String[] startTag = {"<H2>","Born:","Died:","Major Teams:","Known As:","Batting Style:","Bowling Style:","Test Debut:","Last Test:","ODI Debut:","Latest ODI:","TESTS","ONE-DAY INTERNATIONALS"};
			String[] endTag = {"</H2>","<BR>","<BR>","<BR>","<BR>","<br>","<br>","</A>","</A>","</A>","</A>","<strong>","<strong>"};
			String[] values = new String[startTag.length];
			
			int last = 0;
			for (int i=0; i<startTag.length; i++) {
				int index = doc.indexOf(startTag[i],last);
				if (index != -1) {
					int start = index + startTag[i].length();
					int end = doc.indexOf(endTag[i],start);
					last = end;
					values[i] = removeTags(doc.substring(start,end)).trim();
				}
				//System.out.println(startTag[i] + " = " + values[i]);
			}
			//System.out.println();
			
			
			/*
			 * 
			1349.html
			<H2> = Keith Raymond Stackpole
			Born: = 10 July 1940, Collingwood, Melbourne, Victoria
			Died: = null
			Major Teams: = Victoria, Australia.
			Known As: = Keith Stackpole
			Batting Style: = Right Hand Bat
			Bowling Style: = Leg Break
			Test Debut: = Australia v England at Adelaide, 4th Test, 1965/66
			Last Test: = Australia v New Zealand at Auckland, 3rd Test, 1973/74
			ODI Debut: = Australia v England at Melbourne, One-off ODI, 1970/71
			Latest ODI: = null
			TESTS = (career)
			                      M    I  NO  Runs   HS     Ave 100  50   Ct  St
			Batting & Fielding   43   80   5  2807  207   37.42   7  14   47   0

			                    Balls    M     R    W    Ave   BBI    5  10    SR  Econ
			Bowling              2321   86  1001   15  66.73  2-33    0   0 154.7  2.58
			ONE-DAY INTERNATIONALS = (career)
			                      M    I  NO  Runs   HS     Ave     SR 100  50   Ct  St
			Batting & Fielding    6    6   0   224   61   37.33  57.88   0   3    1   0

			                    Balls    M     R    W    Ave   BBI   4w  5w    SR  Econ
			Bowling                77    0    54    3  18.00  3-40    0   0  25.6  4.20
			 * 
			 */
			
			
			
			// second pass:
			
			String[] columns = new String[] {"name",
										   "date_of_birth",
										   "place_of_birth",
										   "date_of_death",
										   "place_of_death",
										   "major_teams",
										   "known_as",
										   "batting_style",
										   "bowling_style",
										   "test_debut",
										   "test_latest",
										   "ODI_debut",
										   "ODI_latest",
										   
										   "test_batting_matches",
										   "test_batting_innings",
										   "test_batting_not_outs",
										   "test_batting_runs_scored",
										   "test_batting_highest",
										   "test_batting_average",
										   "test_batting_strike_rate",
										   "test_batting_hundreds",
										   "test_batting_fifties",
  										   "test_fielding_catches",  
										   "test_fielding_stumpings",

										   "test_bowling_balls",
										   "test_bowling_maidens",
										   "test_bowling_runs_given",
										   "test_bowling_wickets",
										   "test_bowling_average",
										   "test_bowling_best",
										   "test_bowling_strike_rate",
										   "test_bowling_runs_per_over",
										   
										   "ODI_batting_matches",
										   "ODI_batting_innings",
										   "ODI_batting_not_outs",
											"ODI_batting_runs_scored",
											"ODI_batting_highest",
											"ODI_batting_average",
											"ODI_batting_strike_rate",
											"ODI_batting_hundreds",
											"ODI_batting_fifties",
											"ODI_fielding_catches",  
											"ODI_fielding_stumpings",
										   
										   "ODI_bowling_balls",
										   "ODI_bowling_maidens",
										   "ODI_bowling_runs_given",
										   "ODI_bowling_wickets",
										   "ODI_bowling_average",
										   "ODI_bowling_best",
										   "ODI_bowling_strike_rate",
										   "ODI_bowling_runs_per_over"};
			
			int index;
			String val;
			
			
			ArrayList<String> tuple = new ArrayList<String>();
			
			tuple.add(values[0]);
			
			val = values[1]; // born
			if (val!=null && (index = val.indexOf(","))!=-1) {
				tuple.add(val.substring(0,index).trim());
				tuple.add(val.substring(index+1).trim());
			}
			else {
				tuple.add(val);
				tuple.add(null);
			}
			
			val = values[2]; // died
			if (val!=null && (index = val.indexOf(","))!=-1) {
				tuple.add(val.substring(0,index).trim());
				tuple.add(val.substring(index+1).trim());
			}
			else {
				tuple.add(val);
				tuple.add(null);
			}
			
			for (int i=3; i<=10; i++) {
				tuple.add(values[i]);
			}			
			
			tuple.addAll(parseStats(values[11])); // TESTS
			
			tuple.addAll(parseStats(values[12])); // ONE-DAYs
			
			//check:
			for (int i=0; i<tuple.size(); i++) {
			//	System.out.println(columns[i] + " = " + tuple.get(i));
			}
			System.out.println();
			
			
			
			String dbName = "imap.cricinfo";
			int[] lengths = new int[] {200,100,100,100,100,400,100,100,100,400,400,400,400,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10};
			
			String[] cols = new String[columns.length]; for (int i=0; i<columns.length; i++) { cols[i] = "`"+columns[i].trim()+"` varchar("+lengths[i]+")"; }
			//db.createTableIfNotExists(dbName,cols,"`"+columns[0]+"`");
			db.createTableIfNotExists(dbName,cols,null); // no key
			db.insert(dbName,tuple);
			
			
			}
			catch (Exception e) {
				e.printStackTrace();
			}
			
		}
		
		
		
	}
	
	public static ArrayList<String> parseStats(String val) {
		
		String[] lines;
		ArrayList<String> statVars;
		ArrayList<String> statVals;
		String statType;
		
		String[] battingVars = new String[] {"M","I","NO","Runs","HS","Ave","SR","100","50","Ct","St"};
		String[] bowlingVars = new String[] {"Balls","M","R","W","Ave","BBI","SR","Econ"};
		String[] battingVals;
		String[] bowlingVals;
		
		battingVals = new String[battingVars.length];
		bowlingVals = new String[bowlingVars.length];
		
		int index;
		if (val!=null) {
			lines = val.split("\n");
			
			int row = 0;
			String line = lines[row].trim();
			if (line.equals("") || line.endsWith(")")) {
				row++;
			}
			
			statVars = tokenize(lines[row++]);
			statVals = tokenize(lines[row++]);
			statType = statVals.remove(0);
			if (statType.equals("Batting")) {
				if (statVals.get(0).startsWith("&")) {statVals.remove(0);statVals.remove(0);}
				for (int i=0; i<battingVars.length; i++) {
					if ((index = statVars.indexOf(battingVars[i])) != -1) {
						battingVals[i] = statVals.get(index);
					}
				}
			} 
			else if (statType.equals("Bowling")) {
				for (int i=0; i<bowlingVars.length; i++) {
					if ((index = statVars.indexOf(bowlingVars[i])) != -1) {
						bowlingVals[i] = statVals.get(index);
					}
				}
			}
			
			if (lines.length > row) {
				
				line = lines[row].trim();
				if (line.equals("") || line.endsWith(")")) {
					row++;
				}
				
				statVars = tokenize(lines[row++]);
				statVals = tokenize(lines[row++]);
				statType = statVals.remove(0);
				if (statType.equals("Batting & Fielding")) {
					for (int i=0; i<battingVars.length; i++) {
						if ((index = statVars.indexOf(battingVars[i])) != -1) {
							battingVals[i] = statVals.get(index);
						}
					}
				} 
				else if (statType.equals("Bowling")) {
					for (int i=0; i<bowlingVars.length; i++) {
						if ((index = statVars.indexOf(bowlingVars[i])) != -1) {
							bowlingVals[i] = statVals.get(index);
						}
					}
				}
			}
				
		}
		
		ArrayList<String> stats = new ArrayList<String>();
		for (String s: battingVals) {stats.add(s);}
		for (String s: bowlingVals) {stats.add(s);}
		return stats;
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
