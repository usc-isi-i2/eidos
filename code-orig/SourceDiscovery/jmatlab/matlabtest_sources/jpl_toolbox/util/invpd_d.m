% PURPOSE: An example of using invpd()                               
%          a bogus function to mimic Gauss
%          doesn't really do anything
%---------------------------------------------------
% USAGE: invpd_d
%---------------------------------------------------

% generate a matrix
n = 100; k = 3;
x = randn(n,k);
xpx = x'*x;

xi = invpd(xpx);

xi