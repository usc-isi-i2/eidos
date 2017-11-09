package domain;


public class Term {
	
	// for repeated variables or constants, we record the first position it occurs in clause
	public final int lit; // literal index
	public final int pos; // position in literal

	// for fixed value constants, will need to store value
	public final boolean isConstant;
	public final String val;
	
	// straightforward constructor
	public Term(int lit, int pos) {
		this(lit,pos,false,null);
	}
	
	// alternative constructor for a constant
	public Term(String constantVal) {
		this(0,0,true,constantVal);
	}
	
	// actual constructor just assigns vars
	private Term(int lit, int pos, boolean isConstant, String val) {
		this.lit = lit;
		this.pos = pos;
		this.isConstant = isConstant;
		this.val = val;
	}
	
	// simplify cloning
	public Term copy() {
		return new Term(lit, pos, isConstant, val);
	}
	
	// check equality
	public boolean equals(Object o) {
		if (o==null) {
			return false;
		}
		if (!o.getClass().equals(Term.class)) {
			return false;
		}
		Term t = (Term) o;
		if (isConstant) {
			return (t.isConstant && t.val.equals(val)); 
		}
		else {
			return (!t.isConstant && t.lit==lit && t.pos==pos);
		}
	}
	
	public String toString() {
		if (isConstant) {
			return "'" + val + "'";
		}
		else {
			return "<" + lit + "," + pos + ">";
		}
	}

	public static Term[] copyArray(Term[] t) {
		Term[] t1 = new Term[t.length];
		for (int j=0; j<t.length; j++) {
			if (t[j] != null) {
				t1[j] = t[j].copy();
			}
		}
		return t1;
	}

}
