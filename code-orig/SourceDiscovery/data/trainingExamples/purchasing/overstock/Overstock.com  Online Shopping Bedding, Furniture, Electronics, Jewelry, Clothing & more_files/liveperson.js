if (typeof(tagVars) == "undefined")
   tagVars="";
if (typeof(osPrice) != "undefined")
  tagVars += '&PAGEVAR!lpPrice=' + osPrice;
if (typeof(osError) != "undefined")
  tagVars += '&PAGEVAR!lpError=' + osError;
if (typeof(GoldMember) != "undefined")
  tagVars += '&SESSIONVAR!lpGoldMember=' + GoldMember;
if (typeof(s.products) != "undefined")
  tagVars += '&PAGEVAR!lpProducts=' + s.products;
if (typeof(s.pageName) != "undefined")
  tagVars += '&PAGEVAR!lpPagename=' + s.pageName;
if (typeof(osSpecial) != "undefined")
  tagVars += '&PAGEVAR!unit=' + osSpecial;
var lpPosY = 100;
var lpPosX = 100;
