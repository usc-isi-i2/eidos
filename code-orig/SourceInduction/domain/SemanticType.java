package domain;

import java.util.ArrayList;
import java.util.Random;

import relational.DBConnection;
import relational.Operator;
import relational.Table;

import metrics.Metric;

public class SemanticType {
    
	public String  name;
	public String  primitiveType;
	public int     primitiveTypeLength = 30;
	// parameters defining location of examples of this type
	private String  dbName;
	private String  dbTable;
	private String  dbColumn;
	private String  dbOccursCol; // extra column name parameter for examples with occurrnce counts
	// additional parameters for numeric types
	private boolean numeric;
	private double  maxValue = Double.MAX_VALUE;
	private double  minValue;
	private double  accuracy;
	private boolean accuracyIsPercentage = false;
	// additional parameters for equality calculation
	private Metric   eqMetric = null;
	private Operator eqOperator;
	private double   eqThreshold;
    
    // Creates a new instance of SemanticType 
    public SemanticType(String name, 
    					String primitiveType, 
    					String[] dbParams,
    					String[] numericParams,
    					String[] eqParams) {
        
    	this.name 	  = name;
        this.primitiveType = primitiveType;
        
        if (primitiveType.indexOf("(") != -1) {
        	this.primitiveTypeLength = Integer.parseInt(primitiveType.substring(primitiveType.indexOf("(")+1,primitiveType.indexOf(")")));
        }
        
        if (dbParams!=null && dbParams.length>=3) {
            this.dbName   = dbParams[0];
            this.dbTable  = dbParams[1];
            this.dbColumn = dbParams[2];
            // check for additional distribution information:
            int index = dbColumn.indexOf("[");
    		if (index!=-1) {
    			this.dbOccursCol = dbColumn.substring(index+1,dbColumn.indexOf("]"));
    			this.dbColumn    = dbColumn.substring(0,index);
        	}
    		else {
    			this.dbOccursCol = null;
    		}
        }
        
        if (numericParams!=null && numericParams.length>=3) {
        	this.numeric = true;
        	this.minValue = Double.parseDouble(numericParams[0]);
        	this.maxValue = Double.parseDouble(numericParams[1]);
        	if (numericParams[2].contains("%")) {
        		this.accuracyIsPercentage = true;
        		numericParams[2] = numericParams[2].replaceFirst("%"," ");
        	}
        	this.accuracy = Double.parseDouble(numericParams[2]);
        }
        
        if (eqParams!=null && eqParams.length>=3) {
        	eqMetric = new Metric(eqParams[0]);
            eqOperator  = Operator.parse(eqParams[1]);
        	eqThreshold = Double.parseDouble(eqParams[2]);
        }
        
    }
    
    public String toString() {
        String s = name;
        int spaces = 15-s.length(); if (spaces < 1) {spaces = 1;} for (int i=0;i<spaces;i++) {s+=" ";}
        s += "[" + primitiveType + "]";
        spaces = 31-s.length(); if (spaces < 1) {spaces = 1;} for (int i=0;i<spaces;i++) {s+=" ";}
        ArrayList<String> extras = new ArrayList<String>();
        if (numeric) {
        	extras.add("numeric: "+minValue+", "+maxValue+", "+accuracy+ifTrue(accuracyIsPercentage,"%"));
        }
        if (dbName != null) { 
        	extras.add("examples: "+dbName+"."+dbTable+"."+dbColumn+ifTrue(dbOccursCol!=null,"["+dbOccursCol+"]"));
        }
    	if (eqMetric != null) {
    		extras.add("equality: " + eqMetric.name + " " + eqOperator + " " + eqThreshold);
    	}
    	s += listToString(extras);
        return s;
    }
        
    public ArrayList<String> getExamples(int count, DBConnection db) {
    	
    	ArrayList<String> examples = new ArrayList<String>(count);
    	
    	if (dbTable != null) {
    		if (dbOccursCol!=null) {
    			Table exampleTable = db.runQuery("SELECT "+dbOccursCol+", "+dbColumn+" FROM "+dbName+"."+dbTable+" t ORDER BY "+dbOccursCol+" DESC");
    			// sum the counts over all the values:
    			double total = 0.0;
    			for (ArrayList<String> tuple: exampleTable.tuples) {
    				total += Double.parseDouble(tuple.get(0));
    			}
    			// randomly select count values from table according to probability of each value
        		for (int i=0; i<count; i++) {
        			double random = (new Random()).nextDouble()*total;
        			for (ArrayList<String> tuple: exampleTable.tuples) {
        				random -= Double.parseDouble(tuple.get(0));
        				if (random <= 0.0) {
        					examples.add(tuple.get(1));
        					break;
        				}
        			}
        		}
        	}
        	else {
    			examples = db.randomSubset(dbName+"."+dbTable,dbColumn,count,false);
    			// make sure enough examples have been found, otherwise just repeat some:
    			for (int i=0; examples.size()<count; i++) {
    				examples.add(examples.get(i));
    			}
        	}	
        }
        else if (numeric) {
        	String val;
        	//  then get examples by systematically selecting from range.... 	
        	if (name.equalsIgnoreCase("distanceMi")) {
            	//  hack for distanceMi type!!! needs to be fixed
        		double max = maxValue;
            	for (int j=0; j<count-1; j++) {
            		max /= 2.0;
            		val = "" + max*((new Random()).nextDouble() + 1.0);
            		if (val.length()>primitiveTypeLength) {
            			val = val.substring(0,primitiveTypeLength);
            		}
            		examples.add(val);
            	}
            	val = "" + max*(new Random()).nextDouble();
            	if (val.length()>primitiveTypeLength) {
        			val = val.substring(0,primitiveTypeLength);
        		}
        		examples.add(val);
        	}
        	else {
            	for (int i=0; i<count; i++) {
            		val = "" + (minValue + (new Random()).nextDouble()*(maxValue - minValue));
            		if (val.length()>primitiveTypeLength) {
            			val = val.substring(0,primitiveTypeLength);
            		}
            		examples.add(val);
            	}  	
        	}
        }
        else {
        	System.err.println("Error in SemanticType.getExamples(): No database of example values available for: "+this.toString());
        	System.exit(9);
        }
        return examples;
    }
    
    public int cardinality(DBConnection db) {
        if (dbTable != null) {
        	return db.countDistinct(dbName+"."+dbTable,dbColumn);
        }
        else if (numeric) {
        	return (new Double((maxValue - minValue)/accuracy)).intValue();
        }
        else {
        	return Integer.MAX_VALUE;
        }
    }

    public boolean areEqual(String val1, String val2) {
    	boolean result = areEqualImpl(val1.trim(),val2.trim());
    	//if (name.startsWith("distance")) {
    	//	System.out.println("equal('" + val1 + "','" + val2 + "') -> " + result);
    	//}
    	return result;
    }
    
    private boolean areEqualImpl(String val1, String val2) {
        	
    	if (eqMetric != null) {
    		return eqOperator.eval(eqMetric.evaluate(val1,val2),eqThreshold);
    	}
    	else if (numeric) {
    		
    		val1 = val1.replace(",","").replaceAll("[^0-9\\.-]"," ").trim();  
    		val2 = val2.replace(",","").replaceAll("[^0-9\\.-]"," ").trim();  
    		
    		int index;
    		if ((index = val1.indexOf(" "))!=-1) { val1 = val1.substring(0,index); }
    		if ((index = val2.indexOf(" "))!=-1) { val2 = val2.substring(0,index); }
    		
    		if (val1.length()==0) { return (val2.length()==0); }
    		if (val2.length()==0) { return false; }
    		
    		if (val1.equals("-")) { return val2.equals("-"); }
    		if (val2.equals("-")) { return false; }
    		
    		try {
    			Double v1 = Double.parseDouble(val1);
        		Double v2 = Double.parseDouble(val2);
        		if (accuracyIsPercentage) {
        			if (v1==0.0 && v2==0.0) { 
        				return true; 
        			}
        			else {
        				return (200 * Math.abs(v1-v2)/(Math.abs(v1)+Math.abs(v2)) < accuracy);
        			}
        		}
        		else {
        			return (Math.abs(v1-v2) < accuracy);
        		}
    		}
    		catch (java.lang.NumberFormatException e) {
    			System.err.println("ERROR PARSING NUMERIC VALUES OF TYPE "+name+": '" + val1 + "' and '" + val2 +"'");
    			return substringEquality(val1,val2);
    		}
    	}
    	else {
    		return substringEquality(val1,val2);
    	}
    
    }
    
    private boolean substringEquality(String val1, String val2) {
    	if (val1.length()==0) {
    		return (val2.length()==0);
    	}
    	else if (val2.length()==0) {
    		return false;
    	}
    	String v1 = val1.toLowerCase();
		String v2 = val2.toLowerCase();
		return (v1.startsWith(v2) || v2.startsWith(v1));
		
    }

    
    private String ifTrue(boolean a, String s) {
    	if (a) { return s;}
    	else   { return "";}
    }
    
    private String listToString(ArrayList<String> list) {
    	String s = "";
    	if (!list.isEmpty()) {
    		boolean first = true;
    		for (String l: list) {
    			if (first) {first = false;}
    			else {s += ";";}
    			s += l;
    		}
    		s = "{"+s+"}";
    	}
    	return s;
    }
    
}


