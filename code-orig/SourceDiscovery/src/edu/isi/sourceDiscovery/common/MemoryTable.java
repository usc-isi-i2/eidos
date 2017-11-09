package edu.isi.sourceDiscovery.common;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

public class MemoryTable {
	
	public static int MAX_ROWS_INFINTE = -1;
	private ArrayList<ArrayList<String>> data;
	private ArrayList<String> fieldNames;
	
	private int maxNumRows;
	
	public MemoryTable(int maxNumRows) {
		fieldNames = new ArrayList<String>();
		this.maxNumRows = maxNumRows;
		this.data = new ArrayList<ArrayList<String>>();
	}
	
	public MemoryTable(String driver, String connectionURL, String username, String password,
			String tablename, String[] fields, int maxNumRows) throws SQLException, ClassNotFoundException {
	
		this(maxNumRows);
		
		StringBuilder query = new StringBuilder("SELECT DISTINCT ");
		for(int i=0; i<fields.length; i++) {
			fieldNames.add(fields[i]);
			query.append(fields[i]);
			if(i < fields.length-1)
				query.append(", ");
		}
		query.append(" from ").append(tablename);
		if(maxNumRows != MAX_ROWS_INFINTE)
			query.append(" limit 0, ").append(maxNumRows);
		
		System.out.println(query.toString());
		
		//1. Load the Driver
	    Class.forName(driver);

	    //2. Establish the connection using DriverManager
	    Connection connection = DriverManager.getConnection(connectionURL, username, password);
	    Statement stmt = connection.createStatement(
				                		ResultSet.TYPE_SCROLL_SENSITIVE,
				                        ResultSet.CONCUR_READ_ONLY);

	    
	    
	    ResultSet srs = stmt.executeQuery(query.toString());
		while (srs.next()) {
			ArrayList<String> row = new ArrayList<String>();
			for(int i=1; i<=fields.length; i++) {
				row.add(srs.getString(i));
			}
		    data.add(row);
		}
	}
	
	public void addDataRow(List<String> row) throws MemoryTableOverflowException{
		if(data.size() >= maxNumRows && maxNumRows != MAX_ROWS_INFINTE)
			throw new MemoryTableOverflowException("Maximum number of rows exceeded");
		ArrayList<String> row1 = new ArrayList<String>();
		row1.addAll(row);
		data.add(row1);
	}
	
	public ArrayList<ArrayList<String>> getData() {
		return data;
	}
	
	public ArrayList<String> getDataRow(int rowNumber) {
		return data.get(rowNumber);
	}
	
	public ArrayList<String> getFieldNames() {
		return fieldNames;
	}
	
	public String getValue(int rowNumber, int columnNumber) throws MemoryTableException {
		ArrayList<String> row = data.get(rowNumber);
		if(columnNumber < 0 || columnNumber > fieldNames.size()) 
			throw new MemoryTableException("Invalid column number: " + columnNumber + 
							". There are " + fieldNames.size() + " columns in the table");
		return row.get(columnNumber);
	}
	
	public String getValue(int rowNumber, String columnName) throws MemoryTableException {
		ArrayList<String> row = data.get(rowNumber);
		int idx = fieldNames.indexOf(columnName);
		if(idx < 0) 
			throw new MemoryTableException("Invalid column name: " + columnName);
		return row.get(idx);
	}
	
	public void setFieldNames(List<String> fieldNames) {
		for(String s : fieldNames) {
			this.fieldNames.add(s);
		}
	}
	
	public ArrayList<ArrayList<String>> select(List<String> fieldNamesList, int limit) {
		int numFields = fieldNamesList.size();
		int[] indexes = new int[numFields];
		for(int i=0; i<numFields; i++) {
			indexes[i] = fieldNames.indexOf(fieldNamesList.get(i));
		}
		ArrayList<ArrayList<String>> selectedData = new ArrayList<ArrayList<String>>();
		
		for(int row=0;  row<data.size() && row<limit; row++) {
			ArrayList<String> rowData = data.get(row);
			
			ArrayList<String> selectedRow = new ArrayList<String>();
			for(int i=0; i<numFields; i++)
				selectedRow.add(rowData.get(indexes[i]));
			selectedData.add(selectedRow);
		}
		return selectedData;
	}
	
	@Override
	public String toString() {
		StringBuilder str = new StringBuilder("[");
		for(String name : getFieldNames()) {
			str.append(name).append("\t|");
		}
		str.append("]\n");
		for(List<String> row : getData()) {
			for(String s : row) {
				str.append(s).append("\t|");
			}
			str.append("]\n");
		}
		return str.toString();
	}
}
