package domain;

import java.util.ArrayList;

public class Predicate {
    
	// different predicate categories:
	public static final int SOURCE = 0;
	public static final int DOMAIN = 1;
	public static final int COMPARISON = 2;
	public static final int FUNCTION = 3;
	
	public String name;
	public SemanticType[] types;
	public boolean[] bindings;
	public String[] labels;
	public int arity;
	public int category;
	public String[] endpoint;
	public String dbTable;
	public Clause definition;
	
	public ArrayList<Integer> inputIndices;
	
	//	 Create a new instance of Predicate 
    public Predicate(String name, SemanticType[] types, boolean[] bindings, String[] labels) {
        this.name = name;
        this.arity = types.length;
        this.types = types;
        this.bindings = bindings;
        if (bindings == null) {
            this.bindings = new boolean[arity];
        }
        this.labels = labels;
        this.dbTable = name;
        this.definition = null;
        // record the input signature for the predicate
    	this.inputIndices   = new ArrayList<Integer>();
        for (int i=0; i<this.arity; i++) {
    		if (this.bindings[i]) {
    			this.inputIndices.add(i);
    		}
    	}
    }
    
    private ArrayList<SemanticType> typesAsList = null; 
	public ArrayList<SemanticType> typesAsList() {
		if (typesAsList == null) {
			typesAsList = new ArrayList<SemanticType>();
			for (SemanticType t: types) { 
				typesAsList.add(t); 
			}
		}	
		return typesAsList;
	}
	
	private ArrayList<SemanticType> inputSignature = null;
	public ArrayList<SemanticType> inputSignature() {
		if (inputSignature == null) {
			inputSignature = new ArrayList<SemanticType>();
			for (int i: inputIndices) {
				inputSignature.add(types[i]);
			}
		}
		return inputSignature;
	}
    
    public String toString() {
    	String s = name + "(";
        for (int i=0; i<arity; i++) {
        	if (i!=0) { s += ","; }
        	if (bindings[i]) { s += "$"; }
        	s += types[i].name;
        }
        return s + ")";
    }
    
}
