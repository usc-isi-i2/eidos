package induction;

import java.util.Vector;
import domain.*;



// FOIL like generation of candidates - redundant search!

public class EnumerateDomainPreds1 extends Generator {

	public EnumerateDomainPreds1(Domain domain) {
		super(domain);
	}

	public EnumerateDomainPreds1(Domain domain,
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
		Vector<Clause> filteredOutput = new Vector<Clause>();
		Vector<Clause> output = generateNodes(node);
		for (Clause c: output) {
			int maxLevel = c.maxLevel();
			if (!filteredOutput.contains(c)
				&& maxLevel <= maxVarLevel 
				&& maxLevel <= c.preds.size() 
				&& c.isExecutable() 
				&& c.reformulate(domain).firstElement().isExecutable()) {
				filteredOutput.add(c);
			}
		}
		return filteredOutput;
	}
	
	
	private Vector<Clause> generateNodes(Clause node) {
		
		System.out.println("Expanding: "+node.toString());
		
		Vector<Clause> tested = new Vector<Clause>();
		Vector<Clause> output = new Vector<Clause>();
		
		Term[] t = node.terms.lastElement();
		// cycle over variables in the term:
		for (int pos=0; pos<t.length; pos++) {
			// check variable is not already equated to previous variable
			if (t[pos] == null) {
				SemanticType type = node.preds.lastElement().types[pos];
				// equate with a previous variable
				for (int i=0; i<node.terms.size(); i++) {
					Term[] t2 = node.terms.elementAt(i);
					int maxJ = t2.length;
					if (i==node.terms.size()-1) { maxJ = pos; }
					for (int j=0; j<maxJ; j++) {
						if (type == node.preds.elementAt(i).types[j] && (t2[j] == null || t2[j].isConstant)) {
							Clause copyOfNode = node.copy();
							copyOfNode.terms.lastElement()[pos] = new Term(i,j);
							if (!tested.contains(copyOfNode)) {
								tested.add(copyOfNode);
								if (copyOfNode.makesSense() && copyOfNode.hasReformulation(domain)) {
									output.add(copyOfNode);
								}
							}
						}	
					}
				}
				// or add a new constant
				if (node.countConstants() < this.maxConstantCount && t[pos] == null) {
					Clause copyOfNode = node.copy();
					copyOfNode.terms.lastElement()[pos] = new Term(null);
					if (!tested.contains(copyOfNode)) {
						tested.add(copyOfNode);
						if (copyOfNode.makesSense() && copyOfNode.hasReformulation(domain)) {
							output.add(copyOfNode);
						}
					}
				}
			}
		}
		
		// add a new predicate
		if (node.preds.size() - 1 < maxClauseLength) {
			// cycle over domain predicates
			for (int i=0; i<domain.relations.size(); i++) {
				Predicate pred = domain.relations.elementAt(i);
				if (node.occurs(pred) < maxPredRepitition) {
					// over each position in the predicate
					for (int j=0; j<pred.arity; j++) {
						SemanticType type = pred.types[j];
						// over all previous literals (head and body)
						for (int k=0; k<node.preds.size(); k++) {
							Predicate pred2 = node.preds.elementAt(k);
							Term[] t2 = node.terms.elementAt(k);
							// over all variables in each literal
							for (int l=0; l<pred2.arity; l++) {
								// check that they are the same type 
								if (pred2.types[l] == type) {
									// and that the variable hasn't already been equated
									if (t2[l]==null || t2[l].isConstant) {
										Term[] t3 = new Term[pred.arity];
										t3[j] = new Term(k,l);
										Clause copyOfNode = node.copy();
										copyOfNode.preds.add(pred);
										copyOfNode.terms.add(t3);
										if (copyOfNode.makesSense() && copyOfNode.hasReformulation(domain)) {
											output.add(copyOfNode);
										}
									}
								}
							}
						}
					}	
				}	
			}
			if (node.isOutputSafe()) {
				// do same for comparison predicates 
				for (int i=0; i<domain.comparisons.size(); i++) {
					Predicate pred = domain.comparisons.elementAt(i);
					if (node.occurs(pred) < maxPredRepitition) {
						// over each position in the predicate
						for (int j=0; j<pred.arity; j++) {
							SemanticType type = pred.types[j];
							// over all previous literals (head and body)
							for (int k=0; k<node.terms.size(); k++) {
								Predicate pred2 = node.preds.elementAt(k);
								Term[] t2 = node.terms.elementAt(k);
								// over all variables in each literal
								for (int l=0; l<pred2.arity; l++) {
									// check that they are the same type 
									if (pred2.types[l] == type) {
										// and that the variable hasn't already been equated
										if (t2[l]==null || t2[l].isConstant) {
											Term[] t3 = new Term[pred.arity];
											t3[j] = new Term(k,l);
											Clause copyOfNode = node.copy();
											copyOfNode.preds.add(pred);
											copyOfNode.terms.add(t3);
											if (copyOfNode.makesSense() && copyOfNode.hasReformulation(domain)) {
												output.add(copyOfNode);
											}
										}
									}	
								}
							}
						}	
					}	
				}
			}
		}
		return output;
	}
	
	
}
