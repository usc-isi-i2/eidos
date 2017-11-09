{
  var w= document.write;
  var C= document.cookie;
  if (navigator.hasFlash(8)) {
    w('<div style="display:none">');
    w('<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0" width="320" height="240" id="videoPlayer" align="middle" VIEWASTEXT>');
    w('<param name="allowScriptAccess" value="sameDomain" />');
    w('<param name="movie" value="http://images.usatoday.com/asp/uas/flCookie.swf" />');
    w('<param name="quality" value="high" />');
    w('<param name="bgcolor" value="#ffffff" />');
    w('<embed src="http://images.usatoday.com/asp/uas/flCookie.swf" quality="high" bgcolor="#ffffff" width="320" height="240" name="videoPlayer" align="middle" allowScriptAccess="sameDomain" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" />');
    w('</object>');
    w('</div>');
  }

  if (C.match(/zagCookie=[13]/))
    if (C.match(/USATINFO=[^ ;]*UserID/))
      if (!C.match(/USATINFO=[^ ;]*%26ZAG%3D/))
        w('<img src="http://asp.usatoday.com/registration/zagito5/uazag.ashx" width="1px" height="1px" />');
}

