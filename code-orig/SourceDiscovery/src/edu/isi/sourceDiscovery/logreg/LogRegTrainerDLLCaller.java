package edu.isi.sourceDiscovery.logreg;

import com.jstatcom.engine.Engine;
import com.jstatcom.engine.EngineTypes;
import com.jstatcom.engine.PCall;
import com.jstatcom.engine.matlab.MatlabLoadTypes;
import com.jstatcom.model.JSCData;
import com.jstatcom.model.JSCString;

public class LogRegTrainerDLLCaller extends PCall {
	private JSCString trainingTargetFile;
	private JSCString trainingFeatureFile;
	private JSCString outputModelFile;
	
	
	/**
	 * Constructor. Simple sets the class attributes
	 * @param inputFile - Name of the file containing the inputs that need to be classified
	 * @param model - Matlab model filename (.mat file)
	 * @param sortedOutputFile - File that would store the output probabilities in sorted manner
	 * @param probabilityOutputFile - File that would store the output probabilities
	 */
	public LogRegTrainerDLLCaller(String trainingTargetFile, String trainingFeatureFile, String outputModelFile) {
		this.trainingTargetFile = new JSCString("trainingTargetFile", trainingTargetFile);
		this.trainingFeatureFile = new JSCString("trainingFeatureFile", trainingFeatureFile);
		this.outputModelFile = new JSCString("outputModelFile", outputModelFile);		
	}
	
	/**
	 * Overrides the engine to be Matlab
	 */
	@Override
	public Engine engine() {
		return EngineTypes.MATLAB.getEngine();
	}

	
	/**
	 * Runs the logreg classifier
	 * The classifier runs and stores the output in the sortedOutputFile and probabilityOutputFile
	 * (Those were specified in the constructor)
	 */
	@Override
	protected void runCode() {
        // library has to be loaded first, does nothing if it was
        // loaded before
        engine().load("logreg", MatlabLoadTypes.USERLIB, null);

        // calls one of the test methods 'darraytest'
        // number of input and return args must be correct,
        // types must be compatible with required/returned Matlab types
        engine().call("logregtrain", new JSCData[] { trainingTargetFile, trainingFeatureFile, outputModelFile}, null);

        // now out1 and out2 hold the results and can further be processed
        // on the Java side

	}	

}
