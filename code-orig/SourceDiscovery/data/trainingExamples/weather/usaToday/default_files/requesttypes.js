
UserKey=Class.create();
UserKey.prototype={
initialize:function(key){
var data=new Object();
data.Key=key;
this.UserKey=data;}};
CommentKey=Class.create();
CommentKey.prototype={
initialize:function(key){
var data=new Object();
data.Key=key;
this.CommentKey=data;}};
ArticleKey=Class.create();
ArticleKey.prototype={
initialize:function(key){
var data=new Object();
data.Key=key;
this.ArticleKey=data;}};
ReviewKey=Class.create();
ReviewKey.prototype={
initialize:function(key){
var data=new Object();
data.Key=key;
this.ReviewKey=data;}};
CommentPage=Class.create();
CommentPage.prototype={
initialize:function(articleKey,numberPerPage,onPage,sort){
var data=new Object();
data.ArticleKey=articleKey;
data.NumberPerPage=numberPerPage;
data.OnPage=onPage;
data.Sort=sort;
this.CommentPage=data;}};
ReviewPage=Class.create();
ReviewPage.prototype={
initialize:function(articleKey,numberPerPage,onPage,sort){
var data=new Object();
data.ArticleKey=articleKey;
data.NumberPerPage=numberPerPage;
data.OnPage=onPage;
data.Sort=sort;
this.ReviewPage=data;}};
CommentAction=Class.create();
CommentAction.prototype={
initialize:function(commentOnKey,onPageUrl,onPageTitle,commentBody){
var data=new Object();
data.CommentOnKey=commentOnKey;
data.OnPageUrl=onPageUrl;
data.OnPageTitle=onPageTitle;
data.CommentBody=commentBody;
this.CommentAction=data;}};
ReviewAction=Class.create();
ReviewAction.prototype={
initialize:function(reviewOnThisKey,onPageUrl,onPageTitle,
reviewTitle,reviewRating,reviewBody,reviewPros,reviewCons){
var data=new Object();
data.ReviewOnKey=reviewOnThisKey;
data.OnPageUrl=onPageUrl;
data.OnPageTitle=onPageTitle;
data.ReviewTitle=reviewTitle;
data.ReviewRating=reviewRating;
data.ReviewBody=reviewBody;
data.ReviewPros=reviewPros;
data.ReviewCons=reviewCons;
this.ReviewAction=data;}};
RecommendAction=Class.create();
RecommendAction.prototype={
initialize:function(recommendThisKey){
var data=new Object();
data.RecommendThisKey=recommendThisKey;
this.RecommendAction=data;}};
RateAction=Class.create();
RateAction.prototype={
initialize:function(rateThisKey,rating){
var data=new Object();
data.RateThisKey=rateThisKey;
data.Rating=rating;
this.RateAction=data;}};
ReportAbuseAction=Class.create();
ReportAbuseAction.prototype={
initialize:function(reportThisKey,abuseReason,abuseDescription){
var data=new Object();
data.ReportThisKey=reportThisKey;
data.AbuseReason=abuseReason;
data.AbuseDescription=abuseDescription;
this.ReportAbuseAction=data;}};
Category=Class.create();
Category.prototype={
initialize:function(name){
var data=new Object();
data.Name=name;
this.Category=data;}};
Section=Class.create();
Section.prototype={
initialize:function(name){
var data=new Object();
data.Name=name;
this.Section=data;}};
UpdateArticleAction=Class.create();
UpdateArticleAction.prototype={
initialize:function(updateArticle,onPageUrl,onPageTitle,section,categories){
var data=new Object();
data.UpdateArticle=updateArticle;
data.OnPageUrl=onPageUrl;
data.OnPageTitle=onPageTitle;
data.Section=section;
data.Categories=categories;
this.UpdateArticleAction=data;}};
UserTier=Class.create();
UserTier.prototype={
initialize:function(name){
var data=new Object();
data.Name=name;
this.UserTier=data;}};
Activity=Class.create();
Activity.prototype={
initialize:function(name){
var data=new Object();
data.Name=name;
this.Activity=data;}};
DiscoverArticlesAction=Class.create();
DiscoverArticlesAction.prototype={
initialize:function(searchSections,searchCategories,limitToContributors,activity,age,maximumNumberOfDiscoveries){
var data=new Object();
data.SearchSections=searchSections;
data.SearchCategories=searchCategories;
data.LimitToContributors=limitToContributors;
data.Activity=activity;
data.Age=age;
data.MaximumNumberOfDiscoveries=maximumNumberOfDiscoveries;
this.DiscoverArticlesAction=data;}};

