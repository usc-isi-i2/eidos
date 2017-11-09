function [parameters, likelihood, ht, stderrors, robustSE, scores, grad] = garchpq_java(returns , p , q )
% This is a modified version of garch meant to be easily used. Its an extension of 
% functionality provided by JPL_Econometrics toolbox for easy use. The user does not have to 
% provide starting values or 
% % USAGE:
%     [parameters, likelihood, ht, stderrors, robustSE, scores, grad] = garchpq(data , p , q )
% 
% INPUTS:
%     data: A single column of zero mean random data, normal or not for quasi likelihood
%  
%     P: Non-negative, scalar integer representing a model order of the ARCH 
%       process
% 
%     Q: Positive, scalar integer representing a model order of the GARCH 
%       process: Q is the number of lags of the lagged conditional variances included
%       Can be empty([]) for ARCH process
% 
% OUTPUTS:
%     parameters : a [1+p+q X 1] column of parameters with omega, alpha1, alpha2, ..., alpha(p)
%                 beta1, beta2, ... beta(q)
% 
%     likelihood = the loglikelihood evaluated at he parameters
% 
%     ht = the estimated time varying VARIANCES
% 
%     stderrors = the inverse analytical hessian, not for quasi maximum liklihood
% 
%     robustSE = robust standard errors of form A^-1*B*A^-1*T^-1
%               where A is the analytic hessian
%               and B is the covariance of the scores
% 
%     scores = the list of T scores for use in M testing
% 
%     grad = the average score at the parameters
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

[parameters, likelihood, ht, stderrors, robustSE, scores, grad] = garchpq(returns, p , q , [], []);

xlabel('time'); 
ylabel('variance'); 
title('Estimated Variance'); 
plot(ht); 