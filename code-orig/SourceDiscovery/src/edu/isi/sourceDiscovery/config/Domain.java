package edu.isi.sourceDiscovery.config;

import java.util.ArrayList;
import java.util.List;

public class Domain {
	public static final Domain UNKNOWN = new Domain("_UNKNOWN");	
	
	String name;
	int index;
	List<InputSet> inputSets;
	List<OutputSet> outputSets;
	
	public Domain() {	
		inputSets = new ArrayList<InputSet>();
		outputSets = new ArrayList<OutputSet>();
	}
	
	public Domain(String name) {
		this();
		this.name = name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public void setIndex(int idx) {
		this.index = idx;
	}
	
	public void addInputSet(InputSet set) {
		inputSets.add(set);
	}
	
	public void addOutputSet(OutputSet set) {
		outputSets.add(set);
	}
	
	public String getName() {
		return name;
	}
	
	public int getIndex() {
		return index;
	}
	
	public List<OutputSet> getOutputSets() {
		return outputSets;
	}
	
	public List<InputSet> getInputSets() {
		return inputSets;
	}
	
	@Override
	public String toString() {
		return name + ":" + index + "\n" + inputSets + "\n" + outputSets;
	}
	
	public boolean isUnknown() {
		return name.equalsIgnoreCase("_UNKNOWN");
	}
}



