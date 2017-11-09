var HM_DOM    = (document.getElementById) ? true : false;
var HM_NS4    = (document.layers) ? true : false;
var HM_IE     = (document.all) ? true : false;
var HM_IE4    = HM_IE && !HM_DOM;
var HM_Mac    = (navigator.appVersion.indexOf("Mac") != -1);
var HM_IE4M   = HM_IE4 && HM_Mac;
var HM_NS6    = (navigator.appName == "Netscape" && parseFloat(navigator.appVersion) > 4 && parseFloat(navigator.appVersion) < 7);
var HM_IsMenu = (HM_DOM && !HM_NS6) || (HM_IE4 && !HM_IE4M);

