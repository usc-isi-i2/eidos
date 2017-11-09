function [PARCOR,sig,cil,ciu]= pacf(Z,KMAX);
% Partial Autocorrelation function
% [parcor,sig,cil,ciu] = pacf(Z,N);
%
% Input:
%	Z    Signal, each row is analysed
%	N    # of coefficients

% Output:	
%	parcor autocorrelation function
%	sig	p-value for significance test
%	cil	lower confidence interval 
%	ciu	upper confidence interval 
% 
% see also: DURLEV, LATTICE, AC2RC, AR2RC,
% 	FLAG_IMPLICIT_SIGNIFICANCE

%	Version 2.99b	Date: 24Sep 2002
%	Copyright (C) 1997-2002 by Alois Schloegl <a.schloegl@ieee.org>	
%
% This library is free software; you can redistribute it and/or
% modify it under the terms of the GNU Library General Public
% License as published by the Free Software Foundation; either
% Version 2 of the License, or (at your option) any later version.
%
% This library is distributed in the hope that it will be useful,
% but WITHOUT ANY WARRANTY; without even the implied warranty of
% MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
% Library General Public License for more details.
%
% You should have received a copy of the GNU Library General Public
% License along with this library; if not, write to the
% Free Software Foundation, Inc., 59 Temple Place - Suite 330,
% Boston, MA  02111-1307, USA.

[nr,nc] = size(Z);
if nc<KMAX,
        warning('too less elements.\nmake sure the data is row order\n')
end;
[s,n] = sumskipnan(Z,2);
Z = Z - repmat(s./n,1,nc); 	% remove mean

if (nargin == 1), KMAX = N-1; end;

AutoCov = acovf(Z,KMAX);
[AR,PARCOR,PE] = durlev(AutoCov); % PARCOR are the reflection coefficients
%[AR,PARCOR,PE] = lattice(Z,KMAX); % PARCOR are the reflection coefficients
PARCOR = -PARCOR;			% the partial correlation coefficients are the negative reflection coefficient.

if nargout<2, return, end;


% significance test
s = 1./sqrt(repmat(n,1,KMAX)-1-ones(nr,1)*(1:KMAX));
sig = normcdf(PARCOR,0,s);
sig = min(sig,1-sig);


if nargout<3, return, end;
% calculate confidence interval
if exist('flag_implicit_significance')==2;
        alpha = flag_implicit_significance;
else	
        alpha = 0.05;
end;        

fprintf(1,'PACF: confidence interval for alpha=%f\n', alpha);
ciu = norminv(alpha/2).*s;
cil = -ciu;        


