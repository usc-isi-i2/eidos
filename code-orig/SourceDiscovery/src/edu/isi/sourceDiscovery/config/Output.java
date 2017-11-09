package edu.isi.sourceDiscovery.config;

import java.util.ArrayList;
import java.util.List;

public class Output {
	private String name;
	private List<String> valueDomains = new ArrayList<String>();
	private boolean required = false;
	private int weight = 1;
	
	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public List<String> getValueDomains() {
		return valueDomains;
	}
	
	public void setValueDomains(List<String> valueDomains) {
		this.valueDomains = valueDomains;
	}
	
	public void addValueDomain(String valueDomain) {
		this.valueDomains.add(valueDomain);
	}
	
	public void setRequired(boolean isRequired) {
		required = isRequired;
	}
	
	public boolean isRequired() {
		return required;
	}
	
	public int getWeight() {
		return weight;
	}

	public void setWeight(int weight) {
		this.weight = weight;
	}

	@Override
	public String toString() {
		return "Output: " + name + " domainValues: " + valueDomains.toString();
	}
	
	@Override
	public int hashCode() {
		return toString().hashCode();
	}
}