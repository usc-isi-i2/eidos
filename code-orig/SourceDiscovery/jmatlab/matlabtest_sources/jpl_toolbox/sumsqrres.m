function [valu,grdx] = sumsqrres(alpha,y,x);

% function [valu,grdx] = sumsqrres(alpha,y,x)
%
% It returns the sum of squared residuals to be used to estimate the covariance function
% as in expression (3.14) of Chen-Conley.
%
% Code written by Francesca Molinari and Robert Vigfusson


cal = cumsum(alpha);
uval = y-x*cal;
valu = uval'*uval;
grdx = -2*uval'*x;
grdx(end:-1:1) = cumsum(grdx(end:-1:1));

