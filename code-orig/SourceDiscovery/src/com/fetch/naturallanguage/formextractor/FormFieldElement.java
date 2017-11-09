package com.fetch.naturallanguage.formextractor;

import java.util.HashMap;

import org.htmlparser.Node;
import org.htmlparser.Tag;
import org.htmlparser.tags.InputTag;
import org.htmlparser.tags.OptionTag;
import org.htmlparser.tags.SelectTag;
import org.htmlparser.tags.TextareaTag;

/**
 * An instance of this class represents a field in a form
 * It captures the name/id, type, html, value and label
 * Also, for dropdown boxes, it captures the options, too.
 */
public class FormFieldElement {

    public enum ElementType { RADIO, CHECK, SELECT, TEXT, IMAGE, PASSWORD, HIDDEN, SUBMIT, BUTTON, CHECKBOX, RESET, TEXTBOX, SEARCH, FILE }

    private String name;            // field name/id
    private ElementType type;       // field type (see ElementType)
    private String label;           // field label (the text around)
    private String html;            // exact tag representation (for referrence)
    private String value;           // field value (as per html content)
    
    private HashMap<String, String> options;
    
    
    public FormFieldElement(){
        name = "";
        type = ElementType.TEXT;
        label = "";
        html = "";
        value = "";
        options = null;
    }
    
    /**
     * captures the attributes of a field (input, textarea or select)
     * @param tag - a DOM tag
     */
    public void captureField(Tag tag){
        String name = tag.getAttribute("name");
        if(name == null || name.length() == 0){
            name = tag.getAttribute("id");
        }
        setName(name);
        if(tag instanceof InputTag){
            captureInputField((InputTag)tag);
        }
        else if(tag instanceof TextareaTag){
            captureTextareaField((TextareaTag)tag);
        }
        else if(tag instanceof SelectTag){
            captureSelectField((SelectTag)tag);
        }
    }
    
    private void captureInputField(InputTag tag){
        setHtml(tag.toHtml(true));
        String t = tag.getAttribute("type");
        if(t!=null){
            type = ElementType.valueOf(t.trim().toUpperCase());
        }
        else{
            type = ElementType.TEXT;
        }
        setValue(tag.getAttribute("value"));
        if(type == ElementType.RADIO || type == ElementType.CHECK){
            // the label is right after
        	Node nextSibling = tag.getNextSibling();
        	if(nextSibling != null)
        		setLabel(nextSibling.getText().trim());
        }
    }
    
    private void captureTextareaField(TextareaTag tag){
        setHtml(tag.toHtml(true));
        type = ElementType.TEXT;
        setValue(tag.getStringText());
    }

    private void captureSelectField(SelectTag tag){
        String selkey = null;
        setHtml(tag.toHtml(true));
        type = ElementType.SELECT;
        // now add the options
        OptionTag options[] = tag.getOptionTags();
        if(options != null && options.length > 0){
            this.setOptionsSize(options.length);
            for(int i=0; i<options.length; i++){
                OptionTag opt = options[i];                
                String key = opt.getValue();
                int start = opt.getEndPosition();
                int end = opt.getEndTag().getStartPosition();
                String value = "";
                if(end > start)  //value is not Empty 
                	value = opt.getStringText();
                this.addOption(key, value);
                if(opt.getAttributeEx("selected") != null){
                    selkey = key;
                }
            }
        }
        setValue(selkey);
    }
    
    @Override
    public String toString(){
        StringBuffer ret = new StringBuffer("(*) ");
        ret.append(getLabel() + "/");
        ret.append(getType().toString() + "/");
        ret.append(getName() + "/");
        ret.append(getValue() + "\n");
        if(options != null){
            ret.append("options: " + options.toString() + "\n");
        }
        return ret.toString();
    }
    
    public static void main(String[] args) {
        // TODO Auto-generated method stub

    }

    // *************************************
    // getters & setters
    // *************************************

    public String getHtml() {
        return html;
    }

    public void setHtml(String html) {
        this.html = html;
    }

    public String getLabel() {
        if(label.length() == 0){
            return "not found";
        }
        
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ElementType getType() {
        return type;
    }

    public void setType(ElementType type) {
        this.type = type;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public HashMap getOptions(){
        return options;
    }
    
    public String getOptionsValueAsString() {
    	if(options == null)
    		return "";
    	StringBuffer out = new StringBuffer();
    	boolean first = true;
    	for(String option : options.values()) {
    		if(!first)
    			out.append(" ");    		
    		out.append(option);
    		first = false;
    	}
    	return out.toString();
    }
    
    private void setOptionsSize(int no){
        options = new HashMap<String, String>(no);
    }
    
    private void addOption(String key, String value){
        // even this "if" apparently doesn't make sense, there are in fact cases of duplication
        // since the browsers are merciful, we are too... 
        if(!options.containsKey(key)){
            options.put(key, value);
        }
    }
}
