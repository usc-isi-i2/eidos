package edu.isi.sourceDiscovery.config;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import edu.isi.sourceDiscovery.common.MemoryTable;
import edu.isi.sourceDiscovery.common.MemoryTableOverflowException;

public class SampleConfiguration {
	public static int MAX_SAMPLES = 5;

	private String name;	//Unique name of the configuration
	private String type; //Types of samples - static / database
	
	//When sample type is database, these attributes store the database properties
	private String databaseConnectionURL;
	private String databaseDriverName;
	private String databasePassword;
	private String databaseTableName;
	private String databaseUsername;
	private boolean lazyLoad = false; //If lazyload=false, the samples are automatically loaded
									 //when database properties are set. 
									 //When lazyLoad = true, samples need to be loaded on 
									 //demand by calling the loadSamples method
	
	//Indiactor whether samples have been loaded. It is always true for the
	//static samples, and for the database samples, it is true when the samples
	//have been read from the database.
	private boolean dataLoaded = false;

	private List<String> fieldNames; //Names of the database fields	
	//Maps the field names used in the configuration to the actual field names
	//used in the database
	//Key: Configuration Field names - This is the name of the field that is used
	//								   to refere to the sample in the domain's
	//									configuration
	//Value: Database Field Names
	private HashMap<String, String> fieldsMapping = new HashMap<String, String>();
	
	//Semanntic Types of the fields
	//Key: Configuration Field Names
	//Value: Semantic Type
	private HashMap<String, String> fieldSemanticTypes = new HashMap<String, String>(); 
	
	//Table containing the actual sample values
	private MemoryTable samples;
	

	public void addFieldsMapping(String fieldName, String semanticType, String tableFieldName) {
		fieldsMapping.put(fieldName, tableFieldName);
		fieldSemanticTypes.put(fieldName, semanticType);
	}

	public void addSampleDataRow(List<String> row)
			throws MemoryTableOverflowException {
		if (samples == null) {
			samples = new MemoryTable(MAX_SAMPLES);
			samples.setFieldNames(fieldNames);
		}
		samples.addDataRow(row);
		dataLoaded = true;
	}

	public HashMap<String, String> getFieldsMapping() {
		return fieldsMapping;
	}

	public String getName() {
		return name;
	}

	public ArrayList<ArrayList<String>> getSamples(List<String> fieldNames,
			int limit) throws SampleException {
		List<String> tableFieldNames = new ArrayList<String>();
		for (String name : fieldNames) {
			String tblFieldName = fieldsMapping.get(name);
			if (tblFieldName == null) {
				throw new SampleException("Field " + name
						+ " does not exist in the samples");
			}
			tableFieldNames.add(tblFieldName);
		}
		return samples.select(tableFieldNames, limit);
	}

	public String getSemanticTypeOfField(String fieldName) {
		return fieldSemanticTypes.get(fieldName);
	}
	
	public String getType() {
		return type;
	}

	public boolean isDataLoaded() {
		return dataLoaded;
	}

	public boolean isLazyLoad() {
		return lazyLoad;
	}

	public void loadSamples() throws ClassNotFoundException, SQLException {
		samples = new MemoryTable(this.databaseDriverName,
				this.databaseConnectionURL, this.databaseUsername,
				this.databasePassword, this.databaseTableName,
				this.fieldNames.toArray(new String[0]),
				SampleConfiguration.MAX_SAMPLES);
		dataLoaded = true;
	}

	public void setDatabaseProperties(String driver, String connectionURL,
									 String username, String password,
									 String tableName) throws ClassNotFoundException, SQLException{
		this.databaseDriverName = driver;
		this.databaseConnectionURL = connectionURL;
		this.databaseUsername = username;
		this.databasePassword = password;
		this.databaseTableName = tableName;
		
		if(!this.lazyLoad) //If lazyload is not enabled, load the samples.
			this.loadSamples();
	}

	public void setFieldsMapping(HashMap<String, String> fieldsMapping) {
		this.fieldsMapping = fieldsMapping;
	}

	public void setLazyLoad(boolean lazyLoad) {
		this.lazyLoad = lazyLoad;
	}

	public void setName(String name) {
		this.name = name;
	}

	public void setFieldNames(List<String> fieldNames) {
		this.fieldNames = fieldNames;
	}

	public void setType(String type) {
		this.type = type;
	}

	@Override
	public String toString() {
		return name + " :" + type + " :" + lazyLoad + "\n" + samples + "\n"
				+ fieldsMapping + "\n" + databaseDriverName + ":"
				+ databaseConnectionURL + ":" + databaseUsername + ":"
				+ databasePassword + ":" + databaseTableName;
	}

}
