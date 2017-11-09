package edu.isi.sourceDiscovery;

import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

import com.fetch.autowrap.dom.DomTools;
import com.fetch.autowrap.dom.DomTreeHandle;
import com.fetch.autowrap.dom.NodeListWrapper;
import com.fetch.autowrap.list.BasicLabeledColumnSparseList;
import com.fetch.naturallanguage.formextractor.FormElement;
import com.fetch.naturallanguage.formextractor.FormFieldElement;
import com.fetch.naturallanguage.formextractor.HtmlDocument;
import com.fetch.naturallanguage.formextractor.FormFieldElement.ElementType;
import com.fetch.tokenization.impl.TokenizationContext;
import com.fetch.tokenization.utils.TokenizationUtils;

import edu.isi.sourceDiscovery.formInvocation.FormInvoker;
import edu.isi.sourceDiscovery.formInvocation.HttpMethod;

public class MainFormExtraction {

	public static int NUMBER_OF_EXAMPLE_PAGES = 15;
	
	public static void main(String[] args) throws IOException {
		
		/**
		 * Assume that delicios gave the following web-pages as results:
		 * http://www.weather.com/
		 */
		
		String resultPageURL = "http://www.weather.com/";
		HtmlDocument doc = new HtmlDocument(new URL(resultPageURL));
		List<FormElement> formElements = doc.execute();
		
		if(formElements != null) {
			for(FormElement form : formElements) {
				String url = form.getUrl();
				
				//Make sure there is a URL to invoke
				if(url.equals(""))
					continue;
				
//				Convert URL into absolute URL
				if(url.startsWith("/"))
					url = resultPageURL + "/";
				else if(!url.startsWith("http"))
					url = resultPageURL + "/" + url;
				
				HttpMethod method = HttpMethod.getMethod(form.getMethod());
								
				List<ArrayList<String>> fieldNamesList = new ArrayList<ArrayList<String>>(NUMBER_OF_EXAMPLE_PAGES);
				List<ArrayList<String>> fieldValuesList = new ArrayList<ArrayList<String>>(NUMBER_OF_EXAMPLE_PAGES);
				
				for(int i=0; i<NUMBER_OF_EXAMPLE_PAGES; i++) {
					ArrayList<String> fieldNames = new ArrayList<String>();
					ArrayList<String> fieldValues = new ArrayList<String>();
					fieldNamesList.add(fieldNames);
					fieldValuesList.add(fieldValues);
				}
				
				for(FormFieldElement formField : form.getFields()) {
					String name = formField.getName();
					if(name != null) {
						for(int i=0; i<NUMBER_OF_EXAMPLE_PAGES; i++) {
							fieldNamesList.get(i).add(name);
						}
											
						if(formField.getType() == ElementType.TEXT) {
							//Get the sample value for the text to invoke the form
							String type = getValueType(formField.getName());
							List<String> examples = getExamplesOfType(type);
							for(int i=0; i<NUMBER_OF_EXAMPLE_PAGES; i++) {
								fieldValuesList.get(i).add(examples.get(i));
							}
						} else {						
							String value = formField.getValue();
							if(value == null)
								value = "";
							for(int i=0; i<NUMBER_OF_EXAMPLE_PAGES; i++) {
								fieldValuesList.get(i).add(value);
							}
						}
					}
				}
				
				FormInvoker invoker = new FormInvoker(url, method);
				List<DomTreeHandle> domTrees = new ArrayList<DomTreeHandle>(NUMBER_OF_EXAMPLE_PAGES);
				for(int i=0; i<NUMBER_OF_EXAMPLE_PAGES; i++) {
					String html = invoker.invoke(fieldNamesList.get(i), fieldValuesList.get(i));
					
					TokenizationContext ctx = 
					    TokenizationContext.newInstance(TokenizationUtils.ID_STALKER, 
					                                    TokenizationUtils.ID_STALKER);
					
					DomTreeHandle domTree = DomTools.parseDocument(html, ctx);
					domTrees.add(domTree);
				}
				
				BasicLabeledColumnSparseList data = DomTools.getSlots(domTrees);
				printData(data, 0);
			}
		}
	}
	
	public static void printData(BasicLabeledColumnSparseList data, int numTabs) {
		int numRows = data.rows();
		int numCols = data.columns();
				
		for(int col=0; col<numCols; col++) {
			System.out.println();
			for(int i=0; i<numTabs; i++)
				System.out.print("\t");
			System.out.print("Column" + col + ":");
			
			for(int row=0; row<numRows; row++) {
			
				Object cell = data.getObject(row, col);
				
				if(cell instanceof BasicLabeledColumnSparseList) {
					printData((BasicLabeledColumnSparseList)cell, numTabs+1);
				} else {
					NodeListWrapper cellData = (NodeListWrapper)cell;
					System.out.print(cellData);
					System.out.print("\t>>>>>>");
				}
			}
			
		}
	}
	
	
	
	//From the classifier, get the data type for the input field
	public static String getValueType(String inputFieldName) {
		//TODO: /From the classifier, get the data type for the input field
		return "zipcode";
	}
	
	public static List<String> getExamplesOfType(String datatype) {
		//TODO: Get the set of examples from the examples database
		List<String> examples = new ArrayList<String>();
		
		if(datatype.equalsIgnoreCase("zipcode")) {
			examples.add("90292");
			examples.add("10001");
			examples.add("20022");
			examples.add("90245");
			examples.add("60661");
			examples.add("50011");
			examples.add("40075");
			examples.add("80239");
			examples.add("70121");
			examples.add("30548");
			examples.add("90007");			
			examples.add("90405");
			examples.add("90048");
			examples.add("90278");
			examples.add("20997");
			examples.add("56972");
		}
		
		return examples;
	}
}
