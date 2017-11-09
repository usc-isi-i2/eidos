package edu.isi.sourceDiscovery.common;

import java.io.PrintStream;
import java.util.List;

public class Util {

	public static String matrixToCSVString(List<? extends List<String>> matrix) {
		StringBuffer output = new StringBuffer("");
		printMatrix(matrix, output, ",", true);
		return output.toString();
	}
	
	public static void printCSVMatrix(List<? extends List<String>> matrix, PrintStream out) {	
		out.print(matrixToCSVString(matrix));
	}
	
	public static void printMatrix(List<? extends List<String>> matrix, PrintStream out, String seperator, boolean enquote) {
		StringBuffer output = new StringBuffer("");
		printMatrix(matrix, output, seperator, enquote);
		out.print(output.toString());
	}
	
	public static void printMatrix(List<? extends List<String>> matrix, StringBuffer output, String seperator, boolean enquote) {
		for(int i=0; i<matrix.size(); i++) {
			List<String> row = matrix.get(i);
			
			for(int j=0; j<row.size(); j++) {
				String str = row.get(j);
				str = removeNewlines(str);
				str = removeQuotes(str);
				str = removeTabs(str);
				if(enquote) 
					output.append("\"");
				output.append(str);
				if(enquote)
					output.append("\"");
				if(j < row.size()-1)
					output.append(seperator);					
			}			
			output.append("\n");			
		}
	}
	
	public static String removeNewlines(String s) {
		 s = s.replaceAll("\n", "\\\\n");
	     s = s.replaceAll("\r", "\\\\r");	     
	     s = s.replaceAll("[^\\p{ASCII}]", "?");
	     return s;
	}
	
	public static String removeQuotes(String s) {
		s = s.replace("\"", "");
		return s;
	}
	
	public static String removeTabs(String s) {
		s = s.replace("\t", " ");
		return s;
	}
}
