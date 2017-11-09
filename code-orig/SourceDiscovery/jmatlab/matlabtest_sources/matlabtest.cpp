//
// MATLAB Compiler: 4.1 (R14SP1)
// Date: Fri Sep 15 07:49:34 2006
// Arguments: "-B" "macro_default" "-B" "cpplib:matlabtest" "-W"
// "cpplib:matlabtest" "-T" "link:lib" "garchpq_java.m" "darraytest.m"
// "inttest.m" "numtest.m" "sarraytest.m" "stringtest.m" "graphtest.m" 
//

#include <stdio.h>
#include "matlabtest.h"
#ifdef __cplusplus
extern "C" {
#endif
extern const unsigned char __MCC_matlabtest_public_data[];
extern const char *__MCC_matlabtest_name_data;
extern const char *__MCC_matlabtest_root_data;
extern const unsigned char __MCC_matlabtest_session_data[];
extern const char *__MCC_matlabtest_matlabpath_data[];
extern const int __MCC_matlabtest_matlabpath_data_count;
extern const char *__MCC_matlabtest_classpath_data[];
extern const int __MCC_matlabtest_classpath_data_count;
extern const char *__MCC_matlabtest_mcr_runtime_options[];
extern const int __MCC_matlabtest_mcr_runtime_option_count;
extern const char *__MCC_matlabtest_mcr_application_options[];
extern const int __MCC_matlabtest_mcr_application_option_count;
#ifdef __cplusplus
}
#endif


static HMCRINSTANCE _mcr_inst = NULL;


#if defined( _MSC_VER) || defined(__BORLANDC__) || defined(__WATCOMC__) || defined(__LCC__)
#include <windows.h>

static char path_to_dll[_MAX_PATH];

BOOL WINAPI DllMain(HINSTANCE hInstance, DWORD dwReason, void *pv)
{
    if (dwReason == DLL_PROCESS_ATTACH)
    {
        char szDllPath[_MAX_PATH];
        char szDir[_MAX_DIR];
        if (GetModuleFileName(hInstance, szDllPath, _MAX_PATH) > 0)
        {
             _splitpath(szDllPath, path_to_dll, szDir, NULL, NULL);
            strcat(path_to_dll, szDir);
        }
	else return FALSE;
    }
    else if (dwReason == DLL_PROCESS_DETACH)
    {
    }
    return TRUE;
}
#endif
static int mclDefaultPrintHandler(const char *s)
{
    return fwrite(s, sizeof(char), strlen(s), stdout);
}

static int mclDefaultErrorHandler(const char *s)
{
    int written = 0, len = 0;
    len = strlen(s);
    written = fwrite(s, sizeof(char), len, stderr);
    if (len > 0 && s[ len-1 ] != '\n')
        written += fwrite("\n", sizeof(char), 1, stderr);
    return written;
}

bool matlabtestInitializeWithHandlers(
    mclOutputHandlerFcn error_handler,
    mclOutputHandlerFcn print_handler
)
{
    if (_mcr_inst != NULL)
        return true;
    if (!mclmcrInitialize())
        return false;
    if (!mclInitializeComponentInstance(&_mcr_inst,
                                        __MCC_matlabtest_public_data,
                                        __MCC_matlabtest_name_data,
                                        __MCC_matlabtest_root_data,
                                        __MCC_matlabtest_session_data,
                                        __MCC_matlabtest_matlabpath_data,
                                        __MCC_matlabtest_matlabpath_data_count,
                                        __MCC_matlabtest_classpath_data,
                                        __MCC_matlabtest_classpath_data_count,
                                        __MCC_matlabtest_mcr_runtime_options,
                                        __MCC_matlabtest_mcr_runtime_option_count,
                                        true, NoObjectType, LibTarget,
                                        path_to_dll, error_handler,
                                        print_handler))
        return false;
    return true;
}

bool matlabtestInitialize(void)
{
    return matlabtestInitializeWithHandlers(mclDefaultErrorHandler,
                                            mclDefaultPrintHandler);
}

void matlabtestTerminate(void)
{
    if (_mcr_inst != NULL)
        mclTerminateInstance(&_mcr_inst);
}


void mlxGarchpq_java(int nlhs, mxArray *plhs[], int nrhs, mxArray *prhs[])
{
    mclFeval(_mcr_inst, "garchpq_java", nlhs, plhs, nrhs, prhs);
}

void mlxDarraytest(int nlhs, mxArray *plhs[], int nrhs, mxArray *prhs[])
{
    mclFeval(_mcr_inst, "darraytest", nlhs, plhs, nrhs, prhs);
}

void mlxInttest(int nlhs, mxArray *plhs[], int nrhs, mxArray *prhs[])
{
    mclFeval(_mcr_inst, "inttest", nlhs, plhs, nrhs, prhs);
}

void mlxNumtest(int nlhs, mxArray *plhs[], int nrhs, mxArray *prhs[])
{
    mclFeval(_mcr_inst, "numtest", nlhs, plhs, nrhs, prhs);
}

void mlxSarraytest(int nlhs, mxArray *plhs[], int nrhs, mxArray *prhs[])
{
    mclFeval(_mcr_inst, "sarraytest", nlhs, plhs, nrhs, prhs);
}

void mlxStringtest(int nlhs, mxArray *plhs[], int nrhs, mxArray *prhs[])
{
    mclFeval(_mcr_inst, "stringtest", nlhs, plhs, nrhs, prhs);
}

void mlxGraphtest(int nlhs, mxArray *plhs[], int nrhs, mxArray *prhs[])
{
    mclFeval(_mcr_inst, "graphtest", nlhs, plhs, nrhs, prhs);
}

void garchpq_java(int nargout, mwArray& parameters, mwArray& likelihood
                  , mwArray& ht, mwArray& stderrors, mwArray& robustSE
                  , mwArray& scores, mwArray& grad, const mwArray& returns
                  , const mwArray& p, const mwArray& q)
{
    mclcppMlfFeval(_mcr_inst, "garchpq_java", nargout, 7, 3,
                   &parameters, &likelihood, &ht, &stderrors,
                   &robustSE, &scores, &grad, &returns, &p, &q);
}

void darraytest(int nargout, mwArray& a, mwArray& b
                , const mwArray& c, const mwArray& d)
{
    mclcppMlfFeval(_mcr_inst, "darraytest", nargout, 2, 2, &a, &b, &c, &d);
}

void inttest(int nargout, mwArray& g, mwArray& h
             , const mwArray& a, const mwArray& b)
{
    mclcppMlfFeval(_mcr_inst, "inttest", nargout, 2, 2, &g, &h, &a, &b);
}

void numtest(int nargout, mwArray& g, mwArray& h
             , const mwArray& a, const mwArray& b)
{
    mclcppMlfFeval(_mcr_inst, "numtest", nargout, 2, 2, &g, &h, &a, &b);
}

void sarraytest(int nargout, mwArray& g, mwArray& h
                , const mwArray& a, const mwArray& b)
{
    mclcppMlfFeval(_mcr_inst, "sarraytest", nargout, 2, 2, &g, &h, &a, &b);
}

void stringtest(int nargout, mwArray& g, mwArray& h
                , const mwArray& a, const mwArray& b)
{
    mclcppMlfFeval(_mcr_inst, "stringtest", nargout, 2, 2, &g, &h, &a, &b);
}

void graphtest(const mwArray& data)
{
    mclcppMlfFeval(_mcr_inst, "graphtest", 0, 0, 1, &data);
}
