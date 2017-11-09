// global optin var
floptin = false;
// communication options w/ the flash application
flGetData = "flget";
flSetData = "flset";
flDelData = "fldel";
// var to send options
flCommOption = "flcommoption";
// array containing all VALID input parameters to the flash
// make sure to add new parameters here as needed
flValidInput = new Array();
flValidInput[0] = "in_optin";
flValidInput[1] = "in_rmid";
flValidInput[2] = "in_hlid";
flValidInput[3] = "in_hltype";
flValidInput[4] = "in_hpres";
flValidInput[5] = "in_hlzipid";
flValidInput[6] = "in_hlzippres";
flValidInput[7] = "in_hfamilyprefs";
flValidInput[8] = "in_age";
flValidInput[9] = "in_gender";
// where does the flash live
flFilePath = "http://ima.weather.com/web/common/flash/";
flFileName = "flookie.swf";

// some headers can overwrite the flFilePath varialbe if needed
if(typeof(newFlFilePath) == 'undefined') {
    // keep the same
} else {
    flFilePath = newFlFilePath;
}
////////////////////////////////////////////////////////////
////// THIS FUNCTION DRAWS THE SWF FILE ONTO THE PAGE //////
////////////////////////////////////////////////////////////
function flDrawSwf(url,width,height) {
	var str = '';
	var agnt = navigator.userAgent;
	if (agnt.indexOf("MSIE") > -1 && agnt.indexOf("Macintosh") == -1 && agnt.indexOf("PowerPC") == -1) {
		str += '<OBJECT classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=5,0,30,0" swLiveConnect="true" WIDTH='+width+' HEIGHT='+height+' NAME="ccmovie" ID="ccmovie">';
		str += '<PARAM NAME=movie VALUE="'+url+'">';
		str += '<PARAM NAME=quality VALUE=high>';
		str += '<PARAM NAME=swLiveConnect VALUE=true>';
		str += '</OBJECT>';
	} else if (agnt.indexOf("Gecko") > -1) {
		str += '<object id="ccmovie" data="'+url+'" type="application/x-shockwave-flash" width="'+width+'" height="'+height+'">';
		str += '<param name="movie" value="'+url+'">';
		str += '<param name="quality" value="high">';
		str += '<param name="swliveconnect" value="true">';
		str += '</object>';
	} else if (agnt.indexOf("Macintosh") > -1 || agnt.indexOf("PowerPC") > -1 || agnt.indexOf("Opera") > -1) {
		str += '<EMBED swLiveConnect="true" src="'+url+'" quality="high" bgcolor="#FFFFFF" WIDTH="'+width+'" HEIGHT="'+height+'" TYPE="application/x-shockwave-flash" PLUGINSPAGE="http://www.macromedia.com/go/getflashplayer" NAME="ccmovie" ID="ccmovie" allowScriptAccess="samedomain"></EMBED>';
	} else {
		str += '<object id="ccmovie" data="'+url+'" type="application/x-shockwave-flash" width="'+width+'" height="'+height+'">';
		str += '<param name="movie" value="'+url+'">';
		str += '<param name="quality" value="high">';
		str += '<param name="swliveconnect" value="true">';
		str += '</object>';
	}
	writeDiv('flookiebox',str);
}

////////////////////////////////////////////////////////////////
////// THIS FUNCTION SETS VALUES FROM FLOOKIE TO COOKIES ///////
////// IT IS CALLED AS A CALL-BACK FROM FLASH MOVIE     ////////
////////////////////////////////////////////////////////////////
function flGotVals(hash) {
	for (var n in hash) {
		floptin = true;
		switch (n) {
			case "rmid" :
			    var expdate = new Date();
			    FixCookieDate(expdate);
			    expdate.setTime(expdate.getTime() + (24 * 60 * 60 * 1000 * 365 * 10));
			    SetCookie ("RMID", hash[n], expdate, "/", ".weather.com");
				break;
			case "hlid" :
				setUserPreferences("11",hash[n]);
				break;
			case "hltype" :
				setUserPreferences("22",hash[n]);
				break;
			case "hpres" :
				setUserPreferences("10",hash[n]);
				break;
			case "hlzipid" :
				setUserPreferences("23",hash[n]);
				break;
			case "hlzippres" :
				setUserPreferences("24",hash[n]);
				break;
			case "hfamilyprefs" :
				setUserPreferences("26",hash[n]);
				break;
			case "age" :
				setUserPreferences("13",hash[n]);
				break;
			case "gender" :
				setUserPreferences("14",hash[n]);
				break;
		}
	}
	// we set this session cookie so we do not have to draw the flash movie again (we already know the values)
	// anytime you want to re-set (or just set) values, make sure you delete this cookie first!
	var expdate = new Date ();
    FixCookieDate (expdate);
    expdate.setTime (expdate.getTime() + (30 * 60 * 1000));
	SetCookie("flCheck", "true", expdate, "/", ".weather.com");
	flProcessGotVals();
}

/////////////////////////////////////////////////////////////////
////// THIS FUNCTION SETS VALUES TO THE FLOOKIE   ///////////////
/////////////////////////////////////////////////////////////////
function flSetFlookie(hash) {
    var hA = new Array();
    for (var n in hash) {
        if(flIsValidInputParam(n)) {
	        hA[hA.length + 1] = n + "=" + escape(hash[n]);
	    }
    }
    var params = hA.join("&");
    flDrawSwf(flFilePath + flFileName + '?' + flCommOption + '=' + flSetData + '&' + params,1,1);
	// delete the session cookie flCheck so we can retrieve just set values
    DeleteCookie("flCheck", "/", ".weather.com");
}
///////////////////////////////////////////////////////////////////
//////// THIS FUNCTION RETRIEVES ALL FLOOKIE VALUES ///////////////
///////////////////////////////////////////////////////////////////
function flGetFlookie() {
	if (!GetCookie("flCheck")) {
		flDrawSwf(flFilePath + flFileName + '?' + flCommOption + '=' + flGetData, 1, 1);
	} else {
	    // WE HAVE TO CALL THE CUSTOM CALLBACK FUNCTION HERE!!!!
	    // SINCE FLASH WILL NOT BE CALLED, SO THAT CODE STILL WORKS!!!!!
	    flProcessGotVals();
	}
}

////////////////////////////////////////////////////////////////////
//////// THIS FUNCTION DELETES THE FLOOKIE  ////////////////////////
////////////////////////////////////////////////////////////////////
function flDelFlookie() {
	flDrawSwf(flFilePath + flFileName + '?' + flCommOption + '=' + flDelData, 1, 1);
	// delete the session cookie flCheck so we can retrieve just set values
    DeleteCookie("flCheck", "/", ".weather.com");
}


////////////////////////////////////////////////////////////////////
///// THIS IS THE CALLBACK FUNCTION (GETS CALLED BY FLOOKIE ////////
///// THIS IS DEFAULT (BLANK) IMPLEMENTATION THAT NEEDS TO /////////
///// OVERWRITTEN BY SPECIFIC IMPLEMENTATIONS              /////////
////////////////////////////////////////////////////////////////////
function flSetVals(status, message) {
	if(status != 1) {
	    // do something
	}
}

////////////////////////////////////////////////////////////////////
////// THIS IS A CALLBACK FUNCTION AND GETS CALLED WHEN  ///////////
////// FLASH DELETED THE FLOOKIE. THIS IS DEFAULT (BLANK) //////////
////// IMPLEMENTATION THAT NEEDS TO BE OVERWRITTEN BE    ///////////
///// SPECIFIC PAGE IMPLEMENTATION /////////////////////////////////
////////////////////////////////////////////////////////////////////
function flDelVals(status, message) {
    if(status != 1) {
        // do something
    }
}

////////////////////////////////////////////////////////////////////
////// THIS FUNCTION VALIDATES THE INPUT PARAMETERS ///////////////
////// TO THE FLASH                                 ///////////////
///////////////////////////////////////////////////////////////////
function flIsValidInputParam(param) {
    var found = false;
    for(var i=0;i<flValidInput.length;i++) {
        if(flValidInput[i] == param) {
            found = true;
            break;
        }
    }
    return found;
}

//////////////////////////////////////////////////////////////////////
//////// THIS FUNCTION GETS CALLED BY flGotVals() TO DO //////////////
///////  ANY KIND OF EXTRA PROCESSING AFTER THE VALUES ///////////////
//////   HAVE BEEN RETRIEVED FROM THE FLASH            ///////////////
//////////////////////////////////////////////////////////////////////
function flProcessGotVals() {
}
// this addds the "load" event for the page to call the flGetFlookie function
addEvent(window, "load", flGetFlookie);
