package induction;

import java.util.Vector;
import domain.*;




/*
 * FOIL like generation of candidates
 * 
 * searches over space of source predicates
 * all candidates produced are:
 *   => reduced (well, sort of!)
 *   => executable
 *   => varLevel < maxVarLevel 
 *   => distinct (at least for each invocation)
 *   
 */

public class EnumerateSourcePreds1 extends Generator {

	
	public EnumerateSourcePreds1(Domain domain) {
		super(domain);
	}

	
	public EnumerateSourcePreds1(Domain domain,
			  					 int maxClauseLength,
			  					 int maxPredRepitition,
			  					 int maxVarLevel,
			  					 int maxConstantCount) {
		super(domain, maxClauseLength, maxPredRepitition, maxVarLevel, maxConstantCount);
	}

	public Clause firstClause(Domain d) {
		Vector<Predicate> preds = new Vector<Predicate>();
		preds.add(d.target);
		Vector<Term[]> terms = new Vector<Term[]>();
		terms.add(new Term[d.target.arity]);
		return new Clause(preds, terms);
	}
	

	public Vector<Clause> expandNode(Clause node) {
		
		Vector<Clause> newClauses = new Vector<Clause>();
		// specialise the last literal
		newClauses.addAll(specialiseLastLiteral(node));
		// or add a new predicate
		if (node.preds.size()-1 < maxClauseLength) {
			newClauses.addAll(addNewLiteral(node));
		}
		// filter the new clauses 
		Vector<Clause> distinctClauses = new Vector<Clause>();
		for (Clause clause: newClauses) {
			if (!distinctClauses.contains(clause)) {
				distinctClauses.add(clause);
			}
		}
		return distinctClauses;
		
	}
	
	
	private Vector<Clause> specialiseLastLiteral(Clause node) {
		
		Vector<Clause> specialisedClauses = new Vector<Clause>();
		
		Predicate pred1 = node.preds.lastElement();
		Term[] termArray1 = node.terms.lastElement();
		
		// cycle over variables in the last literal:
		for (int pos=0; pos<pred1.arity; pos++) {
			
			// check variable is not already equated to previous variable
			if (termArray1[pos] == null) {
				
				SemanticType type = pred1.types[pos];
				
				// equate with a previous variable
				for (int i=0; i<node.terms.size(); i++) {
					
					Predicate pred2 = node.preds.elementAt(i);
					Term[] termArray2 = node.terms.elementAt(i);
					
					for (int j=0; j<pred2.arity && (i!=node.terms.size()-1 || j<pos); j++) {
						if (type == pred2.types[j] && (termArray2[j] == null || termArray2[j].isConstant)) {
							Clause copyOfClause = node.copy();
							copyOfClause.terms.lastElement()[pos] = new Term(i,j);
							if (copyOfClause.makesSense() && !copyOfClause.isSymmetric()) {
								// check if last literal is specific enough
								if (copyOfClause.isReducable() || !copyOfClause.isExecutable() || copyOfClause.maxLevel()>maxVarLevel) {
									// call method recursively
									specialisedClauses.addAll(specialiseLastLiteral(copyOfClause));
								}
								else {
									specialisedClauses.add(copyOfClause);
								}
							}
						}	
					}
					
				}
				// or add a new constant
				if (node.countConstants()<this.maxConstantCount && termArray1[pos]==null) {
					Clause copyOfClause = node.copy();
					copyOfClause.terms.lastElement()[pos] = new Term(null);
					if (copyOfClause.makesSense() && !copyOfClause.isSymmetric()) {
						// check if last literal is specific enough
						if (copyOfClause.isReducable() || !copyOfClause.isExecutable() || copyOfClause.maxLevel()>maxVarLevel) {
							// call method recursively
							specialisedClauses.addAll(specialiseLastLiteral(copyOfClause));
						}
						else {
							specialisedClauses.add(copyOfClause);
						}
					}
				}

			}
		}
		
		return specialisedClauses;
		
	}

	
	private Vector<Clause> addNewLiteral(Clause node) {

		Vector<Clause> extendedClauses = new Vector<Clause>();
		// cycle over source predicates
		for (Predicate pred: domain.sources) {
			if (node.occurs(pred) < maxPredRepitition) {
				extendedClauses.addAll(addPredicate(node,pred));
			}
		}
		// and comparison predicates 
		for (Predicate pred: domain.comparisons) {
			if (node.occurs(pred) < maxPredRepitition) {
				extendedClauses.addAll(addPredicate(node,pred));
			}	
		}
		return extendedClauses;
	
	}

	
	private Vector<Clause> addPredicate(Clause node, Predicate pred) {
		
		Clause copyOfClause = node.copy();
		copyOfClause.preds.add(pred);
		copyOfClause.terms.add(new Term[pred.arity]);
		return specialiseLastLiteral(copyOfClause);
		
	}

}	
