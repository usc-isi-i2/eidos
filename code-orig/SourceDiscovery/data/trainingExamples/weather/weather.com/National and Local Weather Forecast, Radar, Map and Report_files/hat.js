// hat.js 10.20.2006 @ 9:38 AM last edited by Wendy Frazier
gotGold=hatProdExists("MWG")?1:0;
gotNotify=hatProdExists("SA")?1:0;
gotCustomization=hatProdExists("MPP")?1:0;
gotWeddingPlanner=hatProdExists("MWW")?1:0;
gotUrs=(GetCookie('Ticket_urs'))?1:0;
gotWeather888=hatProdExists("WX8")?1:0;
gotNotifyLite=hatProdExists("SAL")?1:0;
isWxGold = (window.location.pathname.indexOf("/weather/wxgold/")>=0)?1:0;
emptyHBDesktop = '<DIV id="hbDesktop" class="hbText"></DIV>';
emptyHBHTemp = '<DIV id="hbHTemp" class="hbText"></DIV>';
emptyLocalOneClick ='<div id="localOneClick" class="hbText"></DIV>';
haton=gotGold+gotNotify+gotCustomization+gotUrs+gotWeather888+gotNotifyLite+gotWeddingPlanner;
totalProds=gotGold+gotNotify+gotCustomization+gotNotifyLite+gotWeddingPlanner;
countProducts = 0;
var gotTicketWeb = GetCookie("Ticket_web");
var gotMyPrefs = GetCookie("MyPrefs");
var gotMyWedding = GetCookie("MyWedding");
document.write('<DIV id="hbHat" style="background-color: #FFFFFF;">');
document.write('<DIV id="hbHWelcome" class="hbText">');
document.write('<scr'+'ipt language="JavaScript1.2">hatInfo();</scr'+'ipt>');
document.write('</DIV>');
hugMe("notsignedin");
if(nothugged){
document.write('<DIV id="hbDesktop" class="hbText"><A href="'+hatPromoURL+'?from=dt_header&refer=dt_header">'+hatPromoTextUserHugged+'</A></DIV>');
}else{
document.write('<DIV id="hbDesktop" class="hbText"><A href="'+hatPromoURL+'?from=dt_header&refer=dt_header">'+hatPromoTextUserNotHugged+'</A></DIV>');
}
if (gotCustomization == 1 || gotMyPrefs.length > 1){
		document.write('<DIV id="hbMyPage" class="hbText"><A HREF=\'javascript:splitLink('+gotCustomization+',"http://www.weather.com/weather/my/","http://www.weather.com/weather/my/","hat_gotomp")\'>My Page</A></DIV>');
		document.getElementById('hbMyPage').style.display ='inline';
		}else{
		document.write('<DIV id="customize" class="hbText"><A HREF="http://www.weather.com/weather/my/?from=hat_customize&refer=hat_customize">Customize weather.com</A></DIV>');
			if(readDiv('hbHTemp') != ''){
			document.getElementById('hbHTemp').style.display ='inline';	
			document.getElementById('hbHTemp').style.left = 210+'px'; 
				if(!isMinIE4){
				document.getElementById('hbDesktop').style.left = 430+'px'; 
				}
			}else if(!isMinIE4){
			document.getElementById('hbDesktop').style.left = 392+'px'; 
			}
		}
if(readDiv('hbMyPage') == '' && readDiv('hbHTemp') != ''){
	document.getElementById('hbDesktop').style.left = 430+'px';	
}else if(readDiv('hbMyPage') == '' && readDiv('hbHTemp') == ''){
	document.getElementById('hbDesktop').style.left = 392+'px'; 
}else if(readDiv('hbMyPage') != '' && readDiv('hbHTemp') != '' ){
	document.getElementById('hbDesktop').style.left = 440+'px';	
}else if(readDiv('hbMyPage') != ''){
	document.getElementById('hbDesktop').style.left = 392+'px';	
}


document.write('<DIV id="hbDash" class="hbText"> | </DIV>');
document.write('<DIV id="hbSingIn" class="hbText" onMouseDown="siMouseDown(\'snPanell\')"><A href="?from=hat_signin&refer=hat_signin">Sign In</A></DIV>');
document.write('</DIV>');	

document.getElementById('hbHat').position= "absolute";
document.getElementById('hbHat').visibility= "visible";
if (haton && (gotTicketWeb.length > 1))
{
// This part for after sign and user is hugged BEGIN
if(nothugged){

if (getUserPreferences('20') == "hide"){
   	document.write('<DIV id="snPanellSignedIn" class="snPanellSignedInHidden">');
}else{
 	document.write('<DIV id="snPanellSignedIn" class="snPanellSignedIn">');
}

	   	//document.write('<DIV id="snPanellSignedIn" class="snPanellSignedIn">');
		document.write('<DIV id="SignedInFirstPart" class="hbTextSignOneClass">');
		if(!isWxGold){hugMe("signedin");}
		document.write('</DIV>');
		if(!isWxGold){document.write('<DIV id="SignedInMiddlePart" class="SignedInMiddlePartClass"></DIV>');}
		if(isWxGold){document.write('<style>#SignedInSecondPart{left:5px;width:350px;top: 5px;text-align : center;}</style>');}
		document.write('<DIV id="SignedInSecondPart" class="hbTextSign">');
		if(haton >= 2){
			if (gotWeddingPlanner == 1 || gotMyWedding.length > 1){
			document.write('<A 	HREF="http://www.weather.com/outlook/events/weddings?from=wed_hat&refer=wed_hat">My Wedding Weather</A>');if(countProducts == 1){document.write('<BR>');countProducts++;}else if(haton != countProducts || totalProds <= 3){document.write('&nbsp;|&nbsp;');countProducts++;}
			}
			document.write('<A HREF="https://registration.weather.com/ursa/profile?from=hat_myprofile">My Profile</A>');
			if(countProducts == 1 && !isWxGold){document.write('<BR>');countProducts++;}else if(haton != countProducts || totalProds <= 3){document.write('&nbsp;|&nbsp;');countProducts++;}
			if (gotGold == 1){
				if(isWxGold){
				writeDiv('hbDesktop',emptyHBDesktop);
				writeDiv('hbHTemp',emptyHBHTemp);
				}
				document.write('<A HREF="http://gold.weather.com/weather/wxgold/mypage?from=hat_gold">weather.com Gold</A>');
				if(countProducts == 1 && !isWxGold){document.write('<BR>');countProducts++;}else if(haton != countProducts || totalProds <= 3){document.write('&nbsp;|&nbsp;');countProducts++;}
			}
			if (gotNotify == 1 && gotWeather888 == 1){
			document.write('<A HREF="https://registration.weather.com/ursa/notify/alerts?from=hat_notify">Notify!</A>');
			if(countProducts == 1 && !isWxGold){document.write('<BR>');countProducts++;}else if(haton != countProducts || totalProds <= 3){document.write('&nbsp;|&nbsp;');countProducts++;}
			}else if(gotNotify == 1 && gotNotifyLite == 1){
			document.write('<A HREF="https://registration.weather.com/ursa/notify/alerts?from=hat_notify">Notify!</A>');
			if(countProducts == 1 && !isWxGold){document.write('<BR>');countProducts++;}else if(haton != countProducts || totalProds <= 3){document.write('&nbsp;|&nbsp;');countProducts++;}
			}else if (gotNotify == 1){
			document.write('<A HREF="http://notify.weather.com/weather/local?from=hat_notify">Notify!</A>');
			if(countProducts == 1 && !isWxGold){document.write('<BR>');countProducts++;}else if(haton != countProducts || totalProds <= 3){document.write('&nbsp;|&nbsp;');countProducts++;}
			}
			if (gotCustomization == 1){
			document.write('<A HREF="http://www.weather.com/weather/my/?from=hat_gotomp">My Page</A>');if(countProducts == 1){document.write('<BR>');countProducts++;}else if(totalProds <= 3){document.write('&nbsp;|&nbsp;');countProducts++;}
			}
			if(totalProds <= 3){
			document.write('<A HREF="http://www.weather.com/services/?from=hat_more">More...</A>');
			}
		}else if(haton == 1){
		//document.getElementById('SignedInSecondPart').style.top = 11+'px';
			if (gotWeddingPlanner == 1 || gotMyWedding.length > 1){
			document.write('<A 	HREF="http://www.weather.com/outlook/events/weddings?from=wed_hat&refer=wed_hat">My Wedding Weather</A>');
			if(countProducts == 1 && !isWxGold){document.write('<BR>');countProducts++;}else if(haton != countProducts){document.write('&nbsp;|&nbsp;');countProducts++;}
			}
			document.write('<A HREF="https://registration.weather.com/ursa/profile?from=hat_myprofile">My Profile</A>');
			if(countProducts == 1 && !isWxGold){document.write('<BR>');countProducts++;}else if(haton != countProducts || totalProds <= 3){document.write('&nbsp;|&nbsp;');countProducts++;}
			
			
			if (gotGold == 1){
				if(isWxGold){
				writeDiv('hbDesktop',emptyHBDesktop);
				writeDiv('hbHTemp',emptyHBHTemp);
				}
				document.write('<A HREF="http://gold.weather.com/weather/wxgold/mypage?from=hat_gold">weather.com Gold</A>');
				if(countProducts == 1 && !isWxGold){document.write('<BR>');countProducts++;}else if(haton != countProducts){document.write('&nbsp;|&nbsp;');countProducts++;}
			}
			if (gotNotify == 1 && gotWeather888 == 1){
			document.write('<A HREF="https://registration.weather.com/ursa/notify/alerts?from=hat_notify">Notify!</A>');
			if(countProducts == 1 && !isWxGold){document.write('<BR>');countProducts++;}else if(haton != countProducts){document.write('&nbsp;|&nbsp;');countProducts++;}
			}else if(gotNotify == 1 && gotNotifyLite == 1){
			document.write('<A HREF="https://registration.weather.com/ursa/notify/alerts?from=hat_notify">Notify!</A>');
			if(countProducts == 1 && !isWxGold){document.write('<BR>');countProducts++;}else if(haton != countProducts){document.write('&nbsp;|&nbsp;');countProducts++;}
			}else if (gotNotify == 1){
			document.write('<A HREF="http://notify.weather.com/weather/local?from=hat_notify">Notify!</A>');
			if(countProducts == 1 && !isWxGold){document.write('<BR>');countProducts++;}else if(haton != countProducts){document.write('&nbsp;|&nbsp;');countProducts++;}
			}
			if (gotCustomization == 1){
			document.write('<A HREF="http://www.weather.com/weather/my/?from=hat_gotomp">My Page</A>');
			if(countProducts == 1 && !isWxGold){document.write('<BR>');countProducts++;}else if(haton != countProducts){document.write('&nbsp;|&nbsp;');countProducts++;}
			}
			if(totalProds <= 3){
						document.write('<A HREF="http://www.weather.com/services/?from=hat_more">More...</A>');
			}
			if(countProducts == 1){document.getElementById('SignedInSecondPart').style.top = 11+'px';}
		}
		document.write('	</DIV>');
		document.write('	</DIV>	');
}else if (!nothugged){
//<!-- This part for after sign and user is NOT hugged BEGIN-->	

if (getUserPreferences('20') == "hide"){
   	document.write('<DIV id="snPanellSignedIn" class="snPanellSignedInHidden">');
}else{
 	document.write('<DIV id="snPanellSignedIn" class="snPanellSignedIn">');
}
		//document.write('<DIV id="snPanellSignedIn" class="snPanellSignedIn">');
		document.write('<DIV id="SignedInSecondNotHugged" class="hbTextSign">');
		document.getElementById('SignedInSecondNotHugged').style.top = 9+'px';		
		if (gotWeddingPlanner == 1 || gotMyWedding.length > 1){
			document.write('<A 	HREF="http://www.weather.com/outlook/events/weddings?from=wed_hat&refer=wed_hat">My Wedding Weather</A>'); if(haton != countProducts || totalProds <= 3){document.write('&nbsp;|&nbsp;');countProducts++;}
			}
			if(gotUrs == 1 || gotTicketWeb.length > 1){
				document.write('<A HREF="https://registration.weather.com/ursa/profile?from=hat_myprofile">My Profile</A>');
				if(haton != countProducts || totalProds <= 3){document.write('&nbsp;|&nbsp;');countProducts++;}
			}
			
			if (gotGold == 1){
				if(isWxGold){
				writeDiv('hbDesktop',emptyHBDesktop);
				writeDiv('localOneClick',emptyLocalOneClick);
				}
				document.write('<A HREF="http://gold.weather.com/weather/wxgold/mypage?from=hat_gold">weather.com Gold</A>');
				if(haton != countProducts || totalProds <= 3){document.write('&nbsp;|&nbsp;');countProducts++;}
			}
			
			if (gotNotify == 1 && gotWeather888 == 1){
			document.write('<A HREF="https://registration.weather.com/ursa/notify/alerts?from=hat_notify">Notify!</A>');
			if(haton != countProducts || totalProds <= 3){document.write('&nbsp;|&nbsp;');countProducts++;}
			}else if(gotNotify == 1 && gotNotifyLite == 1){
			document.write('<A HREF="https://registration.weather.com/ursa/notify/alerts?from=hat_notify">Notify!</A>');
			if(haton != countProducts || totalProds <= 3){document.write('&nbsp;|&nbsp;');countProducts++;}
			}else if (gotNotify == 1){
			document.write('<A HREF="http://notify.weather.com/weather/local?from=hat_notify">Notify!</A>');
			if(haton != countProducts || totalProds <= 3){document.write('&nbsp;|&nbsp;');countProducts++;}
			}
			if (gotCustomization == 1){
			document.write('<A HREF="http://www.weather.com/weather/my/?from=hat_gotomp">My Page</A>');if(totalProds <= 3){document.write('&nbsp;|&nbsp;');countProducts++;}
			}
			if(totalProds <= 3){
			document.write('<A HREF="http://www.weather.com/services/?from=hat_more">More...</A>');
		}
		document.write('</DIV>');
		document.write('</DIV>');

}
//This block holds right button when user already signed in 



document.write('<DIV id="snPanellSmallRightBoxes" class="snPanellSmallRightBoxesClass">');
document.write('<DIV id="arrowright" class="hbBDRightArrowimgClass" onMouseDown="siMouseDown(\'HideMyProducts\')"><a href="#"><IMG src="http://image.weather.com/web/blank.gif" alt="" name="hbBDRightArrowimg" id="hbBDRightArrowimg" border="0" align="top"></a>');
document.write('</DIV>');
document.write('<DIV id="smallRBOne" class="smallRBOneClass" onMouseDown="siMouseDown(\'HideMyProducts\')"><a href="#">Hide My Products</a>');
document.write('</DIV>');
document.write('<DIV id="smallRBMiddle" class="smallRBMiddleClass">');
document.write('</DIV>');
document.write('<DIV id="smallRBTwo" class="smallRBTwoClass" onMouseDown="siMouseDown(\'snClosePanell\')"><A HREF="https://registration.weather.com/ursa/logout?iswebsignout=true&from=hat_out" >Sign Out</A>');
document.write('</DIV>');
document.write('</DIV>');

document.write('<DIV id="snShowSmallRightBoxes" class="snPanellSmallRightBoxesClassHidden">');
document.write('<DIV id="arrowright" class="hbBDRightArrowimgClass" onMouseDown="siMouseDown(\'ShowMyProducts\')"><a href="#"><IMG src="http://image.weather.com/web/blank.gif" alt="" name="hbBDLeftArrowimg" id="hbBDLeftArrowimg" border="0" align="top"></a>');
document.write('</DIV>');
document.write('<DIV id="smallRBOne" class="smallRBOneClass" onMouseDown="siMouseDown(\'ShowMyProducts\')"><a href="#">Show My Products</a>');
document.write('</DIV>');
document.write('<DIV id="smallRBMiddle" class="smallRBMiddleClass">');
document.write('</DIV>');
document.write('<DIV id="smallRBTwo" class="smallRBTwoClass" onMouseDown="siMouseDown(\'snClosePanell\')"><A HREF="https://registration.weather.com/ursa/logout?iswebsignout=true&from=hat_out"> Sign Out</A>');
document.write('</DIV>');
document.write('</DIV>');

	if(!isMinIE4){
	document.getElementById('snPanellSmallRightBoxes').style.height = 16+'px';	
	document.getElementById('snShowSmallRightBoxes').style.height = 16+'px';	
	}

if (getUserPreferences('20') == "hide"){
		document.getElementById("snPanellSmallRightBoxes").className = 'snPanellSmallRightBoxesClassHidden';
		document.getElementById("snShowSmallRightBoxes").className = 'snPanellSmallRightBoxesClass';	
}else{
		document.getElementById("snPanellSmallRightBoxes").className = 'snPanellSmallRightBoxesClass';
		document.getElementById("snShowSmallRightBoxes").className = 'snPanellSmallRightBoxesClassHidden';

}
		
}

document.write('<DIV id="snPanellSignIn">');
document.write('<FORM name="login" ACTION="https://registration.weather.com/ursa/login" METHOD="post">');
document.write('<INPUT TYPE="HIDDEN" NAME="refer" VALUE="hat_signin">');
document.write('<DIV id="hbeminput" class="hbInputSI">');					
document.write('<INPUT type="Text" name="username" class="inputwidth">');
document.write('</DIV>');
document.write('<DIV id="hbepassnput" class="hbInputSI">');					
document.write('<INPUT type="Password" name="password" width="25" height="10" class="inputwidth">&nbsp;&nbsp;<div class="buttonPad"><INPUT TYPE="image" src="http://image.weather.com/web/common/icons/sign_in_button.gif" align="absmiddle"></div>');
document.write('</DIV>');
document.write('</FORM>');
document.write('<DIV id="hbemail" class="hbTextSI">	E-mail Address:	</DIV>');
document.write('<DIV id="hbpassword" class="hbTextSI">	Password:	</DIV>');
document.write('<DIV id="hbforgotp" class="hbTextSI"><A href="https://registration.weather.com/ursa/changePassword?from=hat_password&refer=hat_password">forgot password?</A></DIV>');
document.write('<DIV id="hbhelpexit" class="hbTextSI"><A HREF="" onClick="return mapWindowOpen(\'/common/help/urssignin.html?from=hat_signin&refer=hat_signin\',\'Help\',\'width=466,height=450,resizable,scrollbars,nostatus\')"><IMG src="http://image.weather.com/web/common/icons/sm_quest_box.gif" align="absmiddle"></A><IMG src="http://image.weather.com/web/blank.gif" width="2" height="2" alt="" border="0"><A href="#" onMouseDown="siMouseDown(\'snClosePanell\')"><IMG src="http://image.weather.com/web/common/icons/sm_close_box.gif" align="absmiddle"></A></DIV>');
document.write('</DIV>');
document.getElementById('snPanellSignIn').style.display ='none';





function hatProdExists(webprodkey) {
	var found = false;
	var allwebprods = getUserPreferences("1");
	if(allwebprods.length > 0) {
		var splitprods = allwebprods.split("^");
		for(var i = 0; splitprods[i]; i++) {
			if(splitprods[i] == webprodkey) {
				found = true;
			}
		}
      }
	return found;	
}
