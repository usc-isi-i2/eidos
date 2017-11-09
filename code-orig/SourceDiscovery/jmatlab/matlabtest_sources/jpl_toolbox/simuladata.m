function [data]=simuladata(ad,cqd,nvar,nobs,dmat,nsim);

% function [data]=simula(ad,cqd,nvar,nobs,dmat,nsim) 
%
% Returns a matrix of data generated using the process described
% in Section 5 of Chen-Conley's "A new Semiparametric Model for Panel Time Series".
% 
% The conditional mean components alpha_i and g_i(d) of expression (2.2) in Chen-Conley are taken to be
% common across all agents with alpha_i = alpha = 0.4; g_i(d) = g(d) is linear from an intercept of 0.6 
% to zero at a distance of 0.35, remaining zero for all larger distances. The innovations are Gaussian
% with the conditional variance parameters sigma^2_i = 1 for all i and C(d) = exp(-2d).
%
% ad = matrix of VAR coefficients, as in expression (2.2) of Chen-Conley
% cqd = cholesky decomposition of the conditional variance of Y(t+1) given {[Y(t-h),D(t-h)], h >= 0}
%		  as in expression (2.3) of Chen-Conley
% nvar = number of agents observed at each time;
% nobs = number of periods;
% dmat = matrix of economic distances given the available locations;
% nsim = current simulation; this option is introduced to allow you to put
% [data]=simula(ad,cqd,nvar,nobs,dmat,nsim) in a loop, and run N Monte Carlo simulations
%
% Code written by Francesca Molinari and Robert Vigfusson



if nargin == 3;
   nsim = 1;
end;

t0 = clock;

% Create the variables as a function of distance. 
x = zeros(nvar,800+nobs);

bclockval=clock;
sedsim(nsim) = sum(100*bclockval(4:6));
randn('state',sedsim(nsim));

for t=1:(800+nobs);
   uv = randn(nvar,1);
   x(:,t+1) =ad*x(:,t)+cqd*uv;
end;
% keep only the last 200 observations. 
x = x(:,801:(800+nobs));
data = x;
