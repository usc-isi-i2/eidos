package com.fetch.naturallanguage.formextractor;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.htmlparser.Node;
import org.htmlparser.Tag;
import org.htmlparser.Text;
import org.htmlparser.tags.FormTag;
import org.htmlparser.tags.InputTag;
import org.htmlparser.tags.SelectTag;
import org.htmlparser.tags.TextareaTag;
import org.htmlparser.util.NodeList;

import com.fetch.naturallanguage.formextractor.FormFieldElement.ElementType;


/**
 * An instance of this class contains one form on the page.
 * The form fields are collected in fields member
 *
 */
public class FormElement {

    public enum FormMethod { POST, GET, PUT, NOT_FOUND }
    private final static java.util.regex.Pattern s_patUnicodeBlank = java.util.regex.Pattern.compile("[_\\-\\s\\p{Z}]*");    

    private String url;                     // the url of the form
    private FormMethod method;              // the method
    private String name;                    // the name    
    private List<FormFieldElement> fields;  // the form fields
    
    private List<Node> nodes;
    
    private List<String> formText;
    private String pageTitle;
    
    private int lastIndex;
    
    public FormElement(){
        url = "";
        method = FormMethod.POST;
        fields = new ArrayList<FormFieldElement>();
        nodes = new ArrayList<Node>();
        lastIndex = -1;
        formText = new ArrayList<String>();
    }
    
    /**
     * collects form's attribute walking the dom
     * @param form - a FORM tag on the page
     */
    public void captureForm(FormTag form){
        setUrl(form.getFormLocation());
        String methodType = form.getFormMethod().toUpperCase();
        if(methodType.equals("")) methodType = "NOT_FOUND";
        setMethod(FormMethod.valueOf(methodType));
        setName(form.getFormName());
        
        // walk the children and retain the right ones
        captureFields(form);
    }
    
    public void setPageTitle(String title) {
    	pageTitle = title.trim();
    }
    
    public String getPageTitle() {
    	return pageTitle;
    }
    
    public List<String> getFormText() {
    	return formText;
    }
    
    /**
     * walks the dom and collects the fields of a form
     * @param parent - an HTML node in the DOM
     */
    private void captureFields(Node parent){
        NodeList children = parent.getChildren();
        if(children != null){
            for(int i=0; i<children.size(); i++){
                Node node = children.elementAt(i);
                if(node instanceof Tag || node instanceof Text){
                    nodes.add(node);
                }
                if(node instanceof Text) {
                	addFormText(node.getText());
                }
                if(node instanceof InputTag || node instanceof TextareaTag || node instanceof SelectTag){
                    Tag child = (Tag)node;
                    FormFieldElement field = new FormFieldElement();
                    field.captureField(child);
                    if(field.getType() != ElementType.RADIO && field.getType() != ElementType.CHECK){
                        // the label follows the tag for a radio/check
                        String label = findFieldLabel(child);
                        field.setLabel(label);
                    }
                    this.addField(field);
                    lastIndex = nodes.size()-1;
                }
                else{
                    captureFields(node);
                }
            }
        }
    }
    
    /**
     * identifies the field label (if any)
     * @param tag - the html tag that represents a form field
     * @return the label
     */
    private String findFieldLabel(Tag tag){
        String label = "";
        // the idea: go backwards until we reach the first tag that breaks the flaw
        //           stop when found the first paragraph
        for(int i = nodes.size()-1; i>lastIndex; i--){
            Node child = nodes.get(i);
            if (child instanceof Tag) {
                Tag childTag = (Tag) child;
                if(childTag.breaksFlow() && !childTag.isEndTag()){
                    label = cleanUpLabel(label);
                    if(label.length() > 0){
                        break;
                    }
                }
            }
            else if (child instanceof Text) {
                Text childText = (Text) child;
                String sTemp = childText.getText();
                if(isBlank(sTemp)){
                    if(label.length()>0){
                        if(!Character.isSpaceChar((int)(StringUtils.right(label,1).charAt(0)))){
                            label = " " + label;
                        }
                    }                            
                }
                else{
                    label = sTemp + label;
                }
            }            
        }
        return label;
    }

    private String cleanUpLabel(String label){
        if(label.length() == 0) return "";
        String sTemp = StringUtils.replace(label, "&nbsp;", " ");
        // the manual replace above avoids the generation of non-break spaces during decodeHtml
        sTemp = StringUtils.replaceChars(sTemp, "\n\r\t", " ");
        sTemp = sTemp.replaceAll("\\s(\\s)+", " ");
        //sTemp = sTemp.trim();
        sTemp = StringUtils.strip(sTemp);       // strip apparently covers more 
        // replace the content with this new one
        return sTemp;
    }

    @Override
    public String toString(){
        StringBuffer ret = new StringBuffer("\n>>>>>> form ");
        ret.append("( " + getName() + ")\n");
        ret.append("url: " + getUrl() + "\n");
        ret.append("method: " + getMethod().toString() + "\n");
        ret.append("fields: \n");
        ret.append(fields.toString());
        
        ret.append("\nPage Title: ").append(pageTitle);
        ret.append("\ntext: \n");
        for(String text : formText)
        	ret.append(text).append("\n");
        
        ret.append("\n");
        
        return ret.toString();
    }

    private  boolean isBlank(String unicodeText){
        boolean bRet =  true;
        if(unicodeText != null){
            java.util.regex.Matcher matcher = s_patUnicodeBlank.matcher(unicodeText);
            bRet = matcher.matches();
        }
        return bRet;
    }

    public static void main(String[] args) {
        // TODO Auto-generated method stub

    }

    // *************************************
    // getters & setters
    // *************************************
    
    public FormMethod getMethod() {
        return method;
    }

    public void setMethod(FormMethod method) {
        this.method = method;
    }

    public String getUrl() {
        return url;
    }

    public String getWellformedURL(String basePath) {
    	String url = getUrl();

    	if(basePath.endsWith("/"))  //strip the last / from the baseURL  		
    		basePath = basePath.substring(0, basePath.length()-1);
    	
		if (!url.equals("")) {
			boolean isRelative = true;
			if(url.startsWith("http") || url.startsWith("www"))
				isRelative = false;
			
			boolean baseURL = false;
			
			if (url.startsWith("/")) { //strip the beginning / 
				url = url.substring(1, url.length());
				baseURL = true;
			}
			
			if(isRelative) { //Is a Relative URL
				if(basePath.startsWith("http://"))
					basePath = basePath.substring("http://".length());
				
				int idx = -1;
				
				if(baseURL) {					
					//get the index of the first / after http
					idx = basePath.indexOf("/");					
				} else {
					idx = basePath.lastIndexOf("/");
				}
				
				if(idx > 0) {
					basePath = basePath.substring(0, idx);
				}
				
				url = basePath + "/" + url;
			}
			
			if (!url.startsWith("http")) {
				url = "http://" + url;
			}
		} else {
			url = basePath;
		}
		
		return url;
    }
    
    public void setUrl(String url) {
        this.url = url;
    }

    public List<FormFieldElement> getFields() {
        return fields;
    }

    public void addField(FormFieldElement ffe){
        fields.add(ffe);
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
    
    private void addFormText(String text) {    	
    	//Remove leading and trailing whitespaces    	
    	text = StringUtils.replace(text, "&nbsp;", " ");
    	text = text.trim();
    	
    	if(text.matches(".*[a-zA-Z0-9]+.*"))
    		formText.add(text);
    }
}
