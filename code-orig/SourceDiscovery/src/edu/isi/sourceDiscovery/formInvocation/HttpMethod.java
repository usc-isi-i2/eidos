package edu.isi.sourceDiscovery.formInvocation;

import com.fetch.naturallanguage.formextractor.FormElement.FormMethod;

public enum HttpMethod {
	METHOD_GET,
	METHOD_POST,
	METHOD_PUT,
	METHOD_UNKNOWN;
	
	public static HttpMethod getMethod(FormMethod method) {
		
		switch(method) {
			case GET : return HttpMethod.METHOD_GET;
			case POST: return HttpMethod.METHOD_POST;
			case PUT: return HttpMethod.METHOD_PUT;
			case NOT_FOUND: return HttpMethod.METHOD_UNKNOWN;
		}
		
		return HttpMethod.METHOD_UNKNOWN;
	}
}
