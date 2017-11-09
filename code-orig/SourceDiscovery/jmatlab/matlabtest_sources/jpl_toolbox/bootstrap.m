function [rezalfz,rezgfun,rezcfun,rezbetz,rezdiag,rezpvalz] =...
   bootstrap(ad,ures,spall,trubeta,bigxdepvar,cholq,xstartval,optvalz,cdiag,gdiag,truvalphas,maxsims,pctg);

% function [rezalfz,rezgfun,rezcfun,rezbetz,rezdiag,rezpvalz] =...
%   bootstrap(ad,ures,spall,trubeta,bigxdepvar,cholq,xstartval,optvalz,cdiag,gdiag,truvalphas,maxsims,pctg);
%
% This function implements the bootstrap method described in Section 3.3 of Chen-Conley, and provides
% approximate confidence intervals.
%
% It returns seven numbers for each variable of interest: 
% the lower and upper confidence intervals at 90% and 95%, 
% a measure of the bias at 90% and 95%,
% the standard deviation.
% 
% The variables of interest are: alpha, the coefficients on the B-splines for the g-function,
% the g-function evaluated at regular distances between 0 and splub, the C-function evaluated
% at regular distances between 0 and splub, the coefficients on the B-splines for the C-function,
% sigma^2.
%
% Code written by Francesca Molinari and Robert Vigfusson


bspwr = optvalz(1);
numbfuncs = optvalz(2);,
method = optvalz(3);
vupbnd = optvalz(4);
vbspwr = optvalz(5);
vnumbfuncs = optvalz(6);
splupper = optvalz(7);



nvars = size(ures,1);
nobs = size(ures,2)+1;
sizofd = nvars;
estimpv = zeros(sizofd,31,maxsims);
pvalz = zeros(numbfuncs,maxsims);
splinspace = bspval(linspace(0,splupper,30),0,splupper,bspwr,numbfuncs-bspwr);
hvallinspace = analvalH(linspace(0,splupper,30),vupbnd,vbspwr,vnumbfuncs);

for t=1:nobs-1;
   eres(:,t) = inv(cholq(:,:,t))*ures(:,t);
end;

for zsim = 1:maxsims;
   x = zeros(nvars,nobs);
   x(:,1) = xstartval;
   
   for t=2:nobs
      useinx = ceil((nobs-1)*rand(1,1));
      x(:,t) = ad(:,:,t-1)*x(:,t-1) + cholq(:,:,t-1)*eres(:,useinx);
   end;    
   x = x - mean(x,2)*ones(1,nobs);
   
   %impose that method equals 0.
   bigx = zeros(nobs*nvars,nvars);
   bigy = zeros(nobs*nvars,1);
   bigz = zeros(nobs*nvars,numbfuncs);
   bgz = 1;
   enz = nobs-1;
   for zx = 1:sizofd;
      bigx(bgz:enz,zx) = x(zx,1:end-1)';
      bigy(bgz:enz,1) = x(zx,2:end)';
      for t=1:nobs-1;
         spbas = spall(:,:,zx,t);
         zdata = spbas*x([1:zx-1 zx+1:sizofd],t);
         bigz(bgz+t-1,:) = zdata';
      end;
      bgz = enz+1;
      enz = enz+nobs-1;
   end;
   parmvalz = [bigx bigz]\bigy;
   pv = zeros(numbfuncs+1,sizofd);
   pv(1,:) = parmvalz(1:sizofd)';
   pv(2:end,:) = parmvalz(sizofd+1:end)*ones(1,sizofd);
   
   
   %elseif method == 1;
   %   for zx=1:sizofd;
   %     zdata = zeros(numbfuncs,nobs-1);
   %     for t = 1:nobs-1;
   %        spbas= spall(:,:,zx,t);
   %        zdata(:,t) = spbas*x([1:zx-1 zx+1:sizofd],t);
   %     end;
   %     pv(:,zx) = [x(zx,1:end-1)' zdata']\(x(zx,2:end)');
   %  end;
   %else;
   %   disp('No method choosen')
   %end 
   
   
   alfz(:,zsim) = pv(1,1:sizofd)';
   pvalz(:,zsim) = pv(2:end,1);
   gfunc(:,zsim) = (pv(2:end,1)'*splinspace)';
   
   
   for t = 1:nobs-1;
      adbs = diag(pv(1,1:sizofd));
      for zx = 1:sizofd;
         spbas = squeeze(spall(:,:,zx,t));
         adbs(zx,[1:zx-1 zx+1:sizofd]) = pv(2:end,zx)'*spbas;
      end;
      uressim(:,t+1) = x(:,t+1)-adbs*x(:,t);
   end;
   
   
   
   [betaval,diagv] = espvarcovboot(uressim(:,2:end),bigxdepvar,trubeta);
   
   betaz(:,zsim) = cumsum([0;betaval]);
   cfunc(:,zsim) = (cumsum([0;betaval])'*hvallinspace)';
   diagelm(:,zsim) = max(diagv-cfunc(1,zsim),0);
   
   
end;

salfz = sort(alfz,2);
lwalfz = salfz(:,round(pctg*maxsims));
upalfz = salfz(:,round((1-pctg)*maxsims));
sdalfz = std(alfz,1,2);

adifwtru = abs(alfz-gdiag*ones(1,maxsims));
adifwtru = sort(adifwtru,2);
smalfz = adifwtru(:,round((1-pctg)*maxsims));



spvalz = sort(pvalz,2);
lwpvalz= spvalz(:,round(pctg*maxsims));
uppvalz = spvalz(:,round((1-pctg)*maxsims));
sdpvalz= std(pvalz,1,2);

pdifwtru = abs(pvalz-truvalphas*ones(1,maxsims));
pdifwtru = sort(pdifwtru,2);
smpvalz = pdifwtru(:,round((1-pctg)*maxsims));

sgfunc  = sort(gfunc,2);
lwgfun  = sgfunc(:,round(pctg*maxsims));
upgfun  = sgfunc(:,round((1-pctg)*maxsims));
sdgfun  = std(gfunc,1,2);



glinspz = truvalphas'*splinspace;
gdifwtru = abs(gfunc-glinspz'*ones(1,maxsims));
gdifwtru = sort(gdifwtru,2);
smgfun = gdifwtru(:,round((1-pctg)*maxsims));


scfunc  = sort(cfunc,2);
lwcfun  = scfunc(:,round(pctg*maxsims));
upcfun  = scfunc(:,round((1-pctg)*maxsims));
sdcfun  = std(cfunc,1,2);                  


clinspz = cumsum([trubeta;0])'*hvallinspace;


cdifwtru = abs(cfunc-clinspz'*ones(1,maxsims));
cdifwtru = sort(cdifwtru,2);
smcfun = cdifwtru(:,round((1-pctg)*maxsims));


sbetaz = sort(betaz,2);
lwbetaz = sbetaz(:,round(pctg*maxsims));
upbetaz = sbetaz(:,round((1-pctg)*maxsims));
sdbetaz = std(betaz,1,2);


bdifwtru = abs(betaz-cumsum([0;trubeta])*ones(1,maxsims));
bdifwtru = sort(bdifwtru,2);
smbetaz = bdifwtru(:,round((1-pctg)*maxsims));



sdiag = sort(diagelm,2);
lwdiag = sdiag(:,round(pctg*maxsims));
updiag = sdiag(:,round((1-pctg)*maxsims));
sddiag = std(diagelm,1,2);


cddifwtru = abs(diagelm-cdiag*ones(1,maxsims));
cddifwtru = sort(cddifwtru,2);
smcdiag = cddifwtru(:,round((1-pctg)*maxsims));


rezalfz = [lwalfz  upalfz smalfz sdalfz];
rezpvalz = [lwpvalz  uppvalz smpvalz sdpvalz];
rezgfun = [lwgfun   upgfun  smgfun sdgfun]; 
rezcfun = [lwcfun   upcfun  smcfun sdcfun];
rezbetz = [lwbetaz upbetaz  smbetaz sdbetaz];
rezdiag = [lwdiag  updiag smcdiag sddiag];

