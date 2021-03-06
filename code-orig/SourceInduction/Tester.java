import induction.*;
import invocation.Wrapper;
import domain.*;
import evaluation.*;
import relational.*;

public class Tester {

	public static void main(String[] args) {
		
		String filename = "problems/example.txt"; 
		if (args.length > 0) { filename = args[0]; }
			
		Domain d = Domain.load(filename);
		d.print();
		
		DBConnection db = new DBConnection("dbProperties.txt");
		
		boolean debug = false; // don't change this unless u like reading a lot of output!
		
		// choose the heuristic to use during search - best to stick with "random"
		String heuristic = "random"; // other possible values: "simple" and "lookahead"
		
		// choose the timeout for the search
		long timeout = 5 * 60;
		
		(new Searcher()).searchAll(db,new EnumerateSources(d,7,2,5,true,heuristic,debug),new EvaluatorImpl(db,debug,20,20,true),true,timeout,30,debug); 
		
		db.close();
		
	}
	
	
	
/*******************************************************************************************
 * EXTRA TESTING CODE BELOW -- You can ignore it
 *
 */	
	
	public static void evaluateClauses() {
		DBConnection db = new DBConnection("dbProperties.txt");
		String filename = "problems/thesis.txt"; 
		Domain d = Domain.load(filename);
		d.print();
		
		boolean debug = true;
		boolean reload = false;
		String[] clauses = {
				"CurrencySource($_,cur1,pri2) :- GoCurrency(cur1,_,pri2).",
				"CurrencySource($cur0,cur1,pri2) :- GoCurrency(cur0,_,pri3),GoCurrency(cur1,_,pri4),Divide(pri2,pri3,pri4).",
				"CurrencySource($cur0,cur1,pri2) :- GoCurrency(cur0,_,pri3),GoCurrency(cur1,_,pri4),Divide(pri3,pri2,pri4)."
			//"YahooExchangeRate($cur0,$cur1,pri2,_,_,_,_) :- GoCurrency(cur0,_,pri3),GoCurrency(cur1,_,pri4),Divide(pri3,pri4,pri2).",
			//"YahooExchangeRate($cur0,$cur1,pri2,_,_,_,_) :- GoCurrency(cur0,_,pri3),GoCurrency(cur1,_,pri4),Divide(pri4,pri3,pri2)."
		};
		evaluateClauses(new EvaluatorImpl(db,debug,20,20,true), d, clauses, reload);
	}

	
	public static void evaluateClauses(Evaluator ce, Domain d, String[] clauses, boolean reload) {
		if (reload) { 
			ce.dbCon.resetTables(ce.dbName,d.sources); 
			ce.dbCon.resetTable(ce.dbName,d.target); 
			(new Initializer(ce.dispatcher)).populateTargetTable(d.target,20); 
		}
		for (String clause: clauses) {
			Clause c = d.parseClause(clause);
			System.out.println();
			double score = ce.evaluate(c).score;
			System.out.println(score + " " + c.toString());
			System.out.println(" confidence: "+score * c.missingDomains(ce.dbCon));
		}
    }       
	
	
	
	
	
	public static void testWrappers() {

		String[] wrappers = new String[] {"Autosite","BoyGenius","Codebump","CurrencySource","Geonames","GoCurrency","GoogleBase","NOAAWeather","Ragnarok","USFireAdmin",
				"USZip","WebServiceX","USGeocoder","USGS","YahooFinance","YahooMaps","YahooLocal","YahooAutos","YahooTraffic","YahooWeather","Wunderground","WeatherBug","WeatherChannel","WebContinuum"};
		
		for (String w: wrappers) {
			try {
				((Wrapper) Class.forName("wrappers."+w).newInstance()).testWrapper();
			}
			catch (Exception e) {
				e.printStackTrace();
			}
		}
		
	}

}
