
RequestBatch=Class.create();
var counter=0;
var pendingRequests=0;
function DirectAccessErrorHandler(msg,ex){}
RequestBatch.prototype={
initialize:function(){
this.UniqueId=counter++;
this.Requests=new Array()},
AddToRequest:function(requestThis){
this.Requests[this.Requests.length]=requestThis;},
BeginRequest:function(serverUrl,callback){
pendingRequests++;
var jsonString=JSON.stringify(this);
var form=generateForm(this.UniqueId,serverUrl,jsonString);
new iframe(form,{onComplete:function(request){processResponse(callback,request);}},this.UniqueId);
this.UniqueId=counter++;}};
function generateForm(formId,serverUrl,inputVal){
try{
var form=document.createElement("form");
form.name="f"+formId;
form.id="f"+formId;
form.action=serverUrl;
var inputElem=document.createElement("input");
inputElem.name="jsonRequest";
inputElem.type="hidden";
inputElem.value=inputVal;
form.appendChild(inputElem);
form.method="post";
if(navigator.userAgent.toLowerCase().indexOf('firefox')!=-1){
var fullRequestURL=serverUrl+"?jsonRequest="+escape(inputVal);
if(fullRequestURL.length<15000){form.method="get";}}
document.body.appendChild(form);}catch(e){
usl.LogException("RequestBatch: Unable to create transport input form ",e,"");}
return form;}
function processResponse(callback,request){
pendingRequests--;
try{
var jsonResponse=unescape(request.responseText);
var responseObject=JSON.parse(jsonResponse);
try{
callback(responseObject.ResponseBatch);}catch(e){
DirectAccessErrorHandler("exception during client callback",e);
usl.LogException("SL ex - exception during client callback",e,"");}}catch(e){
DirectAccessErrorHandler("exception during processResponse",e);
try{
var jsonr=(jsonResponse!="")?unescape(jsonResponse):"";
jsonr=(jsonr!="")?jsonr.substring(0,500):"";
usl.LogException("SL ex - exception during processResponse",e,"jsonResponse(0,500): "+jsonr);}catch(e){}}}
function getPendingRequestCount(){
return pendingRequests;}
