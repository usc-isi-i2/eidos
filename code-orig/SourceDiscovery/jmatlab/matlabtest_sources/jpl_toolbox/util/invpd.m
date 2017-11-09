function  xi = invpd(x)
% PURPOSE: A dummy function to mimic Gauss invpd
%          simply returns the inverse, with no
%          checking for positivie definiteness
%---------------------------------------------------
% USAGE:     mati = invpd(mat)
% where:      mat = a square matrix
% -------------------------------------------------- 
% RETURNS: mati = inverse of mat 
% --------------------------------------------------

% written by:
% James P. LeSage, Dept of Economics
% University of Toledo
% 2801 W. Bancroft St,
% Toledo, OH 43606
% jpl@jpl.econ.utoledo.edu

[n k] = size(x);
if n ~= k
error('invpd: matrix must be square to invert');
end;

xi = inv(x);

