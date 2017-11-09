document.iframeLoaders={};
iframe=Class.create();
iframe.prototype={
initialize:function(form,options,count){
var L=0;
try{
L=1;if(!options)options={};
L=2;this.form=form;
L=3;this.uniqueId=count;
L=4;document.iframeLoaders[this.uniqueId]=this;
L=5;this.transport=this.getTransport();
L=6;if($('frame_'+this.uniqueId)){
L=7;this.onComplete=options.onComplete||null;
L=8;this.update=$(options.update)||null;
L=9;this.updateMultiple=options.multiple||false;
L=10;form.target='frame_'+this.uniqueId;
L=11;form.setAttribute("target",'frame_'+this.uniqueId);
L=12;form.submit();}}catch(e){
usl.LogException("Pork.Iframe["+L+"]: Unable to create transport iframe ",e,"");}},
onStateChange:function(){
this.transport=$('frame_'+this.uniqueId);
try{var doc=this.transport.contentDocument.document.body.innerHTML;this.transport.contentDocument.document.close();}
catch(e){
try{var doc=this.transport.contentWindow.document.body.innerHTML;this.transport.contentWindow.document.close();}
catch(e){
try{var doc=this.transport.document.body.innerHTML;this.transport.document.body.close();}
catch(e){
try{var doc=window.frames['frame_'+this.uniqueId].document.body.innerText;}
catch(e){
usl.LogException("Pork.Iframe: Unable to get iframe contents ",e,"");
return;}}}}
this.transport.responseText=doc;
if(this.onComplete)setTimeout(function(){this.onComplete(this.transport);}.bind(this),10);
if(this.update)setTimeout(function(){this.update.innerHTML=this.transport.responseText;}.bind(this),10);
if(this.updateMultiple){setTimeout(function(){
try{var hasscript=false;eval("var inputObject = "+this.transport.responseText);
for(var i in inputObject){if(i=='script'){hasscript=true;}
else{if(elm=$(i)){elm.innerHTML=inputObject[i];}else{}}}if(hasscript)eval(inputObject['script']);}catch(e){}}.bind(this),10);}},
getTransport:function(){
try{
var divElm=document.createElement('DIV');
divElm.style.position="absolute";
divElm.style.top="0";
divElm.style.marginLeft="-10000px";
if(navigator.userAgent.indexOf('MSIE')>0&&navigator.userAgent.indexOf('Opera')==-1){
divElm.innerHTML='<iframe name=\"frame_'+this.uniqueId+'\" id=\"frame_'+this.uniqueId+'\" src=\"about:blank\" onload=\"setTimeout(function(){document.iframeLoaders['+this.uniqueId+'].onStateChange()},20);"></iframe>';}else{
var frame=document.createElement("iframe");
frame.setAttribute("name","frame_"+this.uniqueId);
frame.setAttribute("id","frame_"+this.uniqueId);
frame.addEventListener("load",function(){this.onStateChange();}.bind(this),false);
divElm.appendChild(frame);}
document.getElementsByTagName("body").item(0).appendChild(divElm);}catch(e){
usl.LogException("Pork.Iframe: Unable to create transport ",e,"");}}};

