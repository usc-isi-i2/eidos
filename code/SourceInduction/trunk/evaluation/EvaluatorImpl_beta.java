package evaluation;

import induction.Restriction;

import java.util.ArrayList;

import relational.Table;
import relational.DBConnection;

import domain.Clause;
import domain.Predicate;
import domain.SemanticType;
import domain.Term;


/*
 * new efficient implementation
 * 
 */



public class EvaluatorImpl_beta extends Evaluator {
	
	private int sampleCount1 = 20;
	private int sampleCount2 = 20;
	private boolean debug;
	
	// these global variables are a hack:
	//  need to pass it between methods correctly
	private double posScaling;
	private double totScaling;
	
	private Predicate target = null;
	private Table targetInput = null;
		
	private boolean minimize; 
	// flag determines whether or not all clauses are tested with the same input
	// and how much the system reuses source invocations ....
	// .... setting this flag should lead to faster induction, but may also cause a degredation in quality of the definitions produced.
	
	public EvaluatorImpl_beta(DBConnection db, String dbName, boolean debug, int count1, int count2, boolean minimizeInvocations) {
		super(db,dbName);
		this.debug = debug;
		sampleCount1 = count1;
		sampleCount2 = count2;
		minimize = minimizeInvocations;
	}	
	
	public Evaluation evaluate(Clause c) {
		
		double start = System.currentTimeMillis();
		
		Evaluation e = new Evaluation();
		e.clause = c;
		
		if (debug) { System.out.println("\n evaluate("+c.toString()+"):\n c = "+c.toStringDebug()+"\n");}
		
		double totalFitness = 0.0;
		double missingDomains = c.missingDomains(dbCon);
		
		if (c.head()!=target || !minimize) {
			target = c.head();
			targetInput = selectTargetInput(target,sampleCount1);
			targetInput.print();
		}
		
		int count = 0;
		
		for (ArrayList<String> inputTuple: targetInput.tuples) {	
			
			// preset scaling factors - they are updated by the createClauseInput method
			posScaling = 1.0;
			totScaling = 1.0;
			
			Table targetTable = dispatcher.invoke(target,inputTuple).renameColumns(targetColumns(target.arity));
			Table candidateTable = execute(c, createClauseInput(c, inputTuple, targetTable, sampleCount2));
			// USES NON DISTINCT PROJECTION OVER targetTable 
			Table commonTable = targetTable.outerIntersection(candidateTable);
			
	        int numCandidateTuples = candidateTable.size();
	        int numTargetTuples = targetTable.size(); 
	        int numCommonTuples = commonTable.size();
	        
	        if (debug) { 
				System.out.println("\n inputTuple      = ["+Table.listToString(inputTuple)+"]"); 
				System.out.println("posScaling         = "+posScaling); 
				System.out.println("totScaling         = "+totScaling); 
				System.out.println("missingDomains     = "+missingDomains); 
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
				double fitness = (numCommonTuples * posScaling) /(numTargetTuples  + (numCandidateTuples * missingDomains * totScaling) - (numCommonTuples * posScaling));
				System.out.println("fitness = ("+numCommonTuples+" * "+posScaling+") /("+numTargetTuples+"  + ("+numCandidateTuples+" * "+missingDomains+" * "+totScaling+") - ("+numCommonTuples+" * "+posScaling+")) = "+fitness);
				totalFitness += fitness;
				count++;
			}
			
			e.targetTables.add(targetTable);
			e.candidateTables.add(candidateTable);
			
		}
			
        
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
			posScaling = (double) positiveExampleCount / (double) selectedPositiveExamples;
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
				examplesTable = Utils.generateExamples(dbCon,typeSignature,count);		
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
			
			// set the total scaling factor:
			int selectedExamples = t.size();
			double totalPossible = 1;
			for (SemanticType st: typeSignature) { totalPossible *= st.cardinality(dbCon); }
	      	totScaling = totalPossible / (double) selectedExamples;
	    	
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
	
	
	
	
	
	
	
	
	
	
	public Evaluation evaluateRestriction(Evaluation e, Restriction r) {
		
		double start = System.currentTimeMillis();
		
		Evaluation e1 = new Evaluation();
		e1.clause = r.updatedClause;
		
		if (debug) { System.out.println("\n evaluating restriction: ("+r.updatedClause.toString()+"):\n c = "+r.updatedClause.toStringDebug()+"\n");}

		int count = 0;
		double totalFitness = 0.0;
		double missingDomains = e1.clause.missingDomains(dbCon);
		
		for (int i=0; i<e.targetTables.size(); i++) {	
			
			double posScaling = 1.0;
	        double totScaling = 1.0;
	        			
			Table targetTable    = e.targetTables.get(i);
			
			Table candidateTable = e.candidateTables.get(i);
			
			// update candidate table with new restriction:
			if (candidateTable.colNames.indexOf(r.variable.toString())!=-1) {
				candidateTable = applyRestriction(r,candidateTable);
			}
			else {
				// select values for new attribute from positive and negative values of source:
				
				// for the moment do negative only:
				SemanticType type = target.types[r.variable.pos];
				ArrayList<String> negExamples = type.getExamples(sampleCount2,dbCon);
				candidateTable = append(candidateTable,r.variable.toString(),type,negExamples);
				
				// calculate totScaling value:
				ArrayList<Integer> sampledAttributes = sampledAttributes(e1.clause);
				double domainSize = 1.0;
				ArrayList<String> attributeNames = new ArrayList<String>();
				for (int a: sampledAttributes) {
					domainSize *= target.types[a].cardinality(dbCon);
					attributeNames.add((new Term(0,a)).toString());
				}
				int totCount = candidateTable.distinctProjection(attributeNames).size();
				totScaling = domainSize / (double) totCount;
			}
			
			// non distinct projection
			Table commonTable = targetTable.outerIntersection(candidateTable);
			
	        int numCandidateTuples = candidateTable.size();
	        int numTargetTuples = targetTable.size(); 
	        int numCommonTuples = commonTable.size();
	        
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
				t2.tuples.add(tuple2);
			}
		}
		return t2;
	}
	
	public Table append(Table t, String colName, SemanticType colType, ArrayList<String> vals) {
		Table out = new Table();
		out.colNames.addAll(t.colNames);
		out.colNames.add(colName);
		out.colTypes.addAll(t.colTypes);
		out.colTypes.add(colType);
		if (t.size()>0) {
			if (t.size()>vals.size()) {
				int i=0;
				for (ArrayList<String> tuple: t.tuples) {
					ArrayList<String> tuple2 = new ArrayList<String>();
					tuple2.addAll(tuple);
					tuple2.add(vals.get((i++)%vals.size()));
					out.tuples.add(tuple2);
				}
			}
			else {
				int i=0;
				for (String val: vals) {
					ArrayList<String> tuple2 = new ArrayList<String>();
					tuple2.addAll(t.tuples.get((i++)%t.size()));
					tuple2.add(val);
					out.tuples.add(tuple2);
				}
			}
		}
		return t;
	}
	
	ArrayList<Integer> sampledAttributes(Clause c) {
		//	returns any OUTPUT ATTRIBUTES of the new source 
		//  that are INPUT ATTRIBUTES to the clause 
		//  (i.e. are not bound by the first predicate involving them)
		ArrayList<Integer> sampledAttributes = new ArrayList<Integer>();
		for (int i: c.clauseInputs()) {
			if (!target.bindings[i]) {
				sampledAttributes.add(i);
			}
		}
		return sampledAttributes;
	}
	
}
