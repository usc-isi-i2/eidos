usingNamespace("Biz.Search")["AutoFilledKeywords"]={json:null,xml:null,index:0,key:"",url:Web.UI.ResourceManager.Url.build("Common/Ajax/AutoFilledKeywords.aspx"),clear:function() {var afk=Biz.Search.AutoFilledKeywords;afk.abort();var o=$("autofilledview");if (o){Web.UI.Control.replaceInnerHTML(o,"");afk.hide();};afk.index=0;},abort:function(){var afk=Biz.Search.AutoFilledKeywords;if(afk.xml){afk.xml.abort();};},fill:function(el) {if(Web.Utility.isRequestSucceeded(el)){var json=Object.fromJSON(el.responseText);var afk=Biz.Search.AutoFilledKeywords;if(json){var o=$("autofilledview");var html=[];for(var i=0;i<json.newegg.length;i++){html.add('<div id="line'+(i+1)+'" class="line">');html.add('<span class="keywords">'+json.newegg[i].keyword+'</span>');html.add('<span class="count">('+json.newegg[i].count+')</span>');html.add('</div>');};Web.UI.Control.replaceInnerHTML(o,html.join(""));afk.key=$("haQuickSearchBox")["value"];if (o&&html.length>0){afk.show();}else{afk.hide();};};};},query:function(){var afk=Biz.Search.AutoFilledKeywords;var o=window.event.srcElement;var keyCode=window.event.keyCode;switch(keyCode) {case 13:break;case 27:afk.clear();break;case 37:break;case 38:if ($("autofilledview").innerHTML.length>0){afk.show();var lastId=afk.index;if (lastId<=1){afk.index=$("autofilledview").childNodes.length;} else {--afk.index;};$("haQuickSearchBox")["value"]=$("line"+afk.index).childNodes[0].innerHTML.decodeHtml();afk.highlight(afk.index, lastId);}break;case 39:break;case 40:if ($("autofilledview").innerHTML.length>0){afk.show();var lastId=afk.index;if (lastId>=$("autofilledview").childNodes.length){afk.index=1;}else{++afk.index;};$("haQuickSearchBox")["value"]=$("line"+afk.index).childNodes[0].innerHTML.decodeHtml();afk.highlight(afk.index, lastId);};break;default:if (o) {var key=o["value"];if (key==""){afk.clear();afk.key="";return;};if (key==afk.key){return;};var igonreKeys=[9,16,17,19,20,33,34,35,36,37,38,39,40,45,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,144,145];if (!igonreKeys.contains(keyCode)){var wnr=Web.Enum.Network.Request;afk.abort();afk.xml=Web.Network.createRequest(wnr.Type.XML,afk.url+"?q="+key.encodeURI()+"&rdm="+ (new Date()).toString().encodeURI(),"",afk.fill,wnr.Method.Get);afk.xml.execute();};};};},show:function(){var wuc=Web.UI.Control;wuc.setAttribute($("autofilledview"),{"style.display":"block"});if (Web.Environment.Browser.isIE()) {var ov=$("autofilledview");if(ov){wuc.setAttribute($("autofilledframe"),{"style.top":ov.offsetTop});wuc.setAttribute($("autofilledframe"),{"style.left":ov.offsetLeft});wuc.setAttribute($("autofilledframe"),{"style.width":ov.offsetWidth});wuc.setAttribute($("autofilledframe"),{"style.height":ov.offsetHeight});};};},hide:function(o){var wuc=Web.UI.Control;wuc.setAttribute($("autofilledview"),{"style.display":"none"});wuc.setAttribute($("autofilledframe"),{"style.display":"none"});},search:function(){Web.UI.Form.submit("haFormQuickSearch");},highlight:function(id,lastId){var wuc=Web.UI.Control;if (id) {var o=$("line"+id);if (o){wuc.setAttribute(o,{"style.color":"#fff"});wuc.setAttribute(o,{"style.backgroundColor":"highlight"});};};if (lastId) {var lasto=$("line"+lastId);if (lasto){wuc.setAttribute(lasto,{"style.color":"#777"});wuc.setAttribute(lasto,{"style.backgroundColor":"#fff"});};};},autoCompleteKeywords:function() {var afk=Biz.Search.AutoFilledKeywords;var o=window.event.srcElement;if (o){if (o.nodeName=="SPAN"){o=o.parentNode;};if (o.className=="line"){var lastId=afk.index;afk.index=o["id"].replace(/[a-z]/ig,"");if (lastId==0||lastId!=afk.index) {afk.highlight(afk.index,lastId);};};};}};window.attachEvent("onload",(function(){var afk=Biz.Search.AutoFilledKeywords;if(document.haFormQuickSearch){document.haFormQuickSearch.attachEvent("onsubmit",(function(e){if($("line"+afk.index)){$("haQuickSearchBox")["value"]=$("line"+afk.index).childNodes[0].innerHTML.decodeHtml();};}));};if($("haSubmitQuickSearch")){$("haSubmitQuickSearch").attachEvent("onclick",(function(){afk.index=0;}));};if($("autofilledview")){$("autofilledview").attachEvent("onmouseover",afk.autoCompleteKeywords);$("autofilledview").attachEvent("onclick",(function(){$("haQuickSearchBox")["value"]=$("line"+afk.index).childNodes[0].innerHTML.decodeHtml();afk.search();}));};if($("haQuickSearchBox")){$("haQuickSearchBox").attachEvent("onkeyup",afk.query);};window.document.body.attachEvent("onclick",(function(){var o=window.event.srcElement;if (o["id"]!="autofilledview"&&o["id"]!="haQuickSearchBox") {afk.hide();};}));}));