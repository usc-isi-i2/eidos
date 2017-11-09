function prt_tgarchpq(results,vname,fid)
fprintf(fid,'\n');
fprintf(fid,'TGarch (p,q) Results\n');
fprintf(fid,'********************************************************\n');
fprintf(fid,'Arch Order-p              =   %9.4f \n', results.p);
fprintf(fid,'Garch Order-q             =   %9.4f \n', results.q);
fprintf(fid,'Log Likelihood            =   %9.4f \n', results.likelihood);
fprintf(fid,'********************************************************\n');

fprintf(fid,'Parameter \t         Estimate  \tS.E.  \t   T-Stats \t  Robust T-Stats \n');
p=results.p;q=results.q;o=results.o;
se=diag(results.stderrors);
tstat=(results.parameters)./(diag(results.stderrors).^0.5);
rtstat=(results.parameters)./(diag(results.robustSE).^0.5);
fprintf(fid,'Omega    \t     %9.4f \t %9.4f \t %9.4f  \t %9.4f \n', results.parameters(1,1),se(1,1),tstat(1,1),rtstat(1,1));

for i=2:p+1
fprintf(fid,'Alpha     %2d \t %9.4f \t %9.4f \t %9.4f  \t %9.4f \n',i-1, results.parameters(i,1),se(i,1),tstat(i,1),rtstat(i,1));
end
for i=p+2:o+p+1
fprintf(fid,'Tarch-p   %2d \t %9.4f \t %9.4f \t %9.4f  \t %9.4f \n',i-1-p, results.parameters(i,1),se(i,1),tstat(i,1),rtstat(i,1));
end
for i=o+p+2:o+p+q+1
fprintf(fid,'Beta      %2d \t %9.4f \t %9.4f \t %9.4f  \t %9.4f \n',i-p-o-1, results.parameters(i,1),se(i,1),tstat(i,1),rtstat(i,1));
end

fprintf(fid,'********************************************************\n');
 