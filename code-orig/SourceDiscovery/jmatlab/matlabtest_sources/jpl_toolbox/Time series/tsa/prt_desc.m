function prt_desc(R,fid)
fprintf(fid,'\n');
fprintf(fid,'Descriptive Statistics \n');
fprintf(fid,'********************************************************\n');
fprintf(fid,'Number of Observations    =   %6d \n', R.N');
fprintf(fid,'Sum of Observations       =   %9.4f \n', R.SUM');
fprintf(fid,'Sum of Squares            =   %9.4f \n', R.SSQ');
fprintf(fid,'Mean                      =   %9.4f \n', R.MEAN');
fprintf(fid,'Variance                  =   %9.4f \n', R.VAR');
fprintf(fid,'Standard Deviation        =   %9.4f \n', R.STD');
fprintf(fid,'Median                    =   %9.4f \n', R.MEDIAN');
fprintf(fid,'Skewness                  =   %9.4f \n', R.SKEWNESS');
fprintf(fid,'Kurtosis                  =   %9.4f \n', R.KURTOSIS');
fprintf(fid,'Standard Error of Mean    =   %9.4f \n', R.SEM');
fprintf(fid,'Standard Error of Variance=   %9.4f \n', R.SEV');
fprintf(fid,'********************************************************\n');
 