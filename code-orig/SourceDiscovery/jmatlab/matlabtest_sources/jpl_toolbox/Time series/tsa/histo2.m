function R=histo2(Y)
% HISTO2 calculates histogram of each column
% R=HISTO2(Y)
%
% R=HISTO(...)            
% 	R is a struct with th fields 
%       R.X  are the bin-values 
%       R.H  is the frequency of occurence of value X 
%  	R.N  are the number of valid (not NaN) samples 
%
% more histogram-based results can be obtained by HIST2RES2  
%
% see also: HISTO, HISTO2, HISTO3, HISTO4
%
% REFERENCE(S):
%  C.E. Shannon and W. Weaver "The mathematical theory of communication" University of Illinois Press, Urbana 1949 (reprint 1963).

%  V 3.00   9.11.2002   minor modifications
%          05.04.2002   docu modified
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

[yr,yc] = size(Y);

if yr==1,
        % Makes sure there is a second row
        % Sort does not support the DIM-argument, therefore,
        % this function would not work correctly with Octave
        % Once this is fixed, this part can be removed. 
        Y = [Y; NaN+ones(size(Y))];  
end;

sY  = sort(Y);
N   = sum(~isnan(Y),1);
[ix,iy] = find(diff(sY,1)>0);
nn0 = 0;
warning('off');

for k=1:yc,
	tmp    = [ix(iy==k); N(k)];
        nn1    = length(tmp);
        
        H(1:nn1,k) = diff([0; tmp]);
       	X(1:nn1,k) = sY(tmp,k);

        if nn1<nn0;
                H(1+nn1:nn0,k) = NaN;
                X(1+nn1:nn0,k) = NaN;
        elseif nn1>nn0,
                H(1+nn0:nn1,1:k-1) = repmat(NaN,nn1-nn0,k-1);
                X(1+nn0:nn1,1:k-1) = repmat(NaN,nn1-nn0,k-1);
                nn0 = nn1;
        end;
end;

R.datatype = 'HISTOGRAM';
R.H = H;
R.X = X;
R.N = sumskipnan(R.H,1);


 