package edu.isi.sourceDiscovery.config;

import java.io.FileInputStream;
import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.input.SAXBuilder;

import edu.isi.sourceDiscovery.common.MemoryTableOverflowException;

/**
 * JDOM Parser for parsing the source discovery configuration file. It parses
 * the file for all domain and sample configurations
 * 
 * @author dipsy
 * 
 */
public class ConfigurationParser {

	Document document;

	HashMap<String, Domain> domains = new HashMap<String, Domain>();

	HashMap<String, SampleConfiguration> sampleConfigs = new HashMap<String, SampleConfiguration>();

	/**
	 * Constructor.
	 * It loads the configuration file and parses it to extract all domain
	 * and sample configurations
	 * 
	 * @param configFilename - THe filename of the configuration file
	 * @throws IOException
	 * @throws JDOMException
	 * @throws SQLException
	 * @throws ClassNotFoundException
	 */
	public ConfigurationParser(String configFilename) throws IOException,
			JDOMException, SQLException, ClassNotFoundException {
		
		//Load the configuration file using a SAX Builder
		SAXBuilder builder = new SAXBuilder();
		document = builder.build(new FileInputStream(configFilename));
		Element element = document.getRootElement();

		//Load all the domains
		loadDomains(element.getChild("domains"));
		
		//Load all the sample's configurations
		loadSampleConfigurations(element.getChild("sampleConfigurations"));
	}

	/**
	 * Returns all the domains found in the configuration file
	 * @return
	 */
	public Collection<Domain> getAllDomains() {
		return domains.values();
	}

	/**
	 * Returns all sample's configurations found in the configuration file 
	 * @return
	 */
	public Collection<SampleConfiguration> getAllSampleConfigurations() {
		return sampleConfigs.values();
	}

	/**
	 * Each domain must have a unique index and a name.
	 * This function get the domain whose index matches the passed value
	 * @param domainIndex
	 * @return
	 */
	public Domain getDomain(int domainIndex) {
		for (Domain domain : domains.values()) {
			if (domain.getIndex() == domainIndex)
				return domain;
		}
		return Domain.UNKNOWN;
	}

	/**
	 * Gets the domain whose name matches the passed value
	 * @param domainName
	 * @return The Domain Object
	 */
	public Domain getDomain(String domainName) {
		return domains.get(domainName);
	}

	/**
	 * Get the sample's configuration with the passed name
	 * @param configName
	 * @return
	 */
	public SampleConfiguration getSampleConfiguration(String configName) {
		return sampleConfigs.get(configName);
	}

	private void loadDatabaseConfig(Element databaseRoot,
			SampleConfiguration config) throws SQLException, ClassNotFoundException {
		config.setDatabaseProperties(databaseRoot.getChildText("driver"),
							databaseRoot.getChildText("connectionURL"),
							databaseRoot.getChildText("username"),
							databaseRoot.getChildText("password"),
							databaseRoot.getChildText("tableName"));
	}

	private void loadDomains(Element domainRoot) {
		for (Object domainElement : domainRoot.getChildren("domain")) {
			Domain domain = new Domain();
			domain.setName(((Element) domainElement).getAttributeValue("name"));
			domain.setIndex(Integer.parseInt(((Element) domainElement)
					.getAttributeValue("index")));

			Element inputs = ((Element) domainElement).getChild("inputs");
			if (inputs != null) {
				for (Object inputSetElement : inputs.getChildren("inputSet")) {
					InputSet inputSet = new InputSet();
					inputSet.setSampleConfig(((Element) inputSetElement)
							.getAttributeValue("sampleConfiguration"));

					for (Object inputElement : ((Element) inputSetElement)
							.getChildren("input")) {
						inputSet.addInputName(((Element) inputElement)
								.getAttributeValue("name"));
					}
					domain.addInputSet(inputSet);
				}
			}

			Element outputs = ((Element) domainElement).getChild("outputs");
			if (outputs != null) {
				for (Object outputSetElement : outputs.getChildren("outputSet")) {
					OutputSet outputSet = new OutputSet();
					String percentageMatchesRequired = ((Element) outputSetElement)
							.getAttributeValue("percentageMatchesRequired");
					if (!StringUtils.isEmpty(percentageMatchesRequired))
						outputSet.setPercentageMatchesRequired(Float
								.parseFloat(percentageMatchesRequired));

					for (Object outputElement : ((Element) outputSetElement)
							.getChildren("output")) {
						Output output = new Output();
						output.setName(((Element) outputElement)
								.getAttributeValue("name"));
						String required = ((Element) outputElement)
								.getAttributeValue("required");
						if (required != null
								&& required.equalsIgnoreCase("true"))
							output.setRequired(true);
						else
							output.setRequired(false);
						String weight = ((Element) outputElement).getAttributeValue("weight");
						
						if(!StringUtils.isEmpty(weight))
							output.setWeight(Integer.parseInt(weight));
						
						for (Object outType : ((Element) outputElement)
								.getChildren("outputType")) {
							output
									.addValueDomain(((Element) outType)
											.getText());
						}

						outputSet.addOutput(output);
					}
					domain.addOutputSet(outputSet);
				}
			}

			domains.put(domain.getName(), domain);
		}
	}

	private void loadMemoryTable(Element staticDataRoot,
			SampleConfiguration config) {
		int rowNum = 0;
		for (Object row : staticDataRoot.getChildren("DataRow")) {
			List<String> fieldNames = new ArrayList<String>();
			List<String> fieldValues = new ArrayList<String>();

			for (Object column : ((Element) row).getChildren("DataColumn")) {
				fieldNames.add(((Element) column).getAttributeValue("name"));
				fieldValues.add(((Element) column).getText());
			}

			if (rowNum == 0) {
				config.setFieldNames(fieldNames);
			}

			try {
				config.addSampleDataRow(fieldValues);
			} catch (MemoryTableOverflowException me) {
				me.printStackTrace();
			}
			rowNum++;

			if (rowNum >= SampleConfiguration.MAX_SAMPLES)
				break;
		}
	}

	private void loadSampleConfigurations(Element sampleConfigRoot)
			throws SQLException, ClassNotFoundException {
		
		for (Object sampleConfigElement : sampleConfigRoot.getChildren("sampleConfiguration")) {
			SampleConfiguration config = new SampleConfiguration();
			config.setName(((Element) sampleConfigElement).getAttributeValue("name"));
			config.setType(((Element) sampleConfigElement).getAttributeValue("type"));
			String lazyLoad = ((Element) sampleConfigElement).getAttributeValue("lazyLoad");
			if (lazyLoad != null && lazyLoad.equalsIgnoreCase("true"))
				config.setLazyLoad(true);

			Element fieldMappings = ((Element) sampleConfigElement).getChild("fieldMapping");
			List<String> tableFieldNames = new ArrayList<String>();
			for (Object mapping : fieldMappings.getChildren("field")) {
				String name = ((Element) mapping).getAttributeValue("name");
				String tableFieldName = ((Element) mapping).getAttributeValue("column");
				String semanticType = ((Element) mapping).getAttributeValue("type");
				tableFieldNames.add(tableFieldName);
				config.addFieldsMapping(name, semanticType, tableFieldName);
			}
			config.setFieldNames(tableFieldNames);

			if (config.getType().equalsIgnoreCase("static")) {
				loadMemoryTable(((Element) sampleConfigElement)
						.getChild("staticData"), config);
			} else {
				loadDatabaseConfig(((Element) sampleConfigElement)
						.getChild("databaseConfig"), config);
			
			}

			sampleConfigs.put(config.getName(), config);
		}
	}
}
