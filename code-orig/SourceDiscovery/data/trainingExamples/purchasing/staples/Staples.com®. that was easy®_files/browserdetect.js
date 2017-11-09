<!-- 

// Test for cookies
var cookiepage = '/sbd/content/help/cookieerror.html';
var thispage = document.location.toString();
var redirectpage = '';
if (!document.cookie && thispage.indexOf(cookiepage) < 0) {
	document.cookie='testcookie=1; path=/; ';
	if (!document.cookie && thispage.indexOf(cookiepage) < 0) {
		redirectpage=cookiepage;	
	}
}

// get all cookies /////////////////////
function getCookies() {
	var args = new Object();
	var mycookie = document.cookie;
	var mypattern = /([^=\sx]+)\s*=\s*([^;]+)\s*/;
	var result;
	while (result = mycookie.match(mypattern)) {
		args[result[1]] = myunescape(result[2]);
		mycookie = mycookie.substr(result.index+result[0].length);
	}
	return args;
}
var cookies = getCookies();

// unescape text /////////////////
function myunescape (str) {
	str = "" + str;
	while (true) {
		var i = str . indexOf ('+');
		if (i < 0) break;
		str = str.substring(0, i) + '%20' + str.substring(i + 1, str.length);
	}
	return unescape (str);
}

// detect if the browser will play nice, if not, send them where they need to go /////////////////////
if ((!document.getElementById) && cookies['UnsupportedBrowser'] != 'True' && redirectpage.length <=0  && thispage.indexOf(cookiepage) < 0 ) {
	redirectpage = "/sbd/cre/resources/browserupgrade/index.html";
}
else if ((!document.getElementById) && cookies['UnsupportedBrowser'] != 'True' && thispage.indexOf(cookiepage) < 0 && redirectpage.length > 0 ) {
	redirectpage = "/sbd/cre/resources/browserupgrade/cookies.html";
}

// do the redirect
if (redirectpage.length > 0) {
	document.location=redirectpage;
}

// -->