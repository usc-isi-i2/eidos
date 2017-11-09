package edu.isi.sourceDiscovery.logreg;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.util.HashSet;
import java.util.Hashtable;
import java.util.StringTokenizer;
import java.util.Vector;

public class Util {
	public static final String[] stopwords = { "about", "above", "across",
			"after", "against", "along", "among", "around", "at", "before",
			"behind", "below", "beneath", "beside", "between", "beyond", "but",
			"by", "despite", "down", "during", "except", "for", "from", "in",
			"inside", "into", "like", "near", "of", "off", "on", "onto", "out",
			"outside", "over", "past", "since", "through", "throughout",
			"till", "to", "toward", "under", "underneath", "until", "up",
			"upon", "with", "within", "without", "or", "and", "http", "get",
			"post", "soap", "response", "request", "stop", "string", "the",
			"null" };

	public static String unEscape(String str) {
		if (str == null)
			return "";
		String output = str.replace("&quot;", "\"");
		output = output.replace("&nbsp;", " ");
		return output;
	}

	public static Hashtable[] loadFileIntoHashtable(String indexfile)
			throws Exception {
		FileInputStream fin = new FileInputStream(indexfile);
		ObjectInputStream oin = new ObjectInputStream(fin);
		Hashtable[] obj = (Hashtable[]) oin.readObject();
		oin.close();
		fin.close();
		return obj;
	}

	public static void storeHashtableIntoFile(Hashtable[] featureIndex,
			String indexfile) throws Exception {
		FileOutputStream fos = new FileOutputStream(indexfile);
		ObjectOutputStream oos = new ObjectOutputStream(fos);
		oos.writeObject(featureIndex);
		oos.close();
		fos.close();
	}

	public static void addStemmedKeysToHashtable(Hashtable dictionary, String[] terms) {
		if (terms == null)
			return;
		for (int i = 0; i < terms.length; i++) {
			String curTerm = terms[i].trim();
			if (curTerm.length() > 1)
				addKeyToHastable(dictionary, PorterStemmer.stem(curTerm));
		}
	}
	
	public static void addKeyToHastable(Hashtable dictionary, String term) {
		if (term == null)
			return;
		if (!dictionary.containsKey(term)) {
			Integer i = new Integer(dictionary.size() + 1);
			dictionary.put(term, i);
		}
	}
	
	/* with regarding to the stop charactor like '_' and 'number' */
	public static String[] advanceBreakTermsFromParamName(String paramName)
			throws Exception {
		if (paramName == null)
			return null;
		// we throw away any number charactors
		// first we have to transform number charactor into ' '
		StringBuffer buf = new StringBuffer();
		for (int j = 0; j < paramName.length(); j++) {
			char curChar = paramName.charAt(j);
			// if((curChar != '_') && ((int)curChar < 48 || (int)curChar > 57))
			if ((curChar > 64) && (curChar < 91) || (curChar > 96)
					&& (curChar < 123))
				buf.append(curChar);
			else
				buf.append(' ');
		}

		StringTokenizer st = new StringTokenizer(buf.toString());
		Vector<String> v = new Vector<String>();
		for (; st.hasMoreTokens();) {
			String curToken = st.nextToken();
			String curTerms[] = breakTermsFromParamName(curToken);
			for (int i = 0; (curTerms != null) && (i < curTerms.length); i++) {
				v.addElement(curTerms[i].toLowerCase());
			}
		}
		return v.toArray(new String[v.size()]);
	}

	public static String generateSparseFeatureRows(int currentRowIndex,
			int startColIndex, Hashtable termIndex, String[] terms) {
		if (terms == null || termIndex == null)
			return null;
		HashSet<String> hs = new HashSet<String>();
		StringBuffer buf = new StringBuffer();
		for (int i = 0; i < terms.length; i++) {
			if (terms[i].length() <= 1)
				continue;
			String curTerm = PorterStemmer.stem(terms[i]);
			if (hs.contains(curTerm))
				continue;
			hs.add(curTerm);
			if (termIndex.containsKey(curTerm)) {
				int index = ((Integer) termIndex.get(curTerm)).intValue();
				if (buf.length() > 0)
					buf.append("\n" + currentRowIndex + " "
							+ (startColIndex + index) + " 1");
				else
					buf.append(currentRowIndex + " " + (startColIndex + index)
							+ " 1");
			}
		}
		if (buf.length() == 0)
			return null;
		else
			return buf.toString();
	}

	private static String[] breakTermsFromParamName(String paramName)
			throws Exception {
		// if we found a token with all capital charactor, so we would treat it
		// as one token
		paramName = cleaningStringForTokenize(paramName);
		if (paramName == null || paramName.length() == 0)
			return null;
		// linearly scan each character to determine if it is uppercase
		// charactor and we could separate terms
		Vector<String> v = new Vector<String>();
		for (int i = 0; i < paramName.length(); i++) {
			// concept is checking the different between current and previous
			// charactor
			int curChar = paramName.charAt(i);
			int prevChar = -1;

			if (i > 0)
				prevChar = paramName.charAt(i - 1);
			if (i > 1) { // changing occur
				if (curChar <= 90 && prevChar > 90) { // Small->Big
					String extracted = paramName.substring(0, i);
					// System.out.println("e: "+extracted);
					if (!isStopWord(extracted))
						v.addElement(extracted);
					paramName = paramName.substring(i);
					i = 0;
				} else if (prevChar <= 90 && curChar > 90) { // Small -> Big
					String extracted = paramName.substring(0, i - 1);
					// System.out.println("e: "+extracted);
					if (!isStopWord(extracted))
						v.addElement(extracted);
					paramName = paramName.substring(i - 1);
					i = 0;
				}
				// System.out.println(paramName);
				// System.out.println(paramName.substring(0,i-1));

			}
		}
		if (paramName.length() > 0) {
			if (!isStopWord(paramName))
				v.addElement(paramName);
		}
		return v.toArray(new String[v.size()]);
	}

	// Assume that the parameter "term" is begun by a capital letter
	// remove number and special character _ -
	private static String cleaningStringForTokenize(String uncleanedString) {

		// clean stop words
		/*
		 * for(int i=0;i< stopwords.length;i++) { int mindex =
		 * uncleanedString.toLowerCase().indexOf(stopwords[i]); if(mindex > -1) {
		 * String head = ""; String tail = ""; if(mindex > 0) head =
		 * uncleanedString.substring(0,mindex); if(mindex <
		 * uncleanedString.length()-1) tail =
		 * uncleanedString.substring(mindex+stopwords[i].length());
		 * uncleanedString = head+tail; } }
		 */

		// clean junk charactor
		StringBuffer buf = new StringBuffer();
		for (int j = 0; j < uncleanedString.length(); j++) {
			char curChar = uncleanedString.charAt(j);
			if ((curChar != '_') && (curChar < 48 || curChar > 57)) {
				buf.append(curChar);
			}
		}
		return buf.toString();
	}

	private static boolean isStopWord(String stringToCheck) {
		for (int i = 0; i < stopwords.length; i++) {
			if (stringToCheck.equalsIgnoreCase(stopwords[i])) {
				return true;
			}
		}
		return false;
	}
}
