package domain;

import java.io.FileInputStream;
import java.io.BufferedReader;

import java.util.*;

public class Domain {
    
    // mediated schema
	public ArrayList<SemanticType> types;
    public ArrayList<Predicate> relations;
	public ArrayList<Predicate> comparisons;
	
	// problem description
	public ArrayList<Predicate> sources;
	public ArrayList<Predicate> targets;
	public Predicate target;
    
	// metadata
	public String filename = null;
	
    // Creates a new instance of Domain 
    public Domain() {
        types       = new ArrayList<SemanticType>();
        relations   = new ArrayList<Predicate>();
        comparisons = new ArrayList<Predicate>();
        sources     = new ArrayList<Predicate>();
        targets     = new ArrayList<Predicate>();
    }
    
    // print out domain description
    public void print() {
    	System.out.println("##############################################################");
    	System.out.println("## PROBLEM DOMAIN DESCRIPTION: ");
    	if (filename!=null) {
    		System.out.println("## generated from file: "+filename);
    	}
        System.out.println();
        System.out.println("## Semantic Types: ");
        for (SemanticType s: types) {
            System.out.println("type " + s.toString());
        }
        System.out.println();
        System.out.println("## Domain Relations: ");
        for (Predicate p: relations) {
            System.out.println("relation " + p.toString());
        }
        System.out.println();
        System.out.println("## Comparison Predicates: ");
        for (Predicate p: comparisons) {
            System.out.println("comparison " + p.toString());
        }
        System.out.println();
        System.out.println("## Sources: ");
        for (Predicate p: sources) {
        	if (p.category == Predicate.SOURCE) {
                System.out.println("source " + p.definition.toStringI() + "\t{" + arrayToString(p.endpoint,";") + "}");
        	}
        	else if (p.category == Predicate.FUNCTION) {
        	    System.out.println("function " + p.definition.toStringI() + "\t{" + arrayToString(p.endpoint,";") + "}");
            }
        	else {
        		System.err.println("ERROR: unknown predicate type among sources!");
        	}
        }
        System.out.println();
        System.out.println("## Target Predicates: ");
        for (Predicate p: targets) {
            System.out.println("target " + p.toString() + "\t{" + arrayToString(p.endpoint,";") + "}");
        }
        System.out.println();
        System.out.println("##############################################################");
        
    }
    
    // parse Clause
	public Clause parseClause(String line) {
    	
		// first remove any "bound variable" flags:
		line = line.replaceAll("\\^b","").replaceAll("\\$","");
		
		Clause c = new Clause();
		
		Hashtable<String,Integer> appearedInLiteral = new Hashtable<String,Integer>();
    	Hashtable<String,Integer> appearedInPosition = new Hashtable<String,Integer>();
    	// split literals
    	String[] literals = line.replaceFirst(":-",",").split("\\)");
    	
    	// process each literal in turn:
    	for (int i=0; i<literals.length; i++) {
    		
    		String l = literals[i];
    		if (l.indexOf("(") == -1) { break; }
    		
    		// get the predicate
    		String predName = l.substring(0,l.indexOf("(")).replaceAll(","," ").trim();
    		Predicate p = lookupPredicate(predName);
    		c.preds.add(p);
    		
    		// get the vars
    		String[] vars = l.substring(l.indexOf("(")+1).split(",");
    		if (vars.length != p.arity) {
    			System.err.println("Error parsing clause: " + line);
    			System.err.println(" => literal: "+l.replaceFirst(","," ").trim()+") should have "+p.arity+" arguments!");
    			System.exit(9);
    		}
    		c.labels.add(vars);
    		
    		// compile the vars into an array of terms
    		Term[] termArray = new Term[p.arity];
	    	c.terms.add(termArray);
	    	for (int j=0; j<p.arity; j++) {
	    		String var = vars[j].trim();
	    		if (!var.equals("_")) {
	    			if (!appearedInLiteral.containsKey(var)) {
	    				appearedInLiteral.put(var,i);
	    				appearedInPosition.put(var,j);
	    				if (var.startsWith("\"")||var.startsWith("\'")) {
	    					String constantVal = var.substring(1,var.length()-1);
	    					if (constantVal.startsWith("#")) {
		    					// constant of unknown value
		    					termArray[j] = new Term(null);
		    				}
	    					else {
	    						// constant of known value
	    						termArray[j] = new Term(constantVal);
	    					}	
	    				}	
	    			}
	    			else {
	    				int lit = appearedInLiteral.get(var);
	    				int pos = appearedInPosition.get(var);
	    				// check variable is of the same type!
	    				SemanticType t1 = p.types[j];
	    				SemanticType t2 = c.preds.elementAt(lit).types[pos];
	    				if (t1!=null && !t1.equals(t2)) {
	    					if (t2==null) {
	    						c.preds.elementAt(lit).types[pos] = t1;
	    					}
	    					else {
	    						System.err.println("Error parsing clause: " + line);
	    		    			System.err.println(" => variable: '"+var+"' of type '"+t2.name+"' cannot appear in slot "+j+" of the predicate "+p.name+" as that slot takes variables of type '"+t1.name+"'");
	    		    			System.exit(9);
	    					}
	    				}
	    				termArray[j] = new Term(lit,pos);
	    			}	
	    		}
	    	}
	    	
	    }
    	return c;
    
	}	
    
	private ArrayList<SemanticType> producibleTypes = null;
	public ArrayList<SemanticType> producibleTypes() {
		if (producibleTypes == null) {
			producibleTypes = new ArrayList<SemanticType>();
			for (Predicate p: sources) {
				for (SemanticType s: p.types) {
					if (!producibleTypes.contains(s)) {
						producibleTypes.add(s);
					}
				}
			}
			//String s = "List of producible types: {"; for (SemanticType st: producibleTypes) { s += st.name + ", ";} System.out.println(s+"}");
		}
		return producibleTypes;
	}
	
   
    //////////////////////////////////////////////////////////////////////////////
    // Methods for parsing the input file

    private void importFile(String fname) {
    	
      	try {
    		// load the domain description from a file
        	FileInputStream in = new FileInputStream(fname);
        	BufferedReader br = new BufferedReader(new java.io.InputStreamReader(in));
        	String line;
        	int i = 0;
        	while ((line = br.readLine()) != null) {
        		i++;
        		if (line.indexOf("#")!=-1) { line = line.substring(0,line.indexOf("#")); }
        		line = line.replaceAll("\t"," ").trim();
        		if (line.startsWith("import ")) {
        			importFile(line.substring("import ".length()).trim());
        		}
        		else if (line.startsWith("type ")) {
        			addSemanticType(line.substring("type ".length()).trim());
        		}
        		else if (line.startsWith("relation ")) {
        			addRelation(line.substring("relation ".length()).trim());
        		}
        		else if (line.startsWith("comparison ")) {
        			addComparison(line.substring("comparison ".length()).trim());
        		}
        		else if (line.startsWith("source ")) {
        			addSource(line.substring("source ".length()).trim());
        		}
        		else if (line.startsWith("function ")) {
        			addFunction(line.substring("function ".length()).trim());
        		}
        		else if (line.startsWith("target ")) {
        			addTarget(line.substring("target ".length()).trim());
        		}
        		else if (line.length()>0){
        			System.err.println("Error in Domain.load(\""+fname+"\") - unable to parse line "+i);
        			System.err.println(i+":\t"+line);
        			System.err.println(" ** Line must start with one of: {import,type,relation,comparison,source,target}");
        			System.exit(9);
        		}
        	}
        	in.close();
        } 
        catch (Exception e) {
        	System.err.println("Error in Domain.load("+fname+")");
			e.printStackTrace();
        	System.exit(9);
        }

    }

    private SemanticType parseType(String line) {
    	
    	String name;
    	String primitiveType = "varchar(30)";
    	String[] dbParams = null;
    	String[] numericParams = null;
    	String[] eqParams = null;
    	
    	if (line.indexOf("[") != -1) {
    		primitiveType = line.substring(line.indexOf("[")+1,line.indexOf("]")).trim();	
    	}
    	
    	if (line.indexOf("{") != -1) {
    		String[][] typeParams = parseTypeParameters(line.substring(line.indexOf("{")+1,line.indexOf("}")).trim().split(";"));
    		if (typeParams == null) {
    			System.err.println("ERROR: Unable to parse {type parameters} for semantic type: "+line); System.exit(9);
    		}	
    		dbParams      = typeParams[0];
        	numericParams = typeParams[1];
        	eqParams      = typeParams[2];
    	}
    	
    	line = (line.trim() + " ").replaceFirst("\\["," ").replaceFirst("\\{"," ");
    	name = line.substring(0,line.indexOf(" "));
    	
    	return new SemanticType(name,primitiveType,dbParams,numericParams,eqParams);
    	
    }
    
	private String[][] parseTypeParameters(String[] typeInfo) {
		String[][] params = new String[3][];
		for (String info: typeInfo) {
			info = info.trim();
			int index = info.indexOf(":");
			if (index != -1) {
				if (info.startsWith("examples")){
					params[0] = info.substring(index+1).trim().split("\\.");
					if (params[0].length != 3) {
						System.err.println("ERROR: type parameter 'examples' requires three values");
						return null;
					}	
				}
				else if (info.startsWith("numeric")) {
					params[1] = info.substring(index+1).trim().split(",");
					if (params[1].length != 3) {
						System.err.println("ERROR: type parameter 'numeric' requires three values");
						return null;
					}	
				}
				else if (info.startsWith("equality")) { 
					params[2] = info.substring(index+1).trim().split(" ");
				}
			}
			else if (info.length()>0) {
				// default to 'examples'
				params[0] = info.split("\\.");
				if (params[0].length != 3) {
					System.err.println("ERROR: type parameter 'examples' requires three values");
					return null;
				}	
			}
		}
		return params;
	}
	
	private Predicate parsePredicate(String line) {
    	
    	String name = line.substring(0,line.indexOf("(")).trim();
    	String[] signature = line.substring(line.indexOf("(")+1,line.indexOf(")")).split(",");
    	
    	int arity = signature.length;
		SemanticType[] semTypes = new SemanticType[arity];
		boolean[] bindings = new boolean[arity];
		
		String[] labels = new String[arity];
		for (int i=0; i<arity; i++) {
			String attr = signature[i].trim();
			if (attr.endsWith("^b")) {
				bindings[i] = true;
				attr = attr.substring(0,attr.length()-2);
			}
			else if (attr.startsWith("$")) {
				bindings[i] = true;
				attr = attr.substring(1);
			}
			
			int index;
			if ((index = attr.indexOf(":")) != -1) {
				labels[i] = attr.substring(index+1);
				attr = attr.substring(0,index);
			}
			semTypes[i] = lookupSemanticType(attr);
			if (semTypes[i] == null) {
				System.err.println("ERROR in "+this.getClass().getName()+": Could not find Semantic Type called '"+attr+"'"); System.exit(9);
			}
	    	
		}

		return new Predicate(name,semTypes,bindings,labels);
		
    }
    
    // add semantic type
    private void addSemanticType(String line) {
    	SemanticType t = parseType(line);
    	SemanticType t1 = lookupSemanticType(t.name);
    	if (t1 == null) {
    		types.add(t);
    	}
    	else if (!t.toString().equals(t1.toString()) ){
    		System.err.println("Warning: Conflicting definitions for type: "+t.name);
    		System.err.println("\t"+t1.toString());
    		System.err.println("\t"+t.toString());
    		System.err.println(" - using first.");
    	}
    }
    
    // add new relation
    private void addRelation(String line) {
    	Predicate p = parsePredicate(line);
    	p.category = Predicate.DOMAIN;
    	relations.add(p);
    }
    
    // add new comparison predicate
    private void addComparison(String line) {
    	Predicate p = parsePredicate(line);
    	p.category = Predicate.COMPARISON;
    	comparisons.add(p);
    }
    
    //  add new source
    private void addSource(String line) {
    	
    	String[] endpoint = null;
    	int index = line.indexOf("{");
    	if (index!=-1) {
    		endpoint = line.substring(index+1,line.indexOf("}")).split(";");
    		for (int i=0; i<endpoint.length; i++) {endpoint[i] = endpoint[i].trim();}
    		line = line.substring(0,index);
    	}
    	
    	line = line.trim();
    	String name = line.substring(0,line.indexOf("("));
    	String[] signature = line.substring(line.indexOf("(")+1,line.indexOf(")")).split(",");
    	int arity = signature.length;
		SemanticType[] semTypes = new SemanticType[arity];
		boolean[] bindings = new boolean[arity];
		for (int i=0; i<arity; i++) {
			signature[i] = signature[i].trim();
			if (signature[i].endsWith("^b")) {
				bindings[i] = true;
				signature[i] = signature[i].substring(0,signature[i].length()-2);
	    	}
			else if (signature[i].startsWith("$")) {
				bindings[i] = true;
				signature[i] = signature[i].substring(1);
    		}
		}
		Predicate p = new Predicate(name,semTypes,bindings,signature);
		p.category = Predicate.SOURCE;
		p.endpoint = endpoint;
		sources.add(p);
		
    	// get definition:
		p.definition = parseClause(line);
		
		// check the types for the head variables
		for (int i=0; i<p.arity; i++) {
			if (p.types[i]==null) {
				if (p.labels[i]=="_") {
					p.types[i] = lookupSemanticType("unknown"); // default type for don't care variables
				}
				else {
					System.err.println("Problem parsing source: "+ line);
					System.err.println("The source definition is not safe resulting in unknown datatype for "+p.labels[i]);
					System.exit(9);
				}
			}
		}
		
		
    }
    
    //  add new function
    private void addFunction(String line) {
    	
    	String[] endpoint = null;
    	int index = line.indexOf("{");
    	if (index!=-1) {
    		endpoint = line.substring(index+1,line.indexOf("}")).split(";");
    		for (int i=0; i<endpoint.length; i++) {endpoint[i] = endpoint[i].trim();}
    		line = line.substring(0,index);
    	}
    	
    	line = line.trim();
    	String name = line.substring(0,line.indexOf("("));
    	String[] signature = line.substring(line.indexOf("(")+1,line.indexOf(")")).split(",");
    	int arity = signature.length;
		SemanticType[] semTypes = new SemanticType[arity];
		boolean[] bindings = new boolean[arity];
		for (int i=0; i<arity; i++) {
			signature[i] = signature[i].trim();
			if (signature[i].endsWith("^b")) {
				bindings[i] = true;
				signature[i] = signature[i].substring(0,signature[i].length()-2);
	    	}
			else if (signature[i].startsWith("$")) {
				bindings[i] = true;
				signature[i] = signature[i].substring(1);
    		}
		}
		Predicate p = new Predicate(name,semTypes,bindings,signature);
		p.category = Predicate.FUNCTION;
		p.endpoint = endpoint;
		sources.add(p);
		
    	// get definition:
		p.definition = parseClause(line);
		
		// check the types for the head variables
		for (int i=0; i<p.arity; i++) {
			if (p.types[i]==null) {
				if (p.labels[i]=="_") {
					p.types[i] = lookupSemanticType("unknown"); // default type for don't care variables
				}
				else {
					System.err.println("Problem parsing source: "+ line);
					System.err.println("The source definition is not safe resulting in unknown datatype for "+p.labels[i]);
					System.exit(9);
				}
			}
		}
	}
    
    // set target predicate
    private void addTarget(String line) {
    	String[] endpoint = null;
    	int index = line.indexOf("{");
    	if (index!=-1) {
    		endpoint = line.substring(index+1,line.indexOf("}")).split(";");
    		for (int i=0; i<endpoint.length; i++) {endpoint[i] = endpoint[i].trim();}
    		line = line.substring(0,index);
    	}
    	Predicate p = parsePredicate(line);
    	p.category = Predicate.SOURCE;
    	p.endpoint = endpoint;
		targets.add(p);
	    target = p;
    }

    
    //////////////////////////////////////////////////////////////////////////////
    // Utility methods
	
    private SemanticType lookupSemanticType(String name) {
    	for (SemanticType t: types) {
    		if (t.name.equals(name)) { return t; }
    	}
    	return null;
    }
    
    // lookup predicate using name
    private Predicate lookupPredicate(String name) {
    	for (Predicate p: targets) {
    		if (p.name.equals(name)) { return p; }
    	}
    	for (Predicate p: sources) {
    		if (p.name.equals(name)) { return p; }
    	}
    	for (Predicate p: relations) {
    		if (p.name.equals(name)) { return p; }
    	}
    	for (Predicate p: comparisons) {
    		if (p.name.equals(name)) { return p; }
    	}
    	System.err.println("Couldn't find any predicate with name: "+name);
    	return null;
    }
    
    private String arrayToString(String[] array, String separator) {
    	String s = "";
    	for (int i=0; i<array.length; i++) {
    		if (i!=0) { s += separator + " "; }
    		s += array[i];
    	}
    	return s;
    }
    
    
    ///////////////////////////////////////////////////////////////////////////////
    // STATIC METHODS:
    
    public static Domain load(String filename) {
    	Domain d = new Domain();
    	d.filename = filename;
    	d.importFile(filename);
    	return d;
    }
    

}
