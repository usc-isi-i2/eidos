function Z = desvec(Z_big,M);
% PURPOSE: Creates a matrix unstacking a vector
% ------------------------------------------------------------
% SYNTAX: Z_big = desvec(Z_big,M);
% ------------------------------------------------------------
% OUTPUT: Z = matrix with M cols.
% ------------------------------------------------------------
% INPUT: Z_big: a vector nx1 
%		   M	  : number of cols.

% ------------------------------------------------------------
% written by:
% Enrique M. Quilis
% Instituto Nacional de Estadistica
% Paseo de la Castellana, 183
% 28046 - Madrid (SPAIN)

[n,m] = size(Z_big);

if (m ~= 1)
   error (' *** number of columns greater than one *** ')
end

N = round(n/M);

Z(:,1) = Z_big(1:N,1);
j=2;
while (j <= M)
   Z = [ Z  Z_big( (j-1)*N+1 : j*N , 1)];
   j=j+1;
end

