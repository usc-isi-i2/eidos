function OAS_RICH(position) {
if (position == 'Launchpad') {
document.write ('<!-- OasDefault/16537-Launchpad-comment Launchpad -->');
}
if (position == 'Spon1') {
document.write ('<!-- OasDefault/16537-Spon1-comment Spon1 -->');
}
if (position == 'PageCount') {
document.write ('<script type="text/javascript">\n');
document.write ('\n');
document.write ('function loadIntrstl(){\n');
document.write ('//alert(intStr);\n');
document.write ('	//setCookie\n');
document.write ('	if (location.hostname.match(/usatoday\\');
document.write ('.com$/)) {\n');
document.write ('		if(usat.cookie.get("interstitial")==null){\n');
document.write ('			//getPosition();\n');
document.write ('			modifyLinks();\n');
document.write ('		} //if\n');
document.write ('	}\n');
document.write ('}\n');
document.write ('\n');
document.write ('function modifyLinks(){\n');
document.write ('	for(x=0;x<document.links.length;x++){\n');
document.write ('		if ((document.links[x].target.indexOf("popup")==-1)&&(document.links[x].href.indexOf("javascrip")==-1)&&(document.links[x].href.indexOf("ad.usatoday")==-1)&&(document.links[x].href.indexOf("#")==-1)&&(document.links[x].href.indexOf("community-features")==-1)&&(document.links[x].href.indexOf("/gallery/")==-1)&&(document.links[x].href.indexOf("/flash.htm")==-1)) {\n');
document.write ('			document.links[x].onclick= buildIntrstlLink(document.links[x].href); \n');
document.write ('		}//if\n');
document.write ('	} //for\n');
document.write ('}\n');
document.write ('\n');
document.write ('function buildIntrstlLink(urlStr){\n');
document.write ('	return function() {\n');
document.write ('		var expireTime = new Date();\n');
document.write ('		expireTime.setHours(23, 59, 59, 999);\n');
document.write ('		//sets expireTime to 11:59:59 and 999 miliseconds, or 1 milisecond before midnight\n');
document.write ('		usat.cookie.set("interstitial","true",new Date(expireTime),"/",".usatoday.com");\n');
document.write ('		window.location=intStr+"?"+urlStr;\n');
document.write ('		return(false); \n');
document.write ('	}\n');
document.write ('}\n');
document.write ('zagEnabled=0;\n');
document.write ('var intStr = "http://www.usatoday.com/_ads/interstitial/2007/page/interstitial.htm";\n');
document.write ('\n');
document.write ('loadIntrstl();\n');
document.write ('</script>');
}
if (position == 'AdOps1') {
document.write ('<script src="http://content.dl-rms.com/rms/1425/nodetag.js"></script>');
}
if (position == 'VerticalBanner') {
document.write ('<!-- OasDefault/22947_Walgreens_FY_07_31932351 VerticalBanner -->');
}
if (position == 'Poster3') {
document.write ('<!--begin: poster---><div class="adAgate">Advertisement<div id="adPoster" style="margin-bottom: 6px;"><SCRIPT language=');
document.write ("'");
document.write ('JavaScript1.1');
document.write ("'");
document.write (' SRC="http://ad.doubleclick.net/adj/N763.USAToday/B2099815.20;sz=300x250;ord=1660?">\n');
document.write ('</SCRIPT>\n');
document.write ('<NOSCRIPT>\n');
document.write ('<A HREF="http://ad.usatoday.com/RealMedia/ads/click_lx.cgi/www.usatoday.com/weather/default.htm/1660/Poster3/OasDefault/22947_Walgreens_FY_07_31932351/amjx_22947-Walgreens-Weather-300x250.htm/38303039643866333436636466663530?http://ad.doubleclick.net/jump/N763.USAToday/B2099815.20;sz=300x250;ord=1660?">\n');
document.write ('<IMG SRC="http://ad.doubleclick.net/ad/N763.USAToday/B2099815.20;sz=300x250;ord=1660?" BORDER=0 WIDTH=300 HEIGHT=250 ALT="Click Here"></A>\n');
document.write ('</NOSCRIPT>\n');
document.write ('</div></div><!-- OasDefault/22947_Walgreens_FY_07_31932351 Poster3 --><!--end: poster--->');
}
if (position == 'SLFront') {
document.write ('<link rel="stylesheet" href="http://www.usatoday.com/_common/_scripts/sponsoredlinks/sl-whatsthis.css" type="text/css"/><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td valign="top" align="left" style="font-size:14px;color:#4c4c4c;font-family:arial;font-weight:bold;border:0px solid #FFFFFF">Related Advertising Links</td><td valign="top" style="border:0px solid #FFFFFF" align="right"><a href="javascript:void(window.open(');
document.write ("'");
document.write ('http://www.usatoday.com/marketing/popup/marketing_ad.htm');
document.write ("'");
document.write (',');
document.write ("'");
document.write ('ref1');
document.write ("'");
document.write (',');
document.write ("'");
document.write ('width=300,height=300');
document.write ("'");
document.write ('))" class="whatsthis">What');
document.write ("'");
document.write ('s This?</a></td></tr></table>\n');
document.write ('\n');
document.write ('<script type="text/javascript">document.writeln(');
document.write ("'");
document.write ('<iframe name="adsonar" id="adsonar" width="100%" height="205" src="http://ads.adsonar.com/adserving/getAds.jsp?&placementId=1269148&pid=3426&ps=4242222&zw=388&zh=205&url=');
document.write ("'");
document.write (' + ( (window.top.location == document.location) ? escape(document.location) : escape(document.referrer) ) + ');
document.write ("'");
document.write ('&v=5&stretchAds=1" hspace="0" vspace="0" marginheight="0" marginwidth="0" frameborder="0" scrolling="no"></iframe>');
document.write ("'");
document.write (');</script><!-- OasDefault/ppc-weather-sectionfront SLFront -->\n');
document.write ('<SCRIPT LANGUAGE="JavaScript">var tcdacmd="dt";</SCRIPT>\n');
document.write ('<SCRIPT SRC="http://an.tacoda.net/an/14096/slf.js" LANGUAGE="JavaScript"></SCRIPT>');
}
if (position == 'Bottom468x60') {
document.write ('<style>\n');
document.write ('<!--\n');
document.write ('#lbAgate {float:left;position:relative;left:95px;}\n');
document.write ('-->\n');
document.write ('</style>\n');
document.write ('<img src="http://images.usatoday.com/_common/_images/vertical-blk-agate.gif" width="16" height="90" hspace="0" id="lbAgate"><SCRIPT LANGUAGE="JavaScript">var tcdacmd="sa=a;sz=2;ad";</SCRIPT><SCRIPT SRC="http://an.tacoda.net/an/14096/slf.js" LANGUAGE="JavaScript"></SCRIPT><!-- OasDefault/23111_Tacoda_Jan._200_32464185 Bottom468x60 -->');
}
if (position == 'Poster5') {
document.write ('<!--begin: poster---><div class="adAgate">Advertisement<div id="adPoster" style="margin-bottom: 6px;"><!-- Iframe/JavaScript -->\n');
document.write ('<iframe src="http://altfarm.mediaplex.com/ad/fm/8664-49554-1394-3?mpt=1195&mpvc=" width=300 height=250 marginwidth=0 marginheight=0 hspace=0 vspace=0 frameborder=0 scrolling=no bordercolor="#000000">\n');
document.write ('  <script language="JavaScript1.1" src="http://altfarm.mediaplex.com/ad/!js/8664-49554-1394-3?mpt=1195&mpvc=">\n');
document.write ('  </script>\n');
document.write ('  <noscript>\n');
document.write ('    <a href="http://altfarm.mediaplex.com/ad/ck/8664-49554-1394-3?mpt=1195">\n');
document.write ('      <img src="http://altfarm.mediaplex.com/ad/!bn/8664-49554-1394-3?mpt=1195"\n');
document.write ('        alt="Click Here" border="0">\n');
document.write ('    </a>\n');
document.write ('  </noscript>\n');
document.write ('</iframe></div></div><!-- OasDefault/23322_3M_Privacy_Filt_32263332 Poster5 --><!--end: poster--->');
}
}
