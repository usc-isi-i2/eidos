package invocation;


import java.util.*;

import domain.Predicate;
import relational.Table;
import relational.DBConnection;


public class Dispatcher {
    
	public long sourceAccesses = 0; // count times sources are invoked
		
	public DBConnection dbCon;
	public String dbName;
	
	private boolean debug = false; //true;
	
	private Hashtable<String,Wrapper> wrappers;
	private Hashtable<String,InvocationLog> logs;
	
	
	public Dispatcher(DBConnection dbCon, String dbName) {
		this.dbCon = dbCon;
		this.dbName = dbName;
		this.wrappers = new Hashtable<String,Wrapper>();
		this.logs = new Hashtable<String,InvocationLog>();
	}
	
	
	// outer invoke method checks for cached values and caches results
	public Table invoke(Predicate p, ArrayList<String> inputTuple) {
		
		// check if predicate is local function 
		//  - if it is, don't do any caching!
		if (p.endpoint[0].equalsIgnoreCase("invocation.Local")) { // hack!
			return invocation.Local.invokeStatic(p.endpoint,inputTuple);
		}
		
    	// check if the source has already been invoked using this input:
    	if (!inputTuple.isEmpty()) {
    		
    		String whereClause = "";
        	for (int i=0,j=0; i<p.arity; i++) {
        		if (p.bindings[i]) {
        			if (j==0) { whereClause += " WHERE "; } else { whereClause += " AND "; }
        			whereClause += "("+p.types[i].name+i+" = '"+inputTuple.get(j).replaceAll("'","\\\\'")+"')";
        			j++;
        		}	
        	}
        	
        	if (!dbCon.returnsEmptySet("SELECT * FROM "+dbName+".InvocationsOf_" + p.dbTable + whereClause)) {
        		Table t = dbCon.runQuery("SELECT DISTINCT * FROM " + dbName+"."+p.dbTable + whereClause);
        		t.colTypes = p.typesAsList();
        		return t;
            }
        	
        	// source has not been tested with this input
        	dbCon.insert(dbName+".InvocationsOf_"+p.dbTable, inputTuple);
    		
    	}
    	else {
    		Table t = dbCon.runQuery("SELECT DISTINCT * FROM " + dbName+"."+p.dbTable);
    		if (t.size()>0) {
    			t.colTypes = p.typesAsList();
    			return t;
    		}	
        }
    	
    	Table table = invoke(p.endpoint,inputTuple);
    	
    	if (table != null) {
    		table.colTypes = p.typesAsList();
    		table.store(dbCon,dbName+"."+p.dbTable,false);
        }
    	else {
    		// make empty table:
    		table = new Table(p);
    	}
    	
		return table; 
    	
    }
	
	
	// inner invoke method calls wrapper
	public Table invoke(String[] endpoint, ArrayList<String> inputTuple) {
    	
		sourceAccesses++;
				
		// get wrapper from hashtable
    	Wrapper w = wrappers.get(endpoint[0]);
    	if (w==null) {
    		w = loadWrapper(endpoint[0]);
    		wrappers.put(endpoint[0],w);
    	}
    	
    	// get log from hashtable
    	InvocationLog l = logs.get(endpoint[0]+";"+endpoint[1]); 		
    	if (l==null) {
    		l = new InvocationLog();
    		logs.put(endpoint[0]+";"+endpoint[1],l);
    	}
    	
    	long delay = 10; // millisecond delay between source invocations
		long interval = System.currentTimeMillis() - l.timestamp;
		if (interval < delay) { 
			try { Thread.sleep(delay-interval); }
			catch (Exception e) {System.err.println("Thread woken while sleeping ... now exiting"); System.exit(9);}
		}
		
		// update log timestamp
		l.timestamp = System.currentTimeMillis();
		
		if (debug) { System.out.println(" Invoking: " + arrayToString(endpoint,"#") + "("+Table.listToString(inputTuple)+")");}
    	    	
    	// invoke the operation!
		Table output = w.invoke(endpoint,inputTuple);
        
    	// check to see if invocation succeeded:
    	if (output != null) {
    	    // record info in log:
		    l.successCount++;
		    l.successiveFailureCount = 0;
		    l.successfulInput = inputTuple;
    	}
    	else {
    		System.err.println("Error invoking method called " + endpoint[1] + " in wrapper: " + endpoint[0]);
			// record info in log:
		    l.successiveFailureCount++;
		    // check if failure count has exceeded threshold:
		    if (l.successCount > 25 && l.successiveFailureCount > l.successiveFailureLimit) {
		    	// try with previously successful input:
		    	if (w.invoke(endpoint,l.successfulInput)==null) {
		    		System.err.println("Error in wrapper: " + endpoint[0] + " when invoking with PREVIOUSLY SUCCESSFUL input");
		    		System.err.println(" Service is probably bloking IP - please restart induction system after removing this source/target.");
		    		System.exit(9);
				}
		    	else {
		    		// increment the successive failure limit
		    		l.successiveFailureLimit += 10;
		    	}	
		    }
		}
    	
    	if (debug) { System.out.println(" - response after "+ (System.currentTimeMillis() - l.timestamp)/1000 +" seconds  ("+output.size()+" tuples)");}
    	return output;
        
    }
	
	
	
	/*
	 * Utility Methods:
	 */
	
	private Wrapper loadWrapper(String name) {
		try {
			return (Wrapper) Class.forName(name).newInstance();
		}
		catch (Exception e) {
			System.err.println("ERROR loading wrapper class: " + name); 
			System.err.println("... System exiting!"); 
			System.exit(9);
		}
		return null;
	}
	
	
	
    private String arrayToString(String[] array, String separator) {
    	String s = "";
    	for (int i=0; i<array.length; i++) {
    		if (i!=0) { s += separator; }
    		s += array[i];
    	}
    	return s;
    }
    	
}
