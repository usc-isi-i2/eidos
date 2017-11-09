package evaluation;

import java.util.ArrayList;

import relational.Table;
import relational.DBConnection;

import domain.Clause;
import domain.Predicate;
import domain.SemanticType;

import induction.Restriction;

/*
 * complete remake
 */



public class Evaluator2 {
	
	private boolean debug;
	
	DBConnection dbCon;
	String 		 dbName;
	
	public Evaluator2(DBConnection db, String dbName, boolean debug) {
		this.dbCon = db;
		this.dbName = dbName;
		this.debug = debug;
	}	
	
	public Evaluation evaluateRestriction(Evaluation e, Restriction r) {
		
		double start = System.currentTimeMillis();
		
		Evaluation e1 = new Evaluation();
		e1.clause = r.updatedClause;
		
		if (debug) { System.out.println("\n evaluating restriction: ("+r.updatedClause.toString()+"):\n c = "+r.updatedClause.toStringDebug()+"\n");}

		int count = 0;
		double totalFitness = 0.0;
		double missingDomains = missingDomains(e1.clause);
		
		for (int i=0; i<e.targetTables.size(); i++) {	
			
			Table targetTable    = e.targetTables.get(i);
			
			// update candidate table with new restricion:
			Table candidateTable = applyRestriction(r,e.candidateTables.get(i));
			
			// non distinct projection
			Table commonTable = targetTable.outerIntersection(candidateTable);
			
	        int numCandidateTuples = candidateTable.size();
	        int numTargetTuples = targetTable.size(); 
	        int numCommonTuples = commonTable.size();
	        
	        double posScaling = 1.0;
	        double totScaling = 1.0;
	        
	        // calculate fitness of candidate definition
			if (numTargetTuples == 0 && numCandidateTuples == 0){
				// do nothing!
				;
			}
			else {
				double fitness = (numCommonTuples * posScaling) /(numTargetTuples  + (numCandidateTuples * missingDomains * totScaling) - (numCommonTuples * posScaling));
				totalFitness += fitness;
				count++;
			}
			
			e1.targetTables.add(targetTable);
			e1.candidateTables.add(candidateTable);
			
		}
			
		e1.score = totalFitness / count;
		
		System.out.println("Evaluation time = "+(System.currentTimeMillis()-start)+" ms");
		
		return e1;
        
	}
	
	public Table applyRestriction(Restriction r, Table t) {
		Table t2 = new Table();
		int index1 = t.colNames.indexOf(r.variable.toString());
		int index2 = t.colNames.indexOf(r.variable2.toString());
		SemanticType type = t.colTypes.get(index1);
		t2.colNames.addAll(t.colNames);
		t2.colNames.remove(index2);
		t2.colTypes.addAll(t.colTypes);
		t2.colTypes.remove(index2);
		for (ArrayList<String> tuple: t.tuples) {
			if (type.areEqual(tuple.get(index1),tuple.get(index2))) {
				ArrayList<String> tuple2 = new ArrayList<String>();
				tuple2.addAll(tuple);
				tuple2.remove(index2);
				t2.insert(tuple2);
			}
		}
		return t2;
	}
	
	public double missingDomains(Clause c) {
		// compensate for missing output values (missing negative examples)
		double penalty = 1.0;
		Predicate headPred = c.preds.firstElement();
		boolean[] varsInBody = c.varsInBody();
		for (int i=0; i<headPred.arity; i++) {
			if (!headPred.bindings[i] && !varsInBody[i]) {
				penalty *= headPred.types[i].cardinality(dbCon);
			}
		}
		return penalty;
	}
	
}
