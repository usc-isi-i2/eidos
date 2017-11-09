import java.util.regex.*;

public class test {
    final static String Digits     = "(\\p{Digit}+)";
    final static String HexDigits  = "(\\p{XDigit}+)";
    // an exponent is 'e' or 'E' followed by an optionally 
    // signed decimal integer.
    final static String Exp        = "[eE][+-]?"+Digits;
    final static String fpRegex    =
	("[\\x00-\\x20]*"+  // Optional leading "whitespace"
	 "[+-]?(" + // Optional sign character
	 "NaN|" +           // "NaN" string
	 "Infinity|" +      // "Infinity" string

	 // A decimal floating-point string representing a finite positive
	 // number without a leading sign has at most five basic pieces:
	 // Digits . Digits ExponentPart FloatTypeSuffix
	 // 
	 // Since this method allows integer-only strings as input
	 // in addition to strings of floating-point literals, the
	 // two sub-patterns below are simplifications of the grammar
	 // productions from the Java Language Specification, 2nd 
	 // edition, section 3.10.2.

	 // Digits ._opt Digits_opt ExponentPart_opt FloatTypeSuffix_opt
	 "((("+Digits+"(\\.)?("+Digits+"?)("+Exp+")?)|"+

	 // . Digits ExponentPart_opt FloatTypeSuffix_opt
	 "(\\.("+Digits+")("+Exp+")?)|"+

	 // Hexadecimal strings
	 "((" +
	 // 0[xX] HexDigits ._opt BinaryExponent FloatTypeSuffix_opt
	 "(0[xX]" + HexDigits + "(\\.)?)|" +

	 // 0[xX] HexDigits_opt . HexDigits BinaryExponent FloatTypeSuffix_opt
	 "(0[xX]" + HexDigits + "?(\\.)" + HexDigits + ")" +

	 ")[pP][+-]?" + Digits + "))" +
	 "[fFdD]?))" +
	 "[\\x00-\\x20]*");// Optional trailing "whitespace"

    public static void main (String [] args) {
	for (String arg: args) {
	    System.out.println( arg + " " + safeParseDouble(arg));
	}
    }

    static double safeParseDouble(String arg) {
	Matcher m = Pattern.compile(fpRegex).matcher(arg);
	if (m.find())
	    return Double.valueOf(m.group()); // Will not throw NumberFormatException
	else {
	    // Perform suitable alternative action
	    return -1.0;
	}
    }
}