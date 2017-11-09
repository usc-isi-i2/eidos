function [C]=aggreg(op1,N,s)
% PURPOSE: Generate a temporal aggregation matrix
% ------------------------------------------------------------
% SYNTAX: C=aggreg(op1,N,s);
% ------------------------------------------------------------
% OUTPUT: C: NxsN temporal aggregation matrix
% ------------------------------------------------------------
% INPUT:  op1: type of temporal aggregation 
%         op1=1 ---> sum (flow)
%         op1=2 ---> average (index)
%         op1=3 ---> last element (stock) ---> interpolation
%         N: number of low frequency data
%         s: number of high frequency data points 
%            for each low frequency data points (freq. conversion)
% ------------------------------------------------------------
% LIBRARY:
% ------------------------------------------------------------
% SEE ALSO: temporal_agg

% written by:
% Enrique M. Quilis
% Instituto Nacional de Estadistica
% Paseo de la Castellana, 183
% 28046 - Madrid (SPAIN)

% ------------------------------------------------------------
% Generation of aggregation matrix C=I(N) <kron> c

switch op1
case 1   
   c=ones(1,s);
case 2
   c=ones(1,s)./s;
case 3
   c=zeros(1,s);
   c(s)=1;
otherwise
   error ('*** IMPROPER VALUE OF OPTION PARAMETER ***');
end

% ------------------------------------------------------------
% Temporal aggregation matrix

C=kron(eye(N),c);

