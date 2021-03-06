import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.sql.Connection;
import java.util.StringTokenizer;
import edu.isi.calo.mapping.gui.ODBCSourceInfo;

public class GenerateSIInputs {

	//the DB that has the type examples

	static Connection conn;
	static String dbName = "wrapcache_081218_no";

	static String dbInfo = "MYSQL:wrapcache_081218_no:ragnarok.isi.edu:3306:root:taipei";

	static String inputFileName = "./weather.txt";
	static String outputPath = "./";
	static String domain = "geospatial";

	public static void main(String[] args){
	    /* Typical call:
	       $ GenerateSIInputs <database> <domain_template> <output_path> <domain>
	       $ java -classpath ".;./*" GenerateSIInputs wrapcache_081218_no ../geospatial/2008-12-22/geocoder_us_domain.txt ../geospatial/2008-12-22/ geospatial
	       $ ./run.bat wrapcache_081218_no ../geospatial/2008-12-22/geocoder_us_domain.txt ../geospatial/2008-12-22/ geospatial
	    */

	    dbName = args[0];
	    dbInfo = "MYSQL:" + dbName + ":ragnarok.isi.edu:3306:root:taipei";
	    inputFileName = args[1];
	    outputPath = args[2];
	    domain = args[3];
	      
	    // System.out.println(dbName + "\n" + dbInfo + "\n" + inputFileName + "\n" + outputPath);

	    conn = ODBCSourceInfo.connect(dbInfo);
		
	    StringBuffer fileContent = getFileContent(inputFileName);
		
	    constructFiles(fileContent.toString(), domain);
	}
	
    static void constructFiles(String fileContent, String domain){
		String q = "select tablename, url, formname, formtypes from sourceid where domain ='" + domain + "'";
		String result = ODBCSourceInfo.executeQuery(conn,q,"@@@");
		//System.out.println("Result=" + result);
		
		StringTokenizer row = new StringTokenizer(result, "\n");
		while(row.hasMoreTokens()){
			String oneRow = row.nextToken().trim();
			StringTokenizer col = new StringTokenizer(oneRow,"@@@");
			//will have 4 tokens
			String tablename = col.nextToken().trim();
			String url = col.nextToken().trim();
			String formname = col.nextToken().trim();
			String formtypes = col.nextToken().trim();
			String target = buildTarget(tablename, url, formname, formtypes);
			constructFile(fileContent, target, tablename);
			//System.exit(0);
		}
	}
	
	static void constructFile(String fileContent, String target, String tablename){
		String fName = outputPath + dbName + "__" + tablename + ".txt";
		System.out.println("Create file:" + fName);
		//System.out.println("target:" + target);
		fileContent += "\n" + target + "\n";
		try{
			FileWriter fo = new FileWriter(fName);
			fo.write(fileContent, 0, fileContent.length()-1);
			fo.close();
		} catch (IOException e) {
			System.out.println(e);
		}

	}

    static String buildTarget(String tablename, String url, String formname, String formtypes){
		String target = "";
		String semanticTypes = getSemanticTypes(tablename);
		
		target = "target " + tablename + "(" + semanticTypes + ") {wrappers.DBService; " + 
			url + "; " + formname + "; " + formtypes + "}";
		return target;
	}

	static String getSemanticTypes(String tablename){
		String semanticTypes = "";
		String q = "select semantictype, direction, argumentno from sourceschema where tablename ='" +
				tablename + "' order by argumentno DESC";
		
		String result = ODBCSourceInfo.executeQuery(conn,q,"@@@");
		//System.out.println("Result=" + result);
		
		StringTokenizer row = new StringTokenizer(result, "\n");
		int nrRows=0;
		while(row.hasMoreTokens()){
			String oneRow = row.nextToken().trim();
			StringTokenizer col = new StringTokenizer(oneRow,"@@@");
			//will have 2 tokens
			String semantictype = col.nextToken().trim();
			String direction = col.nextToken().trim();

			if(nrRows>0) semanticTypes += ","; 
			semanticTypes += prepareTypeName(semantictype, direction);
			nrRows++;
		}
		return semanticTypes;
	}
	
	static StringBuffer getFileContent(String file){

		StringBuffer content = new StringBuffer();
		BufferedReader buff = null;
		File f = null;
		try {
			f = new File(file);
			buff = new BufferedReader(new FileReader(f));
		} catch (FileNotFoundException e) {
			System.out.println(e);
			System.out.println("pattern file was not found:"+ f.toString());
		}
		try {
			String line = null;
			while((line= buff.readLine())!=null){
				content.append(line + "\n");
			}
			buff.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return content;
	}

	static public String prepareTypeName(String name, String direction){
		String s = name;
		s = s.replace('-','_');
		if(s.equals("PR_TempInC") || s.equals("PR_TempCdeg"))
			s="PR_TempC";
		if(s.equals("PR_TempInF") || s.equals("PR_TempFdeg"))
			s="PR_TempF";
		if(s.equals("PR_Visibility"))
			s="PR_VisibilityInMi";
		if(s.equals("PR_PressureInInches"))
			s="PR_Pressure";
		if(s.equals("PR_WindSpeed"))
			s="PR-WindSpeedInMPH";
		if(direction.equals("IN"))
			s = "$" + s;
		return s;
	}	
}

