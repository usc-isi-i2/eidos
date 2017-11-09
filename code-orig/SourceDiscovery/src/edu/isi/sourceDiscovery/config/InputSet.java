package edu.isi.sourceDiscovery.config;

import java.util.ArrayList;
import java.util.List;

public class InputSet {
	private String sampleConfig;
	private List<String> inputNames = new ArrayList<String>();
	
	public List<String> getInputNames() {
		return inputNames;
	}
	public void setInputNames(List<String> inputNames) {
		this.inputNames = inputNames;
	}
	public void addInputName(String inputName) {
		this.inputNames.add(inputName);
	}
	public String getSampleConfig() {
		return sampleConfig;
	}
	public void setSampleConfig(String sampleConfig) {
		this.sampleConfig = sampleConfig;
	}
	@Override
	public String toString() {
		return "InputSet: config=" + sampleConfig + " Inputs: " + inputNames;
	}
	
}