/*
******************************************************************************
     File: gciUSATv*.js                                                                                                                                                                                                             
  Version: see gcion_version, below
Copyright: Copyright (c) 2006, Gannett Inc. All rights reserved.    
******************************************************************************
*/

/* ==================================================================== */
/* Global settings                                                      */
/* ==================================================================== */
var gcion_rdb_cookie  = "RDB";
var gcion_service     = "gcion.ashx";
var gcion_site_code   = "reg.usatoday.com";
var gcion_url         = "http://usatoday.app.ur.gcion.com/";
var gcion_usat_cookie = "zagCookie";
var gcion_version     = "1.0.2r-USAT2007516";

/* ==================================================================== */
/* Defines the GCION global namespace                                   */
/* ==================================================================== */

var GCION = window.GCION || {};

/* ==================================================================== */
/* Defines namespace function                                           */
/* ==================================================================== */

/// <summary>
/// Gets the specified namespace or creates it if it does not exist.
/// </summary>
/// <param name="nameSpace">The representation of the desired namespace.</param>
/// <remarks>
/// GCION.namespace("property.package");
/// GCION.namespace("GCION.property.package");
///
/// Either of the above would create GCION.property, then
/// GCION.property.package.
/// </remarks>
/// <returns>A reference to the namespace object.</returns>
GCION.namespace = function(nameSpace)
{
  if (!nameSpace || !nameSpace.length)
    return null;

  var levels = nameSpace.split(".");
  var currentNamespace = GCION;

  // GCION is implied, so it is ignored if it is included
  for (var i = (levels[0] == "GCION") ? 1 : 0; i < levels.length; ++i)
  {
    currentNamespace[levels[i]] = currentNamespace[levels[i]] || {};
    currentNamespace = currentNamespace[levels[i]];
  }

  return currentNamespace;
};

/* ==================================================================== */
/* Register namespaces                                                  */
/* ==================================================================== */

GCION.namespace("Data");
GCION.namespace("Cookies");
GCION.namespace("Utils");
GCION.namespace("Sites");
GCION.namespace("Callback");

/* ==================================================================== */
/* Defines the GCION data object                                        */
/* ==================================================================== */

/// <summary>
/// Provides a class that defines the data structure of a GCION cookie. 
/// </summary>
GCION.Data.GCION = function() {};
GCION.Data.GCION.prototype =
{
  // GCION data
  GcionId: null,
  CookieVersion: null,
  CreationDate: null,
  RegistrationStatus: null,
  Sessions: null,
  
  // ZAITO data
  ZipCode: null,
  Gender: null,
  Occupation: null,
  Industry: null,
  CompanySize: null,
  YearOfBirth: null,
  Country: null,
  OriginatingSite: null,
  Email: null
};

/* ==================================================================== */
/* Defines the Callback object                                          */
/* ==================================================================== */
GCION.Callback.Add = function (handler) {
    GCION.Callback.Handlers.push(handler);
  };
GCION.Callback.Invoke = function () {
  var fns = GCION.Callback.Handlers;
  for (var n in fns) {
    fns[n].apply(GCION, arguments);
  }
};
if (!GCION.Callback.Handlers) GCION.Callback.Handlers= [];


/* ==================================================================== */
/* Defines the RDB data class                                           */
/* ==================================================================== */

/// <summary>
/// Provides a class that defines the data structure of a RDB cookie. 
/// </summary>
GCION.Data.RDB = function() {};
GCION.Data.RDB.prototype =
{
  Publisher: null,
  Version: null,
  ZipCode: null,
  ZipCodeExt: null,
  Country: null,
  State: null,
  Gender: null,
  Subscriber: null,
  IncomeLow: null,
  IncomeHigh: null,
  AgeLow: null,
  AgeHigh: null,
  Trait1: null,
  Trait2: null,
  Trait3: null,
  Trait4: null,
  Trait5: null,
  Trait6: null,
  Trait7: null,
  Trait8: null
};

/* ==================================================================== */
/* Defines a generic cookie object                                      */
/* ==================================================================== */

/// <summary>
/// Provides an object for handling cookies. 
/// </summary>
GCION.Cookies.Cookie =
{
  /// <summary>
  /// Gets the value stored in the specified cookie.
  /// When domain is ambiguous, gets the longest value
  /// (which, presumably, contains the most information,
  /// and is thus the most pertinent).
  /// </summary>
  /// <param name="name">The name of the cookie.</param>
  Get : function(name)
  {
    var values= (' '+document.cookie).match(new RegExp(' '+name+'=[^;]*', 'g')) || [];
    var valLen= 0;              // length of best match, so far
    var result= null;
    for (var j= 0; j < values.length; j++)
      if (values[j].length > valLen)
      {
        valLen= values[j].length;
	    result= unescape(values[j].substring(2+name.length));
      }
	return result;
  },

  /// <summary>
  /// Sets a value that is stored in the specified cookie.
  /// </summary>
  /// <param name="name">The name of the cookie.</param>
  /// <param name="value">The value to store in the cookie.</param>
  /// <param name="expires">The expiration date of the cookie.</param>
  /// <param name="path">The path to the cookie.</param>
  /// <param name="domain">The domain name for the cookie.</param>
  /// <param name="secure">A value indicating whether the cookie is secure.</param>
  Set : function(name, value, expires, path, domain, secure)
  {
    var today = new Date();
    today.setTime(today.getTime());
    
    if (expires)
      expires = expires * 1000 * 60 * 60 * 24;

    var expirationDate = new Date(today.getTime() + (expires));
    
    document.cookie = name + '=' + value +
      ((expires) ? ';expires=' + expirationDate.toGMTString() : '') +
      ((path) ? ';path=' + path : '\/' ) +
      ((domain) ? ';domain=' + domain : GCION.Utils.Data.GetDomainName()) +
      ((secure) ? ';secure' : '');
  },
  
  /// <summary>
  /// Removes the specified cookie.
  /// </summary>
  /// <param name="name">The name of the cookie.</param>
  /// <param name="path">The path to the cookie.</param>
  /// <param name="domain">The domain name for the cookie.</param>
  Remove : function(name, path, domain)
  {
	  if (this.Get(name))
	  {
	    document.cookie = name + '=' +
		    ((path) ? ';path=' + path : '\/') +
			  ((domain) ? ';domain=' + domain : GCION.Utils.Data.GetDomainName() ) +
			  ';expires=Thu, 01-Jan-1970 00:00:01 GMT';
	  }
  },

  /// <summary>
  /// Gets a value indicating if the cookie exists.
  /// </summary>
  /// <param name="cookieName">The name of the cookie.</param>
  Exists : function(cookieName)
  {
    var cookieString = document.cookie;
    var cookieSet = cookieString.split(';');
    var setSize = cookieSet.length;
    var cookiePieces = "";
    var cookieData = "";
    
    for (var x = 0; ((x < setSize) && (cookieData == "")); x++)
    {
      cookiePieces = cookieSet[x].split('=');
      
      if (cookiePieces[0].substring(0, 1) == ' ')
        cookiePieces[0] = cookiePieces[0].substring(1, cookiePieces[0].length);
      
      if (cookiePieces[0] == cookieName)
        return true;
    }
    
    return false;
  }
};

/* ==================================================================== */
/* Defines the RDB object                                               */
/* ==================================================================== */

/// <summary>
/// Provides an object for handling RDB cookies. 
/// </summary>
GCION.Cookies.RDB =
{
  /// <summary>
  /// Gets a RDB data object filled with data from the specified cookie.
  /// </summary>
  /// <param name="cookieName">The name of the cookie.</param>
  GetData : function(cookieName)
  {       
    // get the cookie
    var cookieData = GCION.Cookies.Cookie.Get(cookieName);
       
    // initialize RDB data object
    var cookie = new GCION.Data.RDB();

    // set properties values
    cookie.Publisher = this.ToInt(cookieData.substring(0, 2));
    cookie.Version = this.ToInt(cookieData.substring(2, 4));
    cookie.ZipCode = this.ToInt(cookieData.substring(4, 10));
    cookie.ZipCodeExt = this.ToInt(cookieData.substring(10, 14));
    cookie.Country = this.GetString(cookieData.substring(14, 18));
    cookie.Gender = this.ToInt(cookieData.substring(18, 20));
    cookie.Subscriber = this.ToInt(cookieData.substring(20, 22));
    cookie.IncomeLow = this.ToInt(cookieData.substring(22, 24));
    cookie.IncomeHigh = this.ToInt(cookieData.substring(24, 26));
    cookie.AgeLow = this.ToInt(cookieData.substring(26, 28));
    cookie.AgeHigh = this.ToInt(cookieData.substring(28, 30));
    cookie.Trait1 = this.ToInt(cookieData.substring(30, 32));
    cookie.Trait2 = this.ToInt(cookieData.substring(32, 34));
    cookie.Trait3 = this.ToInt(cookieData.substring(34, 36));
    cookie.Trait4 = this.ToInt(cookieData.substring(36, 38));
    cookie.Trait5 = this.ToInt(cookieData.substring(38, 40));
    cookie.Trait6 = this.ToInt(cookieData.substring(40, 42));
    cookie.Trait7 = this.ToInt(cookieData.substring(42, 44));
    cookie.Trait8 = this.ToInt(cookieData.substring(44, 46));
                    
    return cookie;
  },
  
  /// <summary>
  /// Converts a hexadecimal value to a integer value.
  /// </summary>
  /// <param name="hex">The hexadecimal value to convert.</param>
  ToInt : function(hex)
  {
    return parseInt(hex, 16);
  },
  
  
  /// <summary>
  /// Converts the specified integer to a character.
  /// </summary>
  /// <param name="chr">The integer value to convert.</param>
  ToChar : function(integer)
  {
    return String.fromCharCode(integer);
  },
  
  /// <summary>
  /// Gets a string for the specified hexadecimal value.
  /// </summary>
  /// <param name="integer">The hexadecimal value to get as a string.</param>
  GetString : function(hex)
  {
    var str = "";
  
    for (var i = 0; i < hex.length; i+=2)
    {
      if (i != hex.length)
      {
        var value = hex.charAt(i) + hex.charAt(i + 1);
        str += this.ToChar(this.ToInt(value));
      }
    }
    
    return str;
  }
};

/* ==================================================================== */
/* Defines the Data object                                              */
/* ==================================================================== */

/// <summary>
/// Provides an object containing data handling utilities. 
/// </summary>
GCION.Utils.Data =
{  
  /// <summary>
  /// Gets a value indicating if the specified object is null or empty.
  /// </summary>
  /// <param name="object">The object to determine it is null or empty.</param>
  IsNullOrEmpty : function(object)
  {
    if (object == null || (object == '' && 'number' != typeof object) || object.length == 0 || object == "null" || object == "undefined")
      return true;
    else
      return false;
  },
  
  /// <summary>
  /// Gets the top level domain name for the current site.
  /// </summary>
  GetDomainName : function()
  {
    var domain = window.location.host;
    var match = /([\w-]+)+\.[a-zA-Z]{2,3}$/i.exec(domain);
    return match ?"." + match[0] :domain;
  },
  
  /// <summary>
  /// Gets the version number of the USAT GCION library.
  /// </summary>
  GetVersion : function()
  {
    return gcion_version;
  },
  
  /// <summary>
  /// Gets the year of birth for the specified age.
  /// </summary>
  /// <param name="age">The age of the user.</param>
  GetYob : function(age)
  {
    var today = new Date();         
    return today.getFullYear() - age;
  },
  
  /// <summary>
  /// Gets the GCION URL and appends the specified query string parameters.
  /// </summary>
  /// <param name="paramsString">A list of query string parameters to append.</param>
  GetGcionUrl : function(paramsString)
  {
    // define the GCION URL
    if (gcion_url.charAt(gcion_url.length - 1) != "/")
      var url = gcion_url + "/" + gcion_service;
    else
      var url = gcion_url + gcion_service;

    // append query character to URL if a query string was passed
    if (!this.IsNullOrEmpty(paramsString))
      url += "?" + paramsString + "&Path=" + escape(this.GetDomainName())+"&CacheDefeat="+new Date().getTime();

    return url;
  }
};

/* ==================================================================== */
/* Defines the Include object                                           */
/* ==================================================================== */

// set global variable used by Include object
var gcion_included_files = new Array();

/// <summary>
/// Provides an object containing script include utilities. 
/// </summary>
GCION.Utils.Include =
{  
  /// <summary>
  /// Appends a JavaScript include to the DOM.
  /// </summary>
  /// <param name="scriptFilename">The name of the JavaScript file to include.</param>
  /// <param name="identifier">The unique identifier for the JavaScript file to include.</param>
  ToDom : function(scriptFilename, identifier)
  {
    // define DOM elements
    var htmlDoc = document.getElementsByTagName('head').item(0);
    var scriptTag = document.createElement('script');
      
    // set tag attributes
    scriptTag.setAttribute('language', 'javascript');
    scriptTag.setAttribute('type', 'text/javascript');
    scriptTag.setAttribute('src', scriptFilename);
    
    // set identifier if specified
    if (!GCION.Utils.Data.IsNullOrEmpty(identifier))
      scriptTag.setAttribute('id', identifier);
      
    // append tag to DOM
    htmlDoc.appendChild(scriptTag);
      
    return false;
  },

  /// <summary>
  /// Dynamically includes a JavaScript file only once per page.
  /// </summary>
  /// <param name="scriptFilename">The name of the JavaScript file to include.</param>
  /// <param name="identifier">The unique identifier for the JavaScript file to include.</param>
  Once : function(scriptFilename, identifier)
  {
    if (!this.InArray(scriptFilename, gcion_included_files))
    {
      gcion_included_files[gcion_included_files.length] = scriptFilename;
      this.ToDom(scriptFilename, identifier);
    }
  },
  
  /// <summary>
  /// Appends a JavaScript include inline to the DOM.
  /// </summary>
  /// <param name="scriptFilename">The name of the JavaScript file to include.</param>
  /// <param name="identifier">The unique identifier for the JavaScript file to include.</param>
  Inline : function(scriptFilename, identifier)
  {
    // get the user agent
    var agent = navigator.userAgent.toLowerCase();
  
    if (agent.indexOf("msie") != -1)
      document.write('<script type="text/javascript" src="' + scriptFilename + '"></script>');
    else
      this.ToDom(scriptFilename, identifier);
  },

  /// <summary>
  /// Determines if the JavaScript file was already included on the page.
  /// </summary>
  /// <param name="needle">The name of the JavaScript include file.</param>
  /// <param name="haystack">An array containing a collection of included JavaScript files.</param>
  InArray : function(needle, haystack)
  {
    for (var i = 0; i < haystack.length; i++)
    {
      if (haystack[i] == needle)
        return true;
    }

    return false;
  }
};

/* ==================================================================== */
/* Defines the Request object                                           */
/* ==================================================================== */

/// <summary>
/// Provides an object for obtaining query string parameters from an HTTP
/// request. 
/// </summary>
GCION.Utils.Request = function(querystring)
{
	this.params = new Object();
	this.QueryString = GCION.Utils.GetRequest;
	
	if (querystring == null)
		querystring = location.search.substring(1, location.search.length);

	if (querystring.length == 0) return;

	querystring = querystring.replace(/\+/g, ' ');
	var args = querystring.split('&');
	
  // split out each name/value pair
	for (var i = 0; i < args.length; i++)
	{
		var value;
		var pair = args[i].split('=');
		var name = unescape(pair[0]);

		if (pair.length == 2)
			value = unescape(pair[1]);
		else
			value = name;
		
		this.params[name] = value;
	}
};

GCION.Utils.GetRequest = function(key, defaultValue)
{
	if (defaultValue == null) defaultValue = null;
	
	var value = this.params[key];
	if (value == null) value = defaultValue;
	
	return value;
};

/* ==================================================================== */
/* Defines the USAT site object                                         */
/* ==================================================================== */

/// <summary>
/// Provides an object for handling events for USAT. 
/// </summary>
GCION.Sites.USAT =
{
  /// <summary>
  /// Captures ZAGITO/O data from the specified GCION data object.
  /// </summary>
  /// <param name="gcion">A defined GCION data object.</param>
  CaptureZagito : function(gcion)
  { 
    // set the required query string parameters
    var querystring = "q=2&NoCookie=1&GCIONID=" + gcion.GcionId +
      "&YOB=" + gcion.YearOfBirth +
      "&Gender=" + gcion.Gender +
      "&Country=" + gcion.Country.toLowerCase() +
      "&OriginatingSite=" + escape(gcion_site_code);
      
    // set optional values
    if (!GCION.Utils.Data.IsNullOrEmpty(gcion.ZipCode))
    {
      if (gcion.Country.toLowerCase() == "us")
        querystring += "&Zip=" + gcion.ZipCode;
    }
  
    if (!GCION.Utils.Data.IsNullOrEmpty(gcion.Occupation)) querystring += "&Occupation=" + gcion.Occupation;
    if (!GCION.Utils.Data.IsNullOrEmpty(gcion.Industry)) querystring += "&Industry=" + gcion.Industry;
    if (!GCION.Utils.Data.IsNullOrEmpty(gcion.CompanySize)) querystring += "&CompanySize=" + gcion.CompanySize;
      
    // ZAGITO/O the user
    GCION.Utils.Include.Once(GCION.Utils.Data.GetGcionUrl(querystring));
  },

  /// <summary>
  /// Converts a USAT cookie to a GCION cookie.
  /// </summary>
  ConvertToGCION : function()
  {
    // get existing ZAGITO/O data from RDB cookie
    if (GCION.Cookies.Cookie.Exists(gcion_rdb_cookie))
    {
      // GCION.Utils.Include.Once(GCION.Utils.Data.GetGcionUrl("q=3&NoCookie=1"));
      // setTimeout("GCION.Sites.USAT.GetZagito()", 500);
      this.GetZagito(new GCION.Data.GCION());
    }
    else if (GCION.Cookies.Cookie.Exists(gcion_usat_cookie))
    {
      // get the USAT cookie
      var usatCookie = GCION.Cookies.Cookie.Get(gcion_usat_cookie);
    
      // only get data from version 3 of USAT ZAGITO cookie
      if (usatCookie.charAt(0) == 3)
      {
        // GCION.Utils.Include.Once(GCION.Utils.Data.GetGcionUrl("q=3&NoCookie=1"));
        // setTimeout("GCION.Sites.USAT.GetZagito()", 500); 
        this.GetZagito(new GCION.Data.GCION());
      }
    }
  },

  /// <summary>
  /// Gets a GCION cookie object filled with USAT ZAGITO data.
  /// </summary>
  GetZagito : function(cookie)
  {
    if (GCION.Cookies.Cookie.Exists(gcion_rdb_cookie) && GCION.Cookies.Cookie.Exists(gcion_usat_cookie))
    {    
      // get the RDB cookie
      var rdbCookie = GCION.Cookies.RDB.GetData(gcion_rdb_cookie);
      
      // set properties
      cookie.Gender= 3-rdbCookie.Gender;

      cookie.Country = rdbCookie.Country.toString().toLowerCase();
      cookie.ZipCode = rdbCookie.ZipCode;
      cookie.YearOfBirth = GCION.Utils.Data.GetYob((rdbCookie.AgeLow + rdbCookie.AgeHigh) / 2);
      
      // override with usat cookie
      // (required -- usat cookie has GCIONID)
      // then capture ZAGITO/O data
      this.GetZagito(cookie);
    }
  },
  
  /* short property names -> long property names */
  PropName : {
    cou: 'Country',
    fem: 'Gender',
    gci: 'GcionId',
    gdt: '',
    ind: 'Industry',
    job: 'Occupation',
    sav: '',
    sit: '',
    siz: 'CompanySize',
    yob: 'YearOfBirth',
    zip: 'ZipCode'
  },
  
  /* names whose values need to be encoded as names */
  NameName : { 
    cou: 1,
    gci: 1,
    key: 1,
    sit: 1
  },
  
  /// <summary>
  /// Gets a GCION cookie object filled with USAT ZAITO data.
  /// </summary>
  GetZagito : function(cookie)
  {
    if (GCION.Cookies.Cookie.Exists(gcion_usat_cookie))
    {
      // get the USAT cookie
      var usatCookie = this.ParseZagito(GCION.Cookies.Cookie.Get(gcion_usat_cookie));

      // set properties
      for (var name in usatCookie)
        if (this.PropName[name])
          switch (name)
          {
            case 'fem':
              cookie.Gender= 2-usatCookie[name];
              break;
              
            default:
              cookie[this.PropName[name]]= usatCookie[name];
          }
        
      // capture ZAGITO/O data
      if (!GCION.Utils.Data.IsNullOrEmpty(cookie))
        GCION.Sites.USAT.CaptureZagito(cookie);
    }
  },

  /// <summary>
  /// Parses a USAT cookie and returns its contents as a name/value pair array.
  /// </summary>
  /// <param name="zagCookie">The contents of the USAT ZAGITO/O cookie.</param>
  ParseZagito : function(zagCookie)
  {
    zagCookie+=""
    var r = new Object();
    r.version = parseInt(zagCookie);
    if (isNaN(r.version)) return {version: 2};
    var nvps = zagCookie.split('n');
    
    for (var j= 0; j < nvps.length; j++)
    {
      var nv = nvps[j].split('v');
      if (2 == nv.length)
      {
        var nam = this.DecodeName(nv[0]);
        var val = this.NameName[nam] ? this.DecodeName(nv[1]) : this.DecodeNumber(nv[1]);
        r[nam] = val;
      }
    }
  
    return r;
  },
  
  ///<summary>
  ///returns cookie value
  ///</summary>
  EncodeZagito : function(obj) {
    var r = obj.version+' ';
    for (var nm in obj) {
      if (3 == nm.length && !GCION.Utils.Data.IsNullOrEmpty(obj[nm])) {
        var val= this.NameName[nm] ?this.EncodeName(obj[nm]) :this.EncodeNumber(obj[nm]);
        r+='n'+this.EncodeName(nm)+'v'+val
      }
    }
    return r;
  },
  
  ///<summary>
  ///Sets zagCookie
  ///<param name="obj">The zagito cookie object to be saved</param>
  SetZagito : function(obj) {
    GCION.Cookies.Cookie.Set(gcion_usat_cookie, this.EncodeZagito(obj), 3650, '/', '.usatoday.com');
  },

  /// <summary>
  /// Converts an integer value to a hexadecimal value.
  /// </summary>
  /// <param name="integer">The integer value to convert.</param>
  EncodeNumber : function(integer)
  {
    if (integer < 10) return integer;
    var result = "";
    for (var result = ""; integer; integer>>>=4)
      result = "0123456789abcdef".charAt(integer&0xf) + result;
    return result;
  },

  /// <summary>
  /// Encode sequence of characters as sequence of hexadecimal pairs
  /// </summary>
  /// <param name="name">The ascii string to encode as hex.</param>
  EncodeName : function(name)
  {
    var result = "";
    for (var i = 0; i < name.length; i++)
      result += this.EncodeNumber(name.charCodeAt(i));
    return result;
  },

  /// <summary>
  /// Converts a hexadecimal value to a number.
  /// </summary>
  /// <param name="str">The hexadecimal value to convert.</param>
  HexToNumber : function(str)
  {
    var r = new Array(str.length);
    var strs = str.split('');
    
    for (var j= 0; j < strs.length; j++)
      r[j]= '0123456789ABCDEF'.indexOf(strs[j]);

    return r;
  },

  /// <summary>
  /// Decodes a number from its hexadecimal format.
  /// </summary>
  /// <param name="number">The number to decode.</param>
  DecodeNumber : function(number)
  {
   return parseInt(number, 16);
  },

  /// <summary>
  /// Decodes a name from its hexadecimal format.
  /// </summary>
  /// <param name="name">The name to decode.</param>
  DecodeName : function(name)
  { 
    var r = '';
    for (var j= 0; j <name.length; j+=2)
      r+= String.fromCharCode(this.DecodeNumber(name.substring(j, j+2)));
    return r;
  }
};

/////////////////////////////////////////////////////////////
// allow deferred processing to continue
if (window.gciUsatLoadedCallback) gciUsatLoadedCallback();
