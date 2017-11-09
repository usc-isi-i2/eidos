package relational;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import domain.SemanticType;
import domain.Predicate;

public class Table {
	
	public List<String> 			colNames;
	public List<SemanticType> 		colTypes;
	public List<List<String>> tuples;

	public Table() {
		this.colNames = new ArrayList<String>();
		this.colTypes = new ArrayList<SemanticType>();
		this.tuples   = new ArrayList<List<String>>();
	}

	public Table(List<String> columnNames) {
		this();
		this.colNames.addAll(columnNames);
	}
	
	public Table(String[] columnNames) {
		this();
		for (String name: columnNames) {
			this.colNames.add(name);
		}
	}
	
	public Table(Predicate p) {
		this();
		for (int i=0; i<p.arity; i++) {
			colNames.add(p.types[i].name + i);
			colTypes.add(p.types[i]);
		}
	}
	
	public int arity() {
		return colNames.size();
	}
	
	public int size() {
		return tuples.size();
	}

	public boolean insertDistinct(List<String> tuple) {
		if (tuple.size() == colNames.size()) {
			if (!tuples.contains(tuple)) {
				tuples.add(tuple);
				return true;
			}
			else {
				return false;
			}
		}
		else {
			System.err.println("ERROR inserting tuple: ["+listToString(tuple)+"]\n into table with columns: ["+listToString(colNames)+"]"); 
			System.exit(9);
			return false;
		}
	}
	
	public boolean insertDistinct(String[] tuple) {
		ArrayList<String> t = new ArrayList<String>(tuple.length);
		for (String val: tuple) {
			t.add(val);
		}
		return insertDistinct(t);
	}
	
	public Table distinctProjection(List<String> columns) {
		
		// generate output table
		Table output = new Table(columns);
		List<Integer> projectedIndices = getColumnIndices(columns);
		
		// fix types
		if (!colTypes.isEmpty()) {
			output.colTypes = new ArrayList<SemanticType>(columns.size());
			for (int index: projectedIndices) {
				output.colTypes.add(colTypes.get(index));
			}
		}
		
		for (List<String> tuple: tuples) {
			List<String> subtuple = new ArrayList<String>(columns.size());
			for (int index: projectedIndices) {
				subtuple.add(tuple.get(index));
			}
			output.insertDistinct(subtuple);
		}
		
		return output;
	
	}

	public void filter(String operator, String argument0, String argument1) {
		
		Operator op = Operator.parse(operator);
		
		if (argument0.startsWith("'")) {
			filter(op.invert(), getColumnIndex(argument1), Double.parseDouble(argument0.substring(1,argument0.length()-1)));
		}
		else if (argument1.startsWith("'")) {
			filter(op, getColumnIndex(argument0), Double.parseDouble(argument1.substring(1,argument1.length()-1)));
		}
		else {
			filter(op, getColumnIndex(argument0), getColumnIndex(argument1));
		}
		
	}
	
	public Table intersection(Table table) {
		// find common columns:
		ArrayList<String> commonColumns = new ArrayList<String>();
		for (String name: colNames) {
			if (table.colNames.contains(name)) {
				commonColumns.add(name);
			}
		}
		return this.distinctProjection(commonColumns).join(table.distinctProjection(commonColumns));
	}
	
	public Table outerIntersection(Table table) {
		// find common columns:
		ArrayList<String> commonColumns = new ArrayList<String>();
		for (String name: colNames) {
			if (table.colNames.contains(name)) {
				commonColumns.add(name);
			}
		}
		Table distinctProjection = table.distinctProjection(commonColumns);
		//if (distinctProjection.size()>0) {
		//	System.out.println("distinct projection:");
		//	distinctProjection.print();
		//}
		return this.join(distinctProjection);
	}
	
	public Table renameColumns(ArrayList<String> names) {
		if (names.size() == colNames.size()) {
			colNames = names;
			return this;
		}
		System.err.println("ERROR in Table.renameColumns: new column list has incorrect arity");
		System.exit(9);
		return this;
	}
	
	public void print() {
		System.out.print(toString());
	}

	public String toString() {
		
		ArrayList<Integer> columnWidths = getColumnWidths();
		
		for (int i=0; i<columnWidths.size(); i++) { columnWidths.set(i,columnWidths.get(i)+1); }
		
		for (int i=0; i<colNames.size(); i++) {
			int length = colNames.get(i).length() + 1;
			if (length > columnWidths.get(i)) {
				columnWidths.set(i,length);
			}
		}
		ArrayList<String> types = new ArrayList<String>();
		if (!colTypes.isEmpty()) {
			for (int i=0; i<colTypes.size(); i++) { 
				String name = colTypes.get(i).name;
				types.add("(" + name + ")");
				if (name.length()+3 > columnWidths.get(i)) {
					columnWidths.set(i,name.length()+3);
				}
			}
		}
		
		int totalWidth=0;
		for (int width: columnWidths) { totalWidth += width; }
		
		
		String s = "";
		
		for (int i=0; i<totalWidth; i++) { s+="*"; } s+="\n";
		s += listToString(colNames,columnWidths) + "\n";
		if (!types.isEmpty()) {
			s += listToString(types,columnWidths) + "\n";
		}
		s += "\n";
		if (tuples.isEmpty()) { s += " NO DATA \n"; }
		for (List<String> tuple: tuples) {
			s += listToString(tuple,columnWidths) + "\n";
		}
		for (int i=0; i<totalWidth; i++) { s+="*"; } s+="\n\n";
		
		return s;
	
	}
	
	public boolean contains(List<String> tuple) {
		if (tuple.size() == colNames.size()) {
			return tuples.contains(tuple);
		}
		System.err.println("ERROR in Table.contains(): "); 
		System.err.println(" Column Names: ["+listToString(colNames)+"]");
		System.err.println(" Tuple values: ["+listToString(tuple)+"]");
		System.exit(9);
		return false;
	}
	
	public List<String> getColumnValues(int index) {
		List<String> values = new ArrayList<String>(this.size());
		for (List<String> tuple: tuples) {
			values.add(tuple.get(index));
		}
		return values;
	}
	
	public void store(DBConnection db, String dbTable, boolean createNew) {
		
		if (createNew) {
			ArrayList<String> columnsWithType = new ArrayList<String>();
			if (!colTypes.isEmpty()) {
				for (int i=0; i<arity(); i++) { 
					SemanticType t = colTypes.get(i);
					columnsWithType.add(colNames.get(i) + " "+ t.primitiveType +"(" + t.primitiveTypeLength + ")"); 
				}
			}
			else {
				ArrayList<Integer> columnWidths = getColumnWidths();
				for (int i=0; i<arity(); i++) { 
					columnsWithType.add(colNames.get(i) + " VARCHAR(" + columnWidths.get(i) + ")"); 
				}
			}	
			db.dropTable(dbTable);
			db.createTable(dbTable,columnsWithType);
		}
		for (List<String> tuple: tuples) {
			db.insert(dbTable,tuple);
		}
	}
	
	public Table randomSubsetWithReplacement(int count) {
		// sanity check:
		if (count > size()) { count = size(); }
		// simple implementation: random selection WITH replacement   
		Table subset = new Table();
		subset.colNames.addAll(colNames);
		subset.colTypes.addAll(colTypes);
		while (subset.size() < count ) {
			List<String> tuple = new ArrayList<String>();
			tuple.addAll(tuples.get((new Random()).nextInt(tuples.size())));
			subset.insertDistinct(tuple);
		} 
		return subset;
	}
	
	public Table randomSubsetWithoutReplacement(int count) {
		// sanity check:
		if (count > size()) { count = size(); }
		// random selection WITHOUT replacement   
		// simple implementation: just copy arraylist - not very efficient for large tables - can be fixed later if needed!
		List<List<String>> tuplesCopy = new ArrayList<List<String>>();
		tuplesCopy.addAll(tuples);
		Table subset = new Table();
		subset.colNames.addAll(colNames);
		subset.colTypes.addAll(colTypes);
		while (subset.size() < count ) {
			ArrayList<String> tuple = new ArrayList<String>();
			tuple.addAll(tuplesCopy.remove((new Random()).nextInt(tuplesCopy.size())));
			subset.insertDistinct(tuple);
		} 
		return subset;
	}
	
	//////////////////////////////////////////////////////////////
	// PRIVATE METHODS:

	private void filter(Operator op, int index0, int index1) {
		int row = 0;
		while (row < tuples.size()) {
			List<String> tuple = tuples.get(row);
			boolean eval;
			try { 
				eval = op.eval(Double.parseDouble(tuple.get(index0)), Double.parseDouble(tuple.get(index1)));
			}
			catch (NumberFormatException e) {
				eval = false;
			}
			if (eval) { 
				row++;
			}
			else {
				tuples.remove(row);
			}
		}
	}
	
	private void filter(Operator op, int index, double value) {
		int row = 0;
		while (row < tuples.size()) {
			List<String> tuple = tuples.get(row);
			if (op.eval(Double.parseDouble(tuple.get(index)), value)) {
				row++;
			}
			else {
				tuples.remove(row);
			}
		}
	}
	
	private ArrayList<Integer> getColumnIndices(List<String> columns) {
		// get column indices
		ArrayList<Integer> indices = new ArrayList<Integer>(columns.size()); 
		for (String name: columns) { 
			indices.add(getColumnIndex(name));
		}
		return indices;
	}
	
	private int getColumnIndex(String column) {
		int index = colNames.indexOf(column);
		if (index != -1) {
			return index;
		}
		System.err.println("Error in Table.getColumnIndex(): no column called "+column+" among "+listToString(colNames));
		System.exit(9);
		return -1;
	}

	private ArrayList<Integer> getColumnWidths() {
		ArrayList<Integer> columnWidths = new ArrayList<Integer>();
		if (!colTypes.isEmpty()) {
			for (SemanticType t: colTypes) { 
				columnWidths.add(t.primitiveTypeLength);
			}
		}
		else {
			for (int i=0; i<arity(); i++) { columnWidths.add(1); }
			for (List<String> tuple: tuples) {
				for (int i=0; i<tuple.size(); i++) {
					if (tuple.get(i).length() > columnWidths.get(i)) {
						columnWidths.set(i,tuple.get(i).length());
					}
				}
			}
		}
		return columnWidths;
	}

	private Table join(Table table) {
		
		// join tables t1 and t2 on common columns
		Table t1 = this;
		Table t2 = table;
		Table t3 = new Table();
		
		List<Integer> commonCols1 = new ArrayList<Integer>();
		List<Integer> commonCols2 = new ArrayList<Integer>();
		List<Integer> newColumns = new ArrayList<Integer>();
		
		t3.colNames.addAll(t1.colNames); 
		for (int i=0; i<t2.arity(); i++) {
			String name = t2.colNames.get(i);
			int index = t1.colNames.indexOf(name);
			if (index == -1) {
				t3.colNames.add(name);
				newColumns.add(i);
			}
			else {
				commonCols1.add(index);
				commonCols2.add(i);
			}
		}
		
		// set column types
		if (!t1.colTypes.isEmpty() && !t2.colTypes.isEmpty()) {
			t3.colTypes.addAll(t1.colTypes); 
			for (int index: newColumns) {
				t3.colTypes.add(t2.colTypes.get(index));
			}
		}
		
				
		for (List<String> tuple1: t1.tuples) {
			for (List<String> tuple2: t2.tuples) {
				boolean equalOnCommonCols = true;
				for (int i=0; i<commonCols1.size(); i++) {
					int col1 = commonCols1.get(i);
					int col2 = commonCols2.get(i);
					
					if (!t3.colTypes.isEmpty()) {
						if (!t1.colTypes.get(col1).areEqual(tuple1.get(col1),tuple2.get(col2))) {
							equalOnCommonCols = false;
							break;
						}
					}
					else if (!tuple1.get(col1).equals(tuple2.get(col2))) {
						equalOnCommonCols = false;
						break;
					}
				}
				if (equalOnCommonCols) {
					// create combined tuple ...
					List<String> tuple3 = new ArrayList<String>(t3.arity());
					tuple3.addAll(tuple1);
					for (int index: newColumns) {
						tuple3.add(tuple2.get(index));
					}
					t3.insertDistinct(tuple3);
				}
			}
		}
		
		if (false) {
			System.out.println();
			System.out.println("Table.join():");
			System.out.println("t1:");
			t1.print();
			System.out.println("t2:");
			t2.print();
			System.out.println("t3:");
			t3.print();
			System.out.println();
		}
		
		return t3;
	}
	
	//////////////////////////////////////////////////////////////
	// STATIC METHODS:
	
    public static String listToString(List<String> tuple) {
    	String separator = ", ";
    	String s = "";
		boolean first = true;
		for (String val: tuple) {
			if (first) { first = false; } else { s+= separator; }
			s += val;
		}
		return s;
    }

    public static String listToString(List<String> tuple, List<Integer> columnWidths) {
    	if (tuple.size()!=columnWidths.size()) { System.err.println("Error in Table.listToString()"); System.exit(9); }
    	String s = "";
		for (int i=0; i<tuple.size(); i++) {
			String val = tuple.get(i);
			if (val==null) { val = ""; }
			int padding = columnWidths.get(i) - val.length();
			if (padding<1) { columnWidths.set(i,val.length()+1); padding =1; }
			s += val;
			for (int j=0; j<padding; j++) { s += " "; }
		}
		return s;
    }

}
