
usl.requestsPerBatch=12;
usl.discoveryAge=2;
usl.discTrimLen=70;
usl.ArticleControls=function(){
var L=0;
try{
var artCtls=document.getElementsByClassName("uslArticleControl");
L=1;if(artCtls&&artCtls.length>0){
L=2;var controls=new Array();
L=3;var i=0;
var reqBatch;
var ctlCount=0;
for(i=0;i<artCtls.length;i++){
L=4;var ctlIda=artCtls[i].id.split("|");
var cid;
var type="";
if(ctlIda[0]=='uslCtl'&&ctlIda.length==3){
L=5;cid=ctlIda[2];
L=6;type=ctlIda[1];}else if(ctlIda[0]=='uslCtl'&&ctlIda.length==6){
L=6;cid=ctlIda[2]+ctlIda[3]+ctlIda[4];
L=7;type=ctlIda[1];}else{
L=8;this.showDebug("Malformed uslArticleControl Id (1)");}
L=9;if(cid.split(".")[0]==""){
try{
L=10;if(artCtls[i]){artCtls[i].innerHTML="";}}catch(e){}
continue;}
if(!controls[cid]){
L=11;controls[cid]=cid;
L=12;ctlCount+=1;
if(!reqBatch){
L=13;reqBatch=new RequestBatch();}
if(type=="comments"||type=="reviews"||type=="recommend"){
this.showDebug("adding article control to batch: "+type+" cid:"+cid);
L=14;reqBatch.AddToRequest(new ArticleKey(cid));}else if(type=="discovery"){
var activity=ctlIda[2];
var section=ctlIda[3];
var categories=ctlIda[4];
L=15;var contribs=new Array(new UserTier("All"));
L=16;var maxIndex=this._findDiscoveryMaxIndex(activity,section,categories);
this.showDebug("adding discovery control to batch: "+type+" cid:"+cid);
L=17;reqBatch.AddToRequest(new DiscoverArticlesAction(new Array(new Section(section)),this.getArticleCats(categories),contribs,new Activity(activity),this.discoveryAge,maxIndex));}else{
this.showDebug("Malformed uslArticleControl Id (2) - type: "+type+" cid: "+cid);}
if(ctlCount!=1&&(ctlCount%this.requestsPerBatch)==0){
L=18;this.sitelifeRequest(reqBatch,"LoadArticleCtls",this._ArticleControlsCallback);
reqBatch=null;}}}
if(ctlCount>0&&(ctlCount%this.requestsPerBatch)!=0){
L=19;this.sitelifeRequest(reqBatch,"LoadArticleCtls",this._ArticleControlsCallback);}}}catch(e){
this.showException("ArticleControls",e);
this.LogException("ArticleControls("+L+")",e,"");}};
usl._findDiscoveryMaxIndex=function(activity,section,categories){
var j=1;
for(j=1;j<=10;j++){
var discElem=$('uslCtl|discovery|'+activity+'|'+section+'|'+categories+'|'+j);
if(!discElem){
return j-1;}}
return 10;};
usl._ArticleControlsCallback=function(result){
var j=0;
var k=0;
for(j=0;j<result.Responses.length;j++){
if(result.Responses[j].Article){
var article=result.Responses[j].Article;
usl._processArticleControl(article.ArticleKey.Key,article);}else if(result.Responses[j].DiscoverArticlesAction){
var disovAction=result.Responses[j].DiscoverArticlesAction;
var discArts=result.Responses[j].DiscoverArticlesAction.DiscoveredArticles;
var k=0;
for(k=0;k<discArts.length;k++){
var discov=discArts[k];
if(discov){
usl._processDiscoveryControl(discov,k+1,disovAction.SearchSections,disovAction.SearchCategories,disovAction.Activity.Name);}}}}
for(j=0;j<result.Messages.length;j++){
var msg="";
article={};
if((msg=result.Messages[j].Message)&&msg.substr(0,14)=="Unable to find"){
var key=""
try{
key=msg.split("= [")[1].split("];")[0];
usl._processArticleControl(key,article);}catch(e){
usl.showException("Unable to extract ArticleKey from batch",e);
continue;}}}
if(usatAuth&&usatAuth.em){
usatAuth.em.loginHandlers["uslArtCtl"]=function(){usl.ArticleControls();if(usl._avatarOverride==true&&(ur=$("USATRegister")))ur.style.display='none';};}
if(usl.Debug&&result.Responses){usl.lastArtCtlRes=result.Responses;}};
usl._processArticleControl=function(key,article){
this.showDebug("processing article control - key: "+key);
var revCtl;
if(revCtl=$('uslCtl|reviews|'+key)){
var revCnt=(article.Reviews)?article.Reviews.NumberOfReviews:0;
var revLink="";
if(typeof(uslReviewLinks)!='undefined'){
revLink=(link=uslReviewLinks[key])?link:usl.getArticleLink(key);
revLink+="#uslPageReturn";}else{
revLink=usl.getArticleLink(key)+"#uslPageReturn";}
revCtl.innerHTML=usl.getReviewCountControl(revCnt,revLink);}
var comCtl;
if(comCtl=$('uslCtl|comments|'+key)){
var comLink="";
var comCnt=(article.Comments)?article.Comments.NumberOfComments:0;
if(typeof(uslComCountOffset)!='undefined'){
comCnt=parseInt(comCnt)+parseInt((offset=uslComCountOffset[key])?offset:0);}
if(typeof(uslCommentLinks)!='undefined'){
comLink=(link=uslCommentLinks[key])?link:usl.getArticleLink(key);
comLink+="#uslPageReturn";}else{
comLink=usl.getArticleLink(key)+"#uslPageReturn";}
comCtl.innerHTML=usl.getCommentCountControl(comCnt,comLink);}
var recCtl;
if(recCtl=$('uslCtl|recommend|'+key)){
var recCount=0;
var recd=false;
if(article.Recommendations){
recCount=article.Recommendations.NumberOfRecommendations;
recd=(article.Recommendations.CurrentUserHasRecommended=="True")?true:false;}
recCtl.innerHTML=usl.getRecommendCountControl('article',key,recCount,recd);}};
usl._processDiscoveryControl=function(article,index,sections,categories,activity){
var strSections=this._getNameValues(sections);
var strCats=this._getNameValues(categories);
this.showDebug("processing article:"+article+" index:"+index+" sections:"+strSections+" cats:"+categories+" activity:"+activity);
var ctlNode=$('uslCtl|discovery|'+activity+'|'+strSections+'|'+strCats+'|'+index);
if(ctlNode){
var key=article.ArticleKey.Key;
var title=(article.PageTitle)?article.PageTitle:activity+' '+strSections+' '+strCats;
if(title.length>usl.discTrimLen){
try{
var trimTitle=title.substring(0,usl.discTrimLen);
title=trimTitle.substring(0,trimTitle.lastIndexOf(' '))+'...';}catch(e){}}
var link=article.PageUrl;
ctlNode.innerHTML=this.getDiscoveryLinkControl(index,title,link,activity);}};
usl._getNameValues=function(arr,delim){
var valArray=new Array();
var i=0;
for(i=0;i<arr.length;i++){
valArray[i]=arr[i].Name;}
return valArray.join(delim);};
usl.getDiscoveryLinkControl=function(index,title,href,type){
var discCtl="";
href+="#discov";
discCtl+="<span class='uslDiscoveryControl'>";
discCtl+=" <span class='uslDiscoveryIndex'>"+index+".</span>";
discCtl+=" <span class='uslDiscoveryLink'>";
discCtl+="  <span class='uslDiscovery"+type+"'>";
discCtl+="   <a href='"+href+"' title='Go to article' alt='Go to article'>"+title+"</a>";
discCtl+="  </span>";
discCtl+="  <div class='uslDiscoverySeparator'></div>";
discCtl+=" </span>";
discCtl+="</span>";
return discCtl;};

