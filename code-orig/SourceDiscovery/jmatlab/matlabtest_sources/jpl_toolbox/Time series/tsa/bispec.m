function [BISPEC,BIACF,ACF] = bispec(Z,N);
% Calculates Bispectrum 
% [BISPEC] = bispec(Z,N);
%
% Input:	Z    Signal
%		N  # of coefficients
% Output:	BiACF  bi-autocorrelation function = 3rd order cumulant
%		BISPEC Bi-spectrum 
%
% Reference(s):
% C.L. Nikias and A.P. Petropulu "Higher-Order Spectra Analysis" Prentice Hall, 1993.
% M.B. Priestley, "Non-linear and Non-stationary Time series Analysis", Academic Press, London, 1988.

%	$Revision: 1.5 $
%	$Id: bispec.m,v 1.5 2003/02/16 22:21:08 schloegl Exp $
%	Copyright (c) 1997-2003 by Alois Schloegl
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

P=N+1;
ACF=zeros(1,N+1);
BIACF=zeros(2*N+1,2*N+1);

Z=Z(:);
M=size(Z,1);
M1=sum(Z)/M;
Z=Z-M1*ones(size(Z));

for K=0:N, 
	jc2=Z(1:M-K).*Z(1+K:M);
	ACF(K+1)=sum(jc2)/M;
	for L = K:N,
		jc3 = sum(jc2(1:M-L).*Z(1+L:M))/M;
		BIACF(K+P,  L+P)  =jc3;
		BIACF(L+P,  K+P)  =jc3;
		BIACF(L-K+P, -K+P)=jc3;
		BIACF(-K+P, L-K+P)=jc3;
		BIACF(K-L+P, -L+P)=jc3;
		BIACF(-L+P, K-L+P)=jc3;
	end;
end;

BISPEC=fft2(BIACF,128,128);
