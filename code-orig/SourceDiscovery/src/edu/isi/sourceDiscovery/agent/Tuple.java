package edu.isi.sourceDiscovery.agent;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

//2 Rows
//1st row contains list of column names - all strings
//2nd row contains values which can be strings or embedded tuples etc.
public class Tuple {
	private ArrayList<ArrayList<Object>> columns;
	private boolean isEmpty;	
	
	public Tuple() {
		columns = new ArrayList<ArrayList<Object>>(2);
		columns.add(new ArrayList<Object>());
		columns.add(new ArrayList<Object>());
//		ArrayList<String> columnNames = columns.get(0);
//		ArrayList<String> values = columns.get(1);
		isEmpty = true;
	}
	
	public void add(String columnName, Object value) {
		columns.get(0).add(columnName);
		columns.get(1).add(value);
		if(!value.equals("")) isEmpty = false;
	}
	
	public ArrayList<ArrayList<Object>> asList() {
//		ArrayList<ArrayList<String>> list = new ArrayList<ArrayList<String>>();
//		list.add(columnNames);
//		list.add(values);
//		return list;
		return columns;
	}
	
	public ArrayList<ArrayList<Object>> asList(
			List<String> outputNames,
			Map<String, List<List<String>>> groupings) {
		ArrayList<ArrayList<Object>> output = new ArrayList<ArrayList<Object>>(2);
		output.add(new ArrayList<Object>());
		output.add(new ArrayList<Object>());
		
		
		//["address1" ["hotelStreetAddr" "PR-StreetAddress"] 
		//				["hotelCity" "PR-City"] 
		//				["hotelState" "PR-State-Abbr"] 
		//				["hotelZipcode" "PR-Zipcode5Digit"]
		
		for(String outputName : outputNames) {
			Object colValue = "";
			
			int idx = getColumnNames().indexOf(outputName);
			
			if(idx >= 0) {
				//Exists is the input as is
				colValue = getValue(idx);
			} else if(groupings.containsKey(outputName)){
				List<List<String>> grouping = groupings.get(outputName);
				
				Tuple innerTuple = new Tuple();
				for(List<String> element : grouping) {
					String name = element.get(0);
					String type = element.get(1);
					
					Object value = getColumnValue(name);
					innerTuple.add(type, value);
				}
				
				colValue = innerTuple.asList();
			}
			
			output.get(0).add(outputName);
			output.get(1).add(colValue);
		}
		
		return output;
	}
	
	public boolean containsColumn(String columnName) {
		return columns.get(0).contains(columnName);
	}
	
	public String getColumnName(int index) {
		return (String)columns.get(0).get(index);
	}
	
	public ArrayList getColumnNames() {
		return columns.get(0);
	}
	
	public Object getValue(int index) {
		return columns.get(1).get(index);
	}
	 
	public ArrayList<Object> getValues() {
		return columns.get(1);
	}
	
	public int size() {
		return columns.get(0).size();
	}
	
	public Object getColumnValue(int index) {
		return columns.get(1).get(index);
	}
	
	public Object getColumnValue(String columnName) {
		int idx = columns.get(0).indexOf(columnName);
		if(idx >= 0)
			return columns.get(1).get(idx);
		return "";
	}
	
	public void setColumnValue(String columnName, Object value) {
		int idx = columns.get(0).indexOf(columnName);
		if(idx >= 0) {
			columns.get(1).set(idx, value);
			if(!value.equals("")) isEmpty = false;
		}
	}
	
	public boolean isEmpty() {
		return isEmpty;	
	}
	
	public static Object getColumnValue(List<? extends List<Object>> tuple, String columnName) {
		Object value = "";
		int idx = tuple.get(0).indexOf(columnName);
		if(idx >= 0)
			value = tuple.get(1).get(idx);
		return value;
	}
	
	
}
