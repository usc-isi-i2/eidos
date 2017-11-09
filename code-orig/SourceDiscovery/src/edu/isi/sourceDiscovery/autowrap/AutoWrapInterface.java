package edu.isi.sourceDiscovery.autowrap;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.StringUtils;

import com.fetch.autowrap.dom.DomTools;
import com.fetch.autowrap.dom.DomTreeHandle;
import com.fetch.autowrap.dom.DomTreeNode;
import com.fetch.autowrap.dom.NodeListWrapper;
import com.fetch.autowrap.list.BasicLabeledColumnSparseList;
import com.fetch.autowrap.tree.TreeNode;
import com.fetch.learning.core.common.IntPair;
import com.fetch.tokenization.impl.TokenizationContext;
import com.fetch.tokenization.utils.TokenizationUtils;

/**
 * Interface for Fetch's Autowrap code.
 * It calls autowrap to extract data from multiple pages and adds functionality to
 * flatten the results returned by Autowrap
 * @author dipsy
 *
 */
public class AutoWrapInterface {

	BasicLabeledColumnSparseList autowrapResult;
	TokenizationContext tokenizationContext;
	
	/**
	 * Constructor. Initialzes the tokenizationContext required by Autowrap
	 *
	 */
	public AutoWrapInterface() {
		//Create an instance of the toeknization context used for Autowrap
		tokenizationContext = 
		    TokenizationContext.newInstance(TokenizationUtils.ID_STALKER, 
		                                    TokenizationUtils.ID_STALKER);
	}
	
	/**
	 * This method should be called after invokeAutoWrap has been already called.
	 * It converts the result returned by Atowrap into a flat 2 dimensional table.
	 * @return - Flattened result from Autowrap
	 */
	public ArrayList<ArrayList<String>> getFlattenedResult() {
		ArrayList<ArrayList<String>> result = new ArrayList<ArrayList<String>>();
		
		ArrayList<ArrayList<Object>> objResult = getFlattenedResult(getTableAsList(autowrapResult), autowrapResult.rows(), autowrapResult.columns());
		for(int i=0; i<objResult.size(); i++) {
			
			ArrayList<Object> objRow = objResult.get(i);
			ArrayList<String> dataRow = new ArrayList<String>();
			
			for(int j=0; j<objRow.size(); j++)
				dataRow.add(objRow.get(j).toString());
			
			result.add(dataRow);
		}
		
		return result;
	}
	
	/**
	 * This method should be called after invokeAutoWrap has been already called.
	 * It converts the result returned by Atowrap into a flat 2 dimensional table.
	 * It gives simply one row per page that was given to Autowrap.
	 * This method is better to get results where the expected output is NOT lists.
	 * If the page contains data like this:
	 * 		Temperature		80 F
	 * 		Sky				Clear
	 * 		Humidity		10%
	 * getFlattenedResults would give back 80 F, Clear, 10% as one column which
	 * is not what would be required if we need to identify data based on columns.
	 * This method however would give back 80F, Clear, 10% as three different columns.
	 * @return - Flattened result from Autowrap
	 */
	public ArrayList<ArrayList<String>> getFlattenedResultsOneRowPerPage() {		
		return	getFlattenedResultsOneRowPerPage(autowrapResult);
	}
	
	
	/**
	 * Returns the result returned by Autowrap. It contains Nested tables.
	 * This result is a table whose cells are either  slots or BasicLabeledColumnSparseList
	 * @return
	 */
	public BasicLabeledColumnSparseList getResult() {
		return autowrapResult;
	}
	
	/**
	 * Calls autowrap to extract data from the passed HTML pages.
	 * AUtowrap tries to learn a template from the passed pages and returns back the
	 * data using the template.
	 * The sample pages should be the result of invoking a website usng different values
	 * (i.e should be having some common template)
	 * @param samplePages - List of HTML pages
	 * @throws IOException
	 */
	public void invokeAutoWrap(List<String> samplePages) throws IOException {
		if(samplePages.size() > 0) {
			List<DomTreeHandle> domTrees = new ArrayList<DomTreeHandle>(samplePages.size());
			
			for(String samplePage : samplePages) {
				DomTreeHandle domTree = DomTools.parseDocument(samplePage, tokenizationContext);
				domTrees.add(domTree);
			}
	
			autowrapResult = DomTools.getSlots(domTrees);
		}		
	}
	
	private ArrayList<ArrayList<Object>> getFlattenedResult(ArrayList<ArrayList<Object>> data, int maxRows, int maxCols) {
		ArrayList<ArrayList<Object>> result = new ArrayList<ArrayList<Object>>();
		
		int currentRow = 0;
		int currentCol = 0;
		int currentSubRow = 0;
		int currentSubRowMaxIndex = 0;
		
//		int maxRows = autowrapResult.rows();
//		int maxCols = autowrapResult.columns();
		
		boolean isDataFlattened = true;		
		int numCols = 0;
		
		while(currentRow < maxRows) {
			ArrayList<Object> row = new ArrayList<Object>();
			
			while(currentCol < maxCols) {
				//Object o = autowrapResult.getObject(currentRow, currentCol);
				Object o = data.get(currentRow).get(currentCol);
				if(o instanceof BasicLabeledColumnSparseList) {
					BasicLabeledColumnSparseList list = (BasicLabeledColumnSparseList)o;
					
					if(currentSubRow < list.rows()) {
						for(int i=0; i<list.columns(); i++) {
							Object o2 = list.getObject(currentSubRow, i);						
							if(o2 != null) {
								if(o2 instanceof BasicLabeledColumnSparseList) {
									row.add(o2);
									isDataFlattened = false;
								} else {
									row.add(o2.toString());
								}
							} else {
								row.add("");
							}
						}
					} else {
						for(int i=0; i<list.columns(); i++) {
							row.add("");
						}
					}
					if(list.rows() > currentSubRowMaxIndex)
						currentSubRowMaxIndex = list.rows();					
				} else {
					if(o != null && currentSubRow == 0) //Remove currentSubRow condition if want data to be repeated
						row.add(o.toString());
					else
						row.add("");
					
				}
				currentCol++;
			}
			
			currentSubRow++;
			
			if(currentSubRow >= currentSubRowMaxIndex) {
				currentRow++;
				currentSubRow = 0;
				currentSubRowMaxIndex = 0;
			}
			
			currentCol = 0;
			
			if(row.size() > numCols)
				numCols = row.size();
			
			result.add(row);
		}
		
		if(!isDataFlattened)
			result = getFlattenedResult(result, result.size(), numCols);
		
		return result;
	}
		
	private ArrayList<String> getParentData(NodeListWrapper object) {
		ArrayList<String> data = new ArrayList<String>();
		StringBuilder parent = new StringBuilder("");
		StringBuilder tillSpace = new StringBuilder("");
		
		TreeNode tn = object.getNodeList().get(0);
		if(tn instanceof DomTreeNode && tn.getChildren().size() == 0) {
			DomTreeNode dtn = (DomTreeNode)tn;
			IntPair myPosition = dtn.m_sourcePos;
			boolean tillSpaceExtractionStarted = false;
			int pos = myPosition.first;
			//boolean extractParent = false;
			
			List<DomTreeNode> children = dtn.getParent().getChildren();
			for(int i=0; i<children.size(); i++) {
				DomTreeNode child = children.get(i);
				IntPair position = child.m_sourcePos;
				//if(position.first == myPosition.first)
					//extractParent = true;
				//if(extractParent) {
					if(position.first > pos)
						parent.append(" ");
					parent.append(child.getDomValue());
				//}
				
				if(!tillSpaceExtractionStarted && position.first == myPosition.first) {
					tillSpaceExtractionStarted = true;
					pos = position.first;
				}
				if(tillSpaceExtractionStarted) {
					String value = child.getDomValue();
					if(position.first > pos || StringUtils.isEmpty(value)) {
						tillSpaceExtractionStarted = false;
					} else {						
						tillSpace.append(value);
					}
				}
				pos = position.second + 1;
			}
		}
		
		String parentStr = parent.toString();
		String tillSpaceStr = tillSpace.toString();
		String objectStr = object.toString();
		if(parent.length() > 0 && !parentStr.equals(objectStr)) {
			data.add(parent.toString());
		} else {
			data.add("NULL");
		}
		
		if(tillSpace.length() > 0 && (tillSpaceStr.length() > objectStr.length()) &&
				(!tillSpaceStr.equals(parentStr))) {
			data.add(tillSpace.toString());			
		} else {
			data.add("NULL");
		}
		return data;
	}
	
	private  ArrayList<ArrayList<String>> getFlattenedResultsOneRowPerPage(BasicLabeledColumnSparseList data) {
				
		ArrayList<ArrayList<String>> result = new ArrayList<ArrayList<String>>();
		int maxRows = data.rows();
		int maxCols = data.columns();
		
		//Construct an empty result
		for(int i=0; i<maxRows; i++) {
			result.add(new ArrayList<String>());
		}
		
		ArrayList<Integer> numColumns = new ArrayList<Integer>();
		for(int col=0; col<maxCols; col++) {
			numColumns.add(new Integer(1));
		}
		for(int row=0; row<maxRows; row++) {
			//ArrayList<Object> dataRow = data.get(row);
			
			for(int col=0; col<maxCols; col++) {
				Object o = data.getObject(row, col);
				if(o instanceof BasicLabeledColumnSparseList) {
					int numCols = ((BasicLabeledColumnSparseList)o).rows() * ((BasicLabeledColumnSparseList)o).columns();
					if(numCols > numColumns.get(col)) {
						numColumns.set(col, numCols);
					}
				}
			}
		}
		
		String lastParent = "NULL";
		
		for(int row=0; row<maxRows; row++) {
			ArrayList<String> resultRow = result.get(row);
							
			for(int col=0; col<maxCols; col++) {
				Object o = data.getObject(row, col);
				if(!(o instanceof BasicLabeledColumnSparseList)) {
					if(o != null) {
						resultRow.add(o.toString());
						List<String> x = getParentData((NodeListWrapper)o);
						String parent = x.get(0);
						String tillSpace = x.get(1);
						if(!parent.equals(lastParent))
							resultRow.add(parent);
						else
							resultRow.add("NULL");
						
						resultRow.add(tillSpace);
						lastParent = parent;
					} else {
						resultRow.add("NULL");
						resultRow.add("NULL");
						resultRow.add("NULL");
						lastParent = "NULL";
					}
				} else {
					BasicLabeledColumnSparseList list = (BasicLabeledColumnSparseList)o;
					for(int listRow=0; listRow<list.rows(); listRow++) {
						for(int i=0; i<list.columns(); i++) {
							Object o2 = list.getObject(listRow, i);
							if(o2 instanceof BasicLabeledColumnSparseList) {								
								ArrayList<ArrayList<String>> subTable = getFlattenedResultsOneRowPerPage((BasicLabeledColumnSparseList)o2);
								for(ArrayList<String> x : subTable)
									resultRow.addAll(x);
							} else {
								if(o2 != null) {
									resultRow.add(o2.toString());
									List<String> x = getParentData((NodeListWrapper)o2);
									String parent = x.get(0);
									String tillSpace = x.get(1);
									if(!parent.equals(lastParent))
										resultRow.add(parent);
									else
										resultRow.add("NULL");
									
									resultRow.add(tillSpace);
									lastParent = parent;
								} else {
									resultRow.add("NULL");
									resultRow.add("NULL");
									resultRow.add("NULL");
									lastParent = "NULL";
								}
							}
						}
					}
					int colsAdded = list.rows() * list.columns();
					int colsToBeAdded = numColumns.get(col);
					for(int k=colsAdded; k<colsToBeAdded; k++) {
						resultRow.add("NULL");
						resultRow.add("NULL");
						resultRow.add("NULL");						
					}
				}
			}
		}
				
		
		//Now remove columns that have the same value for each row
		if(result.size() > 0){
			int numCols = result.get(0).size();
			for(int col=0; col<numCols; col++) {
				String row0Value = result.get(0).get(col);
				boolean allMatch = true;
				for(int row=1; row<result.size(); row++) {
					if(!result.get(row).get(col).equals(row0Value)) {
						allMatch = false;
						break;
					}
				}
				if(allMatch) {
					for(int i=0; i<result.size(); i++)
						result.get(i).remove(col);
					col--;
					numCols--;
				}
			}
		}
		
		return result;
	}
	
	private ArrayList<ArrayList<Object>> getTableAsList(BasicLabeledColumnSparseList list) {
		ArrayList<ArrayList<Object>> result = new ArrayList<ArrayList<Object>>();
		for(int i=0; i<list.rows(); i++) {
			
			ArrayList<Object> row = new ArrayList<Object>();
			for(int j=0; j<list.columns(); j++) {
				row.add(list.getObject(i, j));
			}
			
			result.add(row);
		}
		return result;
	}	
}
