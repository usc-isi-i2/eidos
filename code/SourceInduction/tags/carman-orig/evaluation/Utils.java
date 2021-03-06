package evaluation;

import java.util.ArrayList;
import java.util.Random;

import relational.DBConnection;
import relational.Table;
import domain.Clause;
import domain.Predicate;
import domain.SemanticType;
import domain.Term;
import invocation.Dispatcher;

public class Utils {

	
	static Table generateExamples(DBConnection dbCon, ArrayList<SemanticType> signature, int count) {
    	
		
		// get examples of each type in the signature
		ArrayList<ArrayList<String>> examplesOfTypes = new ArrayList<ArrayList<String>>(signature.size());
        for (SemanticType st: signature) {
    		if (st == null) { 
    			System.out.println("st == null");
    			System.exit(9);
    		}
        	examplesOfTypes.add(st.getExamples(count+1,dbCon));
        }
    	
        // create a new table
        Table table = new Table();
        for (int i=0; i<signature.size(); i++) { table.colNames.add(signature.get(i).name + i); }
        
        // now randomly combine WITH REPLACEMENT constants from different vectors to form tuples
		for (int i=count; i>0; i--) {
        	ArrayList<String> tuple = new ArrayList<String>(signature.size());
			for(ArrayList<String> examples: examplesOfTypes) {
				tuple.add(examples.remove((new Random()).nextInt(i)));
			}
			table.insertDistinct(tuple);
		}
		
        return table;
   	
    }

	static Table execute(Dispatcher d, Clause c, Table inputTable) {
		
		Table mainTable = inputTable;		
		
		// start executing from literal in position 1:
		for (int i=1; i<c.preds.size(); i++) {
    		
    		Predicate pred   = c.preds.elementAt(i);
    		Term[] termArray = c.terms.elementAt(i);
    		
    		if (pred.category == Predicate.SOURCE || pred.category == Predicate.FUNCTION) {
    			
    			Table t = new Table();
    			t.colNames.addAll(mainTable.colNames);
    			t.colTypes.addAll(mainTable.colTypes);
    			
    			// get mapping of predicate attributes to table columns
    			ArrayList<Integer> indices = new ArrayList<Integer>();
    			for (int j=0; j<pred.arity; j++) {
    				if (termArray[j] != null) {
    					int index = t.colNames.indexOf(termArray[j].toString());
        				if (index != -1) {
        					indices.add(index);
        				}
        				else {
        					indices.add(t.arity());
            				t.colNames.add(termArray[j].toString());
        					t.colTypes.add(pred.types[j]);
            			}
    				}
    				else {
    					indices.add(t.arity());
        				t.colNames.add((new Term(i,j)).toString());
    					t.colTypes.add(pred.types[j]);
        			}
    			}
    			
    			// for efficiency, get the list of input column indices before invoking source
    			ArrayList<Integer> inputCols = new ArrayList<Integer>();
    			for (int j=0; j<pred.arity; j++) {
    	    		if (pred.bindings[j]) {	inputCols.add(t.colNames.indexOf(termArray[j].toString())); }
    			}
    	    	
    			// now invoke the source with each tuple
                for (ArrayList<String> tuple: mainTable.tuples) {
                	// get the input tuple values
                	ArrayList<String> inputTuple = new ArrayList<String>();
                	for (int index: inputCols) {
                		inputTuple.add(tuple.get(index));
                	}
                	// invoke the source with each input tuple:
                	for (ArrayList<String> outputTuple: d.invoke(pred,inputTuple).tuples) {
                		boolean isValid = true;
                		ArrayList<String> extendedTuple = new ArrayList<String>();
                		extendedTuple.addAll(tuple);
                		for (int j=0; j<pred.arity; j++) {
                			if (!pred.bindings[j]) {
                				String val = outputTuple.get(j);
                				int index  = indices.get(j);
                				if (index == extendedTuple.size()) {
                    				extendedTuple.add(val);
                    			}
                    			else {
                    				// must check that values are equal here
                    				// use equality procedure for this semantic type!!!!!
                    				if (!t.colTypes.get(index).areEqual(extendedTuple.get(index),val)) {
                    					isValid = false;
                    					break;
                    				}
                    			}
                    		}
                		}
                		if (isValid) {
                			// CHANGED FOR EFFICIENCY - NOT SURE IT'S CORRECT!!!
                			t.tuples.add(extendedTuple);
                			//t.insertDistinct(extendedTuple);
                		}	
                	}	
                }
                
                // update the mainTable
                mainTable = t;
                
    		}
    		else { // interpreted predicate
    			
    			mainTable.filter(pred.dbTable,termArray[0].toString(),termArray[1].toString());
    		
    		}
    		
    	}
    	
        return mainTable;
        
    }

}
