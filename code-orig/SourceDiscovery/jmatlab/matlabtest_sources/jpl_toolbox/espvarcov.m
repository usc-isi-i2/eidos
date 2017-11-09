function [betacoef,sigmasq,bigsigma] = espvarcov(ures,caphval,bigx,stvalbeta);

% function [betacoef,sigmasq,bigsigma] = espvarcov(ures,caphval,bigx,stvalbeta)
%
% ESPVARCOV Estimates the variance covariance matrix (see expression (2.3) in Chen-Conley)
% of a Spatial Vector Autoregression as described in Section 3.2, Step 2 of Chen and Conley.
% The output of this function are:
% betacoef = estimated coefficients of the B-splines used to approximate the C-function as in
% equation (3.7) of Chen-Conley;
% sigmasq = estimate of sigma^2_i;
% bigsigma = estimated conditional variance of Y(t+1) given {[Y(t-h),D(t-h)],h>=0} as in expression (2.3)
% in Chen-Conley.
% 
% Given the constraints sigma^2>=0, bigsigma = positive definite, the code is written so that:
% sigmasq = max{ 0 , (1/T-1)sum(ures^2) - C(0)};
% diag(bigsigma) = max{ (1/T-1)sum(ures^2) , C(0)};
% ... <= betacoef(j) <= betacoef(j+1) <= ...
%
% Code written by Francesca Molinari and Robert Vigfusson



[nvars,nobs] = size(ures);
nsplines = size(caphval,3);
nx = 1;

bigown = zeros(nvars,nobs);
bigy = zeros(nobs*nvars,1);

for t=1:nobs;
   tmp = ures(:,t)*ures(:,t)';
   bigown(:,t) = diag(tmp);
   tmp = tmp-diag(bigown(:,t));
   bigy(nx:nx+nvars^2-1,1) = tmp(:); 
   nx =nx+nvars^2;
end;

bigxy =[bigx bigy];
alpha = bigxy(:,1:end-1)\bigxy(:,end);

diagelm = (1/(nobs-1))*sum(bigown,2);

% X=FMINCON(FUN,X0,A,B)
opz = optimset('fmincon');
opz2 = optimset(opz,'display','off','largescale','off','gradobj','on');

if nargin == 3;
   stvalbeta = alpha;
   stvalbeta(2:end) = stvalbeta(2:end)-stvalbeta(1:end-1);
   stvalbeta = max(stvalbeta,realmin);
end;

betacoef = fmincon('sumsqrres',stvalbeta,-1*eye(length(alpha)),zeros(length(alpha),1),[],[],[],[],[],...
   opz2,bigxy(:,end),bigxy(:,1:end-1));
alpha2 = cumsum([0;betacoef]);


bigsigma = zeros(nvars,nvars,nobs);
for t=1:nobs;
   bigsigma(:,:,t) = diag(diagelm);
   for zx=1:nvars;
      bigsigma(zx,zx,t) = max(bigsigma(zx,zx,t),alpha2'*squeeze(caphval(zx,zx,:,t)));
      diagnew(zx,t) = max(diagelm(zx)-alpha2'*squeeze(caphval(zx,zx,:,t)),0);
      for zy=zx+1:nvars;
         bigsigma(zx,zy,t) = alpha2'*squeeze(caphval(zx,zy,:,t));
         bigsigma(zy,zx,t) = bigsigma(zx,zy,t);
      end;
   end;
end;

sigmasq=diagnew(:,1);