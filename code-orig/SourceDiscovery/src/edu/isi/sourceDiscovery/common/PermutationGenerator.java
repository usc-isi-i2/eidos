package edu.isi.sourceDiscovery.common;

import java.util.ArrayList;
import java.util.List;

public class PermutationGenerator<E> {
	private int _numberOfParams;
	private int _maxIndex[];
	private int _numberOfValues[];
	private int _currentIndex[];
	private int _currentPermutationNumber;
	private List<E[]> _paramValues;
	private long _numberOfPermutations;
	
		
	//Get all possible permutations.
	// Number of arguments = size of paramsValues
	// Each member of paramValues is an ArrayList containg all possible values
	// that
	// can be taken at that position of the permutation
	public void initialize(List<E[]> paramValues) {
		_numberOfParams = paramValues.size();
		_maxIndex = new int[_numberOfParams];
		_numberOfValues = new int[_numberOfParams];
		_currentIndex = new int[_numberOfParams];
		_paramValues = paramValues;
		
		
		//ArrayList<ArrayList<E>> permutations = new ArrayList<ArrayList<E>>();

		_numberOfPermutations = 1;
		for (int i = 0; i < _numberOfParams; i++) {
			E[] values = paramValues.get(i);
			if(values.length > 0)
				_numberOfPermutations *= values.length;
			if(values.length > 0)
				_numberOfValues[i] = values.length;
			else
				_numberOfValues[i] = 1;
			_currentIndex[i] = 0;
		}
		for (int i = 0; i < _numberOfParams; i++) {
			_maxIndex[i] = 1;
			for (int j = i + 1; j < _numberOfParams; j++)
				_maxIndex[i] *= _numberOfValues[j];
		}

		_currentPermutationNumber = 0;		
	}
	
	public void initialize2(List<? extends List<E>> paramValues2) {
		List<E[]> paramValues = new ArrayList<E[]>();
		
		for(List<E> o : paramValues2) {
			E[] newO = (E[])o.toArray();
			paramValues.add(newO);
		}
		initialize(paramValues);
	}
	
	public ArrayList<E> getNextPermutation() {
		ArrayList<E> permutation = new ArrayList<E>();
				
		for(int j=0; j<_paramValues.size(); j++) {
			E[] values = _paramValues.get(j);
			if(_currentIndex[j] < values.length)
				permutation.add(values[_currentIndex[j]]);
			else
				permutation.add(null);
			if ((_currentPermutationNumber + 1) % _maxIndex[j] == 0)
				_currentIndex[j] = ((_currentIndex[j] + 1) % _numberOfValues[j]);			
		}
	
		_currentPermutationNumber++;
		return permutation;
	}
	
	public long getNumberOfPermutations() {
		return _numberOfPermutations;
	}
	
	public boolean hasMorePermutation() {
		if(_currentPermutationNumber < _numberOfPermutations)
			return true;
		return false;
	}
	
	
}
