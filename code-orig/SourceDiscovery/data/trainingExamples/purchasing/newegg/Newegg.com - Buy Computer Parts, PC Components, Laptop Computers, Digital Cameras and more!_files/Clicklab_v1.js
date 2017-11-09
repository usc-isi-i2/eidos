// CLICKLAB TRACKING CODE //
// Copyright 2005 Clicklab LLC //
// User Defined Actions
var CLICKLAB_ID = 79228

var clicklab_action_definition;
var cl_act;

var CLICKLAB_ACTION_NAME;
var CLICKLAB_ACTION_STEP;
var CLICKLAB_ACTION_STEP_NAME;
var CLICKLAB_ORDER_AMOUNT;
var CLICKLAB_ACTION_PARAM;

var CLICKLAB_TRAFFIC_SOURCE;
var CLICKLAB_USER_REFERER;

var clicklab_traffic_source;

function clicklab_set_campaign_cookie(cookie_name_, cookie_value_) {
    var vDomainName = "";
    if (DOMAIN_NAME.length>0){vDomainName = "domain="+DOMAIN_NAME+";"}    
	document.cookie = cookie_name_+"="+escape(cookie_value_)+"; path=/;"+vDomainName;
}

function clicklab_get_campaign_cookie(cookie_name_) {
	var i, c;
	var cookie_name = cookie_name_ + "=";
	var cookie_array = document.cookie.split(';');
	for( i=0; i<cookie_array.length; i++ )
	{
		c = cookie_array[i];
		while (c.charAt(0)==' ') {
			c = c.substring(1, c.length);
		}
		if (c.indexOf(cookie_name) == 0) {
			return c.substring(cookie_name.length, c.length);
		}
	}
	return null;
}

function clicklab_determine_campaign() {	
	var i, locstring, locarray, locpos, engine, campaigns, org_ref;		
	locstring = document.location.href;
	locarray = locstring.split("CMP=");
	
	if( locarray.length>1 ) {
		locpos = locarray[1].indexOf("&");
		engine = locarray[1];
		if( locpos != -1 ) {
			engine = locarray[1].substring( 0, locpos );
		}
	}
	
	// Test campaign
	campaigns = CLICKLAB_CMP_ARRAY;
	if( engine ) {
		for( i=0; i<campaigns.length; i++ ) {
			if( campaigns[i] == engine ) {
				return true;
			}
		}
	}
	else {
	// Organic
		if(clicklab_is_defined(CLICKLAB_USER_REFERER)) {
			org_ref = CLICKLAB_USER_REFERER;
		}
		else {
			org_ref = document.referrer;
		}
		if(org_ref.length>0) {
			for( i=0; i<CLICKLAB_ORGANIC_SOURCES.length; i++ ) {
				if( org_ref.indexOf(CLICKLAB_ORGANIC_SOURCES[i]) != -1 &&
				    org_ref.indexOf(CLICKLAB_ORGANIC_SOURCES[i])<14 ) {
				  if( Math.random() < 0.1 ) {
				  	return true;
				  }
				}
			}//for
		}//if
	}//if organic
	return false;
}

function clicklab_is_defined(o){
	var var_str=eval("' "+o+"'");
	if (var_str==" undefined") return false;
	else return true;
}//clicklab_is_defined

function clicklab_serialize(v){
    switch (typeof v) { 
        case 'number': 
            if (Math.round(v) == v) return 'i:'+v+';'; 
            else return 'd:'+v+';'; 
        case 'boolean': 
            if (v == true) return 'b:1;'; 
            else return 'b:0;'; 
        case 'string': return 's:'+v.length+':"'+v+'";';
				case 'object':
            var l = 0;
            for(i in v) {
            	if(typeof v[i] == 'object' || typeof v[i] == 'string' || typeof v[i] == 'boolean' || typeof v[i] == 'number') {
            		l++;
            	}
            }
            var r = 'a:'+l+':{';
            for(i in v) {
            	if(typeof v[i] == 'object' || typeof v[i] == 'string' || typeof v[i] == 'boolean' || typeof v[i] == 'number') {
            		r+= clicklab_serialize(i)+clicklab_serialize(v[i]);
            	}
            }
            r += '}';
            return r;
        break;
        case 'function': return ''; break;
        default: return '';//return 'unknown type: '+typeof v; 
    }
		return '';
}//clicklab_serialize


if( clicklab_determine_campaign() ) {	
	clicklab_set_campaign_cookie('clicklab_mode_cft', 1);
}


if( clicklab_get_campaign_cookie('clicklab_mode_cft') == 1 ) {	
	if(clicklab_is_defined(CLICKLAB_ACTION_NAME)) {
		clicklab_action_definition = new Array();
		clicklab_action_definition[0] = new Array()
		clicklab_action_definition[0]["name"] = CLICKLAB_ACTION_NAME;
		if(clicklab_is_defined(CLICKLAB_ORDER_AMOUNT) ) {
			clicklab_action_definition[0]["amount"] = CLICKLAB_ORDER_AMOUNT*100;
		}
		if( clicklab_is_defined(CLICKLAB_ACTION_STEP) && clicklab_is_defined(CLICKLAB_ACTION_STEP_NAME) ) {
			clicklab_action_definition[0]["step"] = CLICKLAB_ACTION_STEP;
			clicklab_action_definition[0]["step_name"] = CLICKLAB_ACTION_STEP_NAME;
		}
		
		if(clicklab_is_defined(CLICKLAB_ACTION_PARAM)) {
			clicklab_action_definition[0]["pnew"] = CLICKLAB_ACTION_PARAM;
		}
	}
	else if (clicklab_is_defined(cl_act)) {
		clicklab_action_definition = cl_act
		if(clicklab_is_defined(clicklab_action_definition[0]["amount"]) ) {
			clicklab_action_definition[0]["amount"] = clicklab_action_definition[0]["amount"]*100;
		}
	}
	
	if(clicklab_is_defined(CLICKLAB_TRAFFIC_SOURCE)) {
		clicklab_traffic_source = "&ts="+CLICKLAB_TRAFFIC_SOURCE;
	}
	else {
		clicklab_traffic_source = "";
	}
	
	
	if(!clicklab_is_defined(clicklab_action_definition)) clicklab_action_definition = new Array();
	
	if(clicklab_is_defined(CLICKLAB_ID)) {
	
		var _d  = document;
		var _ua = navigator;
		
		
		var _proto = location.protocol.indexOf('https') > -1 ? 'https://' : 'http://';
		var _url = "newegg.clicklab.com/pv.php";
				
		
		var clicklab_url = escape(window.location.href);
		var clicklab_ref;
		if(clicklab_is_defined(CLICKLAB_USER_REFERER)) {
			clicklab_ref = escape(CLICKLAB_USER_REFERER);
		}
		else {
			clicklab_ref = escape(_d.referrer);
		}	
		var clicklab_title = escape(_d.title);
		
		var clicklab_ua_name = navigator.appName;
		var clicklab_ua_v = (Math.round(parseFloat(navigator.appVersion) * 100));
		var clicklab_proto = _proto == 'https://' ? 1 : 0;
		
		_d.cookie="b=b";
		var clicklab_ck = _d.cookie ? 1 : 0;
		var clicklab_rn = Math.random();
		var clicklab_tz = (new Date()).getTimezoneOffset();
		
		var clicklab_fr = self!=top ? 1 : 0;
		
		var clicklab_js_v = "10";
		var clicklab_wh = screen.width+'x'+screen.height;
		var clicklab_color_depth = 0;
		if( clicklab_is_defined(self) && 
				clicklab_is_defined(self.screen) && 
			(clicklab_is_defined(self.screen.pixelDepth) || clicklab_is_defined(self.screen.colorDepth)) ) 
		{
				clicklab_color_depth = clicklab_is_defined(self.screen.pixelDepth) ?  screen.pixelDepth : screen.colorDepth;
		}
		var clicklab_java_on = navigator.javaEnabled() ? 1 : 0;
		
		var _str="";
		_str+="<a href='"+_proto+_url+"?rn="+clicklab_rn+"' target='_blank'>";
		_str+="<img width=0 height=0 src='"+_proto+_url+"?clicklab_rn="+clicklab_rn+"&site_id="+CLICKLAB_ID+"&ck="+clicklab_ck+"&tz="+clicklab_tz+"&js=1&js_v="+clicklab_js_v+"&jv="+clicklab_java_on+"&fr="+clicklab_fr+clicklab_traffic_source+"&ref="+clicklab_ref+"&url="+clicklab_url+"&title="+clicklab_title+"&proto="+clicklab_proto+"&wh="+clicklab_wh+"&px="+clicklab_color_depth+"&ua_name="+clicklab_ua_name+"&ua_v="+clicklab_ua_v+"&act="+escape(clicklab_serialize(clicklab_action_definition));
		_str+="' border=0 alt='Clicklab' />";
		_str+="</a>";
		_d.write(_str);
	}//clicklab_is_defined(CLICKLAB_ID)
	
}