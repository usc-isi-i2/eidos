package evaluation;



import java.util.ArrayList;

import relational.Table;
import relational.DBConnection;

import domain.Clause;
import domain.Predicate;
import domain.SemanticType;
import domain.Term;


/*
 * 
 * New evaluation function:
 * 
 * f = |A /\ B| / |A \/ B|  =  |A /\ B| / (|A| + |B| - |A /\ B|)   
 * 
 * instead of: 
 * 
 * f = |A /\ B| / (|A| + |B|)
 * 
 */


/*
* 
* THIS VERSION ATTEMPTS TO REDUCE THE NUMBER OF SOURCE ACCESSES BY 
* REUSING SOURCE INVOCATIONS WHENEVER POSSIBLE (I.E. WHENEVER 
* RANDOMLY CHOOSING INPUTS, IT CHOOSES VALUES FOR WHICH THE SERVICE
* HAS ALREADY BEEN INVOKED).
* 
* THIS MINIMISATION CAN BE TURNED OFF BY SETTING:
*  minimize = false;
* 
* CHANGES HAVE BEEN MADE TO THE:
*  createClauseInput()
* METHOD TO ALLOW FOR THIS MINIMISATION 
* 
*/




public class EvaluatorImpl5 extends Evaluator {
	
	private int sampleCount1 = 20;
	private int sampleCount2 = 20;
	private boolean debug;
	
	// these global variables are a hack:
	//  need to pass it between methods correctly
	private double positiveScaling;
	private double negativeScaling;

	private Predicate target = null;
	private Table targetInput = null;
	
	private boolean minimize; 
	// flag determines whether or not all clauses are tested with the same input
	// and how much the system reuses source invocations ....
	// .... setting this flag should lead to faster induction, but may also cause a degredation in quality of the definitions produced.
	
	public EvaluatorImpl5(DBConnection db, String dbName, boolean debug, int count1, int count2, boolean minimizeInvocations) {
		super(db,dbName);
		this.debug = debug;
		sampleCount1 = count1;
		sampleCount2 = count2;
		minimize = minimizeInvocations;
	}	
	
	public Evaluation evaluate(Clause c) {
		
				
		double start = System.currentTimeMillis();
		
		if (debug) { System.out.println("\n evaluate("+c.toString()+"):\n c = "+c.toStringDebug()+"\n");}
		
		double totalFitness = 0.0;
		double outputPenalty = missingDomains(c);
		
		if (c.head()!=target || !minimize) {
			target = c.head();
			targetInput = createTargetInput(target,sampleCount1);
			targetInput.print();
		}
		
		int count = 0;
		
		for (ArrayList<String> inputTuple: targetInput.tuples) {	
			
			// preset scaling factors - they are updated by the createClauseInput method
			positiveScaling = 1.0;
			negativeScaling = 1.0;
			
			Table targetTable = invoke(target,inputTuple).renameColumns(targetColumns(target.arity));
			Table candidateTable = execute(c, createClauseInput(c, inputTuple, targetTable, sampleCount2));
			// USES OLD INTERSECTION FUNCTION WHICH PERFORMS DISTINCT PROJECTION OVER targetTable 
			Table commonTable = targetTable.intersection(candidateTable);
			
	        int numCandidateTuples = candidateTable.size();
	        int numTargetTuples = targetTable.size(); 
	        int numCommonTuples = commonTable.size();
	        
	        if (debug) { 
				System.out.println("\n inputTuple      = ["+Table.listToString(inputTuple)+"]"); 
				System.out.println("positiveScaling    = "+positiveScaling); 
				System.out.println("negativeScaling    = "+negativeScaling); 
				System.out.println("outputPenalty      = "+outputPenalty); 
				System.out.println("numTargetTuples    = "+numTargetTuples); 
				System.out.println("numCandidateTuples = "+numCandidateTuples); 
				System.out.println("numCommonTuples    = "+numCommonTuples); 
			}
	        
	        // calculate fitness of candidate definition
			if (numTargetTuples == 0 && numCandidateTuples == 0){
				// do nothing!
				;
			}
			else {
				double fitness = numCommonTuples /(numTargetTuples * positiveScaling + (numCandidateTuples * outputPenalty - numCommonTuples) / negativeScaling);
				if (debug) {
					System.out.println("fitness = numCommonTuples /(numTargetTuples * positiveScaling + (numCandidateTuples * outputPenalty - numCommonTuples) / negativeScaling)");
					System.out.println("        = "+numCommonTuples+" /("+numTargetTuples+" * "+positiveScaling+" + ("+numCandidateTuples+" * "+outputPenalty+" - "+numCommonTuples+") / "+negativeScaling+")");
					System.out.println("        = "+fitness);
				}
				totalFitness += fitness;
				count++;
			}
			
		}
			
        Evaluation e = new Evaluation();
        e.score = totalFitness / count;
    		
		System.out.println("Evaluation time = "+(System.currentTimeMillis()-start)+" ms");
		// bias towards shorter clauses by multiplying result by 0.95^(clause_length) 
		for (int i=0; i<c.preds.size(); i++) { e.score *= 0.9; }
		return e;
		
	}		
	
	//////////////////////////////////////////////////
	// private methods
	
	private Table createClauseInput(Clause c, ArrayList<String> inputTuple, Table targetTable, int max) {
		
		if (debug) {System.out.println("Creating the clause input for clause: "+c.toStringI());}
		
		Predicate target = c.head();
		
		ArrayList<String> projection = new ArrayList<String>();
		for (int i=0; i<target.arity; i++) {
			if (target.bindings[i]) {
				projection.add(targetTable.colNames.get(i));
			}
		}
		
		// check if any OUTPUT VARIABLES appear in the body but
		//  are not bound by (are input to) the first predicate involving them
		ArrayList<SemanticType> typeSignature = new ArrayList<SemanticType>();
		ArrayList<Integer> predLocation = new ArrayList<Integer>();
		ArrayList<Integer> predPosition = new ArrayList<Integer>();
		for (int i=0; i<target.arity; i++) {
			if (!target.bindings[i]) {
				int[] location = c.firstOccurs(i);
				if (location != null && c.preds.elementAt(location[0]).bindings[location[1]]) {
					projection.add(targetTable.colNames.get(i));
					typeSignature.add(target.types[i]);
					predLocation.add(location[0]);
					predPosition.add(location[1]);
				}
			}
		}
		
		if (debug) {System.out.println(" getting the projection:");}
		
		// get some of the examples from the targetTable (output of the known predicate) 
		Table projectedTable = targetTable.distinctProjection(projection);

		if (debug) {System.out.println(" taking a random sample:");}
		
		Table t = projectedTable.randomSubsetWithoutReplacement((max+1)/2);
				
		// set the positive scaling factor:
		int positiveExampleCount = projectedTable.size();
		int selectedPositiveExamples = t.size();
		if (selectedPositiveExamples > 0) {
			positiveScaling = (double) selectedPositiveExamples / (double) positiveExampleCount;
		}

		if (!typeSignature.isEmpty()) {
			
			if (debug) {System.out.println(" generating some negative examples:");}
			
			// add some negative examples of the target predicate
			Table examplesTable;
			int count = max-t.size();
			
			if (minimize) {
			
				// generate negative examples by selecting from list of prior invocations of
				// each source predicate (if there are enough such invocations already)
				// NOTE 1: doing this COULD ADD DISTORTION TO THE SEARCH - possibly degrading results
				//         but may exponentially(!) reduce the number of source invocations required to 
				//         learn each definition.
				// NOTE 2: for this to reduce source invocations of sources with multiple input parameters, 
				//         will need to coordinate the values - this is not done at the moment
				//            yahoogeocoder($address,$zip, ...) is a good example
				ArrayList<ArrayList<String>> examples = new ArrayList<ArrayList<String>>();
				for (int i=0; i<predLocation.size(); i++) {
					// initialise all example vectors to null
					examples.add(null);
				}
				for (int i=0; i<predLocation.size(); i++) {
					if (examples.get(i)==null) {
						int loc = predLocation.get(i);
						int pos = predPosition.get(i);
						// look for other variables in the same literal (predLocation value):
						ArrayList<Integer> indices = new ArrayList<Integer>();
						ArrayList<Integer> positions = new ArrayList<Integer>();
						indices.add(i);
						positions.add(pos);
						for (int j=i+1; j<predLocation.size(); j++) {
							if (loc == predLocation.get(j)) {
								indices.add(j);
								positions.add(predPosition.get(j));
							}
						}
						Predicate p = c.preds.elementAt(loc);
						// get the column names
						ArrayList<String> columns = new ArrayList<String>();
						for (int po: positions) { columns.add(p.types[po].name+po); }
						// check if there are enough examples in InvocationsOf ...
						if ((p.category==Predicate.SOURCE || p.category == Predicate.FUNCTION) && dbCon.countDistinct(dbName+".InvocationsOf_"+p.dbTable,columns) > 5 * max) {
							// randomly select count of them!
							Table subset = dbCon.randomSubset(dbName+".InvocationsOf_"+p.dbTable,columns,count,true);
							for (int k=0; k<indices.size(); k++) {
								ArrayList<String> values = new ArrayList<String>();
								for (ArrayList<String> tuple: subset.tuples) {values.add(tuple.get(k));}
								examples.set(indices.get(k),values);
							}
						}
						else {
							// select from complete list
							for (int k=0; k<indices.size(); k++) {
								examples.set(indices.get(k),p.types[positions.get(k)].getExamples(count,dbCon));
							}
						}
					}
				}
				// make examplesTable....        
				examplesTable = new Table();
				for (int i=0; i<typeSignature.size(); i++) { 
					examplesTable.colNames.add(typeSignature.get(i).name + i);
					examplesTable.colTypes.add(typeSignature.get(i));
				}
				
				if (debug) {System.out.println(" combine the examples:");}
				
		        // by combining constants from each list
				for (int i=0; i<count; i++) {
		        	ArrayList<String> tuple = new ArrayList<String>(examples.size());
					for(ArrayList<String> list: examples) {
						// use list as a queue:
						String val = list.remove(0); list.add(val); 
						tuple.add(val);
					}
					examplesTable.insertDistinct(tuple);
				}
				
				if (debug) {examplesTable.print(); }
				
			}
			else {
				examplesTable = generateExamples(typeSignature,count);		
			}
			
			if (debug) {System.out.println(" append the examples:");}
			
			for (ArrayList<String> extraTuple: examplesTable.tuples) {
				ArrayList<String> tuple = new ArrayList<String>(t.arity());
				tuple.addAll(inputTuple);
				tuple.addAll(extraTuple);
				// add only negative examples of target!
				if (!projectedTable.contains(tuple)) {
					t.insertDistinct(tuple);
				}
			}
			
			// set the negative scaling factor:
			int selectedNegativeExamples = t.size() - selectedPositiveExamples;
			if (selectedNegativeExamples > 0) {
				double negativeExampleCount = 1;
				for (SemanticType st: typeSignature) { negativeExampleCount *= st.cardinality(dbCon); }
		        negativeExampleCount -= positiveExampleCount;
		        if (negativeExampleCount > 0) {
		        	negativeScaling = (double) selectedNegativeExamples / negativeExampleCount;
		        }
		    }
	    	
		}
		
		// check for any equated head variables
		Term[] headTerms = c.terms.firstElement();
		for (int i=0; i<target.arity; i++) {
			Term term = headTerms[i];
			if (term!=null) {
				if (term.isConstant) {
					System.err.println("Error in EvaluatorImpl1.createClauseInput(): System currently cannot evaluate clauses containing constants in the head."); 
					// NEED TO DEAL WITH CONSTANTS!!!!!!
					System.exit(9);
				}
				else {
					// equated head variables -> need to extend the table horizontally
					//   change the metadata:
					t.colNames.add(targetTable.colNames.get(i));
					t.colTypes.add(targetTable.colTypes.get(i));
					//   and the data (by extending each tuple):
					for (ArrayList<String> tuple: t.tuples) {
						tuple.add(tuple.get(term.pos));
					}
				}
			}
		}
		
		//System.out.println("\n INPUT TABLE: "); t.print(); System.out.println();
		
		return t;
		
	}
	
}
