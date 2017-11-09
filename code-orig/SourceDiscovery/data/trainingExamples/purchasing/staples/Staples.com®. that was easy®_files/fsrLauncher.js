// Customer: ** SAMPLE TEST CODE (Staples Testing-031507) ** 
/** Version: ForeseeTrigger 1.0x **/
/** Copyright 2001-2007 ForeseeResults, Inc **/

/**CLIENT CONFIGURABLE PARAMETERS**/
var triggerParms = new Array(); 
var cppParms  = new Array(); 	//add multiple cpps into this array

/**EXTERNAL PLUGINS**/
triggerParms["multiMeasPlugin"]=1;	// enable multi-measure plugin if 1, disable if 0
triggerParms["flashPlugin"]= 1;		// enable flash compatibility plugin if 1, disable if 0
triggerParms["clickStreamPlugin"]= 1;	// enable 3rd party click stream plugin if 1, disable if 0
triggerParms["doubleCookiePlugin"]= 0;	// enable double cookie plugin if 1, disable if 0
triggerParms["thirdPartyCkPlugin"] = 0; // enable foresee persistent cookie drop if 1, disable if 0
triggerParms["multiVendorPlugin"] = 0;  // enable third-party vendor survey if 1, disable if 0

/**COMMON TRIGGER PARAMETERS**/
var trgClassId = "STD";	//default Standard=STD or OnExit=OE trigger class id
triggerParms["displayMode"] = 3; //0=disable, 1=popup then dhtml, 2=popup only, 3=default dhtml only
if (triggerParms["multiMeasPlugin"] == 0) {
	triggerParms["mid"] ="TESTDmfDolvf02V4OKEFsDeocA==";
	triggerParms["dLF"] = 1; // domain loyalty factor
	//triggerParms["nLF"] = 0; // navigation loyalty factor
	triggerParms["spL"] = 100.0; //launch sample percentage
}
triggerParms["cid"] = "B2QN5u13z0SifZFiOEGnoA=="; // customer id
triggerParms["spE"] = 100.0; //execute sample percentage for OE only
triggerParms["pc"] = 0; // persistent cookies if 1, default 0
triggerParms["rw"] = 129600; //resample wait (value in minutes)
triggerParms["olpu"] = 1; //default onLoad focus pop under, if 0 - focus parent window 
triggerParms["dropShownCookie"] = 1; // show dhtml/tracker again if 0, default 1 - drop AlreadyShown cookie
triggerParms["lfcookie"] = "ForeseeLoyalty_MID_B2QN5u13z0"; // change TESTCOOKIE to first 10 chars of MID
triggerParms["ascookie"] = "ForeseeSurveyShown_B2QN5u13z0"; // change TESTCOOKIE to first 10 chars of MID or CID
triggerParms["width"] = 550; //survey width
triggerParms["height"] = 500; //survey height
triggerParms["domain"] = ".staples.com"; //domain name
//triggerParms["omb"] = "1505-0186"; //OMB number
triggerParms["compliant508"] = 0; 	//508 compliant if 1
triggerParms["userURL"] = 1; // send page url as a cpp if 1, 0-disable
triggerParms["capturePageVisited"] = 1; //send total page visited as a cpp if 1, 0-disable

/**DHTML PARAMETERS**/
var dhtmlIncludeList= new Array();//add multiple dhtml filename(s) for 1-std/2-oe
var dhtmlTitle= new Array();//add multiple dhtml title(s)
var dhtmlText = new Array();//add multiple dhtml text(s)
dhtmlTitle["STD"]= "Thank you for visiting XYZ News!";	//if 'E'mbed is selected - change title and text here 
dhtmlText["STD"]= "You have been selected to take part in a customer satisfaction survey. This survey is conducted by an independent company, <a href=\"http://www.foreseeresults.com\" target=\"_blank\">ForeSee Results</a>. <br><br> The feedback obtained from this survey will help us to enhance our website. All results are strictly confidential.";
dhtmlTitle["OE"]= "Thank you for visiting XYZ News!";
dhtmlText["OE"] = "<b>Upon leaving our website,</b> you may be selected to take part in a customer satisfaction survey. This survey is conducted by an independent company, <a href=\"http://www.foreseeresults.com\" target=\"blank\">ForeSee Results</a>.<br><br> The feedback obtained from this survey will help us to enhance our website. All results are strictly confidential.";
//if 'I'nclude is selected - add different dhtml invite url here
//dhtmlIncludeList["STD"] = "/fsrscripts/FSRInvite.html";   //for standard
//dhtmlIncludeList["OE"] = "/fsrscripts/oeFSRInvite.html"; //for onExit
dhtmlIncludeList["STD"] = "/sbd/js/fsrscripts/FSRInvite.html";   //for standard
dhtmlIncludeList["OE"] = "/sbd/js/fsrscripts/oeFSRInvite.html"; //for onExit


/**DHTML POSITIONS**/ 
//center		bottom-center		bottom-right		bottom-left          upper-right           upper-left	    upper-center
//x,y = (2,150)		x,y = (2,350)		x,y = (1.02,350)	x,y = (60,350)     x,y = (1.02,50)     x,y = (60,50)	   x,y = (60,50)
//replace (x,y) below with any of the above values, default = center 
var x=2;
var y=150;

triggerParms["dhtmlType"] = 'I';//default I-nclude separate files, E-mbed both invites
triggerParms["dhtmlIndex"]= 10000; // z-index s/b greater then client’s dhtml z-index (if exist) - default 10000
triggerParms["dhtmlWidth"] = 400; // welcome page width
triggerParms["dhtmlHeight"] = 300; // welcome page height
triggerParms["dhtmlLeft"] = (self.screen.width - triggerParms["dhtmlWidth"])/x;			//invite page left position**DO NOT MODIFY**
triggerParms["dhtmlTop"] = Math.min((self.screen.height - triggerParms["dhtmlHeight"])/2,y);	//invite page top position**DO NOT MODIFY**

/**OE - SCOUT TRACKER PARAMETERS**/
triggerParms["oeMode"]  = 1; //trigger survey on domain change if 1, default mode=0, show survey on subdomain or protocol change
triggerParms["scoutRetry"] = 2; //default=2, check multiple times if OE condition is true.
triggerParms["scoutDelay"] = 1000; //default=1 sec, scout delay in millseconds.
triggerParms["scoutWidth"]  = 500;
triggerParms["scoutHeight"] = 290;
triggerParms["scoutCookieName"]= "ScoutRunningCheck";
triggerParms["scoutURL"]  = "/sbd/js/fsrscripts/surveyTracker.html";

/**ADD CUSTOMER PASSED PARAMETERS**/
//cppParms["cpp_5"] = "cpp_name:cpp_value"; //uncomment & replace name/value for STD
cppParms["oecpp_orderNum"]="Foresee_orderNum"; //uncomment & replace cppName for OE 

/**ADD ADDITIONAL CUSTOM VARIABLES**/
var siteExcludeList = new Array();	//uncomment if using site exclude domain list below
var referrerExcludeList = new Array();//uncomment if using referrer list below
//siteExcludeList[0] = ""; //list multiple pages,pathname/name/value pair to exclude
//refExcludeList[0] = ""; //list multiple referrer page urls to exclude

/**ADD ADDITIONAL FORESEE SYSTEM VARIABLES**/
var fsrTrigVer  = "TRG1_0x"; //track current trigger version  
var fsr_dropCookie="0"; //Drop retry cookie if 1 for OE Mode 1 only
var fsr_showErr="0";	//Show JavaScript Exception if 1 for OE modes only

/******* DON'T MODIFY BELOW THIS LINE *******/
/************ GLOBAL VARIABLES **************/
var popupURL = "//www.foreseeresults.com/survey/display";
var fsrImgURL= "//www.foreseeresults.com/survey/FSRImg";
var OTCImgURL= "//controller.foreseeresults.com/fsrSurvey/OTCImg";
var OTCImg=null;
var fsrImg=null;
var surveyPopUp=null;
var cpp_3 = "";
var cppCounter=4;
var surveyPresentedBy = "normal";
var surveyWinName = "ForeseeSurveyWindow";
var hParent = null;
var tempURL=null;
var oeRetry=1;
var oeCounter=0;
var pageCount=0;
var isBlankOnce=false;
var trigOnClick=false;
var randNum=null;
var dcQString="";
var fsr_Detect = navigator.userAgent.toLowerCase();
var fsr_Version= navigator.appVersion.toLowerCase();
var fsr_ie=(fsr_Detect.indexOf("msie")>=0 && fsr_Version.indexOf("win") != -1) ? 1 :0;
var fsr_aol=null;
var fsr_opera=null;
var fsr_opera75=null;
var fsr_mac=null;
var fsr_NS=null;
var fsr_NS70=null;
var fsr_NS62=null;
var fsr_NS8=null;
var winOptions = "toolbar=0,scrollbars=1,location=0,statusbar=0,menubar=0,resizable=1,width=1,height=1,top=4000,left=4000";

/** Initialize user URL in case of OE secondary measure **/
if (trgClassId=="OE") {if (triggerParms["userURL"] ==1){cppParms["cpp_1"] = (window.opener !=null) ? "userURL:"+ fsrGetEscapeChars(window.opener.location.href,":","|") : "userURL:"+fsrGetEscapeChars(window.location.href,":","|");}}

/************ COMMON FUNCTIONS ************/
function fsrSetRandNum() {
	randNum = Math.random()*100;
}
function fsrSetCookie (name, value) {
	var argc = arguments.length;
	var expires = (argc > 2) ? arguments[2] : null;
	var path = (argc > 3) ? arguments[3] : null;
	var domain = (argc > 4) ? arguments[4] : null;
	var secure = (argc > 5) ? arguments[5] : null;
	document.cookie = name + "=" + encodeURIComponent(value) +
	((expires == null) ? "" : ("; expires=" + expires.toGMTString())) +
	((path == null) ? "" : ("; path=" + path)) +
	((domain == null) ? "" : ("; domain=" + domain)) +
	((secure == null) ? "" : "; secure");
}
function fsrSetSurveyURL(name,value){
	if (value==null || value==0) return;
	popupURL += name + value;		
}
function fsrSetParams(){
	fsrSetSurveyURL("?width=", triggerParms["width"]);
	fsrSetSurveyURL("&height=", triggerParms["height"]);
	fsrSetSurveyURL("&cid=", encodeURIComponent(triggerParms["cid"]));
	fsrSetSurveyURL("&mid=", encodeURIComponent(triggerParms["mid"]));
	fsrSetSurveyURL("&omb=", triggerParms["omb"]);
	fsrSetSurveyURL("&olpu=", triggerParms["olpu"]);
	fsrSetSurveyURL("&dcUniqueId=", triggerParms["dcUniqueId"]);
	fsrSetSurveyURL("&ndc=1&fsexp=5256000&midexp=", triggerParms["midexp"]);
	fsrSetSurveyURL("&rso=1&rct=", triggerParms["rso"]);	
}
function fsrSetCustomerPassedParams(){
	if (trgClassId=="STD") {if (triggerParms["userURL"] == 1) {cppParms["cpp_1"] = "userURL:" + fsrGetEscapeChars(window.location.href,":","|")}}
	if (triggerParms["capturePageVisited"] == 1) {cppParms["cpp_2"] = "PageView:" + fsrGetLFCookie()};
	var trgType = "Browser:"+ trgClassId;
	trgType = (trgClassId=="STD") ? trgType +";normal;" + fsrTrigVer +";" : trgType + "-Mode" + triggerParms["oeMode"] + ";" + fsrGetURLParameters('surveypresented') + ";" + fsrTrigVer + ";";
	cppParms["cpp_3"] = trgType + fsrGetEscapeChars(fsr_Detect,":","|");
	if (trgClassId=="OE"){
	   for(paramKey in cppParms) {
	     if(paramKey.substring(0,5) == "oecpp"){
	       var value = cppParms[paramKey];
	       var session = fsrGetCookie(value);
	       if (session != null) {
	          cppParms["cpp_"+ cppCounter] = value.substring(8,value.length) + ":" + session;
	          cppCounter++;	
	       }
	     }
	   }
	}
	for(paramKey in cppParms) {
	     if(paramKey.substring(0,3) == "cpp"){
	         fsrSetSurveyURL("&"+ paramKey + "=", encodeURIComponent(cppParms[paramKey],":","|"));
	     }
	}
}
function fsrSetAlreadyShownCookie() {
   if(triggerParms["dropShownCookie"] == 1) {
	var persistentExpires=null;
	if(triggerParms["pc"] == 1) {
	  persistentExpires = new Date(); /*persistent cookie expiration*/
	  persistentExpires.setTime(persistentExpires.getTime() + (triggerParms["rw"]*60*1000));
	}
	if(triggerParms["pc"] != -1) {
		fsrSetCookie(triggerParms["ascookie"], 'true', persistentExpires, "/",triggerParms["domain"]);
	}
   }
}
function fsrSetValidBrowser(){
	fsr_aol= ((fsr_Detect.indexOf(name) >=0) || (fsr_Detect.indexOf("america online browser") >=0)) ? 1 : 0;
	fsr_opera = (fsr_Detect.indexOf("opera") >=0) ? 1 : 0;
	fsr_NS = ((fsr_Detect.indexOf("netscape") >=0) || (fsr_Detect.indexOf("firefox") >=0)) ? 1 : 0;
	fsr_NS70=(fsr_Detect.indexOf("netscape") >= 0 && fsr_Detect.indexOf("7.0") >= 0) ? 1 : 0;
	fsr_NS62=(fsr_Detect.indexOf("netscape") >= 0 && fsr_Detect.indexOf("6.2") >= 0) ? 1 : 0;
	fsr_NS8=(fsr_Detect.indexOf("netscape/8") >=0) ? 1 : 0;	
	fsr_mac= (navigator.platform.indexOf("Win32") < 0) ? 1 : 0;
}
function fsrSetLFCookie(ckName){
	var stillDropCk=true;
	if (ckName==null) return;
	pageCount = fsrGetCookie(ckName); /*check loyalty cookie*/
	if (pageCount == null) {pageCount=1;}
	else pageCount++;
	if (triggerParms["dLF"] <=1 && trgClassId=="STD" && triggerParms["multiMeasPlugin"]==0) stillDropCk=false;
	if (stillDropCk)
	fsrSetCookie(ckName, pageCount, null,'/',triggerParms["domain"]);
}
function fsrGetLFCookie(){
	pageCount = fsrGetCookie(triggerParms["lfcookie"]);
	if (pageCount==null ) pageCount=1;
	return pageCount;
}
/*replace + with %2B and : with |*/
function fsrGetEscapeChars(s,findStr,replaceStr) {
	var encoded = "";
	if (s==null) return encoded;
	var tokens = s.split(findStr);
	for(var i = 0; i < tokens.length; i++) {
		encoded += tokens[i];
		if(i < (tokens.length - 1)) {
			encoded += replaceStr;
		}
	}
	return encoded;
}
function fsrDeleteCookie(name) {
    document.cookie = name + "=" + "; expires=Thu, 01-Jan-70 00:00:01 GMT" +  "; path=/";
}
function fsrGetCookie(name) {
	var prefix = name + "=";
	var begin = document.cookie.indexOf("; " + prefix);
	if (begin == -1) {
		begin = document.cookie.indexOf(prefix);
		if (begin != 0) return null;
	} else begin += 2;
	var end = document.cookie.indexOf(";", begin);
	if (end == -1) end = document.cookie.length;
	return decodeURIComponent(document.cookie.substring(begin + prefix.length, end));
}
function fsrGetDateTimestampId(){
	var newDt   = new Date();
	return newDt.getTime(); 
}
function fsrGetURLParameters(paramName) {
	var sURL = window.document.URL.toString();		
	if (sURL.indexOf("?") > 0) {
		var arrParams = sURL.split("?");			
		var arrURLParams = arrParams[1].split("&");		
		var arrParamNames = new Array(arrURLParams.length);
		var arrParamValues = new Array(arrURLParams.length);
		
		var i = 0;
		for (i=0;i<arrURLParams.length;i++)
		{
		    var sParam =  arrURLParams[i].split("=");
		    if (paramName==sParam[0]){
		       	return decodeURIComponent(sParam[1]);
		    }else{
		       return "";
		    }		
		}
	}
	return "";
}
function fsrIsParentURLChanged(){
	var currentURL=null;
	var changedStatus=false;
	if (triggerParms["oeMode"]==1) {   
		currentURL = fsrGetCookie('currentURL');
	} 
	else {
		/*tracker throws exception if parent url is changed or exit condition*/
		currentURL = (window.opener==null) ? window.location.href : window.opener.location.href;
	}
	if (currentURL != tempURL) {  
	 if (currentURL != 'blank' && tempURL != 'blank'){changedStatus=true;}
	}
	tempURL=currentURL;
	return changedStatus;
}
function fsrIsValidBrowser() {
	if ((trgClassId=="STD" && fsr_NS62) || (trgClassId=="OE" && fsr_mac || fsr_opera || fsr_NS62 || fsr_NS70)) return false; 
	return true;
}
function fsrIsCookieEnabled() {
	var cookieEnabled=(navigator.cookieEnabled)? true : false;
	/*if not IE4+ nor NS6+*/
	if (typeof navigator.cookieEnabled=="undefined" && !cookieEnabled){ 
		document.cookie="testcookie";
		cookieEnabled=(document.cookie.indexOf("testcookie")!=-1)? true : false;
	}
	return cookieEnabled;
}
/**catching window.closed exception in Win/SP2 - property is not supported anymore in IE **/
function fsrIsParentClosed(){
	try {if (window.opener.closed){return true;}}
	catch (e) {return true;}
	return false;
}
function fsrIsOnExcludeList(list) {	
	var myExcludeList = siteExcludeList;
	var pageURL="";
	if (list != null) myExcludeList = list;
	if (myExcludeList.length == 0) return false;
	if (triggerParms["oeMode"]==1) pageURL = fsrGetCookie('currentURL');
	else pageURL = (window.opener == null) ? window.location.href : window.opener.location.href;
	if (list != null) pageURL = this.document.referrer;
	if (pageURL=="" || pageURL==null) return false;
	for(key in myExcludeList) {
		if(pageURL.indexOf(myExcludeList[key]) != -1) {return true;}
	}
	return false;
}
function fsrIsExitCondition(){
	if(triggerParms["displayMode"] == 0 || fsrIsSurveyShown() || !fsrIsCookieEnabled() || 
	   fsrIsOnExcludeList() || fsrIsOnExcludeList(referrerExcludeList)){return true;}
	return false;
}
function fsrIsPopupBlocked(winURL,winName){
	/*popup window standard option */
	surveyPopUp = window.open(winURL, winName, winOptions);
	if (surveyPopUp==null || typeof(surveyPopUp)=="undefined" || surveyPopUp.closed) {
		if (triggerParms["olpu"] == 0) self.focus();
		return true;
	}
	try{
		/*Toolbar popupblocker fix*/
		if (trgClassId=="STD" || arguments.length==3) {surveyPopUp.focus();}
		else surveyPopUp.blur();
	} catch (e){return true;}	     	
	if (triggerParms["olpu"] == 1) {self.focus();}
 	return false;
}
function fsrIsSurveyShown(){

	if (fsrGetCookie(triggerParms["ascookie"]) != null) {return true;}
	return false;
}
function fsrIsValidFlash(){
   /** detect flash with valid browser and player version**/
   if (triggerParms["flashPlugin"]==1){
   	try {if (fsrCheckFlash()) return true;
   	     else return false;
   	} catch (e) {return false;}
   }
   return true;
}
/************ FAILOVER RELATED FUNCTIONS ************/
function fsrIsImgError() {
	return true;
}
function fsrIsImgOnload() {
	if(fsrImg.width == 3) {fsrInviteAct(1);}
  	return true;
}
function fsrIsOTCError() {
	fsrPostOTCOnload();
	return true;
}
function fsrIsOTCOnload() {
	if(OTCImg.width == 3) {fsrPostOTCOnload(); }
  	return true;
}
function fsrPostOTCOnload(){
	if(dcQString == "") {fsrInviteAct(1);}
	else {
		fsrImg = new Image();
		fsrImg.onerror = fsrIsImgError;
		fsrImg.onload = fsrIsImgOnload;
		fsrImg.src = fsrImgURL + "?" + dcQString + "&uid="+ fsrGetDateTimestampId();	
	}
}
function fsrExecuteOTC() {
	/*Failover and DHTML Check*/
	OTCImg = new Image();
	OTCImg.onerror = fsrIsOTCError;
	OTCImg.onload = fsrIsOTCOnload;
	OTCImg.src = OTCImgURL + "?protocol=" + window.location.protocol + "&uid="+ fsrGetDateTimestampId();	/*for NE/FF Cache Fix*/
}
/************ DHTML RELATED FUNCTIONS ************/
function fsrSetDHTML(){
	var dhtmlBody = '<style type="text/css">\n' +
	'.dropin {background-color:#FFFFFF;border:2px solid black;padding:2px;}\n' +
	'td, input {\n'+
	'font-family:Verdana, Geneva, Arial, Helvetica, sans-serif;\n'+
	'font-size:11px;\n'+
	'}\n'+
	'.subtitle {font-size: 120%;color:#000000;font-weight:bold;}\n' +
	'.footnote{font-size: 80%;font-weight: bold;}\n' +
	'</style>\n'+
	'<table class="dropin" summary="Outer table for formatting layouts" width="100%">\n' +

	'	<tr>\n' +
	'		<td>\n' +
	'		<a href="javascript:window.parent.fsrCloseDHTML()" title="Close the Window">\n' +
	'		<img src="./fsrscripts/closebtn.gif" alt="Close Window Button" align="right" border="0" height="14" width="16"><!--Close it--></a>\n' +
	'		</td>\n' +
	'	</tr>\n'+
	'	<tr>\n' +
	'		<td style="padding: 0px 10px 10px;">\n' +
	'			<table summary="Inner table for formatting layouts" width="100%">\n' +
	'				<tr>\n' +
	'					<td align="left" valign="center"><img src="./fsrscripts/sitelogo.gif" alt="Site logo"></td>\n' +
	'					<td align="right" valign="top"><img src="./fsrscripts/FSRlogo.gif" alt="ForeSee Results logo"></td>\n' +
	'				</tr>\n' +
	'			</table>\n' +
	'		</td>\n' +
	'	</tr>\n' +
	'	<tr>\n' +
	'		<td style="padding: 0px 15px 10px;" align="left" valign="top" width="100%">\n' +
	'			<span class="subtitle"><script>document.write(dhtmlTitle[trgClassId])</script>\n' +
	'			</span><br><br><script>document.write(dhtmlText[trgClassId])</script>\n' +
	'		</td>\n' +
	'	</tr>\n' +
	'	<tr>\n' +
	'		<td>\n' +
	'			<table summary="Inner table for formatting layouts" border="0" cellpadding="5" cellspacing="5" width="100%">\n' +
	'				<tr>\n' +
	'					<td align="left"><a href="javascript:window.parent.fsrContinue()" title="Continue"><img src="./fsrscripts/contbtn.gif" alt="Continue Button" border="0"></a></td>\n' +
	'					<td align="right"><a href="javascript:window.parent.fsrCloseDHTML()" title="No Thanks"><img src="./fsrscripts/nothanksbtn.gif" alt="No Thanks" border="0"></a></td>\n' +
	'				</tr>\n' +
	'			</table>\n' +
	'		</td>\n' +
	'	</tr>\n' +
	'	<tr>\n' +
	'		<td height="1" valign="top" align="center" class="footnote">\n' +
	'		<script type="text/javascript">\n' +
	'				if (window.parent.fsr_NS8){\n' +
	'					document.write("*In Netscape 8+, the survey might open in a separate tab");\n' +
	'				}\n' +
	'		</script>\n' +
	'		</td>\n' +
	'	</tr>\n' +
	'</table>';
	document.write("<div id=\"FSRInviteWin\" style=\"position:absolute; width:0px; height:0px; left:" + triggerParms["dhtmlLeft"]+"px; top:"+ triggerParms["dhtmlTop"]
		+ "px; z-index:"+triggerParms["dhtmlIndex"]+"; border:0; visibility:hidden; filter:revealTrans(Duration=0.5, Transition=23);\">");
	if (triggerParms["dhtmlType"] =='E') {
		document.write(dhtmlBody);
	}
	else {
		document.write("<iframe id=\"FSRIframeWin\" src=\"/sbd/js/fsrscripts/blank.html\" width=\"0\" height=\"0\"></iframe>");	}
	document.write("</div>");
}
function fsrShowDHTML() {
	if (triggerParms["displayMode"] !=2 && fsrIsValidFlash()) {
		if (trgClassId=="OE") {if (triggerParms["doubleCookiePlugin"]==1) fsrSetDoubleCookie();}
		fsrExecuteOTC();
	}
}
function fsrContinue() {
	if (trgClassId=="STD") {
		popupURL = popupURL.replace("normal","dhtml");
		fsrIsPopupBlocked(popupURL,surveyWinName);
	}	
	else if (trgClassId=="OE") {
		triggerParms["displayMode"]= 2;
		fsrOpenTrackerWin();
	}
	fsrInviteAct(0);
}
function fsrCloseDHTML() {
	if (trgClassId=="OE") fsrSetAlreadyShownCookie(); /**drop cookie for OE trigger only**/
	fsrInviteAct(0);
}
function fsrInviteAct(dhtmlMode) {
	/** dhtmlMode=0 - Hide
	 ** dhtmlMode=1 - UnHide **/
	surveyPresentedBy = "dhtml";
	var dhtmlSrc = "";
	if (triggerParms["dhtmlType"] =='I') {
	for(key in dhtmlIncludeList) {
		if(key == trgClassId) {
			dhtmlSrc = dhtmlIncludeList[key];
			break;
		}
	}
	}
	if(document.all && document.all.FSRInviteWin.filters) {
	    	if (dhtmlMode == 1) {
		    	document.all.FSRInviteWin.style.width = triggerParms["dhtmlWidth"];
			document.all.FSRInviteWin.style.height= triggerParms["dhtmlHeight"];
			if (triggerParms["dhtmlType"] =='I') {
				document.all.FSRIframeWin.src = dhtmlSrc;
	    			document.all.FSRIframeWin.width = triggerParms["dhtmlWidth"];
	    			document.all.FSRIframeWin.height= triggerParms["dhtmlHeight"];
	    		}
	    	}
	    	document.all.FSRInviteWin.filters.revealTrans.transition = 23;
	    	document.all.FSRInviteWin.filters.revealTrans.Apply();
	    	document.all.FSRInviteWin.style.visibility = (dhtmlMode==1) ? 'visible' : 'hidden';
	    	document.all.FSRInviteWin.filters.revealTrans.Play();
	} else if(document.all) {
		if (dhtmlMode == 1) {
			document.all.FSRInviteWin.style.width = triggerParms["dhtmlWidth"];
			document.all.FSRInviteWin.style.height= triggerParms["dhtmlHeight"];
			if (triggerParms["dhtmlType"] =='I') {
				document.all.FSRIframeWin.src = dhtmlSrc;
				document.all.FSRIframeWin.width = triggerParms["dhtmlWidth"];
		    		document.all.FSRIframeWin.height= triggerParms["dhtmlHeight"];
		    	}
	    	}
		document.all.FSRInviteWin.style.visibility = (dhtmlMode==1) ? 'visible' : 'hidden';
	} else if(document.getElementById){
		if (dhtmlMode == 1) {
			document.getElementById("FSRInviteWin").style.width = triggerParms["dhtmlWidth"];
			document.getElementById("FSRInviteWin").style.height= triggerParms["dhtmlHeight"];
			if (triggerParms["dhtmlType"] =='I') {
				document.getElementById("FSRIframeWin").src = dhtmlSrc;
				document.getElementById("FSRIframeWin").width = triggerParms["dhtmlWidth"];
	    			document.getElementById("FSRIframeWin").height= triggerParms["dhtmlHeight"];
	    		}
	    	}
		document.getElementById("FSRInviteWin").style.visibility = (dhtmlMode==1) ? 'visible' : 'hidden';
	}	
}
/************ OE RELATED FUNCTIONS ************/
function fsrOpenTrackerWin() {
	var sl = (screen.width-triggerParms["scoutWidth"])/2;
	var st = (screen.height-triggerParms["scoutHeight"])/2;
	winOptions = "toolbar=0,scrollbars=1,location=0,statusbar=0,menubar=0,resizable=1,"+ "top=" + st + ",left=" + sl + ",width=" + triggerParms["scoutWidth"] + ",height=" + triggerParms["scoutHeight"];
	var scoutURL = triggerParms["scoutURL"] +"?surveypresented="+surveyPresentedBy + "&measID="+fsrMeasId;
	var scoutTracker = fsrGetCookie(triggerParms["scoutCookieName"]);	
	if (scoutTracker == null) {
		if ((fsrGetLFCookie() >= triggerParms["dLF"] && randNum <= triggerParms["spL"]) || trigOnClick==true) {
			if (triggerParms["displayMode"] !=3) {
				if (!fsrIsPopupBlocked(scoutURL,surveyWinName)) {return;}
			}
		} else return;
	} else {		
		/*overwrite scout again if not shown and scout not closed by another scout and mid is not the same*/
		if (!fsrIsSurveyShown() && scoutTracker != 'ScoutClosed' && scoutTracker != triggerParms["mid"]){
			if (!fsrIsPopupBlocked(scoutURL,surveyWinName)) {
				if(randNum > triggerParms["spL"]) {
					fsrCloseTrackerWin(surveyPopUp);
				}
				return;
			}
		} else return;
	}	
	fsrShowDHTML();
}
function fsrOpenOnExitSurvey() {
	fsrSetRandNum();
	if(randNum <= triggerParms["spE"] || triggerParms["spE"] == null) {
		/** always subtract 1 to remove additional LF that was added when Tracker open first time **/
		pageCount=(fsrGetLFCookie())-1;
		fsrSetCookie(triggerParms["lfcookie"], pageCount, null,'/',triggerParms["domain"]);
		fsrSetParams();
		if (triggerParms["clickStreamPlugin"]==1) fsrSetClickStreamParams();
		fsrSetCustomerPassedParams();			
		fsrSetAlreadyShownCookie();
		fsrLoadWaitTracker();
		fsrIsPopupBlocked(popupURL,surveyWinName,0);
		return;
	}
	fsrCloseTrackerWin(this);
	return;
}
function fsrLoadWaitTracker() {
	document.write("<B>Survey is loading. Please wait...</B>");
}
function fsrOnUnload() {
	if (triggerParms["oeMode"] == 1) {
		fsrSetCookie('previousURL',fsrGetCookie('currentURL'), null,'/',triggerParms['domain']);
		fsrSetCookie('currentURL', 'blank', null,'/',triggerParms['domain']);
	}
}
function fsrOnUnloadTracker(){
	fsrSetCookie(triggerParms["scoutCookieName"], "ScoutClosed", null,"/",triggerParms["domain"]);
}
function fsrOEUpdate(){
	/**update user url cpp based on OE Modes***/
	fsrOEUpdateParentURL();
	/**drop LFCookie only if previous URL not eq current url***/
	if (fsrIsParentURLChanged()){
		oeCounter++;
		fsrSetLFCookie(triggerParms["lfcookie"]);
	}
	/**checking if exclude list or nLF >= scoutTracker Counter **/
	if(fsrIsOnExcludeList() || 
	  (triggerParms["nLF"]) != null && oeCounter >= triggerParms["nLF"]) {
		fsrOpenOnExitSurvey();
		return;
	}
}
function fsrOEUpdateParentURL(){
	if (triggerParms["userURL"] == 1) {
		if (triggerParms["oeMode"] == 0){
			hParent = window.opener;
			cppParms["cpp_1"] = "userURL:" + fsrGetEscapeChars (hParent.location.href,":","|");
		}
		else if ((fsrGetCookie('previousURL') != null && arguments.length == 0 && triggerParms["nLF"] == null) ||
			 (fsrGetCookie("currentURL") == 'blank')) {
			cppParms["cpp_1"] = "userURL:"+ fsrGetEscapeChars (fsrGetCookie('previousURL'),":","|");
		}
	}
}
function fsrOECookieCheck(){
	hParent = window.opener;
	/*close tracker if no cookies setup*/
	if(fsrGetCookie("currentURL") == null){fsrCloseTrackerWin(this); return;}
	/*continue looping if trigger MID == null or currentURL cookie not blank*/
	if ((triggerParms["mid"] != null) && (fsrGetCookie("currentURL") == 'blank' ||
	    				      (fsr_ie && fsrIsParentClosed()))) {
			if (fsr_dropCookie == 1) fsrSetCookie("Foresee_OEMode1Retry", oeRetry, null,'/',triggerParms["domain"]);
			if (fsr_ie && fsrIsParentClosed()){
				/*Issue with IE and Google Popupblocker
				 *Blocks onUnload on closing of window or browser
				 *By default, pop survey with or w/o any popup blockers*/
				fsrOEUpdateParentURL(true);/*get currentURL instead of previousURL*/
				oeRetry=triggerParms["scoutRetry"];
			}
			else {
				isBlankOnce=true;
				/*do not use hParent.closed - causes problem in IE/NS/FF*/
				if (hParent == null) {oeRetry = triggerParms["scoutRetry"]};
			}
			if (fsr_showErr==1) alert("FSR Exception in Trigger Type:"+ trgClassId + "-Ver:"+ fsrTrigVer+"-Mode:"+ triggerParms["oeMode"] + " Counter:"+ oeRetry);
			if (fsrOEIsSurveyShown()) {return;}
	}
	else {
		if (triggerParms["mid"] != null) {
			isBlankOnce=false;
			/**resetting retry counter to avoid false positive due to delay in page loading**/
			if (oeRetry >1) {oeRetry=1;}
		}	
	}
	setTimeout ( "fsrOECheck();", triggerParms["scoutDelay"], "JavaScript" );
}
function fsrOEIsSurveyShown(){
	if (oeRetry<triggerParms["scoutRetry"]) {
		oeRetry++;
		return false;
	}
	try {
	    /** additional mode 0 domain change check in mode 1 - keep checking if both parent & child domain are same to avoid false positive**/
	    if (triggerParms["oeMode"] == 1) {
		hParent = window.opener;
		if (hParent != null) {
		if (triggerParms["domain"] == null) triggerParms["domain"] = window.location.hostname;
		if ((hParent.location.hostname).indexOf(triggerParms["domain"]) != -1) {
			if (oeRetry >1) {oeRetry=1;}
			return false;
		}
		}
	    }
	} catch (e) {}
	fsrOpenOnExitSurvey();
	return true;
}
function fsrOECheck(){
	fsrOEUpdate();
	if (triggerParms["oeMode"] == 0) {
		hParent = window.opener;
		if (this.document.domain != hParent.document.domain) {
			if (fsrOEIsSurveyShown()) return;
		}
		setTimeout ( "fsrOECheck();", triggerParms["scoutDelay"], "JavaScript" );
	}
	else {
		/** resetting retry counter to avoid false positive due to delay in page loading
		    and also when opening multiple browser sessions 
		 **/
		if (isBlankOnce==false)	oeRetry=1; /*this line is causing issue if currentURL = blank on any page then it doesnt loads the page because the counter always stays at 1.*/
		fsrOECookieCheck();
	}
}
function fsrOEErrorHandler(msg,url,line){
	/*for debugging purpose*/
	if (fsr_showErr==1) alert("FSR Exception in Trigger Type:"+ trgClassId + "-Ver:"+ fsrTrigVer+"-Mode:"+ triggerParms["oeMode"] + " Counter:"+ oeRetry+ " -- Error details\n:"+ msg +"\n"+url+"-"+line);
	if (triggerParms["oeMode"] == 0){
		hParent = window.opener;
		if (hParent == null || (fsr_ie && fsrIsParentClosed())) {oeRetry = triggerParms["scoutRetry"]};
		if (fsrOEIsSurveyShown()) {return;}
		setTimeout ( "fsrOECheck();", triggerParms["scoutDelay"], "JavaScript" );
	}
	else { fsrOECookieCheck();}
	return true;
}
function fsrCloseTrackerWin(winObj) {
	fsrSetAlreadyShownCookie();
	winObj.close();
}
function fsrCheckTrackerWin() {
      var scoutTracker = fsrGetCookie(triggerParms["scoutCookieName"]);
      if (scoutTracker!=null && scoutTracker != "ScoutClosed") {
	var trackerWin = window.open(triggerParms["trackerURL"],surveyWinName);
      	if (trackerWin != null && !trackerWin.closed) {fsrCloseTrackerWin(trackerWin);}
      }
}
/*********************************************
 ******** TRIGGER BASED FUNCTIONS ************
 *********************************************/
function fsrExecuteStd() {
	if ((fsrGetLFCookie() >= triggerParms["dLF"] && randNum <= triggerParms["spL"]) || trigOnClick==true) {
		fsrSetParams();
		if (triggerParms["doubleCookiePlugin"]==1) fsrSetDoubleCookie();
		if (triggerParms["clickStreamPlugin"]==1) fsrSetClickStreamParams();
		fsrSetCustomerPassedParams(); 
		fsrSetAlreadyShownCookie();
		if (triggerParms["displayMode"]!=3){ 
			if (!fsrIsPopupBlocked(popupURL,surveyWinName)) {return;}
		}
		if (fsrIsValidBrowser()) {fsrShowDHTML();}
	}	
	return;
}
function fsrExecuteOE() {	
	if (fsrIsValidBrowser()) {
		if (triggerParms["rso"] == 1) {
			triggerParms["pc"] = -1;
			if (triggerParms["aro"] == 1) triggerParms["spL"] = 100.0;
		}
		fsrOpenTrackerWin();
	}
  	return;
}
/*********************************************
 **********  MAIN POLL FUNCTION  *************
 *********************************************/
function fsrPoll() {
	fsrSetLFCookie(triggerParms["lfcookie"]);
	if (fsrIsExitCondition()) return;
	if (arguments.length==1 && arguments[0] == true) trigOnClick=true;
	fsrSetValidBrowser();
	fsrSetDHTML(); /**Initialize empty DHTML layer in Parent Window only**/
	fsrSetRandNum();
	if (trgClassId=="STD") {
		fsrExecuteStd();
	}
	else if (trgClassId=="OE") {
		fsrExecuteOE();
	}
	return;
}
/***************************************************************
 ** Plugin:  fsrMultiMeasure.js
 ** Copyright:2001-2007 ForeseeResults, Inc
 ** Desc:    Show different Survey based on mid as defined below
 **	     Add new ones if requred herea and set it in specific page
 **	     e.g.: var fsrMeasId = BROWSE|CHECKOUT|POS
 ** Instructions: Paste this plugin or include this JS at the bottom
 **		  of fsrLauncher.js
 **************************************************************/
var DEFAULT_ENTRY=1;		//default entry page id
var BROWSE=2;	//exit browse measure
var ZIP=3;	//exit checkout measure
var PURCHASE=4;	//exit purchase measure
var DEFAULT_EXIT=BROWSE;	//default exit page id

function fsrInitMeasure(mid){

	if (mid == DEFAULT_ENTRY){
		trgClassId = "STD";
		triggerParms["mid"] = "MRwNZpQV8kpF4pBYdsoFBg=="; // model instance id
		triggerParms["dLF"] = 1;
		triggerParms["spL"] = 100;
	}
	else if (mid == BROWSE){
		trgClassId = "OE";
		triggerParms["mid"] = "MQxRIMh4o1YAdMFx8YVcAw==";
		triggerParms["dLF"] = 0;
		triggerParms["spL"] = 2.1;
	}
	else if (mid == ZIP){
		trgClassId = "OE";
		triggerParms["mid"] = "FtoEEgsMY89gpF1ZZVEdZw==";
		triggerParms["dLF"] = 0;
		triggerParms["spL"] = 10;
	}
	else if (mid == PURCHASE){
		//ForeSee wants to get the order number along with this survey
		trgClassId = "OE";
		triggerParms["mid"] = "1Ndlg4wFINFMA1gd8YNlIw==";
		triggerParms["dLF"] = 0;
		//triggerParms["nLF"] = 9; //navigation loyalty factor
		triggerParms["spL"] = 22;
	}
}
function fsrInitLiftMeasure(mid){
	/** LIFT MEASURE [CASE 1]:
	 ** Description:
	 **	Show Entry Survey only when its a First Visit & sampl% is met
	 ** 	Show or open Respt.Exit Survey Tracker when the second sampl% is met
	 **
	 ** 	NOTE: spL_Entry is defined first and then spL_Exit. spL_Exit must = 100% if it has multiple measures
	 ** 	Define other multiple OnExit spL along with their respt. measure id (BROWSE,CHECKOUT,PURCHASE, etc) in the above method
	 ** 	To monitor page visited across different Measure, use the same loyaltyCookie
	 ** 	Example:
	 **	To setup various sp% - e.g.: onEntry=10%  onExit-Browse=20%, onExit-CHECKOUT=40%, onExit-PURCHASE=60% then 
	 ** 	spL_Entry= 100.0;  //1-10
	 ** 	spL_Exit = 0.0; //10.1 - 100
	 **/

	spL_Entry =3.0;  //onEntry measure
	spL_Exit  =100.0; //onExit measure must be 100% 

	if (fsrIsSurveyShown()) return;

	fsrSetRandNum();
	
	//MULTIPLE EXIT MEASURE
	if ((randNum > spL_Entry && randNum <= spL_Exit) ||
	    (fsrGetCookie(triggerParms["scoutCookieName"]) !=null && fsrGetCookie(triggerParms["scoutCookieName"]) !="ScoutClosed")) {
		if (mid=="" && fsrGetCookie(triggerParms["scoutCookieName"]) ==null) mid=DEFAULT_EXIT;
		fsrInitMeasure(mid);
		return;
	}
	//FIRST TIME ENTRY MEASURE ONLY
	if ((randNum >0 && randNum <= spL_Entry) && fsrGetCookie(triggerParms["lfcookie"]) == null) {
		fsrInitMeasure(DEFAULT_ENTRY);
		return;
	}
	triggerParms["displayMode"] = 0;	
}
/**************************************************************
 ** Plugin:  fsrFlashDetection.js
 ** Copyright:2001-2007 ForeseeResults, Inc
 ** Desc:    Checks for flash compatibility against browsers
 ** Instructions: Paste this plugin or include this JS at the bottom
 **		  of fsrLauncher.js
 **************************************************************/
var flashTagList= new Array();
//not to be used with other embedded objects e.g. (.dcr/.mov/.mpeg/.avi/.wma/.wmv/.aam/.rm/.ram)
flashTagList[0]= "swf";			// flash src check for IE/NE complaint browsers
flashTagList[1]= "spl";			// splash src check for IE/NE complaint browsers
flashTagList[2]= "clsid:d27cdb6e-ae6d-11cf-96b8-444553540000";	//activeX ID check for IE browsers only
var flash_version= 4;	/*supports flash version 4 and above in IE only*/
var canFlashPlay=0;
/* FOR MSIE BASED BROWSERS ONLY - detect Flash Plugin & Version*/
if (fsr_ie && triggerParms["flashPlugin"] == 1) {
document.write('<SCR' + 'IPT LANGUAGE=VBScript\> \n');
document.write('on error resume next \n');
document.write('canFlashPlay = ( IsObject(CreateObject("ShockwaveFlash.ShockwaveFlash." & flash_version)))\n');
document.write('</SCR' + 'IPT\> \n');
}
function fsrCheckFlashParms(tagName){
	tagName = tagName.toLowerCase();
	for(key in flashTagList) {
		if(tagName.indexOf(flashTagList[key]) != -1) {
			return true;
		}
	}
	return false;
}
function fsrDetectFlash(){
	if (fsr_ie){
	    /** For IE Compatible browsers **/
	    var obj = document.all.tags("OBJECT");
	    if (obj.length == 0) return true;
	    for (var e=0; e<obj.length;e++){
	       for (var d=0; d<obj[e].attributes.length;d++){
		  if ((obj[e].attributes[d].name).toLowerCase() == "classid") {
			if (fsrCheckFlashParms(obj[e].attributes[d].value)){
			   return true;
			}
			else {
			   return false;
			}
		  }
	       }
	    }
	}					    
	else{
	    /** For Netscape Compatible browsers **/
	    if (document.embeds.length == 0) return true;
	    for (var e=0; e<document.embeds.length;e++){
		if (fsrCheckFlashParms(document.embeds[e].src)) {
		   return true;
		}
		
	    }
	}
	return false;
}
/** check flash with valid browser and player version**/
function fsrCheckFlash(){
    if (fsrDetectFlash()){
		var fsr_opera75 = (fsr_Detect.indexOf("opera 7.54u1") >=0) ? 1 : 0;
		var fsr_NS = ((fsr_Detect.indexOf("netscape") >=0) || (fsr_Detect.indexOf("firefox") >=0)) ? 1 : 0;
		if (fsr_NS)
			flash_version=7;	/*Netscape Mozilla supports flash player 7 and above*/
		if (fsr_mac)
			flash_version=8;	/*Mac Browsers supports flash player 8 and above*/
		/** FOR MOZILLA BASED BROWSERS - detect flash plugin & version **/
		var plugin=(navigator.mimeTypes&&navigator.mimeTypes["application/x-shockwave-flash"]?navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin:0);
		if (plugin && parseInt(plugin.description.substring(plugin.description.indexOf(".")-1))>=flash_version) 
		{ canFlashPlay=1; }
		if ((plugin ==0 || plugin==null) && !canFlashPlay){
			return true;
   		}
		else {
			/** Skip dhtml invite for the following browsers:
			 ** For Opera ver 7.5 and below and 
			 ** All Netscape Browsers with flash ver < 7
			 ** Mac Browsers with flash 7 and below
			 ** Reason: possible bug in browser or with flash player using wmode
			 **
			 ** Show Flash for all other browsers with flash >=4
			 ** Supports IE5+,AOL7+,AOLExplorer,MAC,OPERA8+,FF,NS7+
			 **/
			if ((fsr_NS && canFlashPlay) || (!fsr_opera75 && canFlashPlay)){
				return true;
			}
		}
   }
   return false;
}
/**************************************************************
 ** Plugin:  fsrClickStream.js
 ** Copyright:2001-2007 ForeseeResults, Inc
 ** Desc:    Loading Multiple Click Stream Vendors Code
 ** 	     For CoreMetrics - uncomment triggerParms["cmetrics']
 ** 	     For Omniture - set triggerParms["omnitureId"]=1
 **	     For VisualScience - set triggerParms["visualScienceId"]=1
 ** Instructions: Paste this plugin or include this JS at the bottom
 **		  of fsrLauncher.js
 **************************************************************/
triggerParms["cmetrics"] = "90028341"; //enable coremetrics client id if uncommented
triggerParms["visualScienceId"] = 0;	//enable visual science cookie if 1
triggerParms["omnitureId"] = 0;		//enable omniture cookie if 1
var VsCookieName = "v1st";	// visual science cookie name
var OMCookieName = "s_foreSeeId"; //omniture cookie name

function fsrSetClickStreamParams(){
	fsrSetSurveyURL("&cmetrics=", triggerParms["cmetrics"]);
	if (triggerParms["visualScienceId"] == 1) {
		var VisualSciencesId = fsrGetCookie(VSCookieName);
		if(VisualSciencesId != null && VisualSciencesId != "") {
			cppParms["cpp_4"] = "VisualSciencesId:" + encodeURIComponent(VisualSciencesId);	
		}
		cppCounter=5;
	}
	if (triggerParms["omnitureId"] == 1) {
		var OmnitureId = fsrGetCookie(OMCookieName);
		if(OmnitureId != null && OmnitureId != "") {
			cppParms["cpp_0"] = "OmnitureId:" + encodeURIComponent(OmnitureId);	
		}
	}
}
/****************************************************************/