This directory holds all compiled dlls from Matlab .m files, including the .ctf files.
All Matlab Compiler generated dlls for use with the MatlabEngine must go in here. 

All .m files should be compiled with the Microsoft C++ Compiler, at least the Lcc 
compiler that comes with Matlab will not work. Other compilers have not been tested
but might work as well.

If the Matlab Component Runtime (MCR) is not installed, nor Matlab, this directory
must contain the full "MATLAB Component Runtime" directory. Otherwise no
Matlab calls can be made. It is not necessary to adjust the PATH variable if the 
MCR is in this directory.

The Matlab Component Runtime should either be shipped with the product in this
directory, or users must install it separately. 


mlabmaster.dll - required for communication between Java and Matlab
mlabslave.exe - required for communication between Java and Matlab
mlabtests.dll - for unit tests of the MatlabEngine class
engine_config.xml - settings for the MatlabEngine, by default it sets the
		    Matlab Runtime Version to 7.1, but this can be changed
		    by adjusting DLL_NAME and RUNTIME_SUBDIR

