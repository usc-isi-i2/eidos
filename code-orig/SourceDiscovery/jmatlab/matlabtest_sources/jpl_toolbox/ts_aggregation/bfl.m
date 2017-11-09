function res=bfl(Y,ta,d,s);
% PURPOSE: Temporal disaggregation using the Boot-Feibes-Lisman method
% -----------------------------------------------------------------------
% SYNTAX: res=bfl(Y,ta,d,s);
% -----------------------------------------------------------------------
% OUTPUT: res: a structure
%         res.meth  = 'Boot-Feibes-Lisman';
%         res.N     = Number of low frequency data
%         res.ta    = Type of disaggregation
%         res.s     = Frequency conversion
%         res.d     = Degree of differencing 
%         res.y     = High frequency estimate
%         res.et    = Elapsed time
% -----------------------------------------------------------------------
% INPUT: Y: Nx1 ---> vector of low frequency data
%        ta: type of disaggregation
%            ta=1 ---> sum (flow)
%            ta=2 ---> average (index)
%            ta=3 ---> last element (stock) ---> interpolation
%        d: objective function to be minimized: volatility of ...
%            d=0 ---> levels
%            d=1 ---> first differences
%            d=2 ---> second differences
%        s: number of high frequency data points for each low frequency data point
%            s= 4 ---> annual to quarterly
%            s=12 ---> annual to monthly
%            s= 3 ---> quarterly to monthly
% -----------------------------------------------------------------------
% LIBRARY: aggreg
% -----------------------------------------------------------------------
% SEE ALSO: tduni_print, tduni_plot
% -----------------------------------------------------------------------
% REFERENCE: Boot, J.C.G., Feibes, W. y Lisman, J.H.C. (1967)
% "Further methods of derivation of quarterly figures from annual data", 
% Applied Statistics, vol. 16, n. 1, p. 65-75.

% written by:
% Enrique M. Quilis
% Instituto Nacional de Estadistica
% Paseo de la Castellana, 183
% 28046 - Madrid (SPAIN)

t0=clock;

% -----------------------------------------------------------------------
% Size of the problem

[N,M] = size(Y);
n=s*N;

% -----------------------------------------------------------------------
% Generation of aggregation matrix C

C = aggreg(ta,N,s);

% -----------------------------------------------------------------------
% Generation of (implicit) VCV matrix H: nxn
% depending on the selected objective function
%       d=0 ---> H=I
%       d=1 ---> H=D
%       d=2 ---> H=D*D

switch d
case 0
   H = eye(n);         % Levels
case 1
   D = zeros(n-1,n);   % First differences
   for i=1:n-1
      D(i,i)   = -1.00;
      D(i,i+1) =  1.00;
   end;
   H=D'*D;
case 2
   D = zeros(n-2,n);   % Second differences
   for i=1:n-2
      D(i,i)   =  1.00;
      D(i,i+1) = -2.00;
      D(i,i+2) =  1.00;
   end;
   H=D'*D;
otherwise
   error (' *** IMPROPER VALUE d FOR OBJECTIVE FUNCTION *** ');
end

% -----------------------------------------------------------------------
% Computing high frequency series:
%       1. Generation of supermatrix A
%       2. Expandig low freq. input
%       3. y=inv(A)*Ye. Selection of relevant part: 1..n

A = [H C'
   C  zeros(N,N)];

Ye = [ zeros(n,1)
        Y ];

y = A \ Ye;
y = y(1:n);

% -----------------------------------------------------------------------
% Loading the structure
% -----------------------------------------------------------------------

% Basic parameters 

res.meth = 'Boot-Feibes-Lisman';
res.N = N;
res.ta= ta;
res.s = s;
res.d = d;

% -----------------------------------------------------------------------
% Series

res.y = y;

% -----------------------------------------------------------------------
% Elapsed time

res.et        = etime(clock,t0);
