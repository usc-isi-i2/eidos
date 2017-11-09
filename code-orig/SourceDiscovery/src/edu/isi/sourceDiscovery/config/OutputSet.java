package edu.isi.sourceDiscovery.config;

import java.util.ArrayList;
import java.util.List;

public class OutputSet {
	private List<Output> outputs = new ArrayList<Output>();
	private float percentageMatchesRequired = 90;
	
	public List<Output> getOutputs() {
		return outputs;
	}
	
	public void addOutput(Output output) {
		this.outputs.add(output);
	}
	
	public float getPercentageMatchesRequired() {
		return percentageMatchesRequired;
	}
	
	public void setPercentageMatchesRequired(float percentageMatchesRequired) {
		this.percentageMatchesRequired = percentageMatchesRequired;
	}
	
	public int getNumberOfOutputs() {
		return outputs.size();
	}
	
	@Override
	public String toString() {		
		return "Outputs: " + outputs;
	}
}
