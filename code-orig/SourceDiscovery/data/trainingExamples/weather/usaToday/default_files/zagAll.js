/*********
* Config *
*********/
var zagEnabled= 1; // use zagito form?
var ZAGITOEnabled= 1; // do anything at all?
if (!self.zagitoPrefix) zagitoPrefix= 'http://reg.usatoday.com/registration/zagito5';
var gciUsatURL= zagitoPrefix+'/gciUSATv2.js';
var throttle=100;


/************
* utilities *
************/
function getCookie(nm) {
// when we find multiple cookies with the same name, try to
// return the value containing the most information
	var v= (' '+document.cookie).match(new RegExp(' '+nm+'=[^;]*', 'g')) || [];
	var l= 0;    		// length of match
	var r= null;		// result
	for (var j= 0; j < v.length; j++) {
		if (v[j].length > l) {
			l= v[j].length;
			r= unescape(v[j].substring(2+nm.length));
		}
	}
	return r;
}

function setSessionCookie(nm, val) { /* only for session cookies */
	document.cookie= nm+'='+escape(val)+'; path=/; domain=.usatoday.com';
}

function nowDtNum(y,m,d) { /* pack today's date */
	var now= new Date();
	var yr= now.getFullYear();
	yr+= yr < 200 ?1900 :0; /* for broken browser implementations */
	yr+= yr < 1970 ?100 :0; /* for broken browser implementations */
	var mn= now.getMonth();
	var dt= now.getDate()-1;
	return ((yr-2000)*12+mn)*31+dt;
}

/*****************
* gcion wrappers *
*****************/
// HACK: try to emulate callback behavior
function gciSetCallback(fn) {
	var interval= null;
	var old= GCION.Cookies.Value ?GCION.Cookies.Value :null;
	function watchGCIONID() {
		if (!self.GCION) { /* page is unloading */
			clearInterval(interval);
		} else {
			if (GCION.Cookies.Value && old != GCION.Cookies.Value) {
				clearInterval(interval);
				fn(GCION.Cookies.Value);
			}
		}
	}
	interval= setInterval(watchGCIONID, 500);
}

function gcionSet(fnName) {
	/* note: this has to be my editted version */
	GCION.Sites.USAT.ConvertToGCION();
	gciSetCallback(fnName);
}

function gcionGet(fnName) {
	GCION.Utils.Include.Once(GCION.Utils.Data.GetGcionUrl("q=3&NoCookie=1"));
	gciSetCallback(fnName);
}

function gcionWill(fn, isSet) {
	var interval= null;
	function waitForIE() {
		if (!self.ZAGITOEnabled) { /* system turned off or page is unloading */
			clearInterval(interval);
		} else {
			if (self.GCION) { // have GCION, assume it's populated
				clearInterval(interval);
				if (isSet) {
					gcionSet(fn);
				} else {
					gcionGet(fn);
				}
			}
		}
	}
	if (self.GCION) {
		if (isSet) {
			gcionSet(fn);
		} else {
			gcionGet(fn);
		}
	} else {
		interval= setInterval(waitForIE, 50);
	}
}

function gciCallback(fn, doSet) {
/* This is the start of, potentially, a two level chain of callbacks
 * First, we have to guarantee that the gciUsatURL has been loaded;
 * this should be a simple document.Write() of a couple script tags
 * but IE chokes unless it's given some time to calm down
 * -- zagitoExecuteWithGciUsat() handles this
 * Second, once that is loaded, we need to query gci's server
 * (doSet indicates which query we need)
 * -- gcionWill() handles this
 * Finally, when we've gotten the response from gci, we can run
 * the function named by fnName
 */
	zagitoExecuteWithGciUsat(function() {gcionWill(fn, doSet)});
}

/********************************
* execute after loading gciUsatURL *
* (work around an IE problem)   *
********************************/
var zagitoWillHaveGciUsat= 0;
var zagitoHaveGciUsat= 0;
var zagitoExecuteWithGciUsatList= [];
function gciUsatLoadedCallback() {
	zagitoHaveGciUsat= 1;
	for (var j=0; j < zagitoExecuteWithGciUsatList.length; j++) {
		try {
			zagitoExecuteWithGciUsatList[j]();
		} catch(er) {}
	}
}
function zagitoExecuteWithGciUsat(fn) {
	if (!zagitoHaveGciUsat) {
		zagitoExecuteWithGciUsatList.push(fn);
		if (!zagitoWillHaveGciUsat) {
			var script= document.createElement('script');
			script.setAttribute('language', 'javascript');
			script.setAttribute('src', gciUsatURL);
			document.getElementsByTagName('head')[0].appendChild(script);
			zagitoWillHaveGciUsat= script;
		}
	} else {
		fn();
	}
}


/**************
* zagito support *
**************/
var zagito= '-1';
function gci2Zagito(gcio) {
	if (gcio) {
		gcio.adr= null;
		var zagito= GCION.Sites.USAT.ParseZagito(getCookie('zagCookie'));
		if (gcio.gcionid) zagito.gci= gcio.gcionid;
 		if (!GCION.Utils.Data.IsNullOrEmpty(gcio.zip)) {
 			var status='GCI0';
 			zagito.version= 3;
			for (var p in gcio)
				if (GCION.Utils.Data.IsNullOrEmpty(zagito[p]) && 3 == p.length && (status='GCI' /*not a test*/))
					if ('gen' == p)
						zagito['fem']= 2-gcio[p];
					else
						zagito[p]= gcio[p];
			zagito.gdt= zagito.gdt= nowDtNum();
			zagito.sav= 0;
			GCION.Sites.USAT.SetZagito(zagito);
			postzagito(zagito, 'Saved');
			setSessionCookie('zagSession', status);
		} else {
			GCION.Sites.USAT.SetZagito(zagito);
			if ('PreSync' == getCookie('zagSession')) {
				gciCallback(zagito2Gci, 1);
				setSessionCookie('zagSession', 'PreSynced');
			} else if (-1 < (""+getCookie('TData')).indexOf('AMS_00443')) {
				setSessionCookie('zagSession', '0');
				doLoadZagito();
			} else {
				setSessionCookie('zagSession', 'Ready');
			}
		}
	} else {
		setSessionCookie('zagSession', 'GCI Down');
	}
}

function zagito2Gci(gcio) {
	if (gcio) {
		/* in principle, we have updated GCI with our zagito data */
		var zagito= GCION.Sites.USAT.ParseZagito(getCookie('zagCookie'));
		zagito.gci= gcio.gcionid;
		zagito.gdt= nowDtNum();
		zagito.sav= 0;
		GCION.Sites.USAT.SetZagito(zagito);
		setSessionCookie('zagSession', 'Synced');
		if (!zagito.sav) { // sav: no
			postzagito(zagito, 'Saved It');
		}
	} else {
		setSessionCookie('zagSession', 'GCI down');
	}
}

function postzagito(data, finalState) {
	/* pack up GCION.Cookies.value into a query string,
	/* and tell postzagito about it */
	if (!data.kcd) data.kcd= 'testzag2';
	var url= zagitoPrefix+'/postzagito.ashx';
	var delim='?';
	for (p in data)
		if (3 == p.length) {
			url+=delim+escape(p)+'='+escape(data[p]);
			delim='&';
	    }
	var img= document.createElement('img');
	img.onload= function() {
		var zs= ''+getCookie("zagSession"); /* double save to avoid browsers that are 'too smart' */
		setSessionCookie("zagSession", finalState);
		if (-1 < zs.indexOf("error"))
			setSessionCookie("zagSession", zs);
	};
	img.setAttribute('src', url);
}

function doLoadZagito() {
	var url= document.URL;
	if (!zagEnabled) return;
	if (-1==url.indexOf(".htm")) return;
	if (-1<url.indexOf("usafront.htm")) return;
	var exclude= ['javascrip', '/survey/', 'marketing/legal.htm',
		'ads/usat/inside_usat.htm', 'money/jobcenter/front.htm',
		'educate/homesplash.htm', '_ads/sweepstakes',
		'subscribe.usatoday', 'newspaperads.com', 'ad.usatoday.com',
		'newstracker', 'marketing/feedback.htm', 'qasb.pqarchiver',
		'passport.com', 'moneyreg.aspx', 'portfolio.usatoday',
		'email.usatoday', 'registration.usatoday', 'careerbuilder.com',
		'eharmony.com', 'marketplace/front.htm', 'cars.com',
		'concordpromotions.com', 'shermanstravel.com', '.4info.net/nfl', '#'];
	var links= document.links;
	for (x= 0; x<links.length; x++) {
		var link=links[x]
		var href=link.href;
		var check= function(str) {return -1==href.indexOf(str)}
		var ok= -1==link.target.indexOf('popup');
		if (ok) for (var y= 0; y<exclude.length; y++) {
			if (!(ok= check(exclude[y]))) break;
		}
		if (ok) link.onclick= getZagitoLink(href);
	}
}

function getZagitoLink(href) {
	return function() {
		if (2 == parseInt(""+getCookie('zagCookie'))) {
			self.location= zagitoPrefix+'/zagito.htm?destination='+escape(href)+'&origination='+escape(window.location.toString());
			return false;
		} else
			return true;
	}
}

function pickup() {
	// system dropped cookies on floor, pick them up
	setSessionCookie('zagSession', 'Saving');
	zagitoExecuteWithGciUsat(pickupContinued);
}

function pickupContinued() {
	postzagito(GCION.Sites.USAT.ParseZagito(getCookie("zagCookie")), "Saved Session");
}


/*************************
* fundamental zagito logic  *
* invoked elsewhere, so  *
* interstitial logic can *
* disable                *
*************************/
function doLoad() {
	if (throttle <= parseInt((""+getCookie('RMID')).substring(0,7), 16)%100)
		setSessionCookie('zagSession', 'Throttled');

	var sess= getCookie('zagSession');
	if ("0" == sess) {
		doLoadZagito();
	} else if (null == sess || 'Initialized' == sess || 'Session Saved' == sess) {
		zagito= ""+getCookie('zagCookie');
		var zver= parseInt(zagito);
		if (-1 < zagito.indexOf('n676474v')) { // have gdt means we synced with gci
			if (-1 < zagito.indexOf('n736176v0')) { // sav: no (not yet)
				pickup();
			} else {
				setSessionCookie('zagSession', 'Done');
			}
		} else if (0 < zver && 2 != zver) { // zver 1 or 3+: user zagged
			if (-1 < zagito.indexOf('n676369v')) { // gci means we have gcionid
				setSessionCookie('zagSession', 'Sync');
				gciCallback(zagito2Gci, 1);
			} else if (-1 < zagito.indexOf('n736176v0')) { // sav: no (not yet)
				pickup();
			} else { // no gcionid, not saved, get gcionid (and maybe zagito)
				setSessionCookie('zagSession', 'PreSync');
				gciCallback(gci2Zagito, 0);
			}
		} else { // user not zagged, here, maybe elsewhere?
			setSessionCookie('zagSession', 'Checking');
			gciCallback(gci2Zagito, 0)
		}
	}
}


