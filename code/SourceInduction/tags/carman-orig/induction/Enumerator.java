package induction;

import java.util.ArrayList;
import domain.Clause;
import domain.Domain;

public abstract class Enumerator {
	
	public boolean debug = false;
	
	// the descriptions of available predicates, etc.
	public Domain domain;
	
	// requirements on conjunctive queries produced:
	public int maxClauseLength;		// monotonic
	public int maxPredRepitition;	// monotonic
	public int maxVarLevel;					
	public boolean noVarRepetition; // default: no repetition of vars within literal except head
	public String heuristic;
	
	public Enumerator(Domain domain,
					  int maxClauseLength,
					  int maxPredRepitition,
					  int maxVarLevel,
					  boolean noVarRepetition,
					  String heuristic,
					  boolean debug) {
		this.domain 			= domain;
		this.maxClauseLength 	= maxClauseLength;
		this.maxPredRepitition 	= maxPredRepitition;
		this.maxVarLevel 		= maxVarLevel;
		this.noVarRepetition 	= noVarRepetition;
		this.heuristic			= heuristic;
		this.debug	 			= debug;
	}

	public Clause firstClause() { return new Clause(); }
	
	public abstract ArrayList<Clause> expand(Clause node);
	
	public abstract ArrayList<Clause> constrain(Clause node);
	public abstract ArrayList<Restriction> constrain2(Clause node);

	public void test(int count) {
		ArrayList<Clause> queue = new ArrayList<Clause>();
		queue.add(firstClause());
		int i=0;
		while (queue.size()>0 && i<count) {
			for (Clause c: expand(queue.remove(0))) {
				System.out.println(i+": "+c.toString());
				queue.add(c);
				i++;
				if (i==count) { break; }
			}
		}
	}
	
}
