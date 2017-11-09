package invocation;

import java.util.ArrayList;

public class InvocationLog {
    
	// keep log of source invocations:
	long timestamp = 0;
	
	// record the number of successes and also the successive failures (reset for each successful invocation)
	public ArrayList<String>  successfulInput = new ArrayList<String>();
	public int successCount = 0;
	public int successiveFailureCount = 0;
	public int successiveFailureLimit = 10;
	
}
