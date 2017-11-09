DM_addToLoc("zipcode", escape(s_ut.prop30));
DM_addToLoc("age", escape(s_ut.prop31));
DM_addToLoc("gender", escape(s_ut.prop32));
DM_addToLoc("country", escape(s_ut.prop35));
DM_addToLoc("job", escape(s_ut.prop33));
DM_addToLoc("industry", escape(s_ut.prop34));
DM_addToLoc("company size", escape(s_ut.prop39));
DM_addToLoc("csp code", escape(s_ut.getQueryParam('csp')));
DM_addToLoc("hhi", escape(RDBIncRange));
DM_tag();

setTimeout(
	function(){document.cookie=('rsi_seg='+(rsinetsegs.join('|')).replace(/J06575_/g,'')+';expires='+new Date(rsi_now.getTime()+259200000).toUTCString()+';path=/;domain=.usatoday.com')},1);
