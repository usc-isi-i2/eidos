var SCRIPT_VERSION = "1.0";

var hcRandomlyDistributedTimeout = Math.round(Math.random()*6);

var hcUpdateState = 0;

var hcImageURL = "http://www.overstock.com/img/mxc/";
var hcStaticImageURL = "http://www.overstock.com/img/mxc/";

var hcControlImage;
var hcIsImage = false;
var hcCounter = 0;
var hcCmd = "knockPage";
var scriptType = "SERVERBASED";
var hcTimeout = 5;
var hcSendCounter = 0;

var hcPageID = null;

var hcLeft = -1;
var hcTop = -1;

var hcNS = (document.layers) ? true : false;
var hcIE = (document.all) ? true : false;
var hcDOM = (document.getElementById) ? true : false;
if (hcIE)
	hcDOM = false;
var hcMAC = (navigator.platform) && (navigator.platform.toUpperCase().indexOf("MAC") >= 0);
if (hcNS)
	hcMAC = false;
var hcShowImage = false;

var hcPos = - 30;
var HumanStep = 3;
var hcDir = HumanStep;
var hcBorder = 100;
var hcAnimate = false;

var hcNeedImage;
var hcCloseImage;
var hcImageFetched = false;

var hcimage = hcGetImage("hcIcon");
if (hcimage)
	hcicon = hcimage.src;

var hcParam = null;
var hcOpenVars = null;

var hcLoadingImage = false;

var hcLayerWidth = 400;
var hcLayerHeight = 300;

var hcClickURL;

var HCinit = true;

var lpForcePopup = ("{forcePopup}" == "true");

var	visitorStatus = "INSITE_STATUS";
var	lpActivePlugin = "none";
var lpTopFrame = null;

var	hcRejected = false;

//max number of times to create custom invite before aborting
var LP_CUSTOM_INVITE_MAX_LOOPS = 5;
var lpLineCt = 0;

if ("{newChannel}" == "true") {
	var lpPosY = 100;
	var lpPosX = 100;
	var lpOperatorViewable= 'true';
	var lpOperatorPageType= 'CoBrowse';
}

if (hcDOM)
{
	hcControlImage = document.createElement('IMG');
	hcControlImage.style.visibility = "hidden";
	document.body.appendChild(hcControlImage);
} else
if (hcMAC)
{
	document.writeln("<div style='visibility:hidden'><img src='http://sales.liveperson.net/hcp/window/common/spacer.gif' id='hcControlImage' name='hcControlImage'></div>");
	hcControlImage = document.hcControlImage;
}


function hcGetObj(id)
{
	if (document.getElementById)
		return document.getElementById(id);
	else
	if (document.all)
		return document.all(id);
}

function hcObjShow(obj)
{
	if (hcNS)
		obj.visibility="show";
	else
		obj.style.visibility="visible";
}

function hcDate()
{
	var d = new Date();

	return d.getTime();
}

function hcSendRequest()
{
	hcSendCounter++;
	if (hcSendCounter == 5)
		hcIsImage = false;

	if (! hcIsImage) {
		if (hcDOM) {
			document.body.removeChild(hcControlImage);
			hcControlImage = document.createElement('IMG');
			hcControlImage.style.visibility = "hidden";
			document.body.appendChild(hcControlImage);
		} else
		if (! hcMAC)
			hcControlImage= new Image;
		
		if (hcPageID==null) hcPageID=Math.round(Math.random()*9999999999);
		var windowname = lpTopFrame.name;
		if (windowname.length > 256)
			windowname = windowname.substring(0, 255);
		var u = 'http://sales.liveperson.net/hc/74613876/?site=74613876' +
					'&cmd=' + hcCmd +
					'&page=' + escape(document.location) +
					'&title=' + escape(document.title) +
					'&visitorStatus=' + escape(visitorStatus) +
					'&activePlugin=' + escape(lpTopFrame.lpActivePlugin) +
					'&pageWindowName=' + escape(windowname) +
					'&id=' + hcPageID +
					'&scriptVersion=' + SCRIPT_VERSION +
					'&d=' + hcDate();
        if (hcCmd == "knockPage")
			hcCmd = "startPage";
        else {
			if ((typeof(tagVars) != "undefined") && (tagVars != "")) {
				u = u + "&" + tagVars;
				tagVars = "";
			}
			var activateCobrowse = false;
			if ( true ) {
				u = u + "&cobrowse=true";
				activateCobrowse = true;
			}

	        if ( (typeof(lpOperatorViewable) != "undefined") && (lpOperatorViewable == "true") ) {
				if (! activateCobrowse) {
					u = u + "&cobrowse=true";
					activateCobrowse = true;
				}
	            if (typeof(lpOperatorPageType) != "undefined") {
	                u = u  + "&cobrowsetitle=" + escape(lpOperatorPageType);
	            }
	            if (typeof(lpOperatorPageUrl) != "undefined") {
	                u = u  + "&cobrowseurl=" + escape(lpOperatorPageUrl);
	            }
	        }
			if (scriptType != null) {
				u = u + "&scriptType=" + scriptType;
				scriptType = null;
			}
			hcCmd = "inPage";
			if (activateCobrowse) {
				var cookies = document.cookie;
				if ((typeof(cookies) == "undefined") || (cookies == null))
					cookies = "";
				if (u.length <= 1990)
					while (escape(cookies).length + u.length > 1990) {
						var idx = cookies.lastIndexOf(";");
						if (idx >= 0)
							cookies = cookies.substring(0, idx);
						else
							cookies = "";
					}
				u = u + "&cookie=" + escape(cookies);
			}
		}
		u = u + '&referrer=';
		var ref = escape(document.referrer);
		if (u.length + ref.length < 1990)
			u = u + ref;
		hcControlImage.src = u;
		hcIsImage = true;
		hcSendCounter = 0;
	}
}
function hcPlaceLayersIE()
{
}
function hcPlaceLayersNS()
{
}
function hcHandlePopup(w, h)
{
}



var hcImg30Sequence = 0;
var hclastW = -1;
var hclastH = -1;
function hcHandleWidthHeight(w,h)
{
	if (hcMAC && (hclastH == h) && (hclastW == w))
		return;
	hclastH = h;
	hclastW = w;
    if (h==1) {
        var wCode = w-w%2;
        var more = w%2;
        if (wCode == 30) {
			hcImg30Sequence++;
			if (hcImg30Sequence == 2)
				hcTimeout = -1;
        } else if (wCode == 40) {
		hcTimeout = 15 + hcRandomlyDistributedTimeout;
        } else if (wCode == 50) {
		hcTimeout = 30 + hcRandomlyDistributedTimeout;
        } else if (wCode == 60) {
            openChat(null, null);
        } else if (wCode == 70) {
            openEngageChat("engage", null);
        } else if (wCode == 72) {
            openCustomEngageChat("engage", null);
        } else if (wCode == 80) {
			hcReloadIcon();
		} else if (wCode == 90) {
            hcCounter=0;
            hcTimeout = 1;
		} else if (wCode == 100) {
			lpTopFrame.lpActivePlugin = "none";
			lpTopFrame.cb_bInjecting = false;
		} else if (wCode == 110) {
			lpTopFrame.lpActivePlugin = "PCB";
			setTimeout('activateCobrowsePlugin()', Math.round(Math.random()*100));
		} else if (wCode == 130) {
			handleRedirectCommand();
        } else if (wCode == 140) {
            openChat(null, "Pushed=true");
        } else if (wCode == 150) {
            visitorStatus = "INSITE_STATUS";
			hcHideTheImage();
        } else if (wCode == 152) {
            visitorStatus = "CHAT_STATUS";
			hcHideTheImage();
        } else if (wCode == 154) {
            visitorStatus = "REJECT_STATUS";
        } else if (wCode == 156) {
            visitorStatus = "ENGAGE_STATUS";
		}
		if (wCode != 30)
		    hcImg30Sequence = 0;
        if (more==1) {
            hcCounter=0;
            hcTimeout=1;
        }
    } else {
	    var modLength=1000;
	    var wLength=w%modLength;
	    var hLength=h%modLength;
	    var wCode=(w-wLength)/modLength;
	    var hCode=(h-hLength)/modLength;
		if (wCode == 4) {
			if (visitorStatus == "ENGAGE_STATUS")
				setTimeout('hcInvitationTimeout()', 1000 * wLength + 10);
		} else
			hcHandlePopup(w, h);
	}
}

function handleRedirectCommand() {
	var s = 'http://sales.liveperson.net/hc/74613876/?site=74613876' +
					'&cmd=visitorRedirect' +
					'&defaultURL=' + escape(document.location) +
					'&d=' + hcDate();
	document.location = s;
}

function activateCobrowsePlugin() {
    with (lpTopFrame) {
        if (typeof(cb_bInjecting)!="undefined" && cb_bInjecting) return;
        cb_bInjecting = true;
        if ((typeof(document["CBAgent"])=="undefined") || (document["CBAgent"] == null)) {
            var scrtag1 = '<script language="JavaScript" src="http://sales.liveperson.net/hcp/html/lpcbtop.js" defer></script>';
            var scrtag2 = '<script language="JavaScript" src="http://sales.liveperson.net/hcp/html/lpcb.js" defer></script>';
            var screlem1=document.createElement(scrtag1);
            var screlem2=document.createElement(scrtag2);
            var tag = '<applet code="CBAgent.class" codeBase="https://sales.liveperson.net/applets/v6.5" archive="cbagent.jar" name="CBAgent" width=0 height=0 style="LEFT: 0px; TOP: 0px; POSITION: absolute" mayscript></applet>';
            var elem = document.createElement(tag);
            elem["site"] =     "74613876";
            elem["charSet"] =  "ISO-8859-1";
            elem["encoding"] = "{encoding}";
            elem["connectionType"]="https";
            elem["loglevel"]="{cbDebug}";
            elem["cabbase"]="cbagent.cab";
            if (name == "") {
                name = "LPCB" + (new Date().getTime());
            }
            var appletInstanceID = new String(name);
            elem["appletInstanceID"] = new String(escape(appletInstanceID));
            document.body.appendChild(screlem1);
            document.body.appendChild(screlem2);
            document.body.appendChild(elem);
        } else {
            cb_bInjecting = false;
            var o = document["CBAgent"];
            if (typeof(o.connect)!="undefined")
                o.connect()
            else
                if (typeof(o.length) != "undefined" &&  o.length>0)
                    o.item(0).connect();
        }
	}
}


function lpGetTopFrame() {
    if (hcIE && document.getElementById) {
        var w = null;
        eval("try {if (top && typeof(top.document)!='undefined') {var n=''+top.name; w=top;}} catch (e) {w=null;};");
        if (w != null)
            return w;
    }
    return window;
}

function hcCheckImages()
{
	if (hcIsImage) {
		if (((hcDOM) || (hcMAC)) && (! hcControlImage.complete))
		{
			hcLoadingImage = true;
			return;
		}
		var w = hcControlImage.width;
		var h = hcControlImage.height;
		hcLoadingImage = false;

		if (w == 0)
			return;
		hcIsImage = false;
		hcHandleWidthHeight(w,h);
	}
}

var hcLoadTimer = 0;

function hcloop()
{
	if (hcTimeout < 0)
		return;

	if (hcCounter == 0)
	{
		if (! hcLoadingImage)
		{
			hcSendRequest();
			hcLoadTimer = 0;
		}
		else
		{
			hcLoadTimer++;
			if (hcLoadTimer == 5)
			{
				hcIsImage = false;
				hcSendRequest();
				hcLoadTimer = 0;
			}
		}
	}
	hcCounter = (hcCounter + 1) % hcTimeout;
	hcCheckImages();

	setTimeout('hcloop()', 1000);
}

function hcReloadIcon()
{
	if (hcimage)
		hcimage.src = hcicon + "&monitor=1&d=" + hcDate();
}

function openChat(param, openVars)
{
	visitorStatus = "CHAT_STATUS";
	var s = document.location;
	if (param != null)
		s = "(" + param + ") " + s;
	s = escape(s);

    var oparms = "";
    if (openVars != null)
        oparms = oparms + "&" + openVars;

    var url = 'http://sales.liveperson.net/hc/74613876/?cmd=file&file=visitorWantsToChat' + oparms + '&site=74613876&d=' + hcDate()+'&referrer='+s;
    var name = 'chat74613876';
    var params = 'width=472,height=320,menubar=no,scrollbars=0';

    if (typeof(lpOpenChat) == "function") {
        lpOpenChat(url, name, params);
    } else {
        window.open(url, name, params);
    }
}

function openCredit()
{
	document.location = "http://www.liveperson.com/ref/lppb.asp";
}

function openEngageChat(param, openVars) {
	if (hcRejected) {
		hcRejectCall();
		return;
	}
	hcParam = param;
	hcOpenVars = openVars;
	if ((! lpForcePopup) && (hcIE || hcNS || hcDOM)) {
		hcShowTheImage();
	} else {
		window.open('http://sales.liveperson.net/hc/74613876/?cmd=file&file=wantsToChat&site=74613876&d=' + hcDate(), 'wanttochat74613876', ',,menubar=no,scrollbars=no');
	}
}

function openCustomEngageChat(param, openVars) {
	hcImageURL = "http://sales.liveperson.net/hc/74613876/?cmd=ruleRedirect&site=74613876&rulecmd=ShowCustomInvite&inviteDir=" + escape(hcStaticImageURL) + "&&d=" + hcDate() + "&inviteImage=";
	openEngageChat(param, openVars);
}

function openWantsToChat()
{
	openEngageChat(null, null);
}

function hcPreload()
{
	hcNeedImage = new Image();
	hcNeedImage.src = hcImageURL + "need_help_on.gif";

	hcCloseImage = new Image();
	hcCloseImage.src = hcImageURL + "close_on.gif";
}

function hcSetImageGo(name, image, go)
{
	hcAnimate = go;
	hcSetImage(name, image);
}
function hcSetImage(name, image)
{
	hcGetImage(name).src = hcImageURL + image;
}


function hcWriteDoc(str)
{
	document.writeln(str);
}

if (hcIE || hcDOM) {
	hcWriteDoc('<div id="mylayer" style="z-index:90;position:absolute;visibility:hidden;left:10px;top:10px">');
	hcWriteDoc('<table border="0" cellspacing="0" cellpadding="0">');
	hcWriteDoc('<tr><td><a name="needRef" href="#" onClick="return hcAcceptCall()" target="_self" onmouseover=hcSetImageGo("need_help","need_help_on.gif",false) onmouseout=hcSetImageGo("need_help","need_help_off.gif",true)><img name="need_help" onload="hcFloatIconLoaded()" border="0"></a></td></tr>');
	hcWriteDoc('<tr><td><a href="#" onClick="return hcRejectCall()" target="_self" onmouseover=hcSetImageGo("need_close","close_on.gif",false) onmouseout=hcSetImageGo("need_close","close_off.gif",true)><img name="need_close" border="0"></a></td></tr>');
	hcWriteDoc('</table></div>');
	hcPlaceLayersIE();
} else if (hcNS) {
	hcWriteDoc('<layer name="mylayer" z-index="90" left="10px" top="10px" visibility="hidden">');
	hcWriteDoc('<table border="0" cellspacing="0" cellpadding="0">');
	hcWriteDoc('<tr><td><a href="#" onClick="return hcAcceptCall()" target="_self" onmouseover=hcSetImageGo("need_help","need_help_on.gif",false) onmouseout=hcSetImageGo("need_help","need_help_off.gif",true)><img name="need_help" src="' + hcImageURL + 'need_help_off.gif" onload="hcFloatIconLoaded()" border="0"></a></td></tr>');
	hcWriteDoc('<tr><td><a href="#" onClick="return hcRejectCall()" target="_self" onmouseover=hcSetImageGo("need_close","close_on.gif",false) onmouseout=hcSetImageGo("need_close","close_off.gif",true)><img name="need_close" src="' + hcImageURL + 'close_off.gif" border="0"></a></td></tr>');
	hcWriteDoc('</table></layer>');
	hcPlaceLayersNS();
}
function hcFloatIconLoaded()
{
	hcImageFetched = true;
}

function hcImageTimer()
{
	if (hcShowImage && hcImageFetched) {
		var top;
		var left;

		if (hcIE) {
		    scrollPosY = 0;
		    scrollPosX = 0;
            try {
                if (typeof(document.documentElement) != "undefined") {
                    scrollPosY = document.documentElement.scrollTop;
                    scrollPosX = document.documentElement.scrollLeft;
                }
            } catch (e) {}
            scrollPosY = Math.max(document.body.scrollTop, scrollPosY);
            scrollPosX = Math.max(document.body.scrollLeft, scrollPosX);
            top = scrollPosY;
            left = scrollPosX;
			if ((hcTop < 0) || ((hcTop == top) && (hcLeft == left))) {
				document.all.mylayer.style.visibility = "visible";
			} else {
				document.all.mylayer.style.visibility = "hidden";
			}

		} else if (hcNS) {

			top = pageYOffset;
			left = pageXOffset;

			if ((hcTop < 0) || ((hcTop == top) && (hcLeft == left))) {
				document.layers.mylayer.visibility = "visible";
			} else {
				document.layers.mylayer.visibility = "hidden";
			}
		} else if (hcDOM){
			top = pageYOffset;
			left = pageXOffset;
			if ((hcTop < 0) || ((hcTop == top) && (hcLeft == left))) {
				hcGetObj("mylayer").style.visibility = "visible";
			} else {
				hcGetObj("mylayer").style.visibility = "hidden";
			}
		}

		hcPlaceImage();

		hcTop = top;
		hcLeft = left;
	}

	setTimeout('hcImageTimer()', 250);
}

function hcAcceptCall()
{

	openChat(hcParam, hcOpenVars);
	hcHideTheImage();

	return false;
}

function hcRejectCall()
{
	hcRejected = true;
	hcHideTheImage();
	visitorStatus = "REJECT_STATUS";
	hcCmd = "rejectChat";
	hcCounter = 0;

	return false;
}

function hcInvitationTimeout()
{
	if (visitorStatus != "ENGAGE_STATUS")
		return;

	hcHideTheImage();
	hcCmd = "inviteTimeout&timeout=" + ((typeof(lpInviteTimeout) != "undefined") ? lpInviteTimeout : -1);
	visitorStatus = "REJECT_STATUS";
	hcCounter = 0;

	return false;
}

function hcHideTheImage()
{
	hcShowImage = false;
    lpVoiceEngageFlag = false;
    hcGetObj("l1a").style.visibility = "hidden";
    hcGetObj("l1b").style.visibility = "hidden";
    hcGetObj("l2a").style.visibility = "hidden";
    hcGetObj("l2b").style.visibility = "hidden";
    hcGetObj("mylayer").style.visibility = "hidden";
}

function inviteShown() {
	hcCmd = "inviteShown" +((typeof(lpInviteTimeout) != "undefined") && (lpInviteTimeout != "") && (lpInviteTimeout > 0) ? ("&scripttimeout=" + lpInviteTimeout) : "");
	hcCounter = 0;
}

function hcShowTheImage()
{
	visitorStatus = "ENGAGE_STATUS";
	setTimeout("inviteShown()", 5000);

	hcShowImage = true;

	//hcSetImage("need_help","need_help_off.gif");
	//hcSetImage("need_close","close_off.gif");

	hcAnimate = true;

	hcPreload();

	hcAnimateStart();
	
	startLines();
}

function hcAnimateStart()
{
	if (hcIE) {
		hcBorder = document.body.clientWidth;
	} else if (hcNS) {
		hcBorder = window.innerWidth;
	} else if (hcDOM) {
		hcBorder = window.innerWidth;
	}

	hcAnimateImage();
}

function getImageWidth(name)
{
	if (hcDOM)
		return (document.getElementsByTagName("IMG")[name]).width;
	else
	if (hcIE)
		return (document.all(name)).width;
	else
	if (hcNS)
		return (document[name]).width;
	else
		return null;
}

function hcAnimateImage()
{
	if (hcImageFetched && hcAnimate)
		hcPos = hcPos + hcDir;

	if (hcPos > hcBorder - 160)
		hcDir = - HumanStep;

	hcPlaceImage();

	if ((hcPos > 30) || (hcDir > 0))
		setTimeout("hcAnimateImage()", 20);
}

function getMywidth()
{
    var myWidth = 0, myHeight = 0;
    if( typeof( window.innerWidth ) == 'number' ) {
        //Non-IE
        myWidth = window.innerWidth;
        myHeight = window.innerHeight;
    }
    else if( document.documentElement &&
           ( document.documentElement.clientWidth ||
             document.documentElement.clientHeight ) )
    {
         //IE 6+ in 'standards compliant mode'
         myWidth = document.documentElement.clientWidth;
         myHeight = document.documentElement.clientHeight;
    }
    else if( document.body && ( document.body.clientWidth ||
        document.body.clientHeight ) ) {
        //IE 4 compatible
        myWidth = document.body.clientWidth;
        myHeight = document.body.clientHeight;
    }
    return myWidth
}

function hcPlaceImage()
{
	var y = 40;
	var x = hcPos;
	if (typeof(lpPosX) != "undefined")
		x = lpPosX;
	if (typeof(lpPosY) != "undefined")
		y = lpPosY;
	var width = getMywidth()
	x = width - (width/2) 
	var obj = null;
	if (hcIE) {
		obj = document.all.mylayer.style;
	} else if (hcNS) {
		obj = document.layers.mylayer;
	} else if (hcDOM) {
		obj = hcGetObj("mylayer").style;
	}
    if (typeof(lpPlacementFunctionHook) == "function") {
		lpPlacementFunctionHook(obj);
 	} else {
		if (hcIE) {
		    scrollPosY = 0;
		    scrollPosX = 0;
            try {
                if (typeof(document.documentElement) != "undefined") {
                    scrollPosY = document.documentElement.scrollTop;
                    scrollPosX = document.documentElement.scrollLeft;
                }
            } catch (e) {}
            scrollPosY = Math.max(document.body.scrollTop, scrollPosY);
            scrollPosX = Math.max(document.body.scrollLeft, scrollPosX);
			obj.left = scrollPosX + x + "px";
			obj.top = Math.max(scrollPosY, y) + "px";
		} else if (hcNS) {
			obj.left = pageXOffset + x;
			obj.top = Math.max(pageYOffset, y) + y;
		} else if (hcDOM) {
			obj.left = pageXOffset + x + "px";
			obj.top = Math.max(pageYOffset, y) + "px";
		}
	}
}

function hcGetImage(name)
{
	return hcFindImage(document, name);
}

function hcFindImage(doc, name)
{
	if (hcDOM)
		return doc.getElementsByTagName("IMG")[name];
	var lays = doc.layers;

	if (! lays)
		return doc[name];

	for (var i = 0; i < doc.images.length; i++) {
		if (doc.images[i].name == name)
			return doc.images[i];
	}

	for (var l = 0; l < lays.length; l++) {
		img = hcFindImage(lays[l].document, name);
		if (img != null)
			return img;
	}

	return null;
}


function hcgo()
{
    var startAfter=2000;
    var x = new String(document.location).indexOf("lpAutoChat=1");
    if (x >= 0)
        startAfter = 10000;

	if (typeof(lpCobrowsedPage) != "undefined")
		return;
	lpTopFrame = lpGetTopFrame();
    if (typeof(lpTopFrame.lpActivePlugin)=="undefined")
        lpTopFrame.lpActivePlugin = "none";

	setTimeout('hcloop()', startAfter);
	setTimeout('hcImageTimer()', 250);
}
function hcLegalPage() {
	return true;
}

function lpCreateCustomInvitation() 
{

    var lpCustomInnerInvitationHtml = "";
    var lpForceInviteCreate = false;
    
    //Wait for the Monitor tag to create the original "mylayer" DIV (that's where the standard invitation is created)
    if (!hcGetObj("mylayer")) 
     {
     
        //Loop no more than LP_CUSTOM_INVITE_MAX_LOOPS times, to avoid endless loop in case
        //the DIV is not found
        if(LP_CUSTOM_INVITE_MAX_LOOPS > 0)
        {
            LP_CUSTOM_INVITE_MAX_LOOPS--;
            setTimeout('lpCreateCustomInvitation()', 1000);
            return;
        }
        else
        {
            //Max loops has passed, so mark we need to create the invitation
            lpForceInviteCreate = true;
        }
    }
    
    //set the invitation content into the lpCustomInnerInvitationHtml variable(WITHOUT THE WRAPPING DIV)
    lpCustomInnerInvitationHtml = '';
    lpCustomInnerInvitationHtml += '<div style="background-image: url(' + hcImageURL + 'ostk_bg2.gif); background-repeat: no-repeat; width:446px; height:293px;">';
    lpCustomInnerInvitationHtml += '<div style="position:absolute;left:333px;top:20px;z-index:200;"><a href="#" onclick="return hcRejectCall();"><img id="nt" border="0" src="' + hcImageURL + 'nothanks_off.gif" onmouseover="javascript:this.src=\'' + hcImageURL + 'nothanks_on.gif\';" onmouseout="javascript:this.src=\'' + hcImageURL + 'nothanks_off.gif\';"></a></div>';
    lpCustomInnerInvitationHtml += '<div style="position: absolute;top:100px;left:35px">';
    lpCustomInnerInvitationHtml += '<span id="l1a" style="font-family:Verdana;font-size:12px;color:#831518;font-weight:bold;visibility:hidden;">Shopping Assistant:</span> ';
    lpCustomInnerInvitationHtml += '<span id="l1b" style="font-family:Verdana;font-size:12px;color:#000;font-weight:normal;visibility:hidden;">Welcome to Overstock.com...</span><P>';
    lpCustomInnerInvitationHtml += '<span id="l2a" style="font-family:Verdana;font-size:12px;color:#831518;font-weight:bold;visibility:hidden;">Shopping Assistant:</span>';
    lpCustomInnerInvitationHtml += '<span id="l2b" style="font-family:Verdana;font-size:12px;color:#000;font-weight:normal;visibility:hidden;">I can assist you with your product questions.</span>';
    lpCustomInnerInvitationHtml += '</div>';
    lpCustomInnerInvitationHtml += '<div style="position:absolute;top:217px;left:30px">';
    lpCustomInnerInvitationHtml += '<span style="font-family:Verdana; font-size:12px;color:#000;font-weight:normal;letter-spacing:0px"><a href="#" onclick="return hcAcceptCall();" style="color:#000;" onmouseover="this.style.color=\'#4371ce\';" onmouseout="this.style.color=\'#000\';">Click here to chat live</a> with an Overstock Shopping Assistant.</span>';
    lpCustomInnerInvitationHtml += '</div>';
    lpCustomInnerInvitationHtml += '<div style="position:absolute;top: 245px; left:315px">';
    lpCustomInnerInvitationHtml += '<a href="#" onclick="return hcAcceptCall();" name="needRef" id="needRef"><img src="' + hcImageURL + 'chatnow_transparent.gif" border="0" width="95"></a></div>';
    lpCustomInnerInvitationHtml += '</div>';


    //if need to create the DIV
    if(lpForceInviteCreate)
    {
        //call a method of the Monitor tag to create the div with our own content
        lpCreateGenericDiv('mylayer', 200, 170, 90, lpInnerInvitationHtml, null, null, false);
    }
    else
    {
         //replace current invitation content with custom one
         hcGetObj("mylayer").innerHTML = lpCustomInnerInvitationHtml;
    }
    
    //mark the invitation has loaded
     hcFloatIconLoaded();
    
    //If needed, modify any styling details of the invitation DIV now (e.g, change width and height)
    //document.getElementById("mylayer").style.width = "311px";
    // hcGetObj("mylayer").style.backgroundColor = "#fff";
    //document.getElementById("mylayer").style.position = "absolute";
    hcGetObj("mylayer").style.zIndex = "2000";
    //document.getElementById("mylayer").top = "90px";
    //document.getElementById("mylayer").left = "170px";
    
}

function startLines()
{
    switch(lpLineCt)
    {
        case 0: lpLineCt += 1;setTimeout('startLines()', 1000); break;
        case 1: 
                document.getElementById("l1a").style.visibility = "visible";
                document.getElementById("l1b").style.visibility = "visible";
                lpLineCt += 1;
                setTimeout('startLines()', 1000);
                break;
        case 2: 
                document.getElementById("l2a").style.visibility = "visible";
                document.getElementById("l2b").style.visibility = "visible";
                lpLineCt = 0;
                break;
    };
}

if (true) {
	if (hcLegalPage()) hcgo();
}

//call method to create custom invite
lpCreateCustomInvitation();

