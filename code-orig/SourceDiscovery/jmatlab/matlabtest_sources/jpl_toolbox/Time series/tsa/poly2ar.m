function [A] = poly2ar(A);
% Converts AR polymials into autoregressive parameters. 
% Multiple polynomials can be converted. 
%
% function  [AR] = poly2ar(A);
%
%  INPUT:
% A     AR polynomial, each row represents one polynomial
%
%  OUTPUT
% AR    autoregressive model parameter	
%
% see also ACOVF ACORF DURLEV RC2AR AR2POLY

%	Version 2.90
%	Copyright (C) 1996-2002 by Alois Schloegl
%	e-mail: a.schloegl@ieee.org	

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

% Inititialization
[lr,lc]=size(A);

if ~all(A(:,1)==1)
	fprintf(2,'Warning POLY2AR: input argument might not be an AR-polynom');
end;	

A = -A(:,2:size(A,2))./A(:,ones(1,size(A,2)-1));
