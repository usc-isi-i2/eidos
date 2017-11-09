<!--
 
//// Constants used for this JS file
  var strDigits = "0123456789";
  var strLowerCaseLetters = "abcdefghijklmnopqrstuvwxyz";
  var strUpperCaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var strCreditCardDelimiter = "-"
  var strPhoneNumberDelimiters = "()- ";
  var strZipCodeDelimiters = "-";
  var numDigitsInUSPhoneNumber = 10;
  
 //Default Empty value 
  var defaultEmptyOK = false;
 
/**
*Returns a string without a series of characters specified.
**/
  function strStripCharsInBag(strUnformattedString, strBag) {   
  	var u;
  	var returnString = "";
  	for (u = 0; u < strUnformattedString.length; u++)
  	{   
  		var c = strUnformattedString.charAt(u);
  		if (strBag.indexOf(c) == -1) 
      {
  			returnString += c;
      }
  	}
  	return returnString;
  }
  
/**
* COMMON JAVASCRIPT FUNCTIONS
**/

// isInteger 
// 
// Returns true if all characters in string s are numbers.
// EXAMPLE FUNCTION CALL:     RESULT:
// isInteger ("5")            true 
// isInteger ("")             defaultEmptyOK
// isInteger ("-5")           false
// isInteger ("", true)       true
// isInteger ("", false)      false
// isInteger ("5", false)     true

function isInteger (s) {   
	var i;

    if (isEmpty(s)) 
       if (isInteger.arguments.length == 1) return defaultEmptyOK;
       else return (isInteger.arguments[1] == true);
    // Search through string's characters one by one
    // until we find a non-numeric character.
    // When we do, return false; if we don't, return true.

    for (i = 0; i < s.length; i++)
    {   
        // Check that current character is number.
        var c = s.charAt(i);

        if (!isDigit(c)) return false;
    }

    // All characters are numbers.
    return true;
}

/**
* Check whether string s is empty.
**/
function isEmpty(s) {   
	return ((s == null) || (s.length == 0))
}

/**
*  Returns true if character c is a digit (0 .. 9).
**/
function isDigit (c)
{   return ((c >= "0") && (c <= "9"))
}

/**
*  Function formats the string based on the function arguments
**/
function reformat (s){
    var arg;
    var sPos = 0;
    var argPos=0;
    var resultString = "";

    for (var i = 1; i < reformat.arguments.length; i++) {
       arg = reformat.arguments[i];
       if (i % 2 == 1) {
       		if(argPos < s.length)
       		resultString += arg;
       }
       else {
           resultString += s.substring(sPos, sPos + arg);
           sPos += arg;
           argPos+=arg;
       }
    }
    return resultString;
}

/**
* This function strips out the invalid characters and formats 
* the content based on the card type.
**/
function formatCCNumber(cardNumberObj,cardType,mode){
	
	if(mode==false){
		var cardNumberVal=cardNumberObj.value;
		var strippedCCNumber="";
		var formattedCCNumber="";
		
		if (isEmpty(cardNumberObj.value)) return true;
		//Strip all the characters except the numbers
		for (i = 0; i < cardNumberVal.length; i++)
	    	{   
	        // Check that current character is number.
	        var c =cardNumberVal.charAt(i);
	
	        if (isDigit(c)) strippedCCNumber += c;
	   	}
				
		if(cardType=="AMEX"){
		 	 formattedCCNumber=reformat (strippedCCNumber, "", 4, strCreditCardDelimiter, 6, strCreditCardDelimiter, 6);
		}
		else{
		formattedCCNumber=reformat (strippedCCNumber, "", 4, strCreditCardDelimiter, 4, strCreditCardDelimiter, 4,strCreditCardDelimiter, 4);
		}
		cardNumberObj.value=formattedCCNumber;
		
	}	
}	

/**
* Validates the String with the US phone number and 
* formats to (xxx) xxx-xxxx
* Modified by Rajib ( made it simple. Any issue pls talk to me
**/
function checkUSPhone (phoneNoObj, emptyOK)
{
   if (checkUSPhone.arguments.length == 1) emptyOK = defaultEmptyOK;
   var phoneNoVal=phoneNoObj.value;
   if (isEmpty(phoneNoVal)) return true;
   if (emptyOK == true) return true;
   else
    { 
    	var normalizedPhone ="";
 		//Strip all the characters except the numbers
		for (i = 0; i < phoneNoVal.length; i++)
	    	{   
	        // Check that current character is number.
	        var c =phoneNoVal.charAt(i);
	        if (isDigit(c)) normalizedPhone += c;
	   	}

		if ( ( normalizedPhone.length > 3 )	&&  ( normalizedPhone.length <= 6 ) )
		{
			var len=normalizedPhone.length - 3;
			phoneNoObj.value=reformat (normalizedPhone, "(", 3, ") ",len)
			return true;
		}
		else if ( normalizedPhone.length > 6 )
		{
			var len=normalizedPhone.length - 6;
			phoneNoObj.value=reformat (normalizedPhone, "(", 3, ") ", 3, "-", len )
			return true;
		}
		else
		{
			phoneNoObj.value=normalizedPhone;
			return true;
		}
    }
}

/**
* This function strips out the invalid characters and formats 
* the us zip code.
**/
function formatUSZipCode(zipCodeObj,mode){
	
	if(mode==false){
		var zipCodeVal=zipCodeObj.value;
		var strippedZipCode="";
		var formattedZipCode="";
		
		if (isEmpty(zipCodeObj.value)) return true;
		//Strip all the characters except the numbers
		for (i = 0; i < zipCodeVal.length; i++)
	    	{   
	        // Check that current character is number.
	        var c =zipCodeVal.charAt(i);
	
	        if (isDigit(c)) strippedZipCode += c;
	   	}
		
		//reformat if greater than by 5		
		if( strippedZipCode.length > 5)
		{
		 	 formattedZipCode=reformat (strippedZipCode, "", 5, strZipCodeDelimiters,4 );
		 	 zipCodeObj.value=formattedZipCode;
		}
		else
		{
			zipCodeObj.value=strippedZipCode;
		}
	}	
}	

/*
* This method will be used for all JS actions that need to set the action of a form.
* This will also be used when a button is no longer supposed to function, and should set the action of the form to an empty string.
* The formElement should be called using the following notation, document.[formName]
*/
function setFormAction(formElement) 
{    
   // if (document.layers && document.layers[objectId] != null) document.layers[objectId].visibility = Value;
   if ( this != null && formElement.action != "" )
   {
       formElement.action="";
   }
}

/**
* This function is used disable the anchor tag (button) from actually submitting again
**/
	
function disableSrcForElement( formElement) 
{
    if ( formElement != null && formElement.src != "" )
    {
        formElement.src="";
    }
}

//THIS METHOD REPLACES THE SUBMITTED ORDER PAGE IN THE HISTORY WITH THE HOMEPAGE
function redirect(url) {
	location.replace(url);
}	

/**
* This Method clears the value of the passed parameter element
*/
function clearElementValue( formElement )
{
	if ( formElement != null ){
		formElement.value="";
	}	
}

/**
* This Method clears the value of the passed parameter element
*/
function clearElementValue( formElement )
{
	if ( formElement != null ){
		formElement.value="";
	}	
}

/**
* This Method was moved from itmerow1inc.jsp
*/
function addSingleItemtoCart(url, qtyElement, partNumElement, catentElement, cmAreaElement,qtyCheckFlag) {
	if(url != null && qtyElement != null && partNumElement != null && catentElement != null && eval(qtyElement).value != '') {
		var params = '&' + eval(qtyElement).name + '=' + eval(qtyElement).value
		   			+ '&' + eval(partNumElement).name + '=' + eval(partNumElement).value
		   			+ '&' + eval(catentElement).name + '=' + eval(catentElement).value
		   			+ '&' + eval(cmAreaElement).name + '=' + eval(cmAreaElement).value;
		
		window.location.href = url + params;
	}
}
/**
* This Method is required for reqbndlchoice.jsp
*/

function addSingleItemtoCartForReqBndl(fName,counter,element ) {
	if(fName != null && counter != null && element != null) {
        formName=eval( "document." + fName);		
		formElement=eval( "document." + fName + "." + element );
		formElement.value=counter;
		formName.submit();
		
		
	}
}


/**
* This method adds an item to a favorites list
*/
function addSingleItemToFavorites( destUrl, partNumber, catEntryId ) {
	currentUrl = window.location;
	currentUrl = escape( currentUrl );
	var params = '&partNumber=' + partNumber + '&catentryId=' + catEntryId + '&errorUrl=genericerror.jsp&rUrl=' + currentUrl;
	var url = destUrl + params;
	window.location.href = url;
}


/**
 * This function formats the given amount into the specifed format,
 * 	formatNumber(3, "$0.00") returns $3.00
 *	formatNumber(3.14159265, "##0.####") returns 3.1416
 *	formatNumber(3.14, "0.0###%") returns 314.0%
 *	formatNumber(314159, ",##0.####") returns 314,159
 *	formatNumber(31415962, "$,##0.00") returns $31,415,962.00
 *	formatNumber(0.5, "#.00##") returns 0.50
 *	formatNumber(0.5, "0.00##") returns 0.50
 *	formatNumber(0.5, "00.00##") returns 00.50
 *	formatNumber(4.44444, "0.00") returns 4.44
 *	formatNumber(5.55555, "0.00") returns 5.56
 *	formatNumber(9.99999, "0.00") returns 10.00
 * 
*/

// CONSTANTS

  var separator = ",";  // use comma as 000's separator
  var decpoint = ".";  // use period as decimal point
  var percent = "%";
  var currency = "$";  // use dollar sign for currency

  function formatNumber(number, format) {  // use: formatNumber(number, "format")

    if (number - 0 != number) return null;  // if number is NaN return null
    var useSeparator = format.indexOf(separator) != -1;  // use separators in number
    var usePercent = format.indexOf(percent) != -1;  // convert output to percentage
    var useCurrency = format.indexOf(currency) != -1;  // use currency format
    var isNegative = (number < 0);
    number = Math.abs (number);
    if (usePercent) number *= 100;
    format = strip(format, separator + percent + currency);  // remove key characters
    number = "" + number;  // convert number input to string

     // split input value into LHS and RHS using decpoint as divider
    var dec = number.indexOf(decpoint) != -1;
    var nleftEnd = (dec) ? number.substring(0, number.indexOf(".")) : number;
    var nrightEnd = (dec) ? number.substring(number.indexOf(".") + 1) : "";

     // split format string into LHS and RHS using decpoint as divider
    dec = format.indexOf(decpoint) != -1;
    var sleftEnd = (dec) ? format.substring(0, format.indexOf(".")) : format;
    var srightEnd = (dec) ? format.substring(format.indexOf(".") + 1) : "";

     // adjust decimal places by cropping or adding zeros to LHS of number
    if (srightEnd.length < nrightEnd.length) {
      var nextChar = nrightEnd.charAt(srightEnd.length) - 0;
      nrightEnd = nrightEnd.substring(0, srightEnd.length);
      if (nextChar >= 5) nrightEnd = "" + ((nrightEnd - 0) + 1);  // round up

 	
      while (srightEnd.length > nrightEnd.length) {
        nrightEnd = "0" + nrightEnd;
      }

      if (srightEnd.length < nrightEnd.length) {
        nrightEnd = nrightEnd.substring(1);
        nleftEnd = (nleftEnd - 0) + 1;
      }
    } else {
      for (var i=nrightEnd.length; srightEnd.length > nrightEnd.length; i++) {
        if (srightEnd.charAt(i) == "0") nrightEnd += "0";  // append zero to RHS of number
        else break;
      }
    }

     // adjust leading zeros
    sleftEnd = strip(sleftEnd, "#");  // remove hashes from LHS of format
    while (sleftEnd.length > nleftEnd.length) {
      nleftEnd = "0" + nleftEnd;  // prepend zero to LHS of number
    }

    if (useSeparator) nleftEnd = separate(nleftEnd, separator);  // add separator
    var output = nleftEnd + ((nrightEnd != "") ? "." + nrightEnd : "");  // combine parts
    output = ((useCurrency) ? currency : "") + output + ((usePercent) ? percent : "");
    if (isNegative) {
      // patch suggested by Tom Denn 25/4/2001
      output = (useCurrency) ? "(" + output + ")" : "-" + output;
    }
    return output;
  }

  function strip(input, chars) {  // strip all characters in 'chars' from input
    var output = "";  // initialise output string
    for (var i=0; i < input.length; i++)
      if (chars.indexOf(input.charAt(i)) == -1)
        output += input.charAt(i);
    return output;
  }

  function separate(input, separator) {  // format input using 'separator' to mark 000's
    input = "" + input;
    var output = "";  // initialise output string
    for (var i=0; i < input.length; i++) {
      if (i != 0 && (input.length - i) % 3 == 0) output += separator;
      output += input.charAt(i);
    }
    return output;
  }
  
  // - moved from main.js 10/5/04
  
  function setValueFromDDL(fName, optDDLName )
{
    //derive the action from the selected value in the DDL
    box = eval( "document." + fName + "." + optDDLName );    
    actionURL = box.options[box.selectedIndex].value;
    //alert("Selected value from DDL=" + actionURL );
    formSub(fName,actionURL);
}


function subSetCookieHelper(cookieName, cookieValue, yearsValid)
{
	//alert("in subSetSessionCookie(" + cookieName + ", " + cookieValue + ", " + yearsValid + ")");
	if (yearsValid == null || yearsValid == "")
	{
		subSetSessionCookie(cookieName, cookieValue);
	}
	else
	{
		expireDate = new Date();
		msecs = expireDate.getTime();
		expireDate.setTime(msecs + (yearsValid * 365 * 24 * 3600 * 1000));
		expireDate = expireDate.toGMTString();
		//alert("expireDate = |" + expireDate + "|");
		document.cookie = escape(cookieName) + "=" + escape(cookieValue) + ";expires=" + expireDate + ";path=/";
	}
}

function subSetSessionCookie(cookieName, cookieValue)
{
	document.cookie = escape(cookieName) + "=" + escape(cookieValue) + "; path=/";
}
  
// Retrieves the value of a cookie already existing on a user's machine./////////////////////////////////////////////
  function strGetCookie(strCookieName) 
  {
  	// return string containing value of specified cookie or null if cookie does not exist
  	var dc = document.cookie;
  	var prefix = strCookieName + "=";
  	var begin = dc.indexOf("; " + prefix);
  	if (begin == -1) 
  	{
  		begin = dc.indexOf(prefix);
  		if (begin != 0)
  		{
       		return null;
  		}
  	}
  	else
  	{
  		begin += 2;
  	}
  	var end = document.cookie.indexOf(";", begin);
  	if (end == -1)
  	{
  		end = dc.length;
  	}
  	return unescape(dc.substring(begin + prefix.length, end));
  }	
  
  
  // This function checks for the image on/off session cookie value
  function getImageCookieValue(
		cookieName,
		imgOnOffFlagParameter,
		imgOnOffFlagValue,cookieValue)  
	{
								
		var flagValue = "";

		// If the flage values is null, imgOnOffFlagValue is set to default value on
	    if ((imgOnOffFlagValue == 'null') && (cookieValue == 'null'))
		{
			subSetCookieHelper(cookieName,"on");
		} 
		else 
		if ((imgOnOffFlagValue == 'null') && ((cookieValue == 'on') || cookieValue == 'off')  ){
			flagValue = cookieValue;
		} 
		else
		if (  imgOnOffFlagValue != cookieValue  )
		{
				
			// creates the cookie and sets the Image on/off selected value
			subSetCookieHelper(cookieName, imgOnOffFlagValue);
		}
		return flagValue;
	}
  
	// This function gets the server name
	function getServerName() {
		var filepath = window.location.toString();
		var pattern = /\/\/([^\/]+)\/?/;
		var result = filepath.match(pattern);
		if (result != null) {
			return result[1];
		}
	}
	var serverName = getServerName();
  
	//Function to link with hourglass and loading message
	function jsSubmitLink(url) 
	{
  		if (url.indexOf('http') != 0) {
  			url = 'http://' + serverName + url;
		}		
		window.location = url;
		document.body.style.cursor='wait'; 
		status='Loading...';
	}	  
  
	// fill HTML element ////////
	function fillElement(elementId,fillStr) {
		try {
			var elementHtml = document.getElementById(elementId);
			elementHtml.innerHTML = fillStr;
		} catch(e) {}
	}
	// end fill HTML  
  
  
// -->