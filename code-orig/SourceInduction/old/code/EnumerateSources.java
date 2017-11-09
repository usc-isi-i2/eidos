package induction;

import java.util.ArrayList;

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
 *   
 *  NOTE: search does not produce any candidates in which
 *  two output variables are equated (unless they are both
 *  equated to an input)  
 *   
 *  Version 3:
 *    - code for constants removed
 *    - simplified specialiseLastLiteral method (now not recursive)
 *    - added restriction: no variable repetition in any literal except head:
 *  			boolean noVarRepetition = true;
 *   
 *   
 */

public class EnumerateSources extends Enumerator {

	
	public EnumerateSources(Domain domain) {
		super(domain);
	}

	
	public EnumerateSources(Domain domain,
			  					 int maxClauseLength,
			  					 int maxPredRepitition,
			  					 int maxVarLevel,
			  					 int maxConstantCount,
			  					 boolean noVarRepetition,
			  					 boolean debug) {
		super(domain, maxClauseLength, maxPredRepitition, maxVarLevel, maxConstantCount, noVarRepetition, debug);
	}

	public Clause firstClause(Domain d) {
		return new Clause();
	}
	

	public ArrayList<Clause> expandNode(Clause node) {
		
		if (node.preds.size() <= maxClauseLength) {
			// add a new predicate & filter the clauses 
			ArrayList<Clause> distinctClauses = new ArrayList<Clause>();
			for (Clause clause: addNewLiteral(node)) {
				if (!distinctClauses.contains(clause)) {
					distinctClauses.add(clause);
				}
			}
			if (debug) {
				System.out.println(" > Generated "+distinctClauses.size()+" distinct candidates:");
				System.out.println(" ***********************************************************");
				for (Clause c: distinctClauses) { System.out.println(c.toString()); } 
				System.out.println();
			}
			
			return distinctClauses;
		}	
		
		return new ArrayList<Clause>();
	}
	
	
	private ArrayList<Clause> addNewLiteral(Clause node) {
		
		ArrayList<Clause> extendedClauses = new ArrayList<Clause>();
		if (node.preds.isEmpty()) {
			// add head literal
			Predicate target = domain.target;
			Clause emptyClause = node.copy();
			emptyClause.preds.add(target);
			emptyClause.terms.add(new Term[target.arity]);
			extendedClauses.add(emptyClause);
			// get specialisations of the head literal
			ArrayList<Clause> possibleClauses = addPredicate(node,target);
			// remove candidates where output variables have been equated (not very efficient implementation!)
			for (int i=0; i<possibleClauses.size(); i++) {
				Term[] termArray = possibleClauses.get(i).terms.elementAt(0);
				for (int j=0; j<termArray.length; j++) {
					if (!target.bindings[j] && termArray[j]!=null && !termArray[j].isConstant) {
						if (!target.bindings[termArray[j].pos]) {
							possibleClauses.remove(i);
							i--;
							break;
						}
					}
				}
			}
			extendedClauses.addAll(possibleClauses);
		}
		else {
			// cycle over source predicates
			for (Predicate pred: domain.sources) {
				if (node.count(pred) < maxPredRepitition) {
					extendedClauses.addAll(addPredicate(node,pred));
				}
			}
			// and comparison predicates 
			for (Predicate pred: domain.comparisons) {
				if (node.count(pred) < maxPredRepitition) {
					extendedClauses.addAll(addPredicate(node,pred));
				}	
			}
			
		}
		return extendedClauses;
	}

	
	private ArrayList<Clause> addPredicate(Clause node, Predicate pred) {
		
		// generate all (reasonable) configurations for variables:
		ArrayList<Term[]> configurations = new ArrayList<Term[]>();
		configurations.add(new Term[pred.arity]);
		
		// cycle over variables in the last literal:
		for (int pos=0; pos<pred.arity; pos++) {
			
			ArrayList<Term[]> previousConfigs = configurations;
			configurations = new ArrayList<Term[]>();
			
			// find all possible variables of this type to equate to:
			// NOTE: implicit language bias here preventing definitions of the form:
			//     head(A,B,C) :- pred(X,X,A).
			// while still allowing definitions of form:
			//     head(A,B,C) :- pred(B,B,A).
			ArrayList<Term> possibleTerms = findVariables(node,pred.types[pos]);
			
			// add new terms to each of the configurations generated so far
			for (Term[] config: previousConfigs) {
				// executability check:
				if (!pred.bindings[pos]) {
					configurations.add(config);
				}
				for (Term term: possibleTerms) {
					// check for repeated term
					if (!noVarRepetition || !containsTerm(config,term,pos)) {
						Term[] copy = copyArray(config);
						copy[pos] = term;
						configurations.add(copy);
					}	
				}
			}
			
		}
		
		// remove first Term[] if it is all nulls 
		if (!configurations.isEmpty() && allNulls(configurations.get(0))) {
			configurations.remove(0); 
		}
		
		ArrayList<Clause> clauses = new ArrayList<Clause>();
		for (Term[] config: configurations) {
			Clause copy = node.copy();
			copy.preds.add(pred);
			copy.terms.add(config);
			// this needs to be made more efficient:
			if (!copy.isSymmetric() 
				&& !copy.isReducable() 
				&& copy.maxLevel()<=maxVarLevel) {
				
				clauses.add(copy);
			}
		}
		
		return clauses;
		
	}
	
	
	private ArrayList<Term> findVariables(Clause node, SemanticType type) {
		ArrayList<Term> possibleTerms = new ArrayList<Term>();
		for (int i=0; i<node.terms.size(); i++) {
			Predicate pred 	 = node.preds.elementAt(i);
			Term[] termArray = node.terms.elementAt(i);
			for (int j=0; j<pred.arity; j++) {
				if (type == pred.types[j] && (termArray[j] == null || termArray[j].isConstant)) {
					possibleTerms.add(new Term(i,j));
				}
			}
		}	
		return possibleTerms;
	}
	
	private Term[] copyArray(Term[] array) {
		Term[] copy = new Term[array.length];
		for (int i=0; i<array.length; i++) {
			copy[i] = array[i];
		}
		return copy;
	}
	
	private boolean containsTerm(Term[] array, Term term, int pos) {
		for (int i=0; i<pos; i++) {
			if (term.equals(array[i])) {
				return true;
			}
		}
		return false;
	}
	
	private boolean allNulls(Term[] array) {
		for (Term t: array) {
			if (t!=null) {
				return false;
			}
		}
		return true;
	}
	

}	
