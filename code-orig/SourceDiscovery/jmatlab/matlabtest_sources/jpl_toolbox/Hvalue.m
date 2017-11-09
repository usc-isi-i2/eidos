function [caphval,bigx] = Hvalue(dmat,vcbspwr,vcnumspl,vclimit);

% function [caphval,bigx] = Hvalue(dmat,vcbspwr,vcnumspl,vclimit)
%
% Returns the value of H of expression (3.7) in Chen-Conley, given by caphval, and the value of H
% to be used in solving the minimization problem of espression (3.14) in Chen-Conley, given by bigx:
%
%         oo                        k-1
% H(x) = |  [(sin(y|tau|))/y|tau|]*B   (y)dy,  for 0<=x<oo
%        0
%
% The arguments of the function are:
% dmat = gives the values of tau;
% vcbspwr = degree of the b-splines (B) that will make up the basis functions for the var-cov matrix = k;
% vcnumspl = number of splines used to estimeate the C(d) function (see equations (2.4) and (3.3) in Chen-Conley);
% vclimit = upper bound of integration.
%
% Code written by Francesca Molinari and Robert Vigfusson


nobs = size(dmat,3);
nvars = size(dmat,2);

caphval = zeros(nvars,nvars,vcnumspl,nobs);

tmpzero = analvalH(0,vclimit,vcbspwr,vcnumspl);

for t=1:nobs;   
   for zx=1:nvars-1;
      caphval(zx,zx,:,t) = tmpzero';
      tmp = analvalH(squeeze(dmat(zx,zx+1:end,t)),vclimit,vcbspwr,vcnumspl);
      caphval(zx,zx+1:nvars,:,t) = tmp';
      caphval(zx+1:nvars,zx,:,t) = tmp';
   end;  
   caphval(nvars,nvars,:,t) = tmpzero';
end;


nx = 1;

for t=1:nobs;
   
   for ny = 1:vcnumspl;
      tmpc(:,:,ny) = squeeze(caphval(:,:,ny,t))-diag(diag(squeeze(caphval(:,:,ny,t))));
   end;
   
   for zx=1:vcnumspl;     
      bigx(nx:nx+nvars^2-1,zx)=tmpc(((zx-1)*(nvars^2)+1):(zx*(nvars^2)))';
   end;
   nx =nx+nvars^2;
   
end;

