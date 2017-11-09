//******************************************************************************
// (c)2006 Pluck Corporation
//
// -- Declared Javascript Variables --
// BLOGBURST_LOGGING_ONLY   - Used to indicate whether a Logging Only (No content returned) call is requested.
// BLOGBURST_WIDGET_ID      - The Id of the Widget to return/log.
// BLOGBURST_TRACKING_CODE  - Global Calling ID (Optional, used for Impression logging).
// BLOGBURST_PROXY_URL      - The Url of the BlogBurst Proxy Server.
// BLOGBURST_CACHE_ID       - A User-created ID for requesting/logging cached Widget content
//
// -- QueryString Parameter Names --
// bbTransport              - Transport Type (html,proxy,xml,css,logging);
// bbWidgetId               - The Id of the Widget
// bbParentWidgetId         - The Id of the parent Widget (for Post View Widgets)
// bbPostId                 - The Id of the Post
// bbCacheId                - A User-created ID for requesting/logging cached Widget content
// gcid                     - Global Calling ID (Optional, used for Impression logging)

// constructor to create a new BlogBurstWidgetProxy
function BlogBurstWidgetProxy(url)
{
    // sniff the browser for custom behaviors
    this.__isExplorer = navigator.userAgent.toLowerCase().indexOf('msie') != -1;
    this.__isSafari = navigator.userAgent.toLowerCase().indexOf('safari') != -1;
    // 412 has a javascript bug that causes issues w/ async
    this.__isSafari20412 = this.__isSafari && (navigator.userAgent.toLowerCase().indexOf('412') != -1);
    this.__isMac = navigator.platform.toLowerCase().indexOf('mac') != -1;
    this.__isMacIE = this.__isMac && this.__isExplorer;

    // if true, the proxy methods are executed asynchronously, returning JSONHTML
    // default values determined by your browser (conservative check)
    this.async = (document.createElement && document.getElementById && ! this.__isMacIE && !this.__isSafari20412) ? true : false;

    // if enabled, spit out debug information through alert()
    this.debug = false;
    
    // used to track the id of the handler expecting the results from the immediately
    // preceding method invocation, this is used only for testing purposes
    this.lastHandlerId = "";
    
    this.__baseUrl = url;
    this.__isValid = true;
    this.__time = new Date();
    this.__sendInvokeCount = 0;
    this.__scriptId = "_bb_wscript_" + this.__sendInvokeCount++;
    // prefix used to name the div into which we will insert our rendered widget
    this.__widgetDivIdPrefix = "bbwidget-";
};

BlogBurstWidgetProxy.__GetExpiryDate = function(days) {
    var Today = new Date();
    var nomilli = Date.parse(Today);
    Today.setTime(nomilli + days*24*60*60*1000);
    return Today.toUTCString();
};

// Default error handler for the proxy object, simple alert
BlogBurstWidgetProxy.prototype.OnError = function(msg) {
   alert(msg);
};

// Default debug handler for the proxy object, simple alert
BlogBurstWidgetProxy.prototype.OnDebug = function(msg) {
    if (this.debug)
        alert(msg);
};

// fetch a named request parameter from the page URL
BlogBurstWidgetProxy.prototype.GetParameter = function(parameterName) {
    var key = parameterName + "=";
    var parameters = document.location.search.substring(1).split("&");
    for (var i = 0; i < parameters.length; i++)
    {
        if (parameters[i].indexOf(key) == 0)
            return parameters[i].substring(key.length);
    }
    return null;
};

// browser independent method to get elements by ID
BlogBurstWidgetProxy.prototype.GetElement = function(id) {
    this.OnDebug("GetElement " + id);
    if (document.getElementById)
        return document.getElementById(id);
    if (document.all)
        return document.all[id];
    this.OnDebug("No support for GetElement() in this browser");
    return null;
};

// browser independent method to get elements by tag name
BlogBurstWidgetProxy.prototype.GetTags = function(tagName) {
    this.OnDebug("GetTags " + tagName);
    if (document.getElementsByTagName)
        return document.getElementsByTagName(tagName);
    if (document.all)
       return document.tags(tagName);
    this.OnError("No support for GetTags() in this browser");
    return null;
};

// browser independent method to escape request parameters
// would like to use encodeURI but not compatible with IE5 mac, older browsers
BlogBurstWidgetProxy.prototype.EscapeValue = function(s) {
    // encode the plus sign
    s = escape(s);
    s = s.replace('+', '%2B');
    return s;
};

// call back to display content
BlogBurstWidgetProxy.prototype.HandleResponse = function(widgetId, content) 
{
    var target = gBlogBurstWidgetProxy.GetElement(this.__widgetDivIdPrefix + widgetId);
    if (this.async)
    {
        gBlogBurstWidgetProxy.OnDebug("Calling handler for " + widgetId);
        if (target)
        {
            var child = document.createElement('div');
            child.innerHTML = content;            
            target.appendChild(child);
        }
    }
    else
    {
        //Split on Line Breaks
        var contentArray = content.split("\n");
        var i = 0;

        // Write each line out
        while (i < contentArray.length)
        {
          document.writeln(contentArray[i]);
          i++;
        }
    }
    // callback so you can do post processing via the DOM
    if (typeof(OnBlogBurstWidgetRendered) != "undefined")
        OnBlogBurstWidgetRendered(target);
};

// validate and fetch arguments, if the argument is missing and optional, we return an empty string        
BlogBurstWidgetProxy.prototype.__GetArgument = function(variableName, variableValue, isRequired, isArray)
{
    this.OnDebug("__GetArgument " + variableName + "," + variableValue + "," + isRequired + "," + isArray);
    if (typeof(variableValue) == "undefined" || variableValue == null || variableValue == "")
    {
        if (isRequired)
        {
            this.OnError("Missing required parameter " + variableName);
            this.__isValid = false;
            return "";
        }
        else
            return "";
    }
    if (isRequired && isArray) 
    {
        if (!this.__ArrayValidation(variableValue)) 
        {
            this.OnError("Invalid array parameter " + variableName);
            this.__isValid = false;
            return "";
        }
    }
    return "&" + variableName + "=" + this.EscapeValue(variableValue);
};

BlogBurstWidgetProxy.prototype.__AppendUrlValues = function (url, widgetId)
{
    url += this.__GetArgument("CachePrevention", this.__time.getTime() + "" + this.__sendInvokeCount++, false, false);
    url += this.__GetArgument("gcid", BLOGBURST_TRACKING_CODE, false, false);
    return url;
};

BlogBurstWidgetProxy.prototype.__LoadContent = function(url, widgetId) 
{
    this.OnDebug("__LoadContent " + url);
    
    if (!this.__isValid)
    {
        // Reset our valid flag (the setting of this should be done in the Send calls as they are built... So this should be ok
        this.__isValid = true;
        return;
    }

    //append our various parameters as necessary
    url = this.__AppendUrlValues(url, widgetId);
    this.OnDebug("_Send (updated) " + url);
    
   // Create a div where the content will appear (both sync and async)
    document.write("<div id='" + this.__widgetDivIdPrefix + widgetId + "'>");

    // sync mode is designed for maximum compatibility, note we have to split up closing tag on some browsers
    if (! this.async) {
        document.write("<script src=\"" + url + "\"></scr" + "ipt>");
        document.write("</div>");
        return;
    }
    document.write("</div>");

    // find and reuse existing script node, if present
    var scriptNode = this.GetElement(this.__scriptId);
    var head = this.GetTags('head')[0];
    
    // remove the script node (except on explorer and safari)
    // need to check if supported by browser type and see if ok to skip
    if ( (scriptNode != null) && (!this.__isExplorer) && head.removeChild && (!this.__isSafari)) 
    {
       head.removeChild(this.GetElement(this.__scriptId));
    }
        
    // add the script node to the document
    if (document.createElement && ! this.__isMacIE) 
    {
        scriptNode = document.createElement('script');
        scriptNode.id = this.__scriptId;
        scriptNode.setAttribute('type','text/javascript');
        scriptNode.setAttribute('charset', 'utf-8');
        scriptNode.setAttribute('src', url);

        head.appendChild(scriptNode);
        return;
    }

    // could fall back to sync at this point, but will bust if the page is already loaded
    this.OnError("No support for async in this browser");
};


BlogBurstWidgetProxy.prototype.__LoadStyle = function(widgetId, styleUrl)
{
    // prevents loading the same stylesheet twice
    var linkId = "link-" + widgetId;        
    if (document.getElementById && document.getElementById(linkId))
    {
        // style reference already exists
        return;
    }
    
    // older versions of IE
    if (document.createStylesheet)
    {
        document.createStylesheet(styleUrl);
        return;
    }
    
    
    // append the link through the DOM    
    if (document.createElement && document.getElementsByTagName && !(this.__isSafari || this.__isMacIE))
    {
        var objHead = document.getElementsByTagName("head");
        if (objHead[0])
        {
            // maintains proper XHTML layout
            if (document.createElementNS && objHead[0].tagName == "head")
                var objCSS = document.createElementNS("http://www.w3.org/1999/xhtml", "link");
            else
                var objCSS = document.createElement("link");
                            
            objCSS.id = linkId;
            objCSS.rel = "stylesheet";
            objCSS.href = styleUrl;
            objCSS.type = "text/css";            
            
            objHead[0].appendChild(objCSS);
            return;
        }
    }

    // try adding the link to the dom    
    document.write('<link id="' + linkId + '" rel="stylesheet" href="' + styleUrl + '" type="text/css"/>');
};

BlogBurstWidgetProxy.prototype.GetWidget = function(widgetId)
{
    //Create the QueryString items for our Requests
    var appendUrl = this.__GetArgument("bbWidgetId", widgetId, true, false) + this.__GetArgument("bbPostId", this.GetParameter("bbPostId"), false, false) + this.__GetArgument("bbCacheId", BLOGBURST_CACHE_ID, false, false);

    //Inject the StyleSheet LINKS
    var styleUrl = this.__baseUrl + '?bbTransport=css' + appendUrl;
    this.__LoadStyle(widgetId, styleUrl);

    //Inject the Widget content       
    var url = this.__baseUrl + '?bbTransport=proxy' + this.__GetArgument("bbParentWidgetId", this.GetParameter("bbParentWidgetId"), false, false) + appendUrl;    
    this.__LoadContent(url, widgetId);
};

BlogBurstWidgetProxy.prototype.LogWidgetView = function(widgetId)
{
    //Create the QueryString items for our Requests
    var appendUrl = this.__GetArgument("bbWidgetId", widgetId, true, false) + this.__GetArgument("bbPostId", this.GetParameter("bbPostId"), false, false) + this.__GetArgument("bbCacheId", BLOGBURST_CACHE_ID, false, false);

    //Inject the StyleSheet LINKS
    var styleUrl = this.__baseUrl + '?bbTransport=css' + appendUrl;
    this.__LoadStyle(widgetId, styleUrl);

    //Log This Widget        
    var url = this.__baseUrl + '?bbTransport=logging' + appendUrl;
    this.__LoadContent(url, widgetId);
};

//*************************************************************
// Loader
//*************************************************************
if (typeof(BLOGBURST_CACHE_ID) == 'undefined')
    BLOGBURST_CACHE_ID = "";
    
if (typeof(BLOGBURST_LOGGING_ONLY) == 'undefined')
    BLOGBURST_LOGGING_ONLY = false;

//Create Global Proxy Object
var gBlogBurstWidgetProxy = new BlogBurstWidgetProxy(BLOGBURST_PROXY_URL);

//Determine what we will load
if (BLOGBURST_WIDGET_ID && BLOGBURST_LOGGING_ONLY == false)
{
    gBlogBurstWidgetProxy.GetWidget(BLOGBURST_WIDGET_ID);
}
else if (BLOGBURST_WIDGET_ID && BLOGBURST_LOGGING_ONLY == true) 
{
    gBlogBurstWidgetProxy.LogWidgetView(BLOGBURST_WIDGET_ID);
}