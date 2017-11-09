package edu.isi.sourceDiscovery.agent;

import java.io.ByteArrayInputStream;
import java.util.ArrayList;
import java.util.List;

import javax.xml.parsers.SAXParser;
import javax.xml.parsers.SAXParserFactory;

import org.xml.sax.Attributes;
import org.xml.sax.helpers.DefaultHandler;

public class FetchOutputParser extends DefaultHandler {
	private String xmlOutput;
	private boolean startExtractedData;
	private boolean startData;
	private boolean startRow;
	private boolean startValue;
	private int currentRow;
	private int currentCol;
	private ArrayList<String> openXMLTags;
	private ArrayList<Tuple> extractedData;
	private List<String> columnNames;
	
	public FetchOutputParser(String xml, List<String> columnNames) {
		this.xmlOutput = xml;
		this.columnNames = columnNames;
	}
	
	public void parseOutput() {
		SAXParserFactory factory = SAXParserFactory.newInstance();
		  try {
		       SAXParser saxParser = factory.newSAXParser();
		       byte[] utf8_bytes = null;
		       utf8_bytes = xmlOutput.getBytes("UTF-8");
		       saxParser.parse(new ByteArrayInputStream(utf8_bytes), this);
		       //System.out.println("Final Result: " + extractedData);
		  } catch (Throwable err) {
		        err.printStackTrace ();
		  }
	}
	
	@Override
	public void startDocument() {		
		openXMLTags = new ArrayList<String>();
		extractedData = new ArrayList<Tuple>();
		currentRow = -1;
		currentCol = -1;
		//System.out.println("Document started.");
	}

	public Object getExtractedElement() {
		if(extractedData.size() > 0) {			
			Tuple tuple = extractedData.get(0);
			if(tuple.size() > 0) return tuple.getValue(0);
		}
		return "";
	}
	
	public ArrayList<Object> getExtractedElementList() {
		ArrayList<Object> firstColumn = new ArrayList<Object>();
		for(int i=0; i<extractedData.size(); i++) {
			Tuple row = extractedData.get(i);
			if(row.size() > 0) 
				firstColumn.add(row.getValue(0));
			else
				firstColumn.add("");
		}
		return firstColumn;
	}
	
	
	public Tuple getExtractedTuple() {
		if(extractedData.size() > 0) {
			return extractedData.get(0);
		}
		
		return new Tuple();
	}
	
	public ArrayList<Tuple> getExtractedTuples() {
		return extractedData;
	}
	
	@Override
	public void startElement(String namespaceURI, String localName,
			String qName, Attributes atts) {
		//System.out.println("Started element " + qName);
		if(qName.equals("ExtractedData") && openXMLTags.size() > 0 && 
				openXMLTags.get(openXMLTags.size()-1).equals("AgentExecution")) {
			startExtractedData = true;			
		}
		if(qName.equals("Data") && startExtractedData)
			startData = true;
		else if(qName.equals("Row") && startData) {
			if(currentRow == -1 || !extractedData.get(currentRow).isEmpty()) {
				
				//Contruct an empty row
				Tuple tuple = new Tuple();
				for(int i=0; i<columnNames.size(); i++)
					tuple.add(columnNames.get(i), new String(""));
				
				//Add the new row
				extractedData.add(tuple); 
				
				currentRow++;
			}
			startRow = true;			
			currentCol = -1;
		} else	if(qName.equals("Value") && startRow) {			
			startValue = true;			
		} else if(startRow) {
			currentCol = columnNames.indexOf(qName);
		}
		openXMLTags.add(qName);
	}

	@Override
	public void endElement(String namespaceURI, String localName, String qName) {
	//	System.out.println("Ended element " + qName);
		if(qName.equals("ExtractedData"))
			startExtractedData = false;
		if(qName.equals("Data") && startData)
			startData = false;
		if(qName.equals("Row") && startRow)
			startRow = false;
		if(qName.equals("Value") && startValue)
			startValue = false;
		openXMLTags.remove(openXMLTags.lastIndexOf(qName));
	}

	@Override
	public void characters(char[] ch, int start, int length) {
		String value = new String(ch, start, length);
		//System.out.println("Encountered characters:"
		//		+ new String(ch, start, length));
		if(startValue && currentCol >= 0) {			
			Tuple row = extractedData.get(currentRow);			
			String prevValue = (String)row.getColumnValue(currentCol);
			row.setColumnValue(columnNames.get(currentCol), prevValue + value);
		}
	}
	
}
