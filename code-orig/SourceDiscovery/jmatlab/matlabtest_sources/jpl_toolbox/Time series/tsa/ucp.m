function b=ucp(c)
% UCP(C) tests if the polynomial C is a Unit-Circle-Polynomial.
%	It tests if all roots lie inside the unit circle like
%       B=ucp(C) does the same as
%	B=all(abs(roots(C))<1) but much faster.
%	The Algorithm is based on the Jury-Scheme.
%	C are the elements of the Polynomial
%	C(1)*X^N + ... + C(N)*X + C(N+1).
% 
% REFERENCES:
%  O. Foellinger "Lineare Abtastsysteme", Oldenburg Verlag, Muenchen, 1986.
%  F. Gausch "Systemtechnik", Textbook, University of Technology Graz, 1993. 


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

% Version 2.62
% 07.04.1999
% Copyright © 1996-1999 by Alois Schloegl
% a.schloegl@ieee.org
%

[lr,lc] = size(c);

% JURY-Scheme
b=ones(lr,1);
lambda=zeros(lr,1);
while (lc > 1), 
     	lambda = c(:,lc)./c(:,1);
%       disp([lc,size(lambda), sum(b),toc]);
	% ratio must be less then 1
	b = b & (abs(lambda) < 1);
	% and reduced polynomial must be a UCP, too.
	c(:,1:lc-1) = c(:,1:lc-1) - lambda(:,ones(1,lc-1)).*c(:,lc:-1:2);
	lc = lc-1;
end;

