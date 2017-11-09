hbBMDefault='';
hbBMOver = ''; //to keep track which tab was mouse over
hbBSMOver = '';//to keep track which second nav tab was mouse over
hbBTMOver = '';//to keep track which second nav tab was mouse over
atencion = false;//to highlight (Red)in the hat area the tempeture spot 
nothugged = false;//for hat part - if user is not hugged
var defaultnum = 0;
var zipsearch = false;//this is for checking if local rearch was already clicked 
var width = 0;//this is used for diplaying second navigation
if (getUserPreferences("11") && getUserPreferences("11").length > 1) {
nothugged = true;
}

function hbBMIOver(dn) {
	hbBTMOver = '';
	if (hbBMOver != '') {
		hbBSMIOut(hbBMOver);		
	} else if (hbBSMOver != '') {
		hbBSMIOut(hbBSMOver);		
	}
	// now, open new one
	hbBMOver = dn;
	hbBSMOver = dn;
	if (dn != hbBMDefault) {
		document.getElementById(dn).className = 'hbBannerMenuItemHover';
		document.getElementById(dn+"S").className = 'hbBannerMenuSelectedItem';
		/*~~find left tab next to Default tab so that we can change right white border to 0px~~~*/
		var tab1 = (parseFloat(hbBMDefault.substr(5,5)));
			tab1 = tab1-1;
		var tab2 = parseFloat(dn.substr(5,5));
			if(tab1==tab2){
				document.getElementById(dn).className = 'hbBannerMenuItemHoverLEFTside';			
			}
	} else {
		document.getElementById(dn).className = 'hbBannerMenuItemSelectedHover';		
		document.getElementById(dn+"S").className = 'hbBannerMenuSelectedItem';		
	}			
}
function hbBMIOut(dn) {// first this is being called
	hbBMOver = '';
	if (hbBSMOver == '') {
		if (dn != hbBMDefault){
			document.getElementById(dn).className = 'hbBannerMenuItem';	
			var tab1 = (parseFloat(hbBMDefault.substr(5,5)));
				tab1 = tab1-1;
			var tab2 = parseFloat(dn.substr(5,5));
			if(tab1==tab2){
				document.getElementById(dn).className = 'hbBannerMenuItemLEFTside';			
			}			
		}else{
			document.getElementById(dn).className = 'hbBannerMenuItemSelected';
			document.getElementById(dn+"S").className = 'hbBannerMenuSelectedItemDefault';			
		}
		document.getElementById(dn+"S").className = 'hbBannerMenuSelectedItem';	
	}		
}
function hbBSMIOver(dn) {
	hbBSMOver = dn;
}
function hbBSMIOut(dn) {// second this is being called
	hbBSMOver = '';	
	if (hbBMOver == '' && hbBTMOver == '') {
		if (dn != hbBMDefault){		
			document.getElementById(dn).className = 'hbBannerMenuItem';	
			var tab1 = (parseFloat(hbBMDefault.substr(5,5)));
				tab1 = tab1-1;
			var tab2 = parseFloat(dn.substr(5,5));			
			if(tab1==tab2){
				document.getElementById(dn).className = 'hbBannerMenuItemLEFTside';			
			}	
			}else{
				document.getElementById(dn).className = 'hbBannerMenuItemSelected';				
			}					
	} else {
		hbBTMOver = '';		
	}	
}

function hbBSMICloseAll() {
	hbBMOver = '';
	hbBSMOver = '';
	hbBTMOver = '';
	for (n=1;n<=8;n++) {
		var dn = "hbBMI"+n;
		if (dn != hbBMDefault){
			var tab1 = (parseFloat(hbBMDefault.substr(5,5)));
				tab1 = tab1-1;
			var tab2 = parseFloat(dn.substr(5,5));
			if(tab1==tab2){
				document.getElementById(dn).className = 'hbBannerMenuItemLEFTside';			
			}else{
				document.getElementById(dn).className = 'hbBannerMenuItem';		
			}
			for(var a = 0; MenuArray[a];a++){MenuArray[a].hideMe();
			}				
		}else{
			document.getElementById(dn).className = 'hbBannerMenuItemSelected';
			for(var a = 0; MenuArray[a];a++){MenuArray[a].hideMe();}
		}		
	}		
}
function siMouseDown(dn) {
	if(dn == "snPanell"){
		//document.getElementById(dn+"SignIn").className = 'hbSignInPanell';
		document.getElementById('snPanellSignIn').style.display ='inline';
		document.getElementById('hbHat').style.display ='none';	
	}else if(dn == "snClosePanell"){
		//document.getElementById("snPanellSignIn").className = 'hbSignInPanellHidden';
		document.getElementById('snPanellSignIn').style.display ='none';
		document.getElementById('hbHat').style.display ='inline';
	}else if(dn == "HideMyProducts"){	
	    setUserPreferences('20','hide');
		document.getElementById("snPanellSignedIn").className = 'snPanellSignedInHidden';
		document.getElementById("snPanellSmallRightBoxes").className = 'snPanellSmallRightBoxesClassHidden';
		document.getElementById("snShowSmallRightBoxes").className = 'snPanellSmallRightBoxesClass';
		document.getElementById('hatMakeHome').style.visibility="visible";		
	}else if(dn == "ShowMyProducts"){
	    setUserPreferences('20','show');
		document.getElementById("snPanellSignedIn").className = 'snPanellSignedIn';
		document.getElementById("snPanellSmallRightBoxes").className = 'snPanellSmallRightBoxesClass';
		document.getElementById("snShowSmallRightBoxes").className = 'snPanellSmallRightBoxesClassHidden';
		document.getElementById('hatMakeHome').style.visibility="hidden";	
	}
}

function MyLocation(){
	if(zipsearch){
		MyLocationClose("whatwhere");
	}else{
		document.whatwhereform.whatwhere.value = '';
		document.getElementById("whatwherezip").className = 'whatwhereZipClass';
		zipsearch = true;
	}
}
function MyLocationClose(dn){
	document.getElementById(dn+"zip").className = 'whatwhereZipClassHidden';
}

var hatPromoTextUserHugged = "Put this on my desktop";// THIS IS ORCA
var hatPromoTextUserNotHugged = "Put weather on my desktop";// THIS IS ORCA
var hatPromoURL = "/services/desktop.html";// THIS IS ORCA