function [pv,ad,ures,spall] = espvar(x,dmat,method,bspwr,numspl,splub)

% function [pv,ad,ures,spall] = espvar(x,dmat,method,bspwr,numspl,splub)
%
% ESPVAR Estimates the slope coefficients of a Spatial Vector Autoregression as
% described in Chen and Conley.
% 
% The model that is estimated is the following.
% X(t) = X(t-1)*A(D) + Ures(t);
% where A_{i,i} = pv(1,i);
% where A_{i,j} = sum for i=1:numspl over pv(i+1)*B_{i}(D_i,j);
% where B_{i}(D_i,j) = B-spline of degree bspwr and pv gives the a's that are the coefficients 
% for the bsplines, see equation (3.3) in Chen-Conley;
% ad is the matrix of parameter estimates;
% spall is the basis functions;
% we assume that the data is formated nvars rows by nobs columns.
%
% We present two methods to estimate the parameters:
% in the first one (method = 0) the rows of G are the same function of distance for every variable;
% in the second the (method = 1) the rows of G are different functions that depend on the variables.
% By default this code uses method0; to use method1, you have to change the option in the main.m
%
% Note: this program is written for Matlab 5 with the optimization toolbook, as it requires 3-dimensional
% arrays and use of the function fmincon to estimate the var-cov function. 
% If you have any questions or comments about this program, please contact Robert Vigfusson
% r-vigfusson@northwestern.edu.
% The code in this paper is being released free of charge. In exchange, we ask that its use be
% acknowledged in any published work, including working papers and paid research papers.
% The computer programs, documentation and all other information are provided for your information only,
% and for use entirely at your own risk. We do not warrant their accuracy nor their fitness for any purpose
% whatsoever.
%
% Code written by Francesca Molinari and Robert Vigfusson


nvars = size(x,1);
nobs = size(x,2);
if nvars>nobs;
   error('More variables than obs?')
end;
sizofd = size(dmat,1);
if nvars ~= sizofd;
   error('The distance matrix has a different number of rows than variables')
end;

x = x - mean(x,2)*ones(1,size(x,2));

spall = zeros(numspl,nvars-1,nvars,nobs-1);
if method == 0;
   bigx = zeros(nobs*nvars,nvars);
   bigy = zeros(nobs*nvars,1);
   bigz = zeros(nobs*nvars,numspl);
   bgz = 1;
   enz = length(x)-1;
   for zx=1:sizofd;
      bigx(bgz:enz,zx) = x(zx,1:end-1)';
      bigy(bgz:enz,1) = x(zx,2:end)';
      for t=1:nobs-1;
         spbas = bspval(squeeze(dmat(zx,[1:zx-1 zx+1:sizofd],t)),0,splub,bspwr,numspl-bspwr);
         zdata =  spbas*x([1:zx-1 zx+1:sizofd],t);
         spall(:,:,zx,t) = spbas;
         bigz(bgz+t-1,:) = zdata';
      end;
      bgz = enz+1; 
      enz = enz+length(x)-1;
   end;
   bigxz = [bigx bigz];
   parmvalz = bigxz\bigy;
   
   pv = zeros(numspl+1,sizofd);
   pv(1,:) = parmvalz(1:sizofd)';
   pv(2:end,:) = parmvalz(sizofd+1:end)*ones(1,sizofd);
   
elseif method == 1
   for zx=1:sizofd;
      zdata = zeros(numspl,nobs-1);
      for t = 1:nobs-1
         spbas = bspval(squeeze(dmat(zx,[1:zx-1 zx+1:sizofd],t)),0,splub,bspwr,numspl-bspwr);
         spall(:,:,zx,t) = spbas;
         zdata(:,t) = spbas*x([1:zx-1 zx+1:sizofd],t);
      end;
      pv(:,zx) = [x(zx,1:end-1)' zdata']\(x(zx,2:end)');
   end;
   
else
   disp('No method choosen')
end;
disp('Calculated Estimated')
disp('Making Parameter Matrix')

ad = zeros(nvars,nvars,nobs-1);   
for t=1:nobs-1;
   ad(:,:,t) = diag(pv(1,1:sizofd));
   for zx=1:sizofd;
      spbas = squeeze(spall(:,:,zx,t));
      ad(zx,[1:zx-1 zx+1:sizofd],t) = pv(2:end,zx)'*spbas;
   end;
end;


for t=2:nobs;
   ures(:,t) = x(:,t) - squeeze(ad(:,:,t-1))*x(:,t-1);
end;


