function b=hup(c)
%HUP(C)	tests if the polynomial C is a Hurwitz-Polynomial.
%	It tests if all roots lie in the left half of the complex
%	plane 
%       B=hup(C) is the same as 
%       B=all(real(roots(c))<0) but much faster.
%	The Algorithm is based on the Routh-Scheme.
%	C are the elements of the Polynomial
%	C(1)*X^N + ... + C(N)*X + C(N+1).
%
%       HUP2 works also for multiple polynomials, 
%       each row a poly - Yet not tested
%
% REFERENCES:
%  F. Gausch "Systemtechnik", Textbook, University of Technology Graz, 1993. 
%  Ch. Langraf and G. Schneider "Elemente der Regeltechnik", Springer Verlag, 1970.

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

%	Version 2.43                               
%	23.April 1998
%	Copyright (c) 1995-1998 by Alois Schloegl
%	a.schloegl@ieee.org	

[lr,lc] = size(c);

% Strip leading zeros and throw away.
	% not considered yet
%d=(c(:,1)==0);

% Trailing zeros mean there are roots at zero
b=(c(:,lc)~=0);
lambda=b;

n=zeros(lc);
if lc>3
	n(4:2:lc,2:2:lc-2)=1;
end;
while lc>1               
	lambda(b)=c(b,1)./c(b,2);
	b = b & (lambda>=0) & (lambda<Inf);
	c=c(:,2:lc)-lambda(:,ones(1,lc-1)).*(c*n(1:lc,1:lc-1));
	lc=lc-1;
end;
