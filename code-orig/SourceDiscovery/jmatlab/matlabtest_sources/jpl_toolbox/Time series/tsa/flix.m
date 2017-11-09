function Y=flix(D,x)
% floating point index - interpolates data in case of non-integer indices
%
% Y=flix(D,x)
%   FLIX returns Y=D(x) if x is an integer 
%   otherwise D(x) is interpolated from the neighbors D(ceil(x)) and D(floor(x)) 
% 
% Applications: 
% (1)  discrete Dataseries can be upsampled to higher sampling rate   
% (2)  transformation of non-equidistant samples to equidistant samples
% (3)  [Q]=flix(sort(D),q*(length(D)+1)) calculates the q-quantile of data series D   
%
% see also: HIST2RES, Y2RES, PLOTCDF

%	Version 2.99  	9 May 2002
%	Copyright (C) by 2001-2002 Alois Schloegl    <a.schloegl@ieee.org>	

D  = D(:);
Y  = x;

k1 = ((x >= 1) & (x <= size(D,1)));
Y(~k1) = NaN;

k  = x - floor(x);	% distance to next sample	 

ix = ~k & k1; 	        % find integer indices
Y(ix) = D(x(ix)); 	% put integer indices

ix = k & k1;     	% find non-integer indices

Y(ix) = D(floor(x(ix))).*(1-k(ix)) + D(ceil(x(ix))).*k(ix);  

