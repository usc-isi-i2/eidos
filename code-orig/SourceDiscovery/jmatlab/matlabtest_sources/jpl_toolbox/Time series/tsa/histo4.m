function [R,tix]=histo4(Y)
% HISTO4 calculates histogram for rows and supports data compression
%
% R = HISTO4(Y)
% 	R is a struct with th fields 
%       R.X  are the bin-values 
%       R.H  is the frequency of occurence of value X 
%  	R.N  are the number of samples 
%
% HISTO4 might be useful for data compression, because
% [R,tix] = histo4(Y) 
%     	is the compression step
% R.X(tix,:) 
%  	is the decompression step
%
% The effort (in memory and speed) for compression is O(n*log(n))
% The effort (in memory and speed) for decompression is only O(n)
% 
% see also: HISTO, HISTO2, HISTO3, HISTO4
%
% REFERENCE(S):
%  C.E. Shannon and W. Weaver "The mathematical theory of communication" University of Illinois Press, Urbana 1949 (reprint 1963).

%  V 3.00  30.08.2002	compression algorithm implemented
%  	   25.08.2002	histograms for rows.
%          05.04.2002   docu modified
%  	   21.02.2002	major changes, single X for all channels
%  V 2.84  16.02.2002	minor bug fixed	
%  V 2.83  06.02.2002	
%  V 2.82  31.01.2002	AUTO changed to non-equidistant bins
%  V 2.75  30.08.2001	semicolon 
%          10.07.2001   Entropy of multiple channels fixed
%          04.05.2001   display improved
%  V 2.74  20.04.2001   bug fixed for case N==1, x =minY;
%          13.03.2001	scaling of x corrected
%  V 2.72  08.03.2001   third argin, specifies the number of bins
%          26.11.2000 	bug fixed (entropy calculation)
%  V 2.69  25.10.2000   revised (nan's are considered)
%  V 2.68  28.07.2000   revised
%  V 2.63  18.10.1999   multiple rows implemented
%          26.11.1999   bug fixed (size of H corrected);

%	Version 3.00  Date: 09 Nov 2002
%	Copyright (C) 1996-2002 by Alois Schloegl <a.schloegl@ieee.org>	

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


[yr, yc] = size(Y);
if yr==1,
        % Makes sure there is a second row
        % Sort does not support the DIM-argument, therefore,
        % this function would not work correctly with Octave
        % Once this is fixed, this part can be removed. 
        Y = [Y; NaN+ones(size(Y))];  
end;


% identify all possible X's and overall Histogram
[Y,   idx] = sortrows(Y);
[tmp, idx] = sort(idx);        % inverse index

%[ix, iy] = (diff(Y,1)>0);
ix = logical(zeros(yr-1,1));
for k = 1:yr-1,
        ix(k) = any(Y(k,:)~=Y(k+1,:));
end;

tmp = [find(ix); yr];
R.H = diff([0; tmp]);
R.X = Y(tmp,:);
R.N = yr;
R.datatype = 'HISTOGRAM';

% generate inverse index
if nargout>1,
        tix = cumsum([1;ix]);	% rank 
        cc  = 1;
        tmp = sum(ix)+1;
	if exist('OCTAVE_VERSION')>=5,
		; % NOP; no support for integer datatyp 
        elseif tmp <= 2^8;
                tix = uint8(tix);
                cc = 8/1;
        elseif tmp <= 2^16;
                tix = uint16(tix);
                cc = 8/2;
        elseif tmp <= 2^32;
                tix = uint32(tix);
                cc = 8/4;
        end;
        tix = tix(idx);		% inverse sort rank
        
        R.compressionratio = (prod(size(R.X)) + yr/cc) / (yr*yc);
        R.tix = tix;
end;
