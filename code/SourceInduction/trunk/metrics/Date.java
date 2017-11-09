package metrics;

import java.util.ArrayList;

public class Date {
	
	public static double evaluate(String val1, String val2) {
		boolean result = equals(val1,val2);
		// System.out.println("comparing dates: '"+val1+"' and '"+val2+"' - "+result);
		if (result) {	
			return 1.0;
		}
		return 0.0;
	}
	
	public static boolean equals(String val1, String val2) {
		val1 = val1.trim();
		val2 = val2.trim();
		if (val1.equalsIgnoreCase(val2)) {
			return true;
		}
		int[] v1 = sort(normalize(val1));
		int[] v2 = sort(normalize(val2));
		if (v1 == null || v2 == null) {
			return false;
		}
		
		//System.out.println(" comparing: {"+v1[0]+","+v1[1]+","+v1[2]+"} with {"+v2[0]+","+v2[1]+","+v2[2]+"}");
		
		if (v1[0]==v2[0] && ((v1[1]==v2[1] && v1[2]==v2[2]) || (v1[1]==v2[2] && v1[2]==v2[1]))) {
			return true;
		}
		return false;
	}
	
	private static ArrayList<Integer> normalize(String val) {
		// remove day name
		String[] days = {"Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"};
		for (String day: days) {
			if (val.indexOf(day)!=-1) {
				val = val.replaceFirst(day,"").trim();
				break;
			}
			else if (val.indexOf(day.substring(0,3))!=-1) {
				val = val.replaceFirst(day.substring(0,3),"").trim();
				break;
			}
			else if (val.indexOf(day.substring(0,2))!=-1) {
				val = val.replaceFirst(day.substring(0,2),"").trim();
				break;
			}
		}
		if (val.startsWith("/")||val.startsWith("\\")||val.startsWith("-")||val.startsWith(",")) {
			val = val.substring(1).trim();
		}
		// replace month by number
		String[] month = {"January","February","March","April","May","June","July","August","September","October","November","December"};
		for (int m=0; m<12; m++) {
			if (val.indexOf(month[m])!=-1) {
				val = val.replaceFirst(month[m],m+1+"");
				break;
			}
			else if (val.indexOf(month[m].substring(0,3))!=-1) {
				val = val.replaceFirst(month[m].substring(0,3),m+1+"");
				break;
			}
		}
		// split using different separators:
		String[] vals;
		if (  ((vals = val.split("/")).length > 2)
			||((vals = val.split("\\\\")).length > 2)
			||((vals = val.split("-")).length > 2)
			||((vals = val.split(",")).length > 2)
			||((vals = val.split(" ")).length > 2)) {
			ArrayList<Integer> out = new ArrayList<Integer>(3);
			for (String v: vals) {
				try {
					int i = Integer.parseInt(v.replace(","," ").trim());
					out.add(i);
					if (out.size()>2) { return out; }
				}
				catch (Exception e) { System.err.println("error parsing integer: "+v); }
			}
		}
		else { // assume no year - use 2006!
			if (  ((vals = val.split("/")).length > 1)
					||((vals = val.split("\\\\")).length > 1)
					||((vals = val.split("-")).length > 1)
					||((vals = val.split(",")).length > 1)
					||((vals = val.split(" ")).length > 1)) {
				ArrayList<Integer> out = new ArrayList<Integer>(3);
				for (String v: vals) {
					try {
						int i = Integer.parseInt(v.replace(","," ").trim());
						out.add(i);
					}
					catch (Exception e) { System.err.println("error parsing integer: "+v); }
				}
				if (out.size() == 2) { out.add(2006); return out; }
			}
		}
		return null;
	}

	private static int[] sort(ArrayList<Integer> vals) {
		if (vals == null) { return null; }
		// try to sort into: {year, month, day}
		int[] sorted = new int[3];
		// first get year:
		if (vals.get(0)>31) {
			sorted[0] = vals.get(0);
			sorted[1] = vals.get(1);
			sorted[2] = vals.get(2);
		}
		else { 
			sorted[0] = vals.remove(2); 
			// then get day and month:
			if (vals.get(0)>12) {
				sorted[1] = vals.get(1);
				sorted[2] = vals.get(0);
			}
			else if (vals.get(1)>12) {
				sorted[1] = vals.get(0);
				sorted[2] = vals.get(1);
			}
			else {
				// can't tell!
				sorted[1] = vals.get(0);
				sorted[2] = vals.get(1);
			}
		}
		return sorted;
	}

	public static void test() {
		String[] val = {"2006-05-04","5/4/2006","May 4, 2006","Thu, 4 May 2006","2006-03-20"};
		for (String v1: val) {
			for (String v2: val) {
				System.out.println("Checking equality between "+v1+" and "+v2);
				System.out.println(" returns: "+equals(v1,v2));
			}	
		}
	}
	
}


