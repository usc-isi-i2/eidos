function printLegal(){
	// copyright - legal restrictions and terms of use - privacy statement
	document.writeln('<table width="100%" cellspacing=0 cellpadding=0 border=0>');
	document.writeln('<tr><td colspan="2"><IMG SRC="http://image.weather.com/web/blank.gif" WIDTH=1 HEIGHT=10 BORDER=0 ALT=""></td></tr>');
	document.writeln('<tr><td  align="left" valign="top" class="inDentA"><FONT CLASS="blkVerdanaText10"><BR>');
	document.writeln('Copyright &copy; 1995-'+dateNow.getFullYear()+', The Weather Channel Interactive, Inc. Your use of this site constitutes your acceptance of the <A href="/common/home/legal.html?from=footer" class="10pxLink">LEGAL RESTRICTIONS AND TERMS OF USE</A><BR><BR>');
	document.writeln('weather.com &reg; <A href="/common/home/privacy.html?from=footer" class="10pxLink">Privacy Statement</A> - Licensed by TRUSTe | <A href="http://controlyourtv.org/?from=twc_footer" class="10pxLink" target="_blank">Parental TV Controls</a><BR><BR></TD>');
if (GetCookie("partner") == "beta2"){
	document.writeln('<TD ALIGN="RIGHT" VALIGN="TOP"><BR><BR><A HREF="/common/help/betaoptout.html" onClick="return mapWindowOpen(\'/common/help/betaoptout.html\',\'Beta\',\'width=466,height=450,resizable,scrollbars,nostatus\')">BETA</a></TD>');
} else {
	document.writeln('<TD ALIGN="RIGHT" VALIGN="TOP">');
}
	document.writeln('</tr></table>');
}
document.write("<div id='f_eop'></div>")
var gotFV = GetCookie("fv");
if(gotFV.length > 1){
//do nothing
}else{
SetCookie ("fv", "no","", "/", ".weather.com");
}