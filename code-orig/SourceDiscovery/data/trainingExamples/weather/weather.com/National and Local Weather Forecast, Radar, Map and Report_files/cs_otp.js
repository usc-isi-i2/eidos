var cm_Path='/'; var cm_Delim='_'; var cm_CrumbDelim='|'; 

function cm_dString(pDate,addlDays){
	addlDays*=1; 
	eDate = new Date(pDate); 
	if(addlDays){ 
		tempDay = eDate.getDate(); 
		eDate.setDate(tempDay + addlDays);
	}
	tDay = eDate.getDate() + ""; 
	if(tDay < 10) tDay = "0" + tDay;

	tMon = eDate.getMonth() + 1 + "";
	if(tMon < 10) tMon = "0" + tMon;

	tYr = eDate.getFullYear();
	tYr = tYr + "";
	tYr = tYr.slice(2,4);
	dayString = tYr + tMon + tDay; 
	return dayString;
}

var cm_today = cm_dString(new Date());

aCrumbs=new Array(); 
var cookieString; 
var match=false; 
var cookieTest=false; 
var crumbId; 

var cm_Exp = new Date ();
FixCookieDate (cm_Exp);
cm_Exp.setTime (cm_Exp.getTime() + (24 * 60 * 60 * 1000 * 365));

function cm_MakeCrumb(cn){
	var cm_Recycle=cm_dString(cm_date(cm_today),dayFreq); 
	var cm_Count=0; return [cn,cm_Count,cExpDate,cm_Recycle,dayFreq]; 
}

function cm_AddCrumb(co){
	if(cExpDate >= cm_today){
		var cs=GetCookie(cm_Name);
		if (cs&&cs.length>0) cs+= cm_CrumbDelim + co.join(cm_Delim);
		else cs=co.join(cm_Delim);
		SetCookie(cm_Name,cs,cm_Exp,cm_Path,cm_Domain);
	} else {
		tempExp = cm_dString(new Date(),90);
		var cs=GetCookie(cm_Name); 
		co[2] = tempExp;
		if (cs&&cs.length>0){
			cs += cm_CrumbDelim + co.join(cm_Delim);
		} else {
			cs=co.join(cm_Delim);
		} 
		SetCookie(cm_Name,cs,cm_Exp,cm_Path,cm_Domain);
	}
}

function cm_GetCrumbByName(cn){
	var cs=GetCookie(cm_Name); if(!cs||cs.length<1) { 
	var nc=cm_MakeCrumb(cn); 
	cm_AddCrumb(nc); return nc;} else {
	var crumbs=cs.split(cm_CrumbDelim).sort(byName); 
	for(var i=0;crumbs[i];i++){	if(crumbs[i].length>0){
	var thisCrumb=crumbs[i].split(cm_Delim); 
	if(thisCrumb[0]==cn) return thisCrumb; 
	}
	}var nc=cm_MakeCrumb(cn); cm_AddCrumb(nc); return nc; 
	}
}

function cm_EditCrumb(cn,pos,val){
	var cs=GetCookie(cm_Name); 
	if(!cs||cs.length<1) { var nc=cm_MakeCrumb(cn); 
	nc[pos]=val; cm_AddCrumb(nc); return; 
	} else { var crumbs=cs.split(cm_CrumbDelim).sort(byName); 
	var crumbFound=false;for(var i=0;crumbs[i];i++){
	if(crumbs[i].length>0){ var thisCrumb=crumbs[i].split(cm_Delim); 
	if (thisCrumb[0]==cn) { thisCrumb[pos]=val; crumbFound=true; 
	crumbs[i]=thisCrumb.join(cm_Delim);
	cs=crumbs.join(cm_CrumbDelim); 
	SetCookie(cm_Name,cs,cm_Exp,cm_Path,cm_Domain); return; }}}
	if (crumbFound==false) {var nc=cm_MakeCrumb(cn);nc[pos]=val;
	cm_AddCrumb(nc);return;
	}
	}
}

function cm_date(str){
	if(str.length==5){
		str = "0" + str;
	}
	tD = new Date(('20'+str.slice(0,2)),(str.slice(2,4)-1),str.slice(4,6));
	return tD;
}

function cm_Test(){
	var cm_cookiePass = false;
	var crumbContents=cm_GetCrumbByName(cookieName);
	if(crumbContents[2]>=cm_today){ 
		if(crumbContents[3] <= cm_today){
			holdit = cm_dString(cm_date(cm_today),crumbContents[4]);
			cm_EditCrumb(cookieName,3,holdit); 
			cm_EditCrumb(cookieName,1,0); 
			crumbContents[3] = holdit; 
			crumbContents[1] = 0;
		}
		if (freqCap>crumbContents[1]  && crumbContents[3]>=cm_today) {
			cm_EditCrumb(cookieName,1,(crumbContents[1]*1)+1); cm_cookiePass = true;
		}
	} 
	return cm_cookiePass;
}

function byName(a,b){
	if(a < b)return -1; else if(a==b) return 0; else return 1;
}
var expdate=new Date(); FixCookieDate(expdate); expdate.setTime(expdate.getTime()+(24*60*60*1000*30));

// flash tests;
var at_o;
var requiredVersion=8; 
var d=document;    var useRedirect=false;
var flash2Installed=false; 
var flash3Installed=false; 
var flash4Installed=false; 
var flash5Installed=false; 
var flash6Installed=false; 
var flash7Installed=false;
var flash8Installed=false;
var flash9Installed=false;
var maxVersion=9; 
var actualVersion=0; var gotFlash=false; var jsVersion=1.0; 

function at_detectFlash(){
	if(navigator.plugins){
		if(navigator.plugins["Shockwave Flash 2.0"]||navigator.plugins["Shockwave Flash"]){
			var isVersion2=navigator.plugins["Shockwave Flash 2.0"]?" 2.0":"";
			var flashDescription=navigator.plugins["Shockwave Flash"+isVersion2].description;
			var flashVersion=parseInt(flashDescription.charAt(flashDescription.indexOf(".")-1));
			flash2Installed=flashVersion==2;
			flash3Installed=flashVersion==3;
			flash4Installed=flashVersion==4;
			flash5Installed=flashVersion==5; 
			flash6Installed=flashVersion>=6;
			flash7Installed=flashVersion>=7;
			flash8Installed=flashVersion>=8;
			flash9Installed=flashVersion>=9;
		}
	}
	for(var i=2; i<=maxVersion; i++){
		if(eval('flash'+i+'Installed')==true)actualVersion=i;
	}
	if(navigator.userAgent.indexOf('WebTV')!=-1)actualVersion=3;
	if(actualVersion>=requiredVersion){
		gotFlash=true; 
	}
}

var isIE=(navigator.appVersion.indexOf("MSIE")!=-1)?true:false;
var isWin=(navigator.appVersion.indexOf("Windows")!=-1)?true:false; 

jsVersion=1.1;
if(isIE&&isWin){
	d.write('<SCR'+'IPT language=VBScript>\n'); 
	d.write('on error resume next\n');
	d.write('flash2Installed=(IsObject(CreateObject("ShockwaveFlash.ShockwaveFlash.2")))\n');
	d.write('flash3Installed=(IsObject(CreateObject("ShockwaveFlash.ShockwaveFlash.3")))\n');
	d.write('flash4Installed=(IsObject(CreateObject("ShockwaveFlash.ShockwaveFlash.4")))\n');
	d.write('flash5Installed=(IsObject(CreateObject("ShockwaveFlash.ShockwaveFlash.5")))\n');
	d.write('flash6Installed=(IsObject(CreateObject("ShockwaveFlash.ShockwaveFlash.6")))\n');
	d.write('flash7Installed=(IsObject(CreateObject("ShockwaveFlash.ShockwaveFlash.7")))\n');
	d.write('flash8Installed=(IsObject(CreateObject("ShockwaveFlash.ShockwaveFlash.8")))\n');
	d.write('flash9Installed=(IsObject(CreateObject("ShockwaveFlash.ShockwaveFlash.9")))\n');
	d.write('</SCR'+'IPT>\n'); 
}

// CHECK FOR THE COOKIE 
at_detectFlash();  

var cm_RUN_OOB = false;
if(cm_Test() && !capTest){ // cookieTest;
	cm_RUN_OOB = true;
}

function hideObjects() {
	if(document.getElementsByTagName("SELECT").length>0){
		var selectMap = document.getElementsByTagName("SELECT")[0];
    	selectMap.style.visibility='hidden';
    }
	s=0; for (f=0;f<document.forms.length;f++) {
    	for (i=0;i<document.forms[f].elements.length;i++) {
        	if(document.forms[f].elements[i].type=="select-one"){s++;
            	if(s>0){
					document.forms[f].elements[i].style.visibility='hidden';
				}
			}
		}
	}
} 

function showObjects() {
	if(document.getElementsByTagName("SELECT").length>0){
		var selectMap = document.getElementsByTagName("SELECT")[0];
    	selectMap.style.visibility='visible';
    }
	for (f=0;f<document.forms.length;f++) {
    	for (i=0;i<document.forms[f].elements.length;i++) {
        	if(document.forms[f].elements[i].type=="select-one"){
            	document.forms[f].elements[i].style.visibility='visible';
            }
		}
	}
}

var offsetX;
var offsetY;

if(!flVars) flVars = "";
// MAKE ADAPTOR AWARE;
function cs_makeSWF(idNum){
	flObVar='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codeBase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=5,0,0,0" width='
	+aMv[idNum].width +' height='+aMv[idNum].height;  
	if(idNum==1){
		flObVar=flObVar+' ID="swf_ps" ';
	}
	flObVar=flObVar+'><PARAM name="Movie" value'+'="' 
	+aMv[idNum].fileName+'"><param name="WMode" value' 
	+'="Transparent"><PARAM NAME="Loop" VALUE'
	+'="false"><PARAM NAME="Quality" VALUE'
	+'="High"><PARAM NAME="BGColor" VALUE' 
	+'="#FFFFFF"><PARAM name="FlashVars" value="' + flVars + '"/>';
	
	if(mode==6 && idNum==1 && cm_RUN_OOB == true){
		// PAUSE THE MOVIE IF OOB PLAYS FIRST
		flObVar=flObVar+'<param name="play" value="false" />'; 
	}

	flObVar=flObVar + '<embed src="'+aMv[idNum].fileName 
	+'" quality=high wmode=transparent swliveconnect="true" ';  
	
	if(idNum==1){
		flObVar=flObVar+' NAME="swf_ps" ';  
	}
		
	if(mode==6 && idNum==1 && cm_RUN_OOB == true){
		flObVar = flObVar + ' play="false" '; 
	}
	
	flObVar=flObVar+'FlashVars="' + flVars 
	+ '" bgcolor=#FFFFFF' + ' width=' +aMv[idNum].width 
	+ ' height='+aMv[idNum].height 
	+' type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash"></embed></OBJECT>'; 

	if(mode==8 && idNum==0){
		var cs_stopper = '<table bgcolor="black" cellpadding=2 cellspacing=1 align="left" width=75><tr><td bgcolor="white" align="center" nowrap><a href="javascript:at_lyrStop();"><font face="sans-serif" size="1" color="black">STOP [X]</font></a></td></tr></table>';
		flObVar = '<table><tr><td valign="top">' + cs_stopper + '</td><td>' + flObVar + '</td></tr></table>';
	}

	offsetX=aMv[idNum].offsetX;
	offsetY=aMv[idNum].offsetY;
	dImg=aMv[idNum].dImg; 
}

function MM_controlShockwave(objStr,x,cmdName,frameNum) { //v3.0
	f = getFlashMovieObject(objStr);
	if(f!=null && f!=undefined){
		eval('f.' + cmdName + '();');
	}
}

function getFlashMovieObject(movieName){
	if (window.document[movieName]){
		return window.document[movieName];
	}
	if (navigator.appName.indexOf("Microsoft Internet")==-1){
		if (document.embeds && document.embeds[movieName]){
			return document.embeds[movieName];
		}
	}
	else{
		return document.getElementById(movieName);
	}
} 	
 
var at_psStr=''; 
d.write("<div id='fDiv' name='fDiv' style='Z-index:10; left:10px; width:10px; position:absolute; top:10px; height:10px'></div>"); 

 ////////////        WRITE THE PAGESPON HERE        ////////////
/* NEW MODE: 7: expandable 
	- same as 0 except 
	- it loads closed
	- resizewin is always running
	
	NEW MODE 8: Desktop Startspon
	- show otp and in page at same time
	- write a STOP button (table) to wrap the OTP ad.
*/ 

 
function at_ps(){
/* the final output will be 4 options:
	- third party tag
	- default gif
	- swf (paused or not paused);
	- blank gif
*/
	var ps_3rd = "<div name='fAnc' id='fAnc'>" + cs_thirdP + "</div>";
	
	// the img clickthru has to be created in the ad file; if it's an old version, click doesn't do anything;
	cs_imgTarget = "_blank";
	if (!window.cs_imgClick){
		cs_imgClick = "#";
		cs_imgTarget = "";
	}
	
	var ps_blank = "<a href='" + cs_imgClick + "' target='" + cs_imgTarget + "'><IMG SRC='http://image.weather.com/RealMedia/ads/Creatives/creative_repository/common/blank.gif' border=0 width='" + cs_psWidth + "' height='" + cs_psHeight + "' id='fAnc' name='fAnc'></a>";
	var ps_default = "<a href='" + cs_imgClick + "' target='" + cs_imgTarget + "'><IMG SRC='" + aMv[0].dImg + "'  border=0 width='" + cs_psWidth + "' height='" + cs_psHeight + "' id='fAnc' name='fAnc'></a>";
	
	if(aMv.length>1){
		cs_makeSWF(1);
		var ps_swf = "<div id='fAnc' name='fAnc'>" + flObVar + "</div>"; 
	} else if(cs_thirdP!=""){
		// make any in-page version the 3rd party version;
		ps_swf = cs_thirdP;
		ps_default = cs_thirdP;
	} else {
		ps_swf = ps_default;
	}	
	if(mode==3) {
		if(!window.cs_delayInpage || cm_RUN_OOB==false){
			at_psStr=ps_3rd;
		} else {
			at_psStr=ps_blank;
		}
	}	// third party
	
	
	else if(gotFlash==false||mode==2||mode==5) at_psStr=ps_default; // write the default image file;
	else if((mode==4||mode==0||mode==7)&&cm_RUN_OOB==true){
		at_psStr=ps_blank;	// write a blank image place holder;
	}
	else {
		at_psStr=ps_swf;	// write the in-page swf;
	}
}


at_ps(); 
document.write(at_psStr); 

// HIDE the PS if it's 4 or 5 AND the OOB is running.
if((mode==4 || mode==5) && (cm_RUN_OOB==true && gotFlash==true)){
	hideDiv("fAnc");
}

//////////      LYRSTOP      /////////////
var moveX = aMv[0].offsetX;
var moveY = aMv[0].offsetY;

function at_lyrStop(){
	moveX = 0;
	moveY = 0;
	showObjects();
	if(cm_RUN_OOB==true){
		// NEW HOMEPAGE CONTROLLER;
		MM_controlShockwave('homepage_pr','','Play');
		if(mode==0||mode==7){
			at_clipToAnchor('fDiv','fAnc',cs_psHeight,cs_psWidth);
			moveX = aMv[0].offsetX;
			moveY = aMv[0].offsetY;
		}
		else if(mode==3){
			// if they're simultaneous;
			showDiv('fAnc');
			writeDiv('fDiv','');
			if(window.cs_delayInpage){ 
				moveDiv('fDiv','fAnc');
				writeDiv('fDiv',cs_thirdP);
				// showDiv("fAnc");
			}
			// if they're sequential;
			// moveDiv('fDiv','fAnc');
			// writeDiv('fDiv',cs_thirdP);
		} 
		else if(mode==4){
			cs_makeSWF(1);
			moveDiv('fDiv','fAnc'); 
			writeDiv('fDiv',flObVar);
		} 		
		else{	// mode = 1,2,5,6,8;
			writeDiv('fDiv',''); 
		}
		if(mode==5){ 
			showDiv("fAnc");
		}
		else if(mode==6){
			MM_controlShockwave('swf_ps','','Play');
		}
	} else {
		if(mode==3 || mode==4){
			moveDiv('fDiv','fAnc'); 
			writeDiv('fDiv',cs_thirdP);
		}
		else if(mode==5){
			d.images['fAnc'].src=aMv[0].dImg;
		}
		else {
			MM_controlShockwave('swf_ps','','Play');
		}
	}
} 

//////////      LAYER WRITE AND MOVING     /////////////
function at_moveDiv(whichOne){
	cs_makeSWF(whichOne);
	moveDiv('fDiv','fAnc',offsetX,offsetY);
	writeDiv('fDiv',flObVar);
}

function at_clipToAnchor(divName,anchorName,h,w){
	xposition=offsetX*-1; 
	yposition=offsetY*-1; 
	ySecond=yposition+h;
	xSecond=xposition+w; 
	clipDiv(divName,yposition,xSecond,ySecond,xposition);
}
// a global variable to say OOB is okay to run;
var oobSafe = false; 

////////        START THE WHOLE THING HERE       ////////
function at_start(){
	if((isMinIE5 || isNS6) && (cm_RUN_OOB==true && gotFlash == true)){ // if the freq cap is NOT met:
		MM_controlShockwave('homepage_pr','','StopPlay');
		hideObjects(); 
		at_moveDiv(0);
		at_resizeCk='yes';
		if(mode==7){
			at_lyrStop();
		}
	}
	// tracking pix;
	if(trackPix!=''){
		imgReplace("csTrack1",trackPix);
	}
	// otp tracking pix;
	if(otpPix!='' && cm_RUN_OOB==true && gotFlash == true && (isMinIE5 || isNS6)){
		imgReplace("csTrack2",otpPix);
	}
}

function at_lyrOpen(){
	// at_clipToAnchor("fDiv","fAnc",aMv[0].height,aMv[0].width);
	yposition = 0;
	xSecond = aMv[0].width;
	ySecond = aMv[0].height;
	xposition = 0;
	clipDiv("fDiv",yposition,xSecond,ySecond,xposition);
	hideObjects();
	at_resizeCk='yes';
}

/////////       RESIZE FUNCTIONS        /////////
var at_resizeCk='no';
function at_resizeWin(){
	if(at_resizeCk=='yes'){
		moveDiv('fDiv','fAnc',moveX,moveY);
	}
}

document.write("<br /><IMG SRC='http://image.weather.com/RealMedia/ads/Creatives/creative_repository/common/blank.gif' border=0 width=1 height=1 id='csTrack1' name='csTrack1'><IMG SRC='http://image.weather.com/RealMedia/ads/Creatives/creative_repository/common/blank.gif' border=0 width=1 height=1 id='csTrack2' name='csTrack2'><IMG SRC='http://image.weather.com/RealMedia/ads/Creatives/creative_repository/common/blank.gif' border=0 width=1 height=1 id='csTrack3' name='csTrack3'>");

// kill the OTP file after 11 seconds if it's a startspon ad;
if(mode==8){
	setTimeout("at_lyrStop()",11000);
}

addEvent(window,'load',at_start);
addEvent(window,'resize',at_resizeWin);