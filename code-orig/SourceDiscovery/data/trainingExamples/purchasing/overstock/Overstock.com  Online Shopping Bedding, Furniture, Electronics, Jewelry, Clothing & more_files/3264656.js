





 





/*
Do not copy or host this file yourself! This is dynamically generated and is
intended to be centralized and common across all Aggregate Knowledge customers.
You should not need to change it.
*/

try
{
    









function replaceAllInstances(string, REToBeReplaced, stringToReplaceWith)
{
    return string.split(REToBeReplaced).join(stringToReplaceWith);
}


function escapeAPIString(string)
{
    return replaceAllInstances(string, /[,]/, 'AKCOMMA');
}

function unescapeAPIString(string)
{
    return replaceAllInstances(string, /AKCOMMA/, ',');
}


function arrayToEscapedString(array)
{
    var outputString = '';
    for(var i = 0; i <= (array.length - 1); i++) 
    {
        if(i != 0) outputString += ',';
        if(array[i].constructor == String)
        {
            outputString += escapeAPIString(array[i]); 
        } else {
            outputString += array[i];
        }
    }
    return outputString;
}


function escapedStringToArray(string, conversionFunction)
{
    var outputArray = string.split(',');
    for(var i = 0; i <= (outputArray.length - 1); i++) 
    {
        outputString += conversionFunction(array[i]);
    }
    return outputArray;
}


function APIParameter(unifiedName, usableNames, defaultValue, isUsedForSilentMode, URLName)
{
    this.unifiedName = unifiedName;
    this.usableNames = usableNames;
    this.dataType = 'STRING'; 
    this.value = defaultValue;
    this.isUsedForSilentMode = isUsedForSilentMode;
    this.URLName = URLName;
    this.populatingExpression = '';
    this.isSentToServer = true;
    this.specificity = 'REQUEST';
    this.sources = new Array(0);
    this.boxSpecificOverrideChildren = new Array(0);
    this.boxSpecificOverrideParent = null;
}

APIParameter.prototype.unifiedName = '';
APIParameter.prototype.usableNames = [];
APIParameter.prototype.dataType = 'STRING';
APIParameter.prototype.value = '';
APIParameter.prototype.isUsedForSilentMode = false;
APIParameter.prototype.URLName = '';
APIParameter.prototype.populatingExpression = '';
APIParameter.prototype.isSentToServer = true;
APIParameter.prototype.specificity = 'ITEM';
APIParameter.prototype.sources = new Array(0);
APIParameter.prototype.isBoxSpecificOverride = false;

APIParameter.prototype.populateValueFromString = function(string)
{
    this.dataType = this.dataType.toUpperCase();
    try
    {
        if(this.dataType == 'STRING') this.value = string;
        if(this.dataType == 'INTEGER') this.value = parseInt(string);
        if(this.dataType == 'FLOAT') this.value = parseFloat(string);
        if(this.dataType == 'BOOLEAN') this.value = (string == 'true');
        if(this.dataType == 'STRING_OR_ARRAY'
            || this.dataType == 'INTEGER_OR_ARRAY'
            || this.dataType == 'FLOAT_OR_ARRAY'
            || this.dataType == 'BOOLEAN_OR_ARRAY')
        {
            if(this.dataType == 'STRING_OR_ARRAY') conversionFunction = unescapeAPIString;
            if(this.dataType == 'INTEGER_OR_ARRAY') conversionFunction = parseInt;
            if(this.dataType == 'FLOAT_OR_ARRAY') conversionFunction = parseFloat;
            if(this.dataType == 'BOOLEAN_OR_ARRAY') conversionFunction = Boolean;
            if(string.indexOf(',') == -1)
            {
                this.value = conversionFunction(string);
            } else {
                this.value = escapedStringToArray(string, conversionFunction);
            }
        }
    } catch(e) {
        this.value = string;
    }
}


APIParameter.prototype.populateFromQueryString = function()
{
    for(var i = 0; i <= (this.usableNames.length - 1); i++)
    {
        var name = this.usableNames[i];
        var paramValue = getParamValueFromQueryString(name);
        if(paramValue != null)
        {
            this.populateValueFromString(paramValue);
            return true;
        }
    }
    return false;
}


APIParameter.prototype.populateFromCookie = function()
{
    for(var i = 0; i <= (this.usableNames.length - 1); i++)
    {
        var name = this.usableNames[i];
        var paramValue = getParamValueFromCookie(name);
        if(paramValue != null)
        {
            this.populateValueFromString(paramValue);
            return true;
        }
    }
    return false;
}


APIParameter.prototype.populateFromPopulatingExpression = function()
{
    if(this.populatingExpression != '')
    {
        this.value = eval(this.populatingExpression);
        return true;
    }
    return false;
}


APIParameter.prototype.populateFromJSVars = function()
{
    for(var i = 0; i <= (this.usableNames.length - 1); i++)
    {
        var name = this.usableNames[i];
        if(variableIsDefined(name))
        {
            this.value = eval('window.' + name);
            return true;
        }
    }
    return false;
}


APIParameter.prototype.populateFromHTMLHiddens = function()
{
    for(var i = 0; i <= (this.usableNames.length - 1); i++)
    {
        var name = this.usableNames[i];
        var paramFormField = null;
        var paramFormFieldArray = document.getElementsByName(name);
        if(paramFormFieldArray != null && paramFormFieldArray.length > 0)
            paramFormField = paramFormFieldArray[paramFormFieldArray.length - 1];
        if(paramFormField == null) var paramFormField = document.getElementById(name);
        if(paramFormField != null && paramFormField.value !== undefined)
        {
            this.populateValueFromString(paramFormField.value);
            return true;
        }
    }
    return false;
}


APIParameter.prototype.populate = function()
{
    
    for(var i = 0; i <= (this.sources.length - 1); i++)
    {
        var currentSource = this.sources[i];
        if(currentSource == 'URL' && this.populateFromQueryString()) break;
        if(currentSource == 'COOKIE' && this.populateFromCookie()) break;
        if(currentSource == 'JAVASCRIPT_VAR' && this.populateFromJSVars()) break;
        if(currentSource == 'HTML_HIDDEN' && this.populateFromHTMLHiddens()) break;
        if(currentSource == 'POPULATING_EXPRESSION' && this.populateFromPopulatingExpression()) break;
    }
}

APIParameter.prototype.getValueAsString = function()
{
    this.dataType = this.dataType.toUpperCase();
    var output = '';
    if(this.dataType == 'STRING' || this.dataType == 'INTEGER' || this.dataType == 'FLOAT' || this.dataType == 'BOOLEAN')
        output = '' + this.value;
    if(this.dataType == 'STRING_OR_ARRAY')
    {
        if(this.value.constructor == String)
        {
            output = escapeAPIString(this.value);
        } else if(this.value.constructor == Array) {
            output = arrayToEscapedString(this.value);
        }
    }
    if(this.dataType == 'INTEGER_OR_ARRAY'
        || this.dataType == 'FLOAT_OR_ARRAY'
        || this.dataType == 'BOOLEAN_OR_ARRAY')
    {
        if(this.value.constructor == Array)
        {
            output = arrayToEscapedString(this.value);
        } else {
            output = String(this.value);
        }
    }
    return output;
}


APIParameter.prototype.outputToDebug = function(linePrefix)
{
    var output = '';
    if(linePrefix == null) linePrefix = '';
    output += linePrefix + 'Server-side name: ' + this.unifiedName + '\n';
    output += linePrefix + 'Client-usable name(s): ' + this.usableNames + '\n';
    output += linePrefix + 'Data type: ' + this.dataType + '\n';
    output += linePrefix + 'Value: ' + this.getValueAsString() + '\n';
    output += linePrefix + 'URL name: ' + this.URLName + '\n';
    output += linePrefix + 'Used for silent mode? ' + this.isUsedForSilentMode + '\n';
    output += linePrefix + 'Populating expression: ' + this.populatingExpression + '\n';
    output += linePrefix + 'Sent to server? ' + this.isSentToServer + '\n';
    output += linePrefix + 'Specific to: ' + this.specificity + '\n';
    output += linePrefix + 'Sources: ' + this.sources.join(', ') + '\n';
    return output;
}


function APIParameters()
{
    this.paramMap = new Object();
    
        this.paramMap['akDebug'] = new APIParameter('akDebug', ['akDebug'], false, true, 'akDebug');
        
            this.paramMap['akDebug'].dataType = 'BOOLEAN';
        
        
        
        
        
        this.paramMap['akDebug'].sources = ['URL', 'COOKIE', 'POPULATING_EXPRESSION', 'JAVASCRIPT_VAR', 'HTML_HIDDEN'];
    
        this.paramMap['akResultsFrameHeight'] = new APIParameter('akResultsFrameHeight', ['akResultsFrameHeight'], 300, false, '');
        
            this.paramMap['akResultsFrameHeight'].dataType = 'INTEGER';
        
        
            this.paramMap['akResultsFrameHeight'].isSentToServer = false;
        
        
        
        
        this.paramMap['akResultsFrameHeight'].sources = ['URL', 'POPULATING_EXPRESSION', 'JAVASCRIPT_VAR', 'HTML_HIDDEN'];
    
        this.paramMap['akResultsFrameWidth'] = new APIParameter('akResultsFrameWidth', ['akResultsFrameWidth'], 275, false, '');
        
            this.paramMap['akResultsFrameWidth'].dataType = 'INTEGER';
        
        
            this.paramMap['akResultsFrameWidth'].isSentToServer = false;
        
        
        
        
        this.paramMap['akResultsFrameWidth'].sources = ['URL', 'POPULATING_EXPRESSION', 'JAVASCRIPT_VAR', 'HTML_HIDDEN'];
    
        this.paramMap['_akListPrice'] = new APIParameter('_akListPrice', ['_akListPrice'], '', false, '');
        
        
        
        
            this.paramMap['_akListPrice'].specificity = 'ITEM';
        
        
        this.paramMap['_akListPrice'].sources = ['URL', 'POPULATING_EXPRESSION', 'JAVASCRIPT_VAR', 'HTML_HIDDEN'];
    
        this.paramMap['_akOurPrice'] = new APIParameter('_akOurPrice', ['_akOurPrice'], '', false, '');
        
        
        
        
            this.paramMap['_akOurPrice'].specificity = 'ITEM';
        
        
        this.paramMap['_akOurPrice'].sources = ['URL', 'POPULATING_EXPRESSION', 'JAVASCRIPT_VAR', 'HTML_HIDDEN'];
    
        this.paramMap['akExclude'] = new APIParameter('akExclude', ['akExclude'], false, false, '');
        
            this.paramMap['akExclude'].dataType = 'BOOLEAN';
        
        
        
        
            this.paramMap['akExclude'].specificity = 'ITEM';
        
        
        this.paramMap['akExclude'].sources = ['URL', 'POPULATING_EXPRESSION', 'JAVASCRIPT_VAR', 'HTML_HIDDEN'];
    
        this.paramMap['akKeywords'] = new APIParameter('akKeywords', ['akKeywords'], '', true, 'keywords');
        
            this.paramMap['akKeywords'].dataType = 'STRING_OR_ARRAY';
        
        
        
            this.paramMap['akKeywords'].populatingExpression = 'getKeywords()';
        
        
            this.paramMap['akKeywords'].specificity = 'ITEM';
        
        
        this.paramMap['akKeywords'].sources = ['URL', 'POPULATING_EXPRESSION', 'JAVASCRIPT_VAR', 'HTML_HIDDEN'];
    
        this.paramMap['akThumbnailHeight'] = new APIParameter('akThumbnailHeight', ['akThumbnailHeight'], '', false, '');
        
            this.paramMap['akThumbnailHeight'].dataType = 'INTEGER';
        
        
        
        
            this.paramMap['akThumbnailHeight'].specificity = 'ITEM';
        
        
        this.paramMap['akThumbnailHeight'].sources = ['URL', 'POPULATING_EXPRESSION', 'JAVASCRIPT_VAR', 'HTML_HIDDEN'];
    
        this.paramMap['akThumbnailUrl'] = new APIParameter('akThumbnailUrl', ['akThumbnailUrl'], '', false, '');
        
        
        
        
            this.paramMap['akThumbnailUrl'].specificity = 'ITEM';
        
        
        this.paramMap['akThumbnailUrl'].sources = ['URL', 'POPULATING_EXPRESSION', 'JAVASCRIPT_VAR', 'HTML_HIDDEN'];
    
        this.paramMap['akThumbnailWidth'] = new APIParameter('akThumbnailWidth', ['akThumbnailWidth'], '', false, '');
        
            this.paramMap['akThumbnailWidth'].dataType = 'INTEGER';
        
        
        
        
            this.paramMap['akThumbnailWidth'].specificity = 'ITEM';
        
        
        this.paramMap['akThumbnailWidth'].sources = ['URL', 'POPULATING_EXPRESSION', 'JAVASCRIPT_VAR', 'HTML_HIDDEN'];
    
        this.paramMap['_akAdditionalDiscountPercent'] = new APIParameter('_akAdditionalDiscountPercent', ['_akAdditionalDiscountPercent'], 0, false, 'additionaldiscountpercent');
        
            this.paramMap['_akAdditionalDiscountPercent'].dataType = 'INTEGER';
        
        
        
        
        
        this.paramMap['_akAdditionalDiscountPercent'].sources = ['URL', 'POPULATING_EXPRESSION', 'JAVASCRIPT_VAR', 'HTML_HIDDEN'];
    
        this.paramMap['akAnchorId'] = new APIParameter('akAnchorId', ['akAnchorId'], 'akAPI', true, 'anchorid');
        
            this.paramMap['akAnchorId'].dataType = 'STRING_OR_ARRAY';
        
        
        
        
        
        this.paramMap['akAnchorId'].sources = ['URL', 'POPULATING_EXPRESSION', 'JAVASCRIPT_VAR', 'HTML_HIDDEN'];
    
        this.paramMap['akApiKey'] = new APIParameter('akApiKey', ['akApiKey'], '', true, 'apikey');
        
        
        
        
        
        this.paramMap['akApiKey'].sources = ['URL', 'POPULATING_EXPRESSION', 'JAVASCRIPT_VAR', 'HTML_HIDDEN'];
    
        this.paramMap['akDebug'] = new APIParameter('akDebug', ['akDebug'], false, true, 'akDebug');
        
            this.paramMap['akDebug'].dataType = 'BOOLEAN';
        
        
        
        
        
        this.paramMap['akDebug'].sources = ['URL', 'COOKIE', 'POPULATING_EXPRESSION', 'JAVASCRIPT_VAR', 'HTML_HIDDEN'];
    
        this.paramMap['akExcludeResultItems'] = new APIParameter('akExcludeResultItems', ['akExcludeItems', 'akExcludeResultItems'], '', false, 'excludeitems');
        
            this.paramMap['akExcludeResultItems'].dataType = 'STRING_OR_ARRAY';
        
        
        
        
        
        this.paramMap['akExcludeResultItems'].sources = ['URL', 'POPULATING_EXPRESSION', 'JAVASCRIPT_VAR', 'HTML_HIDDEN'];
    
        this.paramMap['akForceSettingsGroup'] = new APIParameter('akForceSettingsGroup', ['akForceSettingsGroup'], '', false, 'akForceSettingsGroup');
        
            this.paramMap['akForceSettingsGroup'].dataType = 'INTEGER';
        
        
        
        
        
        this.paramMap['akForceSettingsGroup'].sources = ['URL', 'POPULATING_EXPRESSION', 'JAVASCRIPT_VAR', 'HTML_HIDDEN'];
    
        this.paramMap['akIntent'] = new APIParameter('akIntent', ['akIntent'], 'VIEW', true, 'intent');
        
        
        
        
            this.paramMap['akIntent'].specificity = 'ITEM';
        
        
        this.paramMap['akIntent'].sources = ['URL', 'POPULATING_EXPRESSION', 'JAVASCRIPT_VAR', 'HTML_HIDDEN'];
    
        this.paramMap['akInternalParameters'] = new APIParameter('akInternalParameters', ['akInternalParameters'], '', true, 'akInternalParameters');
        
        
        
        
        
        this.paramMap['akInternalParameters'].sources = ['URL', 'POPULATING_EXPRESSION', 'JAVASCRIPT_VAR', 'HTML_HIDDEN'];
    
        this.paramMap['akItemQuantity'] = new APIParameter('akItemQuantity', ['akItemQuantity'], 1, true, 'itemquantity');
        
            this.paramMap['akItemQuantity'].dataType = 'INTEGER_OR_ARRAY';
        
        
        
        
            this.paramMap['akItemQuantity'].specificity = 'ITEM';
        
        
        this.paramMap['akItemQuantity'].sources = ['URL', 'POPULATING_EXPRESSION', 'JAVASCRIPT_VAR', 'HTML_HIDDEN'];
    
        this.paramMap['akItemsTruncated'] = new APIParameter('akItemsTruncated', ['akItemsTruncated'], 0, true, 'itemstruncated');
        
            this.paramMap['akItemsTruncated'].dataType = 'INTEGER';
        
        
        
        
        
        this.paramMap['akItemsTruncated'].sources = ['URL', 'POPULATING_EXPRESSION', 'JAVASCRIPT_VAR', 'HTML_HIDDEN'];
    
        this.paramMap['akKeywords'] = new APIParameter('akKeywords', ['akKeywords'], '', true, 'keywords');
        
            this.paramMap['akKeywords'].dataType = 'STRING_OR_ARRAY';
        
        
        
            this.paramMap['akKeywords'].populatingExpression = 'getKeywords()';
        
        
            this.paramMap['akKeywords'].specificity = 'ITEM';
        
        
        this.paramMap['akKeywords'].sources = ['URL', 'POPULATING_EXPRESSION', 'JAVASCRIPT_VAR', 'HTML_HIDDEN'];
    
        this.paramMap['akLinkShareUrl'] = new APIParameter('akLinkShareUrl', ['akLinkShareUrl'], '', false, 'linkshareurl');
        
        
        
        
        
        this.paramMap['akLinkShareUrl'].sources = ['URL', 'POPULATING_EXPRESSION', 'JAVASCRIPT_VAR', 'HTML_HIDDEN'];
    
        this.paramMap['akMaxNum'] = new APIParameter('akMaxNum', ['akMaxNum'], 5, false, 'maxnum');
        
            this.paramMap['akMaxNum'].dataType = 'INTEGER';
        
        
        
        
        
        this.paramMap['akMaxNum'].sources = ['URL', 'POPULATING_EXPRESSION', 'JAVASCRIPT_VAR', 'HTML_HIDDEN'];
    
        this.paramMap['akMode'] = new APIParameter('akMode', ['akMode'], 'DISPLAY', true, 'mode');
        
        
        
        
        
        this.paramMap['akMode'].sources = ['URL', 'COOKIE', 'POPULATING_EXPRESSION', 'JAVASCRIPT_VAR', 'HTML_HIDDEN'];
    
        this.paramMap['akNumCols'] = new APIParameter('akNumCols', ['akNumCols'], 0, false, 'numcols');
        
            this.paramMap['akNumCols'].dataType = 'INTEGER';
        
        
        
        
        
        this.paramMap['akNumCols'].sources = ['URL', 'POPULATING_EXPRESSION', 'JAVASCRIPT_VAR', 'HTML_HIDDEN'];
    
        this.paramMap['akNumRows'] = new APIParameter('akNumRows', ['akNumRows'], 0, false, 'numrows');
        
            this.paramMap['akNumRows'].dataType = 'INTEGER';
        
        
        
        
        
        this.paramMap['akNumRows'].sources = ['URL', 'POPULATING_EXPRESSION', 'JAVASCRIPT_VAR', 'HTML_HIDDEN'];
    
        this.paramMap['akOrientation'] = new APIParameter('akOrientation', ['akOrientation'], 'VERTICAL', false, 'orientation');
        
        
        
        
        
        this.paramMap['akOrientation'].sources = ['URL', 'POPULATING_EXPRESSION', 'JAVASCRIPT_VAR', 'HTML_HIDDEN'];
    
        this.paramMap['akPivotType'] = new APIParameter('akPivotType', ['akPivotType'], '', false, 'pivottype');
        
        
        
        
            this.paramMap['akPivotType'].specificity = 'BOX';
        
        
        this.paramMap['akPivotType'].sources = ['URL', 'POPULATING_EXPRESSION', 'JAVASCRIPT_VAR', 'HTML_HIDDEN'];
    
        this.paramMap['akReferer'] = new APIParameter('akReferer', ['akReferer'], '', true, 'referer');
        
        
        
            this.paramMap['akReferer'].populatingExpression = 'window.top.document.referrer';
        
        
        
        this.paramMap['akReferer'].sources = ['URL', 'POPULATING_EXPRESSION', 'JAVASCRIPT_VAR', 'HTML_HIDDEN'];
    
        this.paramMap['akRelease'] = new APIParameter('akRelease', ['akRelease'], '', true, 'release');
        
        
        
            this.paramMap['akRelease'].populatingExpression = '1.7';
        
        
        
        this.paramMap['akRelease'].sources = ['POPULATING_EXPRESSION'];
    
        this.paramMap['akRestrictIntent'] = new APIParameter('akRestrictIntent', ['akRestrictIntent'], '', false, 'restrictintent');
        
        
        
        
        
        this.paramMap['akRestrictIntent'].sources = ['URL', 'POPULATING_EXPRESSION', 'JAVASCRIPT_VAR', 'HTML_HIDDEN'];
    
        this.paramMap['akResultType'] = new APIParameter('akResultType', ['akResultType'], '', false, 'resulttype');
        
        
        
        
            this.paramMap['akResultType'].specificity = 'BOX';
        
        
        this.paramMap['akResultType'].sources = ['URL', 'POPULATING_EXPRESSION', 'JAVASCRIPT_VAR', 'HTML_HIDDEN'];
    
        this.paramMap['akResultsTitle'] = new APIParameter('akResultsTitle', ['akResultsTitle'], 'People who looked at this also looked at:', false, 'resultstitle');
        
        
        
        
        
        this.paramMap['akResultsTitle'].sources = ['URL', 'POPULATING_EXPRESSION', 'JAVASCRIPT_VAR', 'HTML_HIDDEN'];
    
        this.paramMap['akSourceUrl'] = new APIParameter('akSourceUrl', ['akSourceUrl'], '', true, 'sourceurl');
        
        
        
            this.paramMap['akSourceUrl'].populatingExpression = 'window.top.location.toString()';
        
        
        
        this.paramMap['akSourceUrl'].sources = ['URL', 'POPULATING_EXPRESSION', 'JAVASCRIPT_VAR', 'HTML_HIDDEN'];
    
        this.paramMap['akStylesheetUrl'] = new APIParameter('akStylesheetUrl', ['akStylesheetUrl'], '', false, 'stylesheeturl');
        
        
        
        
        
        this.paramMap['akStylesheetUrl'].sources = ['URL', 'POPULATING_EXPRESSION', 'JAVASCRIPT_VAR', 'HTML_HIDDEN'];
    
        this.paramMap['akTarget'] = new APIParameter('akTarget', ['akTarget'], getDefaultTarget(), true, 'target');
        
            this.paramMap['akTarget'].dataType = 'STRING_OR_ARRAY';
        
        
        
        
            this.paramMap['akTarget'].specificity = 'ITEM';
        
        
        this.paramMap['akTarget'].sources = ['URL', 'POPULATING_EXPRESSION', 'JAVASCRIPT_VAR', 'HTML_HIDDEN'];
    
        this.paramMap['akTargetDesc'] = new APIParameter('akTargetDesc', ['akDescription', 'akDesc', 'akTargetDesc'], window.top.document.title, true, 'description');
        
            this.paramMap['akTargetDesc'].dataType = 'STRING_OR_ARRAY';
        
        
        
        
            this.paramMap['akTargetDesc'].specificity = 'ITEM';
        
        
        this.paramMap['akTargetDesc'].sources = ['URL', 'POPULATING_EXPRESSION', 'JAVASCRIPT_VAR', 'HTML_HIDDEN'];
    
        this.paramMap['akTargetType'] = new APIParameter('akTargetType', ['akTargetType'], '', true, 'fromtype');
        
            this.paramMap['akTargetType'].dataType = 'STRING_OR_ARRAY';
        
        
        
        
            this.paramMap['akTargetType'].specificity = 'ITEM';
        
        
        this.paramMap['akTargetType'].sources = ['URL', 'POPULATING_EXPRESSION', 'JAVASCRIPT_VAR', 'HTML_HIDDEN'];
    
        this.paramMap['akUUId'] = new APIParameter('akUUId', ['akUUId'], '', true, 'uuid');
        
        
        
        
        
        this.paramMap['akUUId'].sources = ['URL', 'POPULATING_EXPRESSION', 'JAVASCRIPT_VAR', 'HTML_HIDDEN'];
    
        this.paramMap['akWebsiteRegion'] = new APIParameter('akWebsiteRegion', ['akRegion', 'akWebsiteRegion'], 'default', true, 'websiteregion');
        
        
        
        
            this.paramMap['akWebsiteRegion'].specificity = 'BOX';
        
        
        this.paramMap['akWebsiteRegion'].sources = ['URL', 'POPULATING_EXPRESSION', 'JAVASCRIPT_VAR', 'HTML_HIDDEN'];
    
        this.paramMap['akAnchorId'] = new APIParameter('akAnchorId', ['akAnchorId'], 'akAPI', true, 'anchorid');
        
            this.paramMap['akAnchorId'].dataType = 'STRING_OR_ARRAY';
        
        
        
        
        
        this.paramMap['akAnchorId'].sources = ['URL', 'POPULATING_EXPRESSION', 'JAVASCRIPT_VAR', 'HTML_HIDDEN'];
    
        this.paramMap['akApiKey'] = new APIParameter('akApiKey', ['akApiKey'], '', true, 'apikey');
        
        
        
        
        
        this.paramMap['akApiKey'].sources = ['URL', 'POPULATING_EXPRESSION', 'JAVASCRIPT_VAR', 'HTML_HIDDEN'];
    
        this.paramMap['akDebug'] = new APIParameter('akDebug', ['akDebug'], false, true, 'akDebug');
        
            this.paramMap['akDebug'].dataType = 'BOOLEAN';
        
        
        
        
        
        this.paramMap['akDebug'].sources = ['URL', 'COOKIE', 'POPULATING_EXPRESSION', 'JAVASCRIPT_VAR', 'HTML_HIDDEN'];
    
        this.paramMap['akIntent'] = new APIParameter('akIntent', ['akIntent'], 'VIEW', true, 'intent');
        
        
        
        
            this.paramMap['akIntent'].specificity = 'ITEM';
        
        
        this.paramMap['akIntent'].sources = ['URL', 'POPULATING_EXPRESSION', 'JAVASCRIPT_VAR', 'HTML_HIDDEN'];
    
        this.paramMap['akInternalParameters'] = new APIParameter('akInternalParameters', ['akInternalParameters'], '', true, 'akInternalParameters');
        
        
        
        
        
        this.paramMap['akInternalParameters'].sources = ['URL', 'POPULATING_EXPRESSION', 'JAVASCRIPT_VAR', 'HTML_HIDDEN'];
    
        this.paramMap['akItemQuantity'] = new APIParameter('akItemQuantity', ['akItemQuantity'], 1, true, 'itemquantity');
        
            this.paramMap['akItemQuantity'].dataType = 'INTEGER_OR_ARRAY';
        
        
        
        
            this.paramMap['akItemQuantity'].specificity = 'ITEM';
        
        
        this.paramMap['akItemQuantity'].sources = ['URL', 'POPULATING_EXPRESSION', 'JAVASCRIPT_VAR', 'HTML_HIDDEN'];
    
        this.paramMap['akItemsTruncated'] = new APIParameter('akItemsTruncated', ['akItemsTruncated'], 0, true, 'itemstruncated');
        
            this.paramMap['akItemsTruncated'].dataType = 'INTEGER';
        
        
        
        
        
        this.paramMap['akItemsTruncated'].sources = ['URL', 'POPULATING_EXPRESSION', 'JAVASCRIPT_VAR', 'HTML_HIDDEN'];
    
        this.paramMap['akKeywords'] = new APIParameter('akKeywords', ['akKeywords'], '', true, 'keywords');
        
            this.paramMap['akKeywords'].dataType = 'STRING_OR_ARRAY';
        
        
        
            this.paramMap['akKeywords'].populatingExpression = 'getKeywords()';
        
        
            this.paramMap['akKeywords'].specificity = 'ITEM';
        
        
        this.paramMap['akKeywords'].sources = ['URL', 'POPULATING_EXPRESSION', 'JAVASCRIPT_VAR', 'HTML_HIDDEN'];
    
        this.paramMap['akMode'] = new APIParameter('akMode', ['akMode'], 'DISPLAY', true, 'mode');
        
        
        
        
        
        this.paramMap['akMode'].sources = ['URL', 'COOKIE', 'POPULATING_EXPRESSION', 'JAVASCRIPT_VAR', 'HTML_HIDDEN'];
    
        this.paramMap['akReferer'] = new APIParameter('akReferer', ['akReferer'], '', true, 'referer');
        
        
        
            this.paramMap['akReferer'].populatingExpression = 'window.top.document.referrer';
        
        
        
        this.paramMap['akReferer'].sources = ['URL', 'POPULATING_EXPRESSION', 'JAVASCRIPT_VAR', 'HTML_HIDDEN'];
    
        this.paramMap['akRelease'] = new APIParameter('akRelease', ['akRelease'], '', true, 'release');
        
        
        
            this.paramMap['akRelease'].populatingExpression = '1.7';
        
        
        
        this.paramMap['akRelease'].sources = ['POPULATING_EXPRESSION'];
    
        this.paramMap['akSourceUrl'] = new APIParameter('akSourceUrl', ['akSourceUrl'], '', true, 'sourceurl');
        
        
        
            this.paramMap['akSourceUrl'].populatingExpression = 'window.top.location.toString()';
        
        
        
        this.paramMap['akSourceUrl'].sources = ['URL', 'POPULATING_EXPRESSION', 'JAVASCRIPT_VAR', 'HTML_HIDDEN'];
    
        this.paramMap['akTarget'] = new APIParameter('akTarget', ['akTarget'], getDefaultTarget(), true, 'target');
        
            this.paramMap['akTarget'].dataType = 'STRING_OR_ARRAY';
        
        
        
        
            this.paramMap['akTarget'].specificity = 'ITEM';
        
        
        this.paramMap['akTarget'].sources = ['URL', 'POPULATING_EXPRESSION', 'JAVASCRIPT_VAR', 'HTML_HIDDEN'];
    
        this.paramMap['akTargetDesc'] = new APIParameter('akTargetDesc', ['akDescription', 'akDesc', 'akTargetDesc'], window.top.document.title, true, 'description');
        
            this.paramMap['akTargetDesc'].dataType = 'STRING_OR_ARRAY';
        
        
        
        
            this.paramMap['akTargetDesc'].specificity = 'ITEM';
        
        
        this.paramMap['akTargetDesc'].sources = ['URL', 'POPULATING_EXPRESSION', 'JAVASCRIPT_VAR', 'HTML_HIDDEN'];
    
        this.paramMap['akTargetType'] = new APIParameter('akTargetType', ['akTargetType'], '', true, 'fromtype');
        
            this.paramMap['akTargetType'].dataType = 'STRING_OR_ARRAY';
        
        
        
        
            this.paramMap['akTargetType'].specificity = 'ITEM';
        
        
        this.paramMap['akTargetType'].sources = ['URL', 'POPULATING_EXPRESSION', 'JAVASCRIPT_VAR', 'HTML_HIDDEN'];
    
        this.paramMap['akUUId'] = new APIParameter('akUUId', ['akUUId'], '', true, 'uuid');
        
        
        
        
        
        this.paramMap['akUUId'].sources = ['URL', 'POPULATING_EXPRESSION', 'JAVASCRIPT_VAR', 'HTML_HIDDEN'];
    
        this.paramMap['akWebsiteRegion'] = new APIParameter('akWebsiteRegion', ['akRegion', 'akWebsiteRegion'], 'default', true, 'websiteregion');
        
        
        
        
            this.paramMap['akWebsiteRegion'].specificity = 'BOX';
        
        
        this.paramMap['akWebsiteRegion'].sources = ['URL', 'POPULATING_EXPRESSION', 'JAVASCRIPT_VAR', 'HTML_HIDDEN'];
    
}

APIParameters.prototype.iterator = function()
{
    return new APIParametersIterator(this);
}


APIParameters.prototype.getParameterByName = function(name)
{
    for(var iter = this.iterator(); iter.hasNext(); )
    {
        var param = iter.next();
        for(var i = 0; i <= (param.usableNames.length - 1); i++) 
        {
            if(param.usableNames[i] == name) return param;
        }
    }
    return undefined;
}


APIParameters.prototype.populate = function()
{
    for(var iter = this.iterator(); iter.hasNext(); )
    {
        var param = iter.next();
        param.populate();
    }
    this.populateBoxSpecificParameters();
}


APIParameters.prototype.populateBoxSpecificParameters = function()
{
    var anchorIds = this.getAnchorIds();
    if(anchorIds.length < 2) return;
    
    for(var iter = this.iterator(); iter.hasNext(); )
    {
        var param = iter.next();
        if(param.specificity == 'BOX')
        {
            
            for(var i = 0; i <= (anchorIds.length - 1); i++)
            {
                
                var boxSpecificUsableNames = [];
                for(var j = 0; j <= (param.usableNames.length - 1); j++) 
                {
                    boxSpecificUsableNames.push(anchorIds[i] + "_" + param.usableNames[j]);
                }
                
                var boxSpecificUnifiedParamName = anchorIds[i] + "_" + param.unifiedName;
                var boxSpecificParam = new APIParameter(boxSpecificUnifiedParamName, [boxSpecificUnifiedParamName], null, param.isUsedForSilentMode, boxSpecificUnifiedParamName);
                boxSpecificParam.dataType = param.dataType;
                boxSpecificParam.sources = param.sources;
                boxSpecificParam.isBoxSpecificOverride = true;
                boxSpecificParam.populate();
                if(boxSpecificParam.value != null)
                {
                    
                    this.paramMap[boxSpecificUnifiedParamName] = boxSpecificParam;
                    param.boxSpecificOverrideChildren.push(boxSpecificParam);
                    boxSpecificParam.boxSpecificOverrideParent = param;
                }
            }
        }
    }
}

APIParameters.prototype.isSilentMode = function()
{
    return (this.getParameterByName('akMode').value == 'SILENT');
}


APIParameters.prototype.getAnchorIds = function()
{
    var anchorIdsParam = this.getParameterByName('akAnchorId');
    if(anchorIdsParam == null) return [];
    if(anchorIdsParam.value.constructor == Array) return anchorIdsParam.value;
    return [anchorIdsParam.value];
}

APIParameters.prototype.toString = function()
{
    var output = 'API PARAMETER CONTENTS\n'
        + '======================\n\n';
    for(var iter = this.iterator(); iter.hasNext(); )
    {
        var param = iter.next();
        if(param.boxSpecificOverrideParent == null)
        {
            output += param.outputToDebug('    ') + '\n';
        }
        if(param.boxSpecificOverrideChildren.length > 0)
        {
            for(var i = 0; i <= (param.boxSpecificOverrideChildren.length - 1); i++)
            {
                output += param.boxSpecificOverrideChildren[i].outputToDebug('        ') + '\n';
            }
        }
    }
    output += '\n======================';
    return output;
}

APIParameters.prototype.toQueryString = function()
{
    var outputString = '';
    var paramCount = 0;
    for(var iter = this.iterator(); iter.hasNext(); )
    {
        var param = iter.next();
        if((!this.isSilentMode() || param.isUsedForSilentMode)
            && param.isSentToServer && param.URLName.length > 0)
        {
            if (paramCount == 0)
            {
                outputString = outputString + '?';
            } else {
                outputString = outputString + '&';
            }
            outputString = outputString + param.URLName + '=' + base64Encode(param.getValueAsString());
            paramCount = paramCount + 1;
        }
    }
    return outputString;
}


function APIParametersIterator(APIParameters)
{
    
    while(this.paramArray.length > 0) this.paramArray.pop();
    for(paramName in APIParameters.paramMap)
    {
        this.paramArray.push(APIParameters.paramMap[paramName]);
    }
}

APIParametersIterator.prototype.paramArray = new Array;
APIParametersIterator.prototype.currentIndex = 0;

APIParametersIterator.prototype.hasNext = function()
{
    return this.currentIndex <= (this.paramArray.length - 1); 
}

APIParametersIterator.prototype.next = function()
{
    var output = this.paramArray[this.currentIndex];
    this.currentIndex++;
    return output;
}

function buildApiParameters()
{
    var params = new APIParameters();
    params.populate();
    return params;
}

    function UTF8Encode(inputString)
{
    var outputString = '';
    for(var i = 0; i < inputString.length; i++)
    {
        var currentCharValue = inputString.charCodeAt(i);
        if(currentCharValue < 128)
        {
            outputString += String.fromCharCode(currentCharValue);
        } else if((currentCharValue >= 128) && (currentCharValue < 2048)) {
            outputString += String.fromCharCode((currentCharValue >> 6) | 192);
            outputString += String.fromCharCode((currentCharValue & 63) | 128);
        } else {
            outputString += String.fromCharCode((currentCharValue >> 12) | 224);
            outputString += String.fromCharCode(((currentCharValue >> 6) & 63) | 128);
            outputString += String.fromCharCode((currentCharValue & 63) | 128);
        }
    }
    return outputString;
}




function base64Encode(inputString)
{
    inputString = UTF8Encode(inputString);
    var base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
	var outputArray = new Array;
	var j=0;
	for(var i = 0; i <= (inputString.length - 1); i += 3) 
	{
		var byte1 = inputString.charCodeAt(i);
		var byte2 = inputString.charCodeAt(i + 1);
		var byte3 = inputString.charCodeAt(i + 2);
		var encodedCharIndex1 = byte1 >> 2;
		var encodedCharIndex2 = ((byte1 & 3) << 4) | (byte2 >> 4);
		var encodedCharIndex3 = ((byte2 & 15) << 2) | (byte3 >> 6);
		var encodedCharIndex4 = byte3 & 63;
		if(isNaN(byte2))
		{
			encodedCharIndex3 = encodedCharIndex4 = 64;
		} else if (isNaN(byte3)) {
			encodedCharIndex4 = 64;
		}
		outputArray.push(base64Chars.charAt(encodedCharIndex1));
        outputArray.push(base64Chars.charAt(encodedCharIndex2));
        outputArray.push(base64Chars.charAt(encodedCharIndex3));
        outputArray.push(base64Chars.charAt(encodedCharIndex4));
	}
	return outputArray.join('');
}


    function stripSpaces(string)
{
    if(string.length == 0) return string;
    while(string.charAt(0) == ' ') string = string.substring(1, string.length);
    while(string.charAt(string.length - 1) == ' ') string = string.substring(0, string.length - 1);
    return string;
}


function getCookieValue(name)
{
    var cookieArray = document.cookie.split(';');
    for(var i = 0; i <= (cookieArray.length - 1); i++) 
    {
        var cookieItem = stripSpaces(cookieArray[i]);
        if(cookieItem.indexOf(name) == 0)
            return cookieItem.substring(name.length + 1, cookieItem.length);
    }
    return null;
}


function setCookie(name, value, numDays)
{
    var expireDate = new Date();
    expireDate.setTime(expireDate.getTime() + (numDays * 24 * 60 * 60 * 1000));
    var cookieString = stripSpaces(name)
        + '=' + stripSpaces(value);
        + '; expires=' + expireDate.toGMTString()
        + '; path=/';
    document.cookie = cookieString;
}


function setSessionCookie(name, value)
{
    var cookieString = stripSpaces(name)
        + '=' + stripSpaces(value);
        + '; path=/';
    document.cookie = cookieString;
}

function removeCookie(name)
{
    setCookie(name, '', -1, false);
}

    function generateRandomNumericString(length)
{
    var output = '';
    for(var i = 0; i <= (length - 1); i++) 
    {
        output += (Math.random() * 10).toString().charAt(0);
    }
    return output;
}

    

APIParameter.prototype.clone = function()
{
    var newParam = new APIParameter(this.unifiedName, this.usableNames, this.value, this.isUsedForSilentMode, this.URLName);
    newParam.dataType = this.dataType;
    newParam.populatingExpression = this.populatingExpression;
    newParam.isSentToServer = this.isSentToServer;
    newParam.specificity = this.specificity;
    return newParam;
}


APIParameter.prototype.getLength = function()
{
    if(this.value.constructor == Array) return this.value.length;
    return 1;
}


APIParameter.prototype.padToLength = function(length)
{
    if(this.value.constructor == Array)
    {
        for(var i = this.value.length; i <= (length - 1); i++) 
        {
            if(this.dataType == 'STRING_OR_ARRAY') this.value.push('');
            if(this.dataType == 'INTEGER_OR_ARRAY' || this.dataType == 'FLOAT_OR_ARRAY') this.value.push(0);
            if(this.dataType == 'BOOLEAN_OR_ARRAY') this.value.push(false);
        }
    }
}


APIParameter.prototype.canSplit = function()
{
    return (this.value.constructor == Array && this.value.length > 1);
}


APIParameter.prototype.split = function()
{
    if(!this.canSplit()) return [this.clone()];
    var newParam1 = this.clone();
    var newParam2 = this.clone();
    var splitIndex = Math.floor(this.value.length /  2);
    newParam1.value = this.value.slice(0, splitIndex);
    newParam2.value = this.value.slice(splitIndex);
    return [newParam1, newParam2];
}

APIParameters.prototype.clone = function()
{
    var newParams = new APIParameters();
    newParams.paramMap = new Object(); 
    
    for(paramName in this.paramMap)
    {
        newParams.paramMap[paramName] = this.paramMap[paramName].clone();
    }
    return newParams;
}

APIParameters.prototype.getMaxItemSpecificArrayLength = function()
{
    var maxArrayLength = 0;
    for(var iter = this.iterator(); iter.hasNext(); )
    {
        var param = iter.next();
        var currentLength = param.getLength();
        if(currentLength > maxArrayLength && param.specificity == 'ITEM') maxArrayLength = currentLength;
    }
    return maxArrayLength;
}


APIParameters.prototype.normalizeItemSpecificArrayLengths = function()
{
    var maxArrayLength = this.getMaxItemSpecificArrayLength();
    for(var iter = this.iterator(); iter.hasNext(); )
    {
        var param = iter.next();
        if(param.specificity == 'ITEM') param.padToLength(maxArrayLength);
    }
}


APIParameters.prototype.canSplit = function()
{
    for(var iter = this.iterator(); iter.hasNext(); )
    {
        var param = iter.next();
        if(param.specificity == 'ITEM' && param.canSplit()) return true;
    }
    return false;
}


APIParameters.prototype.split = function()
{
    if(!this.canSplit()) return [this.clone()];
    var newParams1 = this.clone();
    var newParams2 = this.clone();
    for(paramName in newParams1.paramMap)
    {
        var param = newParams1.paramMap[paramName]
        if(param.specificity == 'ITEM' && param.canSplit())
        {
            var splitParamArray = param.split();
            newParams1.paramMap[paramName] = splitParamArray[0];
            newParams2.paramMap[paramName] = splitParamArray[1];
        }
    }
    return [newParams1, newParams2];
}


APIParameters.prototype.convertToSilentMode = function()
{
    this.getParameterByName('akMode').value = 'SILENT';
    
}


function splitApiParametersForUrlLengthLimit(apiParams)
{
    var outputArray = new Array;
    
    var queryStringLengthLimit = 2000;
    
    if(apiParams.toQueryString().length <= queryStringLengthLimit) return [apiParams];
    apiParams.normalizeItemSpecificArrayLengths();
    var inputArray = [apiParams]; 
    
    var discardedObjects = new Array;
    
    for(var i = 0; i < 10000; i++) 
    {
        if(inputArray.length == 0) break;
        var currentParams = inputArray.pop();
        if(currentParams.toQueryString().length <= queryStringLengthLimit) 
        {
            outputArray.push(currentParams);
            continue;
        }
        if(!currentParams.canSplit())
        {
            discardedObjects.push(currentParams);
            continue; 
        }
        var splitArray = currentParams.split();
        if(splitArray.length == 1) continue; 
        for(var j = 0; j <= (splitArray.length - 1); j++)
        {
            if(splitArray[j].toQueryString().length <= queryStringLengthLimit)
            {
                outputArray.push(splitArray[j]); 
            } else {
                inputArray.push(splitArray[j]); 
            }
        }
    }
    
    if(outputArray.length > 1)
    {
        for(var i = 1; i <= (outputArray.length - 1); i++) 
        {
            outputArray[i].convertToSilentMode();
        }
    }
    
    if(outputArray.length > 0)
    {
        var totalTruncatedItems = 0;
        for(var i = 0; i <= (discardedObjects.length - 1); i++)
            totalTruncatedItems += discardedObjects[i].getMaxItemSpecificArrayLength();
        for(var i = 1; i <= (outputArray.length - 1); i++)
            totalTruncatedItems += outputArray[i].getMaxItemSpecificArrayLength();
        outputArray[0].getParameterByName('akItemsTruncated').value = totalTruncatedItems;
    }
    return outputArray;
}


function truncateApiParametersForUrlLengthLimit(apiParams)
{
    var paramsArray = splitApiParametersForUrlLengthLimit(apiParams);
    
    if(paramsArray.length > 0) return paramsArray[0];
}
    







function getQueryVariable(name)
{
    var queryTokens = window.location.search.substring(1).split("&");
    for(var i = 0; i <= (queryTokens.length - 1); i++) 
    {
        var nameAndValue = queryTokens[i].split("=");
        if(nameAndValue[0].toLowerCase() == name.toLowerCase())
        {
            if(nameAndValue.length == 1) return '';
            return nameAndValue[1];
        }
    }
    return null;
}


function getParamValueFromQueryString(paramName)
{
    paramName = paramName.toLowerCase();
    var queryValue = getQueryVariable(paramName);
    if(queryValue != null)
    {
        setSessionCookie(paramName, queryValue);
        return queryValue;
    }
    return null; 
}

function getParamValueFromCookie(paramName)
{
    return getCookieValue(paramName);
}

function getParamValueFromJSVar(paramName)
{
    if(variableIsDefined(paramName))
    {
        return eval('window.' + name);
    }
    return null;
}

function getParamValueFromHTMLHidden(paramName)
{
    var paramFormField = null;
    var paramFormFieldArray = document.getElementsByName(name);
    if(paramFormFieldArray != null && paramFormFieldArray.length > 0)
        paramFormField = paramFormFieldArray[paramFormFieldArray.length - 1];
    if(paramFormField == null) var paramFormField = document.getElementById(name);
    if(paramFormField != null && paramFormField.value !== undefined)
    {
        return paramFormField.value;
    } else {
        return null;
    }
}

function getDefaultTarget()
{
    var locationObj = window.top.location;
    var url = "";
    
    
    if(locationObj.href) {
        url = locationObj.href.toString()
    } else {
        url = locationObj.toString();
    }
    
    if(url.length >= 4 && url.substring(0, 4) != 'http') return '';
    return url;
}


function getKeywords()
{
    
    var apiVarsArray = new Array;
    var varPrefixArray = new Array;
    
    var includeFunctionsArray = new Array;
    
        if(variableIsDefined('_akListPrice'))
        {
            apiVarsArray.push(_akListPrice);
            
                varPrefixArray.push('_akListPrice:');
            
            includeFunctionsArray.push(new Function('val', 'return true;'));
        }
    
        if(variableIsDefined('_akOurPrice'))
        {
            apiVarsArray.push(_akOurPrice);
            
                varPrefixArray.push('_akOurPrice:');
            
            includeFunctionsArray.push(new Function('val', 'return true;'));
        }
    
        if(variableIsDefined('akExclude'))
        {
            apiVarsArray.push(akExclude);
            
                varPrefixArray.push('xcl:');
            
            includeFunctionsArray.push(new Function('val', 'return val;'));
        }
    
        if(variableIsDefined('akKeywords'))
        {
            apiVarsArray.push(akKeywords);
            
                varPrefixArray.push(''); 
            
            includeFunctionsArray.push(new Function('val', 'return true;'));
        }
    
        if(variableIsDefined('akThumbnailHeight'))
        {
            apiVarsArray.push(akThumbnailHeight);
            
                varPrefixArray.push('tnh:');
            
            includeFunctionsArray.push(new Function('val', 'return val > 0;'));
        }
    
        if(variableIsDefined('akThumbnailUrl'))
        {
            apiVarsArray.push(akThumbnailUrl);
            
                varPrefixArray.push('tn:');
            
            includeFunctionsArray.push(new Function('val', 'return val.length > 0;'));
        }
    
        if(variableIsDefined('akThumbnailWidth'))
        {
            apiVarsArray.push(akThumbnailWidth);
            
                varPrefixArray.push('tnw:');
            
            includeFunctionsArray.push(new Function('val', 'return val > 0;'));
        }
    
    var currentKeywordStringIndex = 0;
    
    var packedStringArray = new Array;
    
    while(true && currentKeywordStringIndex < 1000) 
    {
        
        var currentPackedString = '';
        
        for(var i = 0; i <= (apiVarsArray.length - 1); i++) 
        {
            var currentVarValue = undefined;
            if(apiVarsArray[i].constructor != Array && currentKeywordStringIndex == 0)
            {
                currentVarValue = apiVarsArray[i];
            } else if(apiVarsArray[i].constructor == Array && apiVarsArray[i].length > currentKeywordStringIndex) {
                
                currentVarValue = apiVarsArray[i][currentKeywordStringIndex];
            }
            if(currentVarValue != undefined && includeFunctionsArray[i](currentVarValue))
            {
                currentKeyword = varPrefixArray[i] + currentVarValue;
                if(currentPackedString.length > 0) currentPackedString += ' ';
                currentPackedString += currentKeyword;
            }
        }
        if(currentPackedString.length > 0)
        {
            packedStringArray.push(currentPackedString);
        } else {
            break;
        }
        currentKeywordStringIndex++;
    }
    return packedStringArray;
}


    

function handleShortcuts(event)
{
    if(!event) event = window.event;
    
    var character = (event.ctrlKey) ? 'ctrl' : String.fromCharCode(event.keyCode).toLowerCase();
    window.akCharSequence += character;
    if(window.akCharSequence == 'ctrlak') setUpDebugConsole();
    if(window.akCharSequence == 'ctrl' || window.akCharSequence == 'ctrla') return;
    window.akCharSequence = '';
}

function setUpShortcuts()
{
    window.akCharSequence = '';
    if(document.addEventListener)
    {
        document.addEventListener('keydown', handleShortcuts, false);
    } else if(document.attachEvent) {
        document.attachEvent('onkeydown', handleShortcuts);
    } else {
        document['onkeydown'] = handleShortcuts;
    }
}

function getWindowSize()
{
    if(typeof(window.innerWidth) == 'number')
    {
        var windowWidth = window.innerWidth;
        var windowHeight = window.innerHeight;
    } else if(document.documentElement && document.documentElement.clientWidth) {
        var windowWidth = document.documentElement.clientWidth;
        var windowHeight = document.documentElement.clientHeight;
    }
    return [windowWidth, windowHeight];
}

var AK_NUM_LOADING_DOTS = 8;

function createLoadingMessage()
{
    var loadingDiv = document.createElement('div');
    var windowSize = getWindowSize();
    var divLeft = (windowSize[0] / 2) - 50;
    var divTop = (windowSize[1] / 2) - 25;
    setStyleAttribute(loadingDiv, 'background:white; border:2px solid #999999; position:absolute; z-index:99; display:block; padding:10px; left:' + divLeft + 'px; top:' + divTop + 'px; text-align:center;');
    loadingDiv.setAttribute('id', 'akLoadingMessageDiv');
    var loadingBarHTML = '';
    for(var i = 0; i < AK_NUM_LOADING_DOTS; i++)
    {
        loadingBarHTML += '<span id = "loadingDot' + i + '">&bull;</span>';
    }
    loadingDiv.innerHTML = '<span style = "color:#999999;"><span style = "font-size:10pt;">One moment...</span><br><span style = "font-size:20pt;">' + loadingBarHTML + '</span></span>';
    document.body.appendChild(loadingDiv);
    window.currentCenterLoadingDot = -2;
    setLoadingDotColors();
}

function setLoadingDotColors()
{
    for(var i = 0; i < AK_NUM_LOADING_DOTS; i++)
    {
        var currentDot = document.getElementById('loadingDot' + i);
        if(currentDot == null) continue;
        currentDot.style.color = '#FFFFFF';
    }
    for(var i = (window.currentCenterLoadingDot - 2); i < (window.currentCenterLoadingDot + 3); i++)
    {
        var currentDot = document.getElementById('loadingDot' + i);
        if(currentDot == null) continue;
        var relativeDotPosition = (i - window.currentCenterLoadingDot);
        if(relativeDotPosition == 0) currentDot.style.color = '#999999';
        if(Math.abs(relativeDotPosition) == 1) currentDot.style.color = '#BBBBBB';
        if(Math.abs(relativeDotPosition) == 2) currentDot.style.color = '#DDDDDD';
    }
    window.currentCenterLoadingDot++;
    if(window.currentCenterLoadingDot == AK_NUM_LOADING_DOTS + 2) window.currentCenterLoadingDot = -2;
    var loadingDiv = document.getElementById('akLoadingMessageDiv');
    if(loadingDiv != null && loadingDiv.style.display != 'none')
        setTimeout('setLoadingDotColors();', 100);
}


function setStyleAttribute(element, cssText)
{
    if(element.style && element.style.setAttribute)
    {
        
        element.style.setAttribute('cssText', cssText);
    } else {
        
        element.setAttribute('style', cssText);
    }
}

function setUpDebugConsole()
{
    createLoadingMessage();
    setSessionCookie('akdebug', 'true');
    
    var debugConsoleUrl = 'http://api.aggregateknowledge.com/debug/'
        + generateRandomNumericString(7)
        + '.js';
    attachScript(debugConsoleUrl);
}



    
    function spliceArrays(array1, array2)
    {
        if(array1.length == 0) return array2;
        if(array2.length == 0) return array1;
        var delimiter = '[DELIMITER]';
        var array1AsString = array1.join(delimiter);
        var array2AsString = array2.join(delimiter);
        var unifiedString = array1AsString + delimiter + array2AsString;
        return unifiedString.split(delimiter);
    }

    
    function isProbablyAFormField(obj)
    {
        if(typeof(obj) != 'object') return false;
        
        var probablyAFormFieldRating = 0;
        
        if(obj.form !== undefined) probablyAFormFieldRating++;
        if(obj.tabIndex !== undefined) probablyAFormFieldRating++;
        if(obj.focus !== undefined) probablyAFormFieldRating++;
        if(obj.value !== undefined) probablyAFormFieldRating++;
        if(obj.type !== undefined) probablyAFormFieldRating++;
        
        return (probablyAFormFieldRating >= 3);
        
    }

    function variableIsDefined(varName)
    {
        var varReference = eval('window.' + varName);
        if(varReference == undefined) return false;
        if(isProbablyAFormField(varReference)) return false;
        
        if(varReference.length !== undefined
            && varReference[0] !== undefined
            && isProbablyAFormField(varReference[0]))
            return false;
        return true;
    }

    function getBoxUrl(apiParams)
    {
        var boxUrl = 'http://api.aggregateknowledge.com/2007/01/15/results/'
            + generateRandomNumericString(7)
            + '.js'
            + apiParams.toQueryString();
        return boxUrl;
    }

    function submitApiData(apiParams)
    {
        
        var boxUrl = getBoxUrl(apiParams);
        log('Box URL: ' + boxUrl);
        attachScript(boxUrl);
        
    }

    function attachScript(scriptUrl)
    {
        var boxScript = document.createElement('script');
        boxScript.setAttribute('src', scriptUrl);
        document.getElementsByTagName('head')[0].appendChild(boxScript);
    }

    
    function log(logString)
    {
        if(window.akDebugLogText != null)
        {
            var timeStampString = 'Log output at ' + (new Date()).toString();
            window.akDebugLogText += timeStampString + ':\n';
            window.akDebugLogText += logString + '\n\n';
        }
    }

    
    function addProtectiveStylingToAnchor(apiParams)
    {
        try 
        {
            var akAnchor = document.getElementById(apiParams.getParameterByName('akAnchorId').getValueAsString());
            if(akAnchor == null) return;
            akAnchor.style.textDecoration = 'none';
            akAnchor.style.fontWeight = 'normal';
        } catch(e) {}
    }

    
    function akExecute()
    {
        var params = buildApiParameters();
        params = truncateApiParametersForUrlLengthLimit(params);
        if(params.getParameterByName('akDebug').value) setUpDebugConsole();
        window.akDebugLogText = '';
        log(params.toString());
        addProtectiveStylingToAnchor(params);
        submitApiData(params);
        setUpShortcuts();
    }

    akExecute();

} catch(akException) {
    if(window.akDebug || getQueryVariable('akdebug') == 'true')
    {
        
        throw(akException);
    } else {
        
        try
        {
            var queryString = 'pageurl=' + window.top.location.toString();
            if(akException.message) queryString += '&message=' + akException.message;
            if(akException.name) queryString += '&name=' + akException.name;
            if(akException.description) queryString += '&description=' + akException.description;
            if(akException.number) queryString += '&number=' + akException.number;
            var url = 'http://api.aggregateknowledge.com/jserror/'
                + generateRandomNumericString(7)
                + '.html'
                + '?' + queryString;
            var akErrorIframe = document.createElement('iframe');
            akErrorIframe.setAttribute('border', '0');
            akErrorIframe.setAttribute('frameborder', '0');
            akErrorIframe.setAttribute('width', '0');
            akErrorIframe.setAttribute('height', '0');
            akErrorIframe.setAttribute('scrolling', 'no');
            akErrorIframe.setAttribute('src', url);
            
            var akAnchor = document.getElementById('akAPI');
            if(akAnchor == null && window.akAnchorId)
               akAnchor = document.getElementById(window.akAnchorId);
            if(akAnchor != null)
            {
                akAnchor.appendChild(akErrorIframe);
            }
        } catch(e) {  }
    }
}
