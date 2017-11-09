function [A] = ar2poly(A);
% converts autoregressive parameters into AR polymials 
% Multiple polynomials can be converted. 
% function  [A] = ar2poly(AR);
%
%  INPUT:
% AR     AR parameters, each row represents one set of AR parameters
%
%  OUTPUT
% A     denominator polynom
%
%
% see also ACOVF ACORF DURLEV RC2AR FILTER FREQZ ZPLANE
% 
% REFERENCES:
%  P.J. Brockwell and R. A. Davis "Time Series: Theory and Methods", 2nd ed. Springer, 1991.
%  S. Haykin "Adaptive Filter Theory" 3rd ed. Prentice Hall, 1996.
%  M.B. Priestley "Spectral Analysis and Time Series" Academic Press, 1981. 
%  W.S. Wei "Time Series Analysis" Addison Wesley, 1990.

%	Version 2.90	last revision 10.04.2002
%	Copyright (c) 1996-2002 by Alois Schloegl
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

A = [ones(size(A,1),1),-A];
