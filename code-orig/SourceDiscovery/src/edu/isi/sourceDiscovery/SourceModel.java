package edu.isi.sourceDiscovery;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;

import edu.isi.semanticMapper.labeler.ILabelScore;
import edu.isi.sourceDiscovery.formInvocation.HttpMethod;

public class SourceModel {

	private String formActionURL;

	private HttpMethod formMethod;

	private String formName;

	private ArrayList<String> inputFieldNames = new ArrayList<String>();

	private ArrayList<String> inputFieldTypes = new ArrayList<String>();

	private ArrayList<ILabelScore[]> outputColumnLabels = new ArrayList<ILabelScore[]>();

	private HashMap<Integer, ILabelScore> outputColumnsMatchingDomain = new HashMap<Integer, ILabelScore>();

	private String sourceURL;

	private String domain;
	
	public SourceModel(String domain, String sourceURL, String formName, HttpMethod formMethod, String formActionURL) {
		this.domain = domain;
		this.sourceURL = sourceURL;
		this.formName = formName;
		this.formMethod = formMethod;
		this.formActionURL = formActionURL;
	}
	
	public void addInputField(String fieldName, String fieldSemanticType) {
		inputFieldNames.add(fieldName);
		inputFieldTypes.add(fieldSemanticType);
	}
	
	public void addOutputColumnMatchingDomain(int columnNumber, ILabelScore semanticType) {
		outputColumnsMatchingDomain.put(columnNumber, semanticType);
	}
	
	public void addOutputFieldType(ILabelScore[] outputLabels) {
		outputColumnLabels.add(Arrays.copyOf(outputLabels, outputLabels.length));
	}
	
	public String getFormActionURL() {
		return formActionURL;
	}
	
	public HttpMethod getFormMethod() {
		return formMethod;
	}
	
	public String getFormName() {
		return formName;
	}
	
	public ArrayList<String> getInputFieldNames() {
		return inputFieldNames;		
	}
	
	public String getInputFieldType(String fieldName) {
		int idx = inputFieldNames.indexOf(fieldName);
		return inputFieldTypes.get(idx);
	}

	public ArrayList<ILabelScore[]> getOutputColumnLabels() {
		return outputColumnLabels;
	}

	public HashMap<Integer, ILabelScore> getOutputColumnsMatchingDomain() {
		return outputColumnsMatchingDomain;
	}

	public String getSourceURL() {
		return sourceURL;
	}

	public void setFormActionURL(String formActionURL) {
		this.formActionURL = formActionURL;
	}

	public void setFormMethod(HttpMethod formMethod) {
		this.formMethod = formMethod;
	}

	public void setFormName(String formName) {
		this.formName = formName;
	}

	public void setSourceURL(String sourceURL) {
		this.sourceURL = sourceURL;
	}

	public String getDomain() {
		return domain;
	}
	
	@Override
	public String toString() {
		StringBuffer out = new StringBuffer("");
		out.append("Source: " + sourceURL + "   Domain: " + domain + "\n");
		out.append("Form: " + formName + " formMethod: " + formMethod + " formActionURL: " + formActionURL + "\n");
		out.append("Inputs: " + "\n");
		for(int i=0; i<inputFieldNames.size(); i++) {
			out.append("     " + inputFieldNames.get(i) + " : " + inputFieldTypes.get(i) + "\n");
		}
		out.append("Domain Outputs: " + "\n");
		for(Integer columnNumber : outputColumnsMatchingDomain.keySet()) {
			out.append("     column " + columnNumber + " : " + outputColumnsMatchingDomain.get(columnNumber).getLabelName() + ":" +  outputColumnsMatchingDomain.get(columnNumber).getScore() + "\n");
		}
		return out.toString();
	}
}
