package invocation;

import java.util.ArrayList;
import relational.Table;

public interface Wrapper {
    
	Table invoke(String[] endpoint, ArrayList<String> inputTuple);    
	
	void testWrapper();
	
}
