usingNamespace("Biz.Polls")["checkOption"]=function(o,v){Web.UI.Form.setValue("braFormYouTellUs","viewPoll",v);if((v=="0" && o && !String.isNullOrEmpty(o.value)) || v=="1"){Web.UI.Form.submit("braFormYouTellUs");};};usingNamespace("Biz.Common")["NewsletterSingup"]={sflag:false,verify:function(f){var msg,errorMsg;var emptyField="";f = eval("document." + f);if(String.isNullOrEmpty(f.LoginName.value)){errorMsg = "- Your email field is empty";emptyField += "\n" + errorMsg;}else if(!Biz.Common.Validation.isEmail(f.LoginName.value)){errorMsg = "- Your email address is invalid";emptyField += "\n" + errorMsg;};if(!emptyField){return true;};msg  = "______________________________________________________\n\n";msg += "Your request cannot continue because of the following error(s).\n";msg += "Please correct these error(s) and re-submit:\n";msg += "______________________________________________________\n";if(emptyField){msg += emptyField + "\n";};alert(msg);return false;},hiddenframe:function(oid){var o=$(oid);if(o){Web.UI.Control.setAttribute(o,{"style.display":"none"});};},showframe:function(oid,f,fn){var o=$(oid);if(o){if(Biz.Common.NewsletterSingup.sflag){Web.UI.Control.setAttribute(o,{"style.display":""});Web.UI.Form.setValue(f,fn,"Enter your e-mail");};};},nSubmit:function(f,fn){Biz.Common.NewsletterSingup.sflag=true;var flag=Biz.Common.NewsletterSingup.verify(f);return flag;},submit:function(f){if (Biz.Common.NewsletterSingup.verify(f)){Web.UI.Form.submit(f);};}};usingNamespace("Biz.Common")["TopNavigation"]={login:function(){var rtv = [];var wces=Web.Config.Environment.SSLPage;var loginName = Web.StateManager.Cookies.get(Web.StateManager.Cookies.Name.LOGIN,"CONTACTWITH");if (!String.isNullOrEmpty(loginName)){rtv.push("<span class=\"loginName\">" + loginName.encodeHtml() + "</span>");rtv.push("<span>&nbsp;[<a href=\"" + wces.Loginout + "\">log out</a>]</span>");}else{rtv.push("<span class=\"loginName\">[<a href=\"" + wces.Login + "\">login</a>]</span>");};document.write(rtv.join(""));},cart:function(){var rtv = [];var wces=Web.Config.Environment.SSLPage;var crtUrl=wces.Shoppingcart+"?Submit=view";var cartInfo = Web.StateManager.Cookies.get(Web.StateManager.Cookies.Name.CART);if (!String.isNullOrEmpty(cartInfo)){rtv.push("<span class=\"item toRight\"><div class=\"toLeft\"><a href=\"" + crtUrl + "\">"+ cartInfo.replace("0 Item ","0 Items ").replace(" | ","</a></div><div class=\"toLeft\">&nbsp;(") +")</div></span>");}else{rtv.push("<span class=\"item toRight\"><div class=\"toLeft\"><a href=\"" + crtUrl + "\">0 Items</a></div><div class=\"toLeft\">&nbsp;($ 0.00)</div></span>");};if (!String.isNullOrEmpty(cartInfo) && cartInfo.indexOf("(s)") != -1){rtv.push("<span class=\"toRight\"><a href=\"" + crtUrl + "\" class=\"noline\"><img src=\"" + Web.UI.ResourceManager.Image.build("topCartFull.gif") + "\" alt=\"Shopping Cart with Items\" title=\"Shopping Cart with Items\" border=\"0\" id=\"shoppingCart\" /></a></span>");}else{rtv.push("<span class=\"toRight\"><a href=\"" + crtUrl + "\" class=\"noline\"><img src=\"" + Web.UI.ResourceManager.Image.build("n1_topCartEmptyD.gif") + "\" alt=\"Empty Shopping Cart\" title=\"Empty Shopping Cart\" border=\"0\" id=\"shoppingCart\" /></a></span>");};document.write(rtv.join(''));}};usingNamespace("Biz.Common")["Pagination"]={go:function(n,p){p=Number.parse(p);if(p>0){Web.UI.Form.setValue(n,"Page",p);Web.UI.Form.submit(n);};}};usingNamespace("Biz.Common")["Validation"]={isEmail:function(s){var patrn=/^([0-9a-zA-Z]([-.\w\+]*[0-9a-zA-Z_-])*@([0-9a-zA-Z][-.\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;return patrn.test(s);}};usingNamespace("Biz.Common")["VeriSign"]={open:function(){var url="https://seal.verisign.com/splash?form_file=fdf/splash.fdf&dn=SECURE.NEWEGG.COM&lang=en";Web.UI.Control.openWindow(url,"_blank",560,500,200,200,"resizable=yes,status=yes");}};usingNamespace("Biz.Common")["saveDepaCookie"]=function(depaID){var n = Web.StateManager.Cookies.Name.CFG;if(String.isNullOrEmpty(n) || String.isNullOrEmpty(depaID)){return;};Web.StateManager.Cookies.save(n, {"DEPA":depaID});};usingNamespace("Biz.Common")["QuickSearch"]={submit:function(){var item=$("haQuickSearchBox");if(item == null){return false;}else{var description=item.value;if(String.isNullOrEmpty(description)){item.focus();return false;}else{Web.UI.Form.submit("haFormQuickSearch");return true;};};}};