var BLOGBURST_PROXY_URL = 'http://api.blogburst.com/v1.0/WidgetDeliveryService.ashx';
if (typeof(gBlogBurstWidgetProxy) == 'undefined')
	 document.write("<script src='http://api.blogburst.com/v1.0/WidgetDeliveryProxyStub.js'></scr" + "ipt>");
else
	 if (BLOGBURST_WIDGET_ID)
		 gBlogBurstWidgetProxy.GetWidget(BLOGBURST_WIDGET_ID);