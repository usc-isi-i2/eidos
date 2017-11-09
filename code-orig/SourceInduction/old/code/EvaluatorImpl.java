package evaluation;

import java.util.Random;
import java.util.ArrayList;

import relational.Table;
import relational.DBConnection;

import domain.Clause;
import domain.Predicate;
import domain.SemanticType;
import domain.Term;


public class EvaluatorImpl extends Evaluator {
	
	private int sampleCount1 = 20;
	private int sampleCount2 = 20;
	private boolean debug;
	
	// these global variables are a hack:
	//  need to pass it between methods correctly
	private double positiveScaling;
	private double negativeScaling;
	
	public EvaluatorImpl(DBConnection db, String dbName, boolean debug, int count1, int count2) {
		super(db, dbName);
		this.debug = debug;
		sampleCount1 = count1;
		sampleCount2 = count2;
	}	
	
	public double evaluateCandidate(Clause candidate) {
		
		double start = System.currentTimeMillis();
		double result = evaluate(candidate);
		System.out.println("Evaluation time = "+(System.currentTimeMillis()-start)+" ms");
		// bias towards shorter clauses by multiplying result by 0.95^(clause_length) 
		for (int i=0; i<candidate.preds.size(); i++) { result *= 0.9; }
		return result;
		
	}		

	public double outputPenalty(Clause c) {
		// compensate for missing output values (missing negative examples)
		double penalty = 1.0;
		Predicate headPred = c.preds.firstElement();
		boolean[] varsInBody = c.varsInBody();
		for (int i=0; i<headPred.arity; i++) {
			if (!headPred.bindings[i] && !varsInBody[i]) {
				penalty /= headPred.types[i].cardinality(dbCon);
			}
		}
		return penalty;
	}

	//////////////////////////////////////////////////
	// private methods
	
	private double evaluate(Clause c) {
		
		if (debug) { System.out.println("\n evaluate("+c.toString()+"):\n c = "+c.toStringDebug()+"\n");}
		
		double totalFitness = 0.0;
		
		Table targetInput = createTargetInput(c.head(),sampleCount1);
		
		int count = 0;
		
		for (ArrayList<String> inputTuple: targetInput.tuples) {	
			
			// preset scaling factors - they are updated by the createClauseInput method
			positiveScaling = 1.0;
			negativeScaling = 1.0;
			
			Table targetTable = invoke(c.head(),inputTuple).renameColumns(targetColumns(c.head().arity));
			Table candidateTable = execute(c, createClauseInput(c, inputTuple, targetTable, sampleCount2));
			// USES NEW OURTERINTERSECTION FUNCTION WHICH DOESN'T PERFORM DISTINCT PROJECTION OVER targetTable 
			Table commonTable = targetTable.outerIntersection(candidateTable);
			
	        int numCandidateTuples = candidateTable.size();
	        int numTargetTuples = targetTable.size(); 
	        int numCommonTuples = commonTable.size();
	        
	        if (debug) { 
				System.out.println("\n inputTuple = ["+Table.listToString(inputTuple)+"]"); 
				System.out.println("positiveScaling = "+positiveScaling); 
				System.out.println("negativeScaling = "+negativeScaling); 
				System.out.println("numTargetTuples = "+numTargetTuples); 
				System.out.println("numCandidateTuples = "+numCandidateTuples); 
				System.out.println("numCommonTuples = "+numCommonTuples); 
			}
	        
	        // calculate fitness of candidate definition
			double fitness = -1;
	        
			if (numTargetTuples == 0 && numCandidateTuples == 0){
				// do nothing!
				;
			}
			else {
				//totalFitness += 2.0 * numCommonTuples /(numTargetTuples * positiveScaling + numCandidateTuples);
				fitness = 2.0 * numCommonTuples /(numTargetTuples * positiveScaling + numCandidateTuples/negativeScaling);
				if (debug) {
					System.out.println("fitness = 2.0 * numCommonTuples /(numTargetTuples * positiveScaling + numCandidateTuples/negativeScaling)");
					System.out.println("        = 2.0 * "+numCommonTuples+" /("+numTargetTuples+" * "+positiveScaling+" + "+numCandidateTuples+" / "+negativeScaling+")");
					System.out.println("        = "+fitness);
				}
				totalFitness += fitness;
				count++;
			}
			
		}
			
        return outputPenalty(c) * totalFitness / count;
        
	}
	
	private Table createTargetInput(Predicate p, int count) {
		// method gets input tuples and guarantees that at least half of them 
		//   are positive (return values when used to invoke target predicate)
		Table t1 = dbCon.randomSubset(dbName+".InvocationsOf_"+p.dbTable,count, false);
		Table t2 = dbCon.randomSubset(dbName+"."+p.dbTable, t1.colNames,(count+1)/2, true);
		for (int i=0; t2.size()<count && i<t1.tuples.size(); i++) {
			t2.insert(t1.tuples.get(i));
		}
		// set column types
		t2.colTypes = new ArrayList<SemanticType>(p.inputSignature()); 
		return t2;
	}
	
	private Table createClauseInput(Clause c, ArrayList<String> inputTuple, Table targetTable, int max) {
		
		Table t = new Table();
		
		Term[] headTerms = c.terms.firstElement();
		for (int i=0; i<c.head().arity; i++) {
			if (c.head().bindings[i]) {
				t.colNames.add((new Term(0,i)).toString());
				t.colTypes.add(c.head().types[i]);
			}
		}
		
		// check if any OUTPUT VARIABLES appear in the body but
		//  are not bound by (are input to) the first predicate involving them
		ArrayList<SemanticType> typeSignature = new ArrayList<SemanticType>();
		for (int i=0; i<c.head().arity; i++) {
			if (!c.head().bindings[i]) {
				int[] location = c.firstOccurs(i);
				//if (location != null && i==3) {	System.out.println("c.preds.elementAt("+location[0]+").bindings["+location[1]+"] = " + c.preds.elementAt(location[0]).bindings[location[1]]);}
				if (location != null && c.preds.elementAt(location[0]).bindings[location[1]]) {
					t.colNames.add((new Term(0,i)).toString());
					t.colTypes.add(c.head().types[i]);
					typeSignature.add(c.head().types[i]);
				}
			}
		}
		
		
		// get some (minimum half) of the examples from the targetTable (output of the known predicate) 
		Table projectedTable = targetTable.select(t.colNames);
		
		int positiveExampleCount = projectedTable.size();
		
		while (t.size()<(max+1)/2 && projectedTable.size()>0) {
			t.insert(projectedTable.tuples.remove((new Random()).nextInt(projectedTable.size())));
		}
		
		int selectedPositiveExamples = t.size();
		
		// set the positive scaling factor:
		if (selectedPositiveExamples > 0) {
			positiveScaling = (double) selectedPositiveExamples / (double) positiveExampleCount;
		}
		
		Table examplesTable = generateExamples(typeSignature, max-t.size());		
		for (ArrayList<String> extraTuple: examplesTable.tuples) {
			ArrayList<String> tuple = new ArrayList<String>(t.colNames.size());
			for (String val: inputTuple) { tuple.add(val); }
			for (String val: extraTuple) { tuple.add(val); }
			// add only negative examples of target
			if (!projectedTable.contains(tuple)) {
				t.insert(tuple);
			}
		}
		
		// set the negative scaling factor:
		int selectedNegativeExamples = t.size() - selectedPositiveExamples;
		if (selectedNegativeExamples > 0) {
			double negativeExampleCount = 1;
			for (SemanticType st: typeSignature) { negativeExampleCount *= st.cardinality(dbCon); }
	        negativeExampleCount -= positiveExampleCount;
	        negativeScaling = (double) selectedNegativeExamples / negativeExampleCount;
        }
    	
		// check for any equated head variables
		ArrayList<Integer> equatedIndices = new ArrayList<Integer>(); 
		for (int i=0; i<headTerms.length; i++) {
			Term term = headTerms[i];
			if (term!=null) {
				if (term.isConstant) {
					System.err.println("Error in EvaluatorImpl1.createClauseInput(): System currently cannot evaluate clauses containing constants in the head."); 
					// NEED TO DEAL WITH CONSTANTS!!!!!!
					System.exit(9);
				}
				else {
					// equated head variables
					t.colNames.add((new Term(0,i)).toString());
					t.colTypes.add(c.head().types[i]);
					equatedIndices.add(term.pos);
				}
			}
		}
		// extend tuples as required
		if (!equatedIndices.isEmpty()) {
			for (ArrayList<String> tuple: t.tuples) {
				for (int index: equatedIndices) {
					tuple.add(tuple.get(index));
				}
			}
		}
		
		//System.out.println("\n INPUT TABLE: "); t.print(); System.out.println();
		
		return t;
		
	}
	
	//////////////////////////////////////////////////
	// utility methods

	private ArrayList<String> targetColumns(int arity) {
		ArrayList<String> columns = new ArrayList<String>(arity);
		for (int i=0; i<arity; i++) {
			columns.add((new Term(0,i)).toString());
		}
		return columns;
	}
	
}
