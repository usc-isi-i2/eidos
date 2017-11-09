//configuration
OAS_url = 'http://ad.usatoday.com/RealMedia/ads/';
usatHostname = window.location.hostname;
if ((usatHostname == 'usatoday.com') || (usatHostname == 'asp.usatoday.com')){
usatHostname = 'www.usatoday.com';
}
OAS_sitepage = usatHostname  + window.location.pathname;
OAS_query = '';
OAS_target = '_top';
//end of configuration
OAS_version = 10;
OAS_rn = '001234567890'; OAS_rns = '1234567890';
OAS_rn = new String (Math.random()); OAS_rns = OAS_rn.substring (2, 11);
function OAS_NORMAL(pos) {
  document.write('<A HREF="' + OAS_url + 'click_nx.cgi/' + OAS_sitepage + '/1' + OAS_rns + '@' + OAS_listpos + '!' + pos + '?' + OAS_query + '" TARGET=' + OAS_target + '>');
  document.write('<IMG SRC="' + OAS_url + 'adstream_nx.cgi/' + OAS_sitepage + '/1' + OAS_rns + '@' + OAS_listpos + '!' + pos + '?' + OAS_query + '" BORDER=0></A>');
}
OAS_version = 11;
if ( (navigator.userAgent.indexOf('Mozilla/3') != -1 ) || (navigator.userAgent.indexOf('Mozilla/4.0 WebTV') != -1) ) {
  OAS_version = 10;
}
if (OAS_version >= 11){
  oas_script = '<SCR' + 'IPT LANGUAGE=JavaScript1.1 SRC="' + OAS_url + 'adstream_mjx.cgi/' + OAS_sitepage + '/1' + OAS_rns + '@' + OAS_listpos + '?' + OAS_query + '"><\/SCRIPT>'
  document.write(oas_script);
}
  document.write('');
function OAS_AD(pos) {
  if (OAS_version >= 11)
    OAS_RICH(pos);
  else
    OAS_NORMAL(pos);
}