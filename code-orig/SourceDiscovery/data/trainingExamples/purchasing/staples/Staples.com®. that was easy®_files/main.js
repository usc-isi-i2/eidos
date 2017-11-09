<!--
// parse for cart shipping message /////////////
function parseCart(cookieName) {
	var returnObject = new Object();
	try {
		var cartString = cookies[cookieName];
		var pattern = /^([^\;]+)\;([^\;]+)\;([^\;]+)$/;
		var result = cartString.match(pattern);	
		if (result != null) {
			returnObject['OrderID'] = result[1];
			returnObject['Items'] = result[2];
			returnObject['Total'] = result[3];
		} else {
			returnObject['OrderID'] = '0';
			returnObject['Items'] = '0 items';
			returnObject['Total'] = '$0.00';
		}		
	} catch(e) {
		returnObject['OrderID'] = '0';
		returnObject['Items'] = '0 items';
		returnObject['Total'] = '$0.00';
	}
	return returnObject;
}
// end parse cart

// user control for static ////////////
function isguest(CookieId) {
	try {
		if (cookies[CookieId] != null && cookies[CookieId] != '' &&  cookies[CookieId] != 'guest') {
			return false;
		} else {
			return true;
		}
	} catch(e) {}
}
// end user control

// set html by cookie /////////////////////
function eatCookie(ElementId,CookieId) {
	try {
		if (cookies[CookieId]) {
			var el = document.getElementById(ElementId);
			el.innerHTML = cookies[CookieId];
			el.style.display = 'Block';
		}
	} catch(e) {}
}
// end set html by cookie

// Set up IE6 navigation
var agt=navigator.userAgent.toLowerCase();
var version = parseFloat(navigator.appVersion);
var browser;
var OS;

if (agt.indexOf("gecko") != -1) {var moz = 1;browzer = 0;browser = 'Netscape7';}	//Camino, Netscape 7.0
if (agt.indexOf("opera") != -1) {var opera = 1; browzer = 2;browser = 'Opera';}		//Opera
if ((agt.indexOf("msie") != -1) && !moz && !opera) {
	var ie = 1; 
	browser = "Internet Explorer";
    version = agt.substr(agt.indexOf("msie ")+ 5, 4);
    version = parseFloat(version);
	}
if ( agt.indexOf( 'win' ) != -1 ) { OS = 'Windows' }
	
function startnavigation() {
	if ((OS == "Windows") && (browser == "Internet Explorer") && (version == '6')) {
		if (document.all && document.getElementById) {
			navRoot = document.getElementById("nav");
			if (navRoot != null) {
				for (i=0; i<navRoot.childNodes.length; i++) {
					node = navRoot.childNodes[i];
					if (node.nodeName == "LI") {
						node.onmouseover = function() {	this.className+=" over"; }
						node.onmouseout = function() { this.className=this.className.replace(" over", ""); }
					}
				}
			}
		}
	}
}

// Capture enter in forms
function formskeypress(e) {
	if (window.event) {
		if (window.event.keyCode == 13) {
			window.event.returnValue = false;
			if (window.event.srcElement.form.action) {
				if (!window.event.srcElement.form.enteroverride) {
					formSub(window.event.srcElement.form.name);
				} else {
					eval(window.event.srcElement.form.enteroverride.value);
				}
			}
		}
	} else {
		if (e.which == 13) {
			e.preventDefault();
			if (e.target.form.action) {
				if (!e.target.form.enteroverride) {
					formSub(e.target.form.name);
				} else {
					eval(e.target.form.enteroverride.value);								
				}
			}
		}
	}
}

// Hook up enter capturing
function formsenterhook() {
	if (document.getElementById) {
		if (document.captureEvents) document.captureEvents(Event.KEYPRESS);
		for (f=0; f < document.forms.length; f++) {
			for (i=0; i < document.forms[f].elements.length; i++) {
				if (document.forms[f].elements[i].type != "textarea" ) { 
					document.forms[f].elements[i].onkeypress = formskeypress;
				}
			}
		}
		var a = document.getElementsByTagName("a");
		for(i=0; i < a.length; i++) {
			if ( a[i].className.match(/^d\d+$/) ) { 
					a[i].onkeypress = buttonskeypress;
			}
		}
	}
}

// Capture spacebar in buttons
function buttonskeypress(e) {
	if (window.event) {
		if (window.event.keyCode == 32) {
			window.event.returnValue = false;
			if (window.event.srcElement.href > '') window.location = window.event.srcElement.href;
		}
	} else {
		if (e.which == 32) {
			e.preventDefault();
			if (e.target.href > '') window.location = e.target.href;
		}
	}

}

// set field to 1 on focus
function qtyOne(thefield) {
	if (thefield.value=="") thefield.value = "1";
	thefield.select();
}

// clear template value on focus
function autoclear(thefield,thedefault) {
	if (thefield.value==thedefault) thefield.value = "";
}

// reset the form 
function formReset(fName) {
	eval("document." + fName + ".reset();");
}

// submit with action (action deprecated) + only allows one submit per form 
// w/ hourglass cursor to fix IE6 progress bar bug and status message
var submittedformcount = 0;
function formSub(fName,fAction) {
	if (submittedformcount == 0) {
		submittedformcount++;
		if (fAction > "") eval("document." + fName + ".action = '" + fAction + "';");
			// next line is for lowercasing search terms
			eval("if(typeof document." + fName + ".keyword != 'undefined') {document." + fName + ".keyword.value = document." + fName + ".keyword.value.toLowerCase();}");
			eval("document." + fName + ".submit();");
			document.body.style.cursor='wait'; 
			status='Loading...';
			if (cookies['KIOSK_NBR'] || cookies['STORE_NBR']) {
				loadlink();
			}
	}
}

// execute popup
	var popArray = new Array(4);
	for (i=0; i <popArray.length; ++i) {
		popArray[i] = new Array(4);
	}
	//scrollbars			titlebar				width				height
	popArray[0][0] = 'yes';popArray[0][1] = 'no';popArray[0][2] = 415;popArray[0][3] = 330;
	popArray[1][0] = 'yes';popArray[1][1] = 'no';popArray[1][2] = 596;popArray[1][3] = 486;	// more views
	popArray[2][0] = 'no';popArray[2][1] = 'no';popArray[2][2] = 570;popArray[2][3] = 460;	// interactive tour
	popArray[3][0] = 'yes';popArray[3][1] = 'yes';popArray[3][2] = 780;popArray[3][3] = 580;
	
function pop(pURL, pName, sIndex) {
	var browserAvailWidth = window.screen.availWidth;
	var browserAvailHeight = window.screen.availHeight;
	var popupLeft = (((browserAvailWidth / 2) - (popArray[sIndex][2] / 2)) - 5);
	var popupTop = (((browserAvailHeight / 2) - (popArray[sIndex][3] / 2)) - 5);
	newPop = open(pURL,pName,'directories=no,scrollbars=' + popArray[sIndex][0] + ',status=no,toolbar=no,titlebar=' + popArray[sIndex][1] + ',location=no,menubar=no,resizable=no,width=' + popArray[sIndex][2] + ',height=' + popArray[sIndex][3] + ',left=' + popupLeft + ',top=' + popupTop);
	newPop.focus();
}

// launch link in new window
function newwindow(newUrl) {
	window.open(newUrl);
}

// print this page
function printpage() {
	window.print();
}

// close popup 
function popclose() {
	self.close();
}

// loading tip for kiosk
var enablekioskstatus=false;
function loadlink(url) {
	if (typeof kioskstatusobj == 'undefined') {
		document.body.innerHTML = '<a href=\"\" class=\"d03\" id=\"kioskstatus\" style=\"position: absolute;  z-index: 100; \">Loading...</a>' + document.body.innerHTML;
		kioskstatusobj=document.getElementById("kioskstatus");
	}
	document.body.style.cursor='wait';
	enablekioskstatus=true;
	document.onmousemove=kioskstatusposition;
	if (url) {
		window.location=url;
	}
}

// track mouse position for loading tip for kiosk
function kioskstatusposition(){
	if (enablekioskstatus) {
		var scrollLeft = ( document.documentElement.scrollLeft > 0 ? document.documentElement.scrollLeft : document.body.scrollLeft );
		var scrollTop = ( document.documentElement.scrollTop > 0 ? document.documentElement.scrollTop : document.body.scrollTop );
		var clientWidth = ( document.documentElement.clientWidth > 0 ? document.documentElement.clientWidth : document.body.clientWidth )
		var clientHeight = ( document.documentElement.clientHeight > 0 ? document.documentElement.clientHeight : document.body.clientHeight )
		var curX = event.clientX+scrollLeft;
		var curY = event.clientY+scrollTop;
		var curWidth = clientWidth + scrollLeft;
		var curHeight = clientHeight + scrollTop;
		if (curX>curWidth) {
			kioskstatusobj.style.left=curWidth-kioskstatusobj.offsetWidth-24+"px";
		} else if (curX+kioskstatusobj.offsetWidth>curWidth-20) {
			kioskstatusobj.style.left=curX-kioskstatusobj.offsetWidth-24+"px";
		} else {
			kioskstatusobj.style.left=curX+12+"px";
		}
		if (curY - scrollTop < 20) {
			kioskstatusobj.style.top= scrollTop + 8 + "px";		
		} else if (curY+kioskstatusobj.offsetHeight>curHeight-5) {
			kioskstatusobj.style.top=curHeight-kioskstatusobj.offsetHeight-16+"px";
		} else {
			kioskstatusobj.style.top=curY-kioskstatusobj.offsetHeight+16+"px";
		}		
	}
}

// Run these functions after browser loads window
function onloadwindow () {
	if (cookies['KIOSK_NBR'] || cookies['STORE_NBR']) {
		for (var arraycounter = 0 ; arraycounter < document.links.length ; arraycounter++ ) {
			if (! document.links[arraycounter].href.match(/^javascript/i) ) {
				document.links[arraycounter].href = 'javascript:loadlink(\'' + document.links[arraycounter].href + '\')\;';
			} else if (document.links[arraycounter].href.match(/^javascript:jsSubmitLink/i)) {
				document.links[arraycounter].href = 'javascript:loadlink(); ' + document.links[arraycounter].href.replace(/^javascript:/i,'')
			}
		}
	}
	formsenterhook();
	startnavigation();
}

window.onload=onloadwindow;

// just for partpopup.jsp, changing it here for reusability

function updateOpener(url) {
	opener.location.href = url;
	popclose();
}

function reloadcaptchaimg(path)
	{
	   img = document.getElementById('captchaimg');
	   img.src = path + '?' + Math.random();
	   document.Register.captchaanswer.value="";
	}


// -->