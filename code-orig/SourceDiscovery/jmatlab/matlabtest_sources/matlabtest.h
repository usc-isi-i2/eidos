//
// MATLAB Compiler: 4.1 (R14SP1)
// Date: Fri Sep 15 07:49:34 2006
// Arguments: "-B" "macro_default" "-B" "cpplib:matlabtest" "-W"
// "cpplib:matlabtest" "-T" "link:lib" "garchpq_java.m" "darraytest.m"
// "inttest.m" "numtest.m" "sarraytest.m" "stringtest.m" "graphtest.m" 
//

#ifndef __matlabtest_h
#define __matlabtest_h 1

#if defined(__cplusplus) && !defined(mclmcr_h) && defined(__linux__)
#  pragma implementation "mclmcr.h"
#endif
#include "mclmcr.h"
#include "mclcppclass.h"
#ifdef __cplusplus
extern "C" {
#endif

extern bool matlabtestInitializeWithHandlers(mclOutputHandlerFcn error_handler,
                                             mclOutputHandlerFcn print_handler);
extern bool matlabtestInitialize(void);
extern void matlabtestTerminate(void);


extern void mlxGarchpq_java(int nlhs, mxArray *plhs[],
                            int nrhs, mxArray *prhs[]);

extern void mlxDarraytest(int nlhs, mxArray *plhs[],
                          int nrhs, mxArray *prhs[]);

extern void mlxInttest(int nlhs, mxArray *plhs[], int nrhs, mxArray *prhs[]);

extern void mlxNumtest(int nlhs, mxArray *plhs[], int nrhs, mxArray *prhs[]);

extern void mlxSarraytest(int nlhs, mxArray *plhs[],
                          int nrhs, mxArray *prhs[]);

extern void mlxStringtest(int nlhs, mxArray *plhs[],
                          int nrhs, mxArray *prhs[]);

extern void mlxGraphtest(int nlhs, mxArray *plhs[],
                         int nrhs, mxArray *prhs[]);

#ifdef __cplusplus
}
#endif

#ifdef __cplusplus

extern void garchpq_java(int nargout, mwArray& parameters, mwArray& likelihood
                         , mwArray& ht, mwArray& stderrors, mwArray& robustSE
                         , mwArray& scores, mwArray& grad
                         , const mwArray& returns, const mwArray& p
                         , const mwArray& q);

extern void darraytest(int nargout, mwArray& a, mwArray& b
                       , const mwArray& c, const mwArray& d);

extern void inttest(int nargout, mwArray& g, mwArray& h
                    , const mwArray& a, const mwArray& b);

extern void numtest(int nargout, mwArray& g, mwArray& h
                    , const mwArray& a, const mwArray& b);

extern void sarraytest(int nargout, mwArray& g, mwArray& h
                       , const mwArray& a, const mwArray& b);

extern void stringtest(int nargout, mwArray& g, mwArray& h
                       , const mwArray& a, const mwArray& b);

extern void graphtest(const mwArray& data);

#endif

#endif
