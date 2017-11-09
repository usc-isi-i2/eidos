function prt_garchpqtest(testresults,fid)
fprintf(fid,'\n');
fprintf(fid,'Testing for the Presence of GARCH\n');
fprintf(fid,'**************************************\n'); 
info.fid=fid;
info.cnames=strvcat('Statistic','P-Value'); 
matrix=[testresults.statistic';testresults.pval']';
mprint(matrix,info);
fprintf(fid,'**************************************\n'); 