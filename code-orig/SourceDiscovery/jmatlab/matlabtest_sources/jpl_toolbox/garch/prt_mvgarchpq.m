function prt_mvgarchpq(results,vname,fid)
fprintf(fid,'\n');
fprintf(fid,'Multi-Variate Garch (p,q) Results\n');
fprintf(fid,'********************************************************\n');
nvar=results.nvar;
for i=1:nvar
fprintf(fid,'Equation %2d    \n', i);
fprintf(fid,'Arch Order-p              =   %9.4f \n', results.p(i,1));
fprintf(fid,'Garch Order-q             =   %9.4f \n', results.q(i,1));
end
fprintf(fid,'********************************************************\n');
fprintf(fid,'Log Likelihood            =   %9.4f \n', results.loglikelihood);
fprintf(fid,'Correlation Matrix        \n');

for i=1:nvar
    for j=1:nvar
        fprintf(fid,'%9.4f \t ',results.R(i,j));
    end
    fprintf(fid,'\n');
end

fprintf(fid,'********************************************************\n');

fprintf(fid,'Parameter \t    Estimate  \tS.E.  \t   T-Stats \n');
p=results.p;q=results.q;
nvar=results.nvar;
se=diag(results.stderrors);
tstat=(results.parameters)./(diag(results.stderrors).^0.5);

j=1;

for k=1:nvar

fprintf(fid,'Omega%2d \t %9.4f \t %9.4f \t %9.4f       \n',k, results.parameters(j,1),se(j,1),tstat(j,1));

for i=2:p(k,1)+1
fprintf(fid,'Alpha%2d%2d \t %9.4f \t %9.4f \t %9.4f           \n',k,i-1, results.parameters(i+j-1,1),se(i+j-1,1),tstat(i+j-1,1));
end

for i=p(k,1)+2:p(k,1)+q(k,1)+1
fprintf(fid,'Beta %2d%2d \t %9.4f \t %9.4f \t %9.4f           \n',k,i-p(k,1)-1, results.parameters(i+j-1,1),se(i+j-1,1),tstat(i+j-1,1));
end

j=k+p(k,1)+q(k,1)+1;

end
fprintf(fid,'********************************************************\n');
 