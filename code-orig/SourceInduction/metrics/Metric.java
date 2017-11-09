package metrics;

import com.wcohen.secondstring.*;

public class Metric {

	public String name;
	private StringDistance sd;

    public Metric(String name) {
    	this.name = name;
    	try {
    		if (!name.equals("Date")) {
    			sd = (StringDistance) Class.forName("com.wcohen.secondstring."+name).newInstance();
    		}
		}
		catch (Exception e) {
			System.err.println("ERROR in "+this.getClass()+": unknown string distance " + name);
			System.exit(9);
		}
    }
    
    
    public double evaluate(String s1, String s2) {
    	if (name.equals("Date")) { return Date.evaluate(s1,s2); }
    	return sd.score(sd.prepare(s1),sd.prepare(s2));
    }
    
    /*
    if((v+"").equals("-Infinity")) { v = -2.0; }
   	if(!Double.isNaN(v)) { return v; }
   	return 0;
    
    public double getMaxJaroWinklerScore(String ref, String tok) {
    	double maxVal = 0.0;
    	String splitVal[] = ref.split(" ");
    	for(int i = 0; i < splitVal.length; i++) {
    		double v = jaro.score(splitVal[i],tok);
    		if(v > maxVal) {
    			maxVal = v;
    		}
    	}
    	if((maxVal+"").equals("-Infinity")) {
    		maxVal = -2.0;
    	}
    	return maxVal;
    }
    
    
    public double getSubstringScore(String s, String t) {
    	if(s.indexOf(t)>-1 || t.indexOf(s)>-1) {
    		return 1.0;
	    }
    	return 0.0;
    }
	*/
}
