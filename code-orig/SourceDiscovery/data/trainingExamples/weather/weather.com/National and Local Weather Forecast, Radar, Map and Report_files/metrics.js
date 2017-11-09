// anonymization.js and categorization.js combined
// (c) 2007 wbf



var anonymization=pageName;if(anonymization.indexOf("?")>-1){var eol=anonymization.indexOf("?");anonymization=anonymization.substring(0,eol);}
if(anonymization.indexOf("#")>-1){var eol=anonymization.indexOf("#");anonymization=anonymization.substring(0,eol);}
if(anonymization=="/index.html"||anonymization=="/"||anonymization==""){anonymization="/";}else{if(anonymization.indexOf("/interact/photogallery")==0){anonymization='/interact/photogallery';}else if(anonymization.indexOf("/common/drilldown")==0){var urlObjs=anonymization.split("/");for(var i=0;i<urlObjs.length;i++){if(i!="common"||i!="drilldown"){urlObjs.pop();}}
anonymization=urlObjs.join("/");}else if(anonymization.indexOf(".html")>-1){}else{var urlObjs=anonymization.split("/");totalNum=urlObjs.length-1;temp=urlObjs[totalNum];if(temp.match(/[A-Z]/)||temp.match(/[0-9]/)||temp.match(/[@#$%&!*:]/)||temp=='')
{urlObjs.pop();}
anonymization=urlObjs.join("/");}}
CM_page_id=anonymization;var pif=new Array();pif[0]='local';pif[1]='tenday';pif[2]='5day';pif[3]='map';pif[4]='hourbyhour';pif[5]='wxdetail';pif[6]='monthly';pif[7]='weekend';pif[8]='pastweather';pif[9]='currentradar';pif[9]='extended';if(anonymization!="/"){categorization=anonymization+'/';}else{categorization=anonymization;}
if(categorization.indexOf("-")>-1){categorization=categorization.replace("-","_");}
if(categorization.indexOf("?")>-1){var eol=categorization.indexOf("?");categorization=categorization.substring(0,eol);}
if(categorization.indexOf("#")>-1){var eol=categorization.indexOf("#");categorization=categorization.substring(0,eol);}
if(categorization=="/index.html"||categorization=="/"||categorization==""){categorization="HOMEPAGE";}else{var success=false;var tValue;var urlObjs=categorization.split("/");urlObjs.pop();categorization=urlObjs.join("/");processor=categorization.substring(0,5);if(processor=="/maps"){var urlObjs=categorization.split("/");if(categorization.indexOf(".html")>-1){urlObjs.pop();tValue=urlObjs.join("/");}
if(maproom_mapping[categorization]!=null&&maproom_mapping[categorization].indexOf(categorization)==-1){categorization="MAPS-"+maproom_mapping[categorization];success=true;}else{for(var w=0;w<mapvertical_mapping.length;w++){var mapItem=mapvertical_mapping[w].split("|");if(mapItem[0].indexOf(tValue)!=-1&&!success){categorization="MAPS-"+mapItem[1];success=true;}}}
if(!success){var catObjs=new Array();for(var i=0;i<urlObjs.length;i++){if(i<=4){if(i==0){catObjs[i]='MAPS';}else{if(catObjs.length<=3&&urlObjs[i].indexOf('maps')==-1){catObjs[catObjs.length]=urlObjs[i].toUpperCase();}}}}
success=true;categorization=catObjs.join("-");}}
processor=categorization.substring(0,8);if(processor=="/outlook"){var urlObjs=categorization.split("/");if(categorization.indexOf(".html")>-1){urlObjs.pop();}
var catObjs=new Array();var isPIF=false;for(var k=0;k<urlObjs.length;k++){for(var j=0;j<pif.length;j++){if(urlObjs[k]==pif[j]){isPIF=true;}}}
for(var i=0;i<urlObjs.length;i++){if(i<=4){if(i==0){if(isPIF){catObjs[i]='PIF';}else{catObjs[i]='DEEP';}}else{if(catObjs.length<=3&&urlObjs[i].indexOf('outlook')==-1){catObjs[catObjs.length]=urlObjs[i].toUpperCase();}}}}
success=true;categorization=catObjs.join("-");}
if(processor=="/weather"){var urlObjs=categorization.split("/");if(categorization.indexOf(".html")>-1){urlObjs.pop();}
var catObjs=new Array();var isMyPage=false;var isPIF=false;if(urlObjs[2]=='my'){isMyPage=true;}
for(var k=0;k<urlObjs.length;k++){for(var j=0;j<pif.length;j++){if(urlObjs[k]==pif[j]){isPIF=true;}}}
for(var i=0;i<urlObjs.length;i++){if(i<=4){if(i==0){if(isMyPage){catObjs[i]='HOMEPAGE';}else if(isPIF){catObjs[i]='PIF';catObjs[i+1]='UNDECLARED';catObjs[i+2]='WEATHER';}else{catObjs[i]='OTHER';}}else{if(catObjs.length<=3&&urlObjs[i].indexOf('weather')==-1){catObjs[catObjs.length]=urlObjs[i].toUpperCase();}}}}
success=true;categorization=catObjs.join("-");}
processor=categorization.substring(0,10);if(processor=="/community"){var urlObjs=categorization.split("/");if(categorization.indexOf(".html")>-1){urlObjs.pop();}
var catObjs=new Array();for(var i=0;i<urlObjs.length;i++){if(i<=4){if(i==0){catObjs[i]='COMMUNITY';}else{if(catObjs.length<=3&&urlObjs[i].indexOf('community')==-1){catObjs[catObjs.length]=urlObjs[i].toUpperCase();}}}}
success=true;categorization=catObjs.join("-");}
processor=categorization.substring(0,11);if(processor=="/activities"){var urlObjs=categorization.split("/");if(categorization.indexOf(".html")>-1){urlObjs.pop();}
var catObjs=new Array();for(var i=0;i<urlObjs.length;i++){if(i<=4){if(i==0){catObjs[i]='DEEP';}else{if(catObjs.length<=3&&urlObjs[i].indexOf('activities')==-1){catObjs[catObjs.length]=urlObjs[i].toUpperCase();}}}}
success=true;categorization=catObjs.join("-");}
processor=categorization.substring(0,11);if(processor=="/newscenter"){var urlObjs=categorization.split("/");if(categorization.indexOf(".html")>-1){urlObjs.pop();}
var catObjs=new Array();for(var i=0;i<urlObjs.length;i++){if(i<=4){if(i==0){catObjs[i]='NEWS';}else{if(urlObjs[i].indexOf('newscenter')==-1){catObjs[catObjs.length]=urlObjs[i].toUpperCase();}}}}
success=true;categorization=catObjs.join("-");}
if(!success){var urlObjs=categorization.split("/");if(categorization.indexOf(".html")>-1){urlObjs.pop();}
var catObjs=new Array();for(var i=0;i<urlObjs.length;i++){if(i<=3){if(i==0){catObjs[i]='OTHER';}else{catObjs[catObjs.length]=urlObjs[i].toUpperCase();}}}
categorization=catObjs.join("-");}}
CM_cat_id=categorization;