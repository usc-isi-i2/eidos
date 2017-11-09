function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		 cook = ca[i];
		while (cook.charAt(0)==' ') cook = cook.substring(1,cook.length);
		if (cook.indexOf(nameEQ) == 0)  return cook.substring(nameEQ.length,cook.length);
	}
	return null;
}
function readCookie2(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		 affCook = ca[i];
		while (affCook.charAt(0)==' ') affCook = affCook.substring(1,affCook.length);
		if (affCook.indexOf(nameEQ) == 0)  return affCook.substring(nameEQ.length,affCook.length);
	}
	return null;
}
//End Read Cookie Function

readCookie2('ostk_affiliate')//Run Cookie Function (AFF)
readCookie('mxccamid'); //Run Cookie Function (CID)
if (affCook != null) {
	var	affArray =	affCook.split('-');
}
//Html Build Variable
var firstHtml = '<table width="100&#37;" border="0" cellspacing="0" cellpadding="0" align="center"><td align="center" style="background-color: #';
var middleHtml = ';"><img src="http://images.overstock.com/f/102/3117/8h/www.overstock.com/img/mxc/';
var middleHtmlLink = ';"><a href="';
var middleHtmlLink2 = '"><img src="http://images.overstock.com/f/102/3117/8h/www.overstock.com/img/mxc/';
var lastHtml = '" border="0"></td></tr></table>';
var lastHtmlLink = '" border="0"></a></td></tr></table>';
var affBar = false;
var cidBar = false;
var topCidBar = false;
//End Html Build Variables

//Top Cid Array

var topCidAss = new Array;
// topCidAss['mxccamid=105169'] = 'Your 15% Coupon has been ACTIVATED!';
//topCidAss['mxccamid=115647'] = 'Your 10% Off Coupons Has Been Activated.  Order Today!|http://www.overstock.com/cgi-bin/d2.cgi?PAGE=staticpopup&sta_id=10944';

//BlueBar Cid Array
var cidAss = new Array;
cidAss['mxccamid=121613'] = '7a5189|bluebar_2646_7a5189.gif|off';  //Affiliate Weekender - 20070823 - 20070827 - Author: Ryan Sorensen 
cidAss['mxccamid=120708'] = '75a268|bluebar_2645_75a268.gif|on';  	//Affiliate August 7% Mo Coupon - Author: Ryan Sorensen- Expires 20070831
cidAss['mxccamid=120711'] = 'b484c4|bluebar_7272_b484c4.gif|on';  	//Affiliate August 8% NC Coupon - Author: Ryan Sorensen- Expires 20070831
cidAss['mxccamid=120772'] = 'ff9a1a|bluebar_2414_ff9a1a.gif|on';   	//Affiliate August Perf Coupon - Author: Ryan Sorensen- Expires 20070831
cidAss['mxccamid=121411'] = '5c73a6|bluebar_2642_5c73a6.gif|on';  	//Affiliate August Bi-Mo 2 Coupon - Author: Ryan Sorensen- Expires 20070931
cidAss['mxccamid=120626'] = '75a268|bluebar_12583_75a268.gif|on';  //Affiliate O-Day - 20070718 - 20070720 - Author: Ryan Sorensen
cidAss['mxccamid=119700'] = '75a268|bluebar_dt_75a268.gif|on'; 	//Affilite DealTaker $5 off $50 Bar - Author: Jeremy Curtis - Expires 20070914
cidAss['mxccamid=115716'] = '2EAC2E|upromise_20060628_barAA.gif|off'; 	//Affilite Upromise FS Bar - Author: Lane Hancock - Expires 20071231
cidAss['mxccamid=107354'] = '2EAC2E|upromise_20060628_barAA.gif|off'; 	//Affilite Upromise FS Bar - Author: Lane Hancock - Expires 20071231
cidAss['mxccamid=120143'] = '2EAC2E|upromise_20060628_barAA.gif|off'; 	//Affilite Upromise FS Bar - Author: Ryan Sorensen - Expires 20071231
cidAss['mxccamid=120707'] = '2EAC2E|upromise_20060628_barAA.gif|off'; 	//Affilite Upromise FS Bar - Author: Ryan Sorensen - Expires 20070731
cidAss['mxccamid=115717'] = '2eac2e|upromise_4380_2eac2e.gif|on'; 	//Affilite Upromise 10 off 199 - Author: Lane Hancock - Expires 20070731
cidAss['mxccamid=107881'] = '2eac2e|upromise_4380_2eac2e.gif|on'; 	//Affilite Upromise 10 off 199 - Author: Lane Hancock - Expires 20070731
cidAss['mxccamid=119597'] = '2eac2e|upromiseEmail_4380_2eac2e.gif|on'; 	//Affilite Upromise July Soly - Author: Ryan Sorensen - Expires 20070731
cidAss['mxccamid=119598'] = '2eac2e|upromiseEmail_4380_2eac2e.gif|on'; 	//Affilite Upromise July Soly - Author: Ryan Sorensen - Expires 20070731
cidAss['mxccamid=119599'] = '2eac2e|upromiseEmail_4380_2eac2e.gif|on'; 	//Affilite Upromise July Soly - Author: Ryan Sorensen - Expires 20070731
cidAss['mxccamid=119600'] = '2eac2e|upromiseEmail_4380_2eac2e.gif|on'; 	//Affilite Upromise July Soly - Author: Ryan Sorensen - Expires 20070731
cidAss['mxccamid=119601'] = '2eac2e|upromiseEmail_4380_2eac2e.gif|on'; 	//Affilite Upromise July Soly - Author: Ryan Sorensen - Expires 20070731
cidAss['mxccamid=119602'] = '2eac2e|upromiseEmail_4380_2eac2e.gif|on'; 	//Affilite Upromise July Soly - Author: Ryan Sorensen - Expires 20070731
cidAss['mxccamid=116272'] = 'dbeed0|bluebar_11131_dbeed0.gif|on'; 	//Affilite Upromise 5% college savings - Author: Lane Hancock - Expires 20071321
cidAss['mxccamid=107094'] = '314c90|bluebar_10041_314c90.gif|off'; 	//Affilite Mallnetworks FS Bar - Author: Lane Hancock - Expires 20070831
cidAss['mxccamid=115850'] = '1a437a|bluebar_2646_1a437a.gif|on';  //Affiliate Couponshare $60 off $500 - Author: Lane Hancock - Expires 20070831
cidAss['mxccamid=116499'] = 'ae67a1|bluebar_hsbc_ae67a1.gif|on';  //Affiliate HSBC 10% off New Customer - Author: Lane Hancock - Expires 20070630
cidAss['mxccamid=107278'] = '005941|bluebar_8215_005941.gif|on'; 		//Melaleuca 7% off - Author: Ryan Sorensen- Expires 20071231
cidAss['mxccamid=108561'] = '96171a|bluebar_vesdia_96171a.gif|off'; 		//Vesdia - Author: Ryan Sorensen- Expires 20071231
cidAss['mxccamid=117640'] = 'd0eeec|bluebar_11267_d0eeec.gif|off';  //Affiliate NextJump 7% - Author: Jake Bailey - Expires 20070831
cidAss['mxccamid=117641'] = 'd0eeec|bluebar_11268_d0eeec.gif|off';  //Affiliate NextJump 10% - Author: Jake Bailey - Expires 20070831
cidAss['mxccamid=117644'] = 'd0eeec|bluebar_11269_d0eeec.gif|off';  //Affiliate NextJump Free Shipping - Author: Jake Bailey - Expires 20070831
cidAss['mxccamid=118730'] = '5a5858|062207-bb_10offcpnDS_01.gif|off';  //Double Your Savings creative on New UnT - Author: Amber Welch - Expires Unknown
cidAss['mxccamid=118853'] = '75a268|bluebar_4151_75a268.gif|off';  //Affiliate Visa 10% off - Author: Jake Bailey - Expires 20080228
cidAss['mxccamid=116601'] = '75a268|bluebar_4151_75a268.gif|off';  //Affiliate Visa 10% off - Author: Jake Bailey - Expires 20080228
cidAss['mxccamid=118968'] = '8381a1|bluebar_1shopmall_8381a1.gif|off';  //1ShopMall Free Shipping - Author: Mialee Whetton - Expires 20071231
cidAss['mxccamid=117639'] = '7a5189|bluebar_motivano_7a5189.gif|on';  //Motivano - Author: Jeremy Curtis - Expires 20070930
cidAss['mxccamid=117642'] = '7a5189|bluebar_motivano_7a5189.gif|on';  //Motivano - Author: Jeremy Curtis - Expires 20070930
cidAss['mxccamid=117643'] = '7a5189|bluebar_motivano_7a5189.gif|on';  //Motivano - Author: Jeremy Curtis - Expires 20070930
cidAss['mxccamid=121420'] = 'd5e6f0|bluebar_couponcode_d5e6f0.gif|on';  //CouponCode - Author: Jeremy Curtis - Expires 20070930
cidAss['mxccamid=121519'] = '37a3d2|bluebar_12882_37a3d2.gif|on';  //CouponPage - Author: Affiliates - Expires 20071231
cidAss['mxccamid=121522'] = 'a2ad68|bluebar_12886_a2ad68.gif|on';  //CouponPage - Author: Affiliates - Expires 20071231
cidAss['mxccamid=121520'] = 'dbb8d9|bluebar_12887_dbb8d9.gif|off';  //CouponPage - Author: Affiliates - Expires 20071231


//End Cid Array

//Affiliate ID Array
var affAss = new Array;
affAss['ostk_affiliate=59JLB7sBj1c'] = 'BC262D|bluebar_dealcatcher.gif|off'; // DealCatcher
affAss['ostk_affiliate=qfpbmMkytU8'] = '00659c|bluebar_6936_00659c.gif|off'; // Fabulous Savings Expires 20071231
affAss['ostk_affiliate=9eASk0x48lo'] = 'BC262D|bluebar_gotapex.gif|off'; // GotApex
affAss['ostk_affiliate=OmdxViUZtwA'] = 'BC262D|20060714_pointsBar.gif|off'; // Old Mypoints
affAss['ostk_affiliate=OwCQWCjrWtQ'] = 'faf0d3|20070815_pointsBar_faf0d3.gif|off'; // New Mypoints
//affAss['ostk_affiliate=yrk0ZAwSMLA'] = 'EE3628|bar_aadvantage_0906.gif|off'; // American Airlines (DBG)
//affAss['ostk_affiliate=vqqyDZD9u88'] = '961b1e|bluebar_10736_961b1e.gif|off'; // United Airlines 3 miles per dollar-Expires 20071231
//affAss['ostk_affiliate=87e12fYTgmo'] = '961b1e|bluebar_10737_961b1e.gif|off'; // Delta Airlines 3 miles per dollar-Expires 20071231
//affAss['ostk_affiliate=v0kVR/GB1*U'] = '961b1e|bluebar_10738_961b1e.gif|off'; // Alaska Airlines-Mileage Plan 3 miles per dollar-Expires 20071231
//affAss['ostk_affiliate=3*qzyiVmhN4'] = '961b1e|bluebar_10739_961b1e.gif|off'; // New York Timespoints-Double your points 4% back-Expires 20071231
//affAss['ostk_affiliate=nBgSG12yh0A'] = '961b1e|bluebar_10740_961b1e.gif|off'; // Lufthansa-Double Miles-3 miles per dollar-Expires 20071231
//affAss['ostk_affiliate=j0Uc//P3SFw'] = 'F0692F|bar_marriott_0906.gif|off'; // Marriott Club Rewards (DBG)
affAss['ostk_affiliate=5iSU/25c7tA'] = '0060a9|continental3_bluebar_0060a9.gif|off'; // Continental Airlines  expiration 12/31/07
affAss['ostk_affiliate=5iSU_25c7tA'] = '0060a9|continental3_bluebar_0060a9.gif|off'; // Continental Airlines  expiration 12/31/07
affAss['ostk_affiliate=YzmyDNBq76c'] = '33A55C|bar_nwa_0906.gif|off'; // Northwest Airlines ? expiration 9/15, after which it is 2 miles per dollar
affAss['ostk_affiliate=Ssba3.JSVFQ'] = '003366|bar_memolink_0906.gif|off'; // Memolink
affAss['ostk_affiliate=NKa3hZyYoHA'] = '6666CC|bar_dealnews_0906.gif|off'; // Dealnews
affAss['ostk_affiliate=3kz6eKzh900'] = '96171a|bluebar_discountdawg_96171a.gif|off'; // Discountdawg
affAss['ostk_affiliate=PvTvb1zzm2o'] = '344B7E|bluebar_woot_344b7e_1106.gif|off'; // Woot
affAss['ostk_affiliate=AysPbYF8vuM'] = '344B7E|bar_ebates_110106.gif|off'; // eBates 
affAss['ostk_affiliate=*YMgf2ynpYI'] = '003366|bluebar_amtrak_111606_003366.gif|off'; // Amtrak
affAss['ostk_affiliate=r4B3kA9h4zM'] = '6699CC|bluebar_dealtaker_6699cc.gif|off'; // DealTaker
affAss['ostk_affiliate=If/M8N/jgrM'] = '31657f|bluebar_dionreal_31657f.gif|off'; // Dion
affAss['ostk_affiliate=If_M8N_jgrM'] = '31657f|bluebar_dionreal_31657f.gif|off'; // Dion
affAss['ostk_affiliate=RvEiSnI7NyY'] = 'bdd8ae|bluebar_bradsdeals.gif|off'; // Jeremy Curtis
//affAss['ostk_affiliate=idIgo2SpI9s'] = 'fdb813|bar_380_fdb813.gif|off'; // DealTaker
affAss['ostk_affiliate=UnlJPFdznf8'] = '7a5189|bluebar_cheapstingy_7a5189.gif|off'; // Cheapster - Mialee



//End Affiliate ID Array

//Check Array for Cid and post
if (affAss[affArray[0]] != null) {
	affBar = true;
}
if (cidAss[cook] != null) {
	cidBar = true;
}
if (topCidAss[cook] != null) {
	topCidBar = true;
}


if (topCidBar == true && affBar == true) {
	var topCid = topCidAss[cook].split('|');
	if (topCid[1] != null) {
		document.getElementById('blueBar1').innerHTML = '<a href="' + topCid[1] + '">' + topCid[0] + '</a>';
	}
	else {
		document.getElementById('blueBar1').innerHTML = topCid[0];
	}
	var butter2 = affAss[affArray[0]].split('|');
	if(butter[2] == 'off') {
		document.getElementById('blueBar1').style.display = 'none';
		document.getElementById('blueBar1').style.visibility = 'hidden';
	}
	if (butter2[3] != null) {
		document.getElementById('blueBar').innerHTML = firstHtml + butter2[0] + middleHtmlLink + butter2[2] + middleHtmlLink2 + butter2[1] + lastHtmlLink;
	}
	else {
	document.getElementById('blueBar').innerHTML = firstHtml + butter2[0] + middleHtml + butter2[1] + lastHtml;
	}
}


else if (affBar == true && cidBar == true) {
	var butter = cidAss[cook].split('|');
	if(butter[2] == 'off') {
		document.getElementById('blueBar1').style.display = 'none';
		document.getElementById('blueBar1').style.visibility = 'hidden';
	}
	if (butter[3] != null) {
		document.getElementById('blueBar').innerHTML = firstHtml + butter[0] + middleHtmlLink + butter[2] + middleHtmlLink2 + butter[1] + lastHtmlLink;
	}
	else {
	document.getElementById('blueBar').innerHTML = firstHtml + butter[0] + middleHtml + butter[1] + lastHtml;
	}
}


else if (affBar == false && cidBar == true) {
	var butter = cidAss[cook].split('|');
	if(butter[2] == 'off') {
		document.getElementById('blueBar1').style.display = 'none';
		document.getElementById('blueBar1').style.visibility = 'hidden';
	}
	if (butter[3] != null) {
		document.getElementById('blueBar').innerHTML = firstHtml + butter[0] + middleHtmlLink + butter[2] + middleHtmlLink2 + butter[1] + lastHtmlLink;
	}
	else {
	document.getElementById('blueBar').innerHTML = firstHtml + butter[0] + middleHtml + butter[1] + lastHtml;
	}
}

else if (affBar == true && cidBar == false) {
	var butter2 = affAss[affArray[0]].split('|');
	if(butter2[2] == 'off') {
		document.getElementById('blueBar1').style.display = 'none';
		document.getElementById('blueBar1').style.visibility = 'hidden';
	}
	if (butter2[3] != null) {
		document.getElementById('blueBar').innerHTML = firstHtml + butter2[0] + middleHtmlLink + butter2[2] + middleHtmlLink2 + butter2[1] + lastHtmlLink;
	}
	else {
	document.getElementById('blueBar').innerHTML = firstHtml + butter2[0] + middleHtml + butter2[1] + lastHtml;
	}
}

else if (topCidBar == true && cidBar == false && affBar == false) {
	var topCid = topCidAss[cook].split('|');
	if (topCid[1] != null) {
		document.getElementById('blueBar1').innerHTML = '<a href="' + topCid[1] + '">' + topCid[0] + '</a>';
	}
	else {
		document.getElementById('blueBar1').innerHTML = topCid[0];
	}
}