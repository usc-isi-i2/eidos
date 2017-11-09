
//  pop related code

var isNav4, isIE4
if (parseInt(navigator.appVersion.charAt(0)) >= 4) {
  isNav4 = (navigator.appName == "Netscape") ? true : false
  isIE4 = (navigator.appName.indexOf("Microsoft" != -1)) ? true : false
}

var CBase = 'DB'

function get_random()
{
    var ranNum= Math.round(Math.random()*4);
    return ranNum;
}

function popsurvey(base_url)
{ 
  var random_num = Math.round((Math.random()*4)+1)
  var survey_url = "//" + base_url + "/sectors/survey/Survey_default.asp"
  var myWindow = window.open(survey_url, "tinyWindow", 'width=320, height=180, scrollbars=1,status=0,alwaysLowered=yes;')
  if (!myWindow)
	  myWindow.close();
  
}


 
function ps_setCookie(name, value, expires, path, domain, secure) {
  var curCookie = name + "=" + escape(value) +
      ((expires) ? "; expires=" + expires.toGMTString() : "") + "; path=/" +
     // ((path) ? "; path=" + path : "") +
      ((domain) ? "; domain=" + domain : "") +
      ((secure) ? "; secure" : "");
  document.cookie = curCookie;
}



function ps_setcookiecollection(c_array,name,pvalue)
{ 
   var l_array = get_cookie(c_array).split("&")
   var value = ''
   var cfound = 0
   for ( i =0; i< l_array.length  ; i++ )
   {
     if( IsStrThere(l_array[i],name+'='))
        { 
          l_array[i] = name + '=' + pvalue
	      cfound = 1
        }
     value += l_array[i] + '&'
   } 
     if (cfound == 1) 
	  {
        value = Left(value, (value.length -1) )
	    ps_setCookie( c_array, value )
	  }
	 else
	  { 
		addcookie(c_array,name,pvalue)
	  }

}


function ps_getcookiecollection(c_array,name)
{
   var l_array = get_cookie(c_array).split("&")
   var value = ''
   var cfound = 0
   
   for ( i =0; i< l_array.length  ; i++ )
   {
     if( IsStrThere(l_array[i],name+'='))
        { 
          value = l_array[i].split('=') 
          return ( value[1] )
	      cfound = 1
        }
   } 

   return ''


}


function delcookiecollection(c_array,name)
{
   var l_array = get_cookie(c_array).split("&")
   var value = ''
   var cfound = 0
   for ( i =0; i< l_array.length  ; i++ )
   {
     if( IsStrThere(l_array[i],name+'='))
        { 
	      cfound = 1
        }
     else
        value += l_array[i] + '&'
   } 
     if (cfound == 1) 
	  {
        value = Left(value, (value.length -1) )
	    ps_setCookie( c_array, value )
	  }


}


function addcookie(c_array,name,pvalue)
{
  ps_setCookie(c_array, ps_getCookie(c_array)+ '&' + name + '=' + pvalue )
}

function iscookiethere(c_array,name,pvalue)
{
   var l_array = get_cookie(c_array).split("&")
   var value = ''
   var cfound = 0
   for ( i =0; i< l_array.length  ; i++ )
   {
     if( IsStrThere(l_array[i],name))
        { 
	      cfound = 1
	      alert('found ' + c_array + '-' + name)
        }
   }
     if (cfound == 1) 
        return true;
	 else
		return false;

}


//  c functions 

function isNull(a) 
 {
      return typeof a == 'object' && !a;
 }
 function isArray(a) 
 {
  return isObject(a) && a.constructor == Array;
 }


function isBoolean(a) 
 {
      return typeof a == 'boolean';
 }

function isEmpty(o) 
 {
      if (isObject(o)) 
  {
           for (var i in o) 
   {
                return false;
           }
      }
      return true;
 }

function isFunction(a) 
 {
      return typeof a == 'function';
 }



function isNumber(a) 
 {
      return typeof a == 'number' && isFinite(a);
 }

 function isObject(a) 
 {
     return (typeof a == 'object' && !!a) || isFunction(a);
 }


function isString(a) 
 {
     return typeof a == 'string';
 }

 function isUndefined(a) 
 {
     return typeof a == 'undefined';
 } 


function Left(str, n)
  {
     if (n <= 0)     
      return "";
     else if (n > String(str).length)   
      return str;                
     else 
      return String(str).substring(0,n);
  }



// end c functions




function switchDiv(div_id)
{
  var style_sheet = getStyleObject(div_id);
  if (style_sheet)
  {
    hideAll();
    changeObjectVisibility(div_id,"visible");
  }
  else 
  {
  }
}

function hideAll()
{
   changeObjectVisibility("f1","hidden");
   changeObjectVisibility("f2","hidden");
}

function getStyleObject(objectId) {
  if(document.getElementById && document.getElementById(objectId)) {
	return document.getElementById(objectId).style;
   }
   else if (document.all && document.all(objectId)) {  
	return document.all(objectId).style;
   } 
   else if (document.layers && document.layers[objectId]) { 
	return document.layers[objectId];
   } else {
	return false;
   }
}

function changeObjectVisibility(objectId, newVisibility) {
    var styleObject = getStyleObject(objectId);
    if(styleObject) {
	styleObject.visibility = newVisibility;
	return true;
    } else {
	// 
	return false;
    }
}


function IsStrThere(strx,fx)
{
  if(strx.indexOf(fx)!= -1)
    return true;
  else
    return false;
}



function ps_getCookie2(name) {
    var dc = document.cookie;
    var prefix = name + "=";
    var begin = dc.indexOf("; " + prefix);
    if (begin == -1) {
        begin = dc.indexOf(prefix);
        if (begin != 0) return null;
    } else {
        begin += 2;
    }
    var end = document.cookie.indexOf(";", begin);
    if (end == -1) {
        end = dc.length;
    }
    return unescape(dc.substring(begin + prefix.length, end));
}




function ps_getCookie( name ) 
{
  var start = document.cookie.indexOf( name + "=" );
  var len = start + name.length + 1;
  if ( ( !start ) && ( name != document.cookie.substring( 0, name.length ) ) ) {
    return null;
  }
  if ( start == -1 ) return null;
  var end = document.cookie.indexOf( "&", len );
  if ( end == -1 ) end = document.cookie.length;
  return unescape( document.cookie.substring( len, end ) );
}


////////////////////////////////////////////////////////////////////////


var ses = new CJL_CookieUtil("DB", "" ,"/");
function CJL_CookieUtil(name, duration, path, domain, secure)
{
   this.affix = "";
   
   if( duration )
   {   	  
      var date = new Date();
	  var curTime = new Date().getTime();

	  date.setTime(curTime + (1000 * 60 * duration));
	  this.affix = "; expires=" + date.toGMTString();
   }
   
   if( path )
   {
      this.affix += "; path=" + path;
   }
   
   if( domain )
   {
      this.affix += "; domain=" + domain;
   }

   if( secure )
   {
      this.affix += "; secure=" + secure;
   }
   


      
   function getValue()
   {
      var m = document.cookie.match(new RegExp("(" + name + "=[^;]*)(;|$)"));

      return m ? m[1] : null;   
   }
   
   this.cookieExists = function()
   {
      return getValue() ? true : false;
   }
      
   this.expire = function()
   {
      var date = new Date();
	  date.setFullYear(date.getYear() - 1);
	  document.cookie=name + "=noop; expires=" + date.toGMTString(); 
   }
        
   this.setSubValue = function(key, value)
   {
      var ck = getValue();

      if( /[;, ]/.test(value) )
      {
         //Mac IE doesn't support encodeURI
		 value = window.encodeURI ? encodeURI(value) : escape(value);
      }

      
      if( value )
      {
         var attrPair = "&" + key +'='+ value;

         if( ck )
         {
             if( new RegExp("&" + key).test(ck) )
	         {
		        document.cookie =
				   ck.replace(new RegExp("&" + key + "[^&;]*"), attrPair) + this.affix;
	         }
	         else
	         {
		        document.cookie =
				   ck.replace(new RegExp("(" + name + "=[^;]*)(;|$)"), "$1" + attrPair) + this.affix;
	         }
         }
         else
         {
	        document.cookie = name + "=" + attrPair + this.affix;
         }
      }
      else
      {      
	     if( new RegExp("&" + key).test(ck) )
	     {
	        document.cookie = ck.replace(new RegExp("&" + key + "[^&;]*"), "") + this.affix;
	     }
      }
   }

      
   this.getSubValue = function(key)
   {
      var ck = getValue();

      if( ck )
      {
         var m = ck.match(new RegExp("&" + key + "([^&;]*)"));

	     if( m )
	     {
	        var value = m[1].replace('=','');

	        if( value )
	        { 
			  return  unescape(value);
	        }
	     }
      }
	  return null;
   }
}


function addit()
{
  if( window.addEventListener ) {
  window.addEventListener('unload',tellthemgone,false);
} else if( document.addEventListener ) {
  document.addEventListener('unload',tellthemgone,false);
} else if( window.attachEvent ) {
  window.attachEvent('onunload',tellthemgone);
}

}


function addonload()
{
  if( window.addEventListener ) {
  window.addEventListener('load',Addpopsurvey,false);
} else if( document.addEventListener ) {
  document.addEventListener('load',Addpopsurvey,false);
} else if( window.attachEvent ) {
  window.attachEvent('onload',Addpopsurvey);
}

}







function Minimize() 
{
window.innerWidth = 100;
window.innerHeight = 100;
window.screenX = screen.width;
window.screenY = screen.height;
alwaysLowered = true;
}

function Maximize() 
{
window.innerWidth = screen.width;
window.innerHeight = screen.height;
window.screenX = 0;
window.screenY = 0;
alwaysLowered = false;
}



  function ps_replace(sStr) {
    return sStr.replace(/&/g,"-").replace(/=/g,"-");
  }

function CountdownTimer(mon, dy, yr, hr, min) {
	curr_date = new Date();
	target_date = new Date(yr, mon-1, dy, hr, min, 00);
	
	GMTOffset = curr_date.getTimezoneOffset() - 240  // 240 is the EST Offset

	diff = new Date(target_date-curr_date - (GMTOffset*60000));

	if (diff>0)
	{
		days = (diff - (diff % 86400000)) / 86400000;
		hours = (diff - (diff % 3600000)) / 3600000 - days * 24;
		minutes = (diff - (diff % 60000)) / 60000 - hours * 60 - days * 1440;
		seconds = (diff - (diff % 1000)) / 1000 - minutes * 60 - hours * 3600 - days * 86400;

		if (days==1)
		{
			daytxt = days + " day, "
		}
		else
		{
			daytxt = days + " days, "
		}

		if (hours==1)
		{
			hourtxt = hours + " hour, "
		}
		else
		{
			hourtxt = hours + " hours, "
		}

		if (minutes==1)
		{
			minutetxt = minutes + " minute and "
		}
		else
		{
			minutetxt = minutes + " minutes and "
		}

		output = daytxt + hourtxt + minutetxt + seconds + " seconds left";
		document.getElementById("countdown").innerHTML = output;
		setTimeout("CountdownTimer(" + mon + "," + dy + "," + yr + "," + hr + "," + min + ")", "1000");
	}
	else
	{
		output = "";
	}
	}