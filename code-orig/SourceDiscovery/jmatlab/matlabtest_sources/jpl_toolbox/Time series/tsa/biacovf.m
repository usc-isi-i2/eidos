function [BIACF,ACF,M1] = biacovf(Z,N);
% BiAutoCovariance function 
% [BiACF] = biacovf(Z,N);
%
% Input:	Z    Signal
%		N  # of coefficients
% Output:	BIACF bi-autocorrelation function (joint cumulant 3rd order
% Output:	ACF   covariance function (joint cumulant 2nd order)

%	Version 2.30
%	last revision 21.03.1998
%	Copyright (c) 1997, 1998 by Alois Schloegl
%	e-mail: a.schloegl@ieee.org	

% This library is free software; you can redistribute it and/or
% modify it under the terms of the GNU Library General Public
% License as published by the Free Software Foundation; either
% version 2 of the License, or (at your option) any later version.
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

ACF=zeros(1,N+1);
BIACF=zeros(N+1,N+1);

Z=Z(:);
M=size(Z,1);

M1=sum(Z)/M;
Z=Z-M1*ones(size(Z));

for K=0:N, 
	tmp=Z(1:M-K).*Z(1+K:M);
	ACF(K+1)=sum(tmp)/M;
	for L = K:N,
		BIACF(K+1,L+1) = sum(tmp(1:M-L).*Z(1+L:M))/M;
	end;
end;

BIACF=BIACF+BIACF'-diag(diag(BIACF));