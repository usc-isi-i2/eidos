package com.fetch.naturallanguage.formextractor;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintStream;
import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.htmlparser.Parser;
import org.htmlparser.filters.TagNameFilter; 
import org.htmlparser.lexer.Lexer;
import org.htmlparser.util.NodeList;
import org.htmlparser.util.ParserException;
import org.htmlparser.tags.FormTag;


/**
 * This class represents an HTML document
 *
 */
public class HtmlDocument {

    private String m_html;
    private String pageTitle;
    private URL url;
    
    public static PrintStream log;
    
    /**
     * @param html - the source of the page
     */
    public HtmlDocument(String html){
        m_html = html;
    }
    
    public HtmlDocument(URL url) throws IOException {
    	m_html = getURLContents(url);
    }
    
    public URL getURL() {
    	return url;
    }
    
    /**
     * Parses the HTML using 3rd party library
     * @param tagName - the name of the nodes that should be retained
     * @return A list of HTML nodes
     */
    private NodeList parseAllTags(String tagName){
        NodeList list = new NodeList();
        if (StringUtils.isBlank(m_html)){
            throw new RuntimeException("Must supply the html text.");
        }
        // parse the page - call to htmlparser.jar
        try{
            // the following line eliminates a bug in the parser (bug #1505676)
            // See also bug #1345049: HTMLParser should not terminate a comment with --->
            Lexer.STRICT_REMARKS = false;
            Parser parser = new Parser();
            parser.setInputHTML(m_html);

            // parse only the form tags
            list = parser.parse(new TagNameFilter(tagName));            
        }
        catch (ParserException pe)
        {
            pe.printStackTrace ();
        }
        /*
         catch (UnsupportedEncodingException uee)
         {
         uee.printStackTrace ();
         }
         */
        return list;
    }
    
    /**
     * Returns all the forms from an HTML page
     * (this is the main worker for this class)  
     * @return A list of FormElements
     */
    public List<FormElement> execute(){    	
        List<FormElement> forms = null;
        if(m_html.length() > 0){
        	NodeList title = parseAllTags("TITLE");
        	pageTitle = title.asString();
        	
            NodeList all_forms = parseAllTags("FORM");
            if(all_forms.size() > 0){
                // walk through - we have forms to process
                forms = captureForms(all_forms);
            }
        }
        return forms;
    }
    
    /**
     * @param nl - list of FORM tags
     * @return A list of FormElements
     */
    private List<FormElement> captureForms(NodeList nl){
        List<FormElement> formList = new ArrayList<FormElement>();
        for(int i=0; i<nl.size(); i++){
            FormTag form = (FormTag)nl.elementAt(i);
            if(form != null){
            	try {
	                FormElement myForm = new FormElement();
	                // capture the form attributes
	                myForm.captureForm(form);
	                myForm.setPageTitle(pageTitle);
	                
	                // add the form to the list
	                formList.add(myForm);
            	} catch(Exception e) {
            		e.printStackTrace(log);
            	}
            }
        }        
        return formList;
    }
    
    public static void main(String[] args) {
        // TODO Auto-generated method stub

    }

    private String getURLContents(URL url) throws IOException {
    	URLConnection conn = url.openConnection();
    	
    	BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
    	StringBuffer buffer = new StringBuffer("");
    	String inputLine;
    	String lineseperator = System.getProperty("line.separator");
    	
    	while ((inputLine = in.readLine()) != null)
    		buffer.append(inputLine).append(lineseperator);

    	in.close();
    	
    	this.url = conn.getURL();
    	return buffer.toString();
    }
}
