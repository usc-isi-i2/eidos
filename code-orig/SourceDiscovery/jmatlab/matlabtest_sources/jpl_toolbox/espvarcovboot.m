function [betaval,diagelm] = espvarcovboot(ures,bigx,stvalbeta);

% function [betaval,diagelm] = escovmcbs(ures,bigx,stvalbeta)
%
% This is the stripped down version of the estimate covariance program espvarcov.m;
%
% Code written by Francesca Molinari and Robert Vigfusson


[nvars,nobs] = size(ures);
nx = 1;

bigown = zeros(nvars,nobs);
bigy = zeros(nobs*nvars,1);

% What we do in this file is to take out those observations that are on the diagonal terms 
% and just try to explain the rest. We have zeroed out the equivalent entries in bigx,
% so having all these zero terms does not hurt the regression. 

for t=1:nobs;
   tmp = ures(:,t)*ures(:,t)';
   bigown(:,t) = diag(tmp);
   tmp = tmp-diag(bigown(:,t));
   bigy(nx:nx+nvars^2-1,1) = tmp(:); 
   nx =nx+nvars^2;
end;

alpha = bigx\bigy;

diagelm = (1/(nobs-1))*sum(bigown,2);

alpha(2:end) = alpha(2:end)-alpha(1:end-1);

if ge(alpha,0);
   disp('a winner')
   betaval = alpha;
else
   opz = optimset('fmincon');
   opz2 = optimset(opz,'display','off','largescale','off','gradobj','on','tolfun',0.001,'tolx',0.001);
   if nargin == 2;
      stvalbeta = max(alpha,realmin);
   end;
   betaval = fmincon('sumsqrres',stvalbeta,-1*eye(length(alpha)),zeros(length(alpha),1),[],[],[],[],[],opz2,bigy,bigx);
end;



