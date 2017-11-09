// $Id: DBConnection.java 16 2008-07-11 01:04:48Z tar $
package relational;

import java.io.FileInputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import domain.Predicate;


/**
 * @author University of Southern California
 * @date $Date: 2008-07-10 18:04:48 -0700 (Thu, 10 Jul 2008) $
 * @version $Revision: 16 $
 *
 * Copyright 2008 University of Southern California.
 * All rights reserved.
 *
 */
public class DBConnection {

	public String cacheDbName;
	public String outputDbName;

	Properties dbProperties;

	enum SQLVariant {MySQL, SQLServer, Oracle}
    SQLVariant dbVendor;
	Connection con;
	Statement  stmt;
    ResultSet  rs;

    public DBConnection(String filename) {

    	try {

    		// load the database connection properties from a file
        	FileInputStream in = new FileInputStream(filename);
        	dbProperties = new Properties();
        	dbProperties.load(in);
        	in.close();

            cacheDbName = dbProperties.getProperty("cacheDbName");
            outputDbName = dbProperties.getProperty("outputDbName");


            String jdbcDriver = dbProperties.getProperty("jdbcDriver");

            // record type of database:
            if (jdbcDriver.equals("com.mysql.jdbc.Driver")) {
            	dbVendor = SQLVariant.MySQL;
            }
            else if (jdbcDriver.equals("com.microsoft.jdbc.sqlserver.SQLServerDriver")) {
            	dbVendor = SQLVariant.SQLServer;
            }

            // start database connection ....
            Class.forName(jdbcDriver);
            con = DriverManager.getConnection(dbProperties.getProperty("dbURL"),dbProperties.getProperty("dbUser"),dbProperties.getProperty("dbPassword"));
            stmt = con.createStatement();

        }
        catch (Exception e) {
        	e.printStackTrace();
        	System.exit(9);
        }

        createDatabaseIfNotExists(cacheDbName);
        createDatabaseIfNotExists(outputDbName);

    }

    public DBConnection(String jdbcDriver, String dbURL, String dbUser, String dbPassword) {

    	try {
            // record type of database:
            if (jdbcDriver.equals("com.mysql.jdbc.Driver")) {
            	dbVendor = SQLVariant.MySQL;
            }
            else if (jdbcDriver.equals("com.microsoft.jdbc.sqlserver.SQLServerDriver")) {
            	dbVendor = SQLVariant.SQLServer;
            }
            // start database connection ....
            Class.forName(jdbcDriver);
            con = DriverManager.getConnection(dbURL,dbUser,dbPassword);
            stmt = con.createStatement();
        }
        catch (Exception e) {
        	e.printStackTrace();
        	System.exit(9);
        }

    }


	public void close() {
		try {
			stmt.close();
			con.close();
		}
    	catch (Exception e) {
    		e.printStackTrace();
    		System.exit(9);
    	}
    }

	public void resetTables(String dbName, List<Predicate> preds) {
		for (Predicate p: preds) {
        	resetTable(dbName,p);
		}
    }

	public void resetTable(String dbName, Predicate pred) {
		// drop tables for predicate
        dropTable(dbName+"."+pred.dbTable);
        dropTable(dbName+".InvocationsOf_" + pred.dbTable);

        // create new table for predicate:
        List<String> columns = new ArrayList<String>(pred.arity);
		for (int j=0; j<pred.arity; j++) {
			columns.add(pred.types[j].name + j + " " + pred.types[j].primitiveType);
		}
		createTable(dbName+"."+pred.dbTable,columns);

		// create also InvocationsOf table containing only input parameters
		columns = new ArrayList<String>();
		for (int j=0; j<pred.arity; j++) {
			if (pred.bindings[j]) {
				columns.add(pred.types[j].name + j + " " + pred.types[j].primitiveType);
			}
		}
		if (!columns.isEmpty()) {
			createTable(dbName+"."+"InvocationsOf_" + pred.dbTable, columns);
		}
    }

	public boolean createTable(String name, List<String> columns) {

    	String update = null;
    	try {
    		update = "CREATE TABLE " + name + " ( " + delimitedList(columns,",") + " )";
        	stmt.executeUpdate(update);
        	System.out.println(update);
        }
        catch (Exception e) {
        	System.err.println("Error in DBConnection.createTable(): update = "+update );
        	e.printStackTrace();
        	return false;
        }
        return true; // success

    }

	public boolean createDatabaseIfNotExists(String name) {
    	String update = null;
    	try {
    		update = "CREATE DATABASE IF NOT EXISTS `" + name + "`;";
        	stmt.executeUpdate(update);
        	System.out.println(update);
        }
        catch (Exception e) {
        	System.err.println("Error in DBConnection.createDatabaseIfNotExists(): update = "+update );
        	e.printStackTrace();
        	return false;
        }
        return true; // success
    }

	public boolean createTableIfNotExists(String name, String[] columns, String primaryKey) {
    	String update = null;
    	try {
    		update = "CREATE TABLE IF NOT EXISTS " + name + " ( " + delimitedList(columns,",");
        	if (primaryKey != null) {
        		update += ", PRIMARY KEY ("+primaryKey+")";
        	}
        	update += " )";
        	stmt.executeUpdate(update);
        	System.out.println(update);
        }
        catch (Exception e) {
        	System.err.println("Error in DBConnection.createTableIfNotExists(): update = "+update );
        	e.printStackTrace();
        	return false;
        }
        return true; // success
    }

    public boolean dropTable(String name) {
    	String update = null;
    	try {
            // drop database tables
        	update = "DROP TABLE IF EXISTS " + name;
        	stmt.executeUpdate(update);
        	System.out.println(update);
        }
        catch (Exception e) {
        	System.err.println("Error in DBConnection.dropTable(): update = "+update );
        	e.printStackTrace();
        	return false;
        }
        return true; // success
    }

	public Table runQuery(String query) {

		Table table = null;

        try {

        	// execute query
	        rs = stmt.executeQuery(query);

	        // get metadata
	        ResultSetMetaData md = rs.getMetaData();
	        int columnCount = md.getColumnCount();
	        ArrayList<String> columnNames = new ArrayList<String>(columnCount);
            for (int i=0; i<columnCount; i++) {
            	columnNames.add(md.getColumnName(i+1));
            }
	        table = new Table(columnNames);

            // get data
	        while (rs.next()) {
	        	ArrayList<String> tuple = new ArrayList<String>(columnCount);
                for (int i=0; i<columnCount; i++) {
                	tuple.add(rs.getString(i+1));
                }
                table.insertDistinct(tuple);
            }

        }
        catch (Exception e) {
        	System.err.println("query = "+query);
        	e.printStackTrace();
        	System.exit(9);
        }

        return table;

    }

	public void insert(String table, List<String> tuple) {
		// insert tuple into database
		String update = null;
		try {
		    update = "INSERT INTO " + table + " VALUES (";
	    	for (int i=0; i<tuple.size(); i++) {
	    		if (i!=0) { update += ","; }
	    		String val = tuple.get(i);
	    		if (val == null) {
	    			val = "";
	    		}
	    		else {
	    			val = val.trim();
	    		}
	    		update += "\"" + val.replaceAll("\"","\\\\\"") + "\"";
	    	}
	    	update += ")";
	        stmt.executeUpdate(update);
		}
		catch (Exception e) {
			System.err.println("update = " + update);
			e.printStackTrace();
		}

	}

	public void insert(String table, String[] tuple) {
		List<String> t = new ArrayList<String>();
		for (String val: tuple) { t.add(val); }
		insert(table, t);
	}

	public boolean returnsEmptySet(String query) {

		try {
        	// execute query
	        return !stmt.executeQuery(query).next();
	    }
        catch (Exception e) {
        	System.err.println("query = "+query);
        	e.printStackTrace();
        	System.exit(9);
        }
        return true;

    }

	public int count(String table) {
		return firstIntValue("SELECT COUNT(*) FROM " + table);
	}

	public int countDistinct(String table, String column) {
		return firstIntValue("SELECT COUNT(DISTINCT " + column + ") FROM " + table);
	}

	public int countDistinct(String table, List<String> columns) {
		return firstIntValue("SELECT COUNT(DISTINCT " + delimitedList(columns,",") + ") FROM " + table);
	}

    public Table randomSubset(String table, int count, boolean distinct) {
    	return runQuery(randomSubsetSQL(table,null,count,distinct));
	}

    public Table randomSubset(String table, List<String> columns, int count, boolean distinct) {
    	return runQuery(randomSubsetSQL(table,delimitedList(columns,","),count,distinct));
	}

    public List<String> randomSubset(String table, String column, int count, boolean distinct) {
    	return runQuery(randomSubsetSQL(table,column,count,distinct)).getColumnValues(0);
	}

    /////////////////////////////////////////////////////
    // static methods

    public static void testConnection(String filename) {
    	DBConnection u = new DBConnection(filename);
    	System.out.println("Successful creation of DB connection.");
    	u.close();
    }

    /////////////////////////////////////////////////////
    // private methods

    private int firstIntValue(String query) {

    	int value = 0;
        try {
    		rs = stmt.executeQuery(query);
            if (rs.next()) {
            	value = rs.getInt(1);
            }
        }
        catch (Exception e) {
        	System.err.println("query = " + query);
        	e.printStackTrace();
        	System.exit(9);
        }
        return value;
    }

	private String randomSubsetSQL(String table, String attributes, int sampleSize, boolean distinct) {
		if (attributes == null) {
			attributes = "*";
		}
		String modifier = "";
		if (distinct) {
			modifier = "DISTINCT ";
		}
		switch (dbVendor) {
		case MySQL:
			return "SELECT " + modifier + attributes + " FROM " + table + " ORDER BY RAND() LIMIT " + sampleSize;
		case SQLServer:
			return "SELECT TOP " + sampleSize + " " + modifier + attributes + " FROM " + table + " ORDER BY NEWID()";
		case Oracle:
			System.err.println("Error in DBConnection.randomSubsetQuery(): method is NOT YET IMPLEMENTED for ORACLE db!!!");
			System.exit(9);
		}
		return null;
	}

	public String delimitedList(String[] list, String delimiter) {
		StringBuilder s = new StringBuilder();
	    boolean first = true;
		for (String l: list) {
			if (first) {first = false;}
			else {s.append(delimiter);}
			s.append(l);}
		return s.toString();
	}

	public String delimitedList(List<String> list, String delimiter) {
		StringBuilder s = new StringBuilder();
	    boolean first = true;
		for (String l: list) {
			if (first) {first = false;}
			else {s.append(delimiter);}
			s.append(l);}
		return s.toString();
	}

	public String andSeparated(String[] list1, String[] list2) {
		assert list1.length == list2.length;
		List<String> pairs = new ArrayList<String>(list1.length);
		for (int i = 0; i < list1.length; i++) {
		    pairs.add(list1[i] + "='" + list2[i] + "'");
		}
		return delimitedList(pairs, " AND ");
	}

	public String andSeparated(List<String> list1, List<String> list2) {
		assert list1.size() == list2.size();
		List<String> pairs = new ArrayList<String>(list1.size());
		for (int i = 0; i < list1.size(); i++) {
		    pairs.add(list1.get(i) + "='" + list2.get(i) + "'");
		}
		return delimitedList(pairs, " AND ");
	}

}
