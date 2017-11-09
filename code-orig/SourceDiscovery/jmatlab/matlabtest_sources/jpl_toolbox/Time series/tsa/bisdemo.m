% BISDEMO (script) Shows BISPECTRUM of eeg8s.mat
%	Version 2.44
%	last revision 22.06.1998
%	Copyright (c) 1997-1998 by Alois Schloegl
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

load eeg8s.mat;
[BISPEC,BICOV,ACF]=bispec(eeg8s,30);
[s1,s2]=size(BISPEC);
t1=(1:s1)/max(s1);
t2=(1:s2)/max(s2);
subplot(211);
mesh(t1,t2,abs(BISPEC));
title('Bispectrum - mesh plot');

subplot(212);
if exist('OCTAVE_VERSION')>5
        contour(abs(BISPEC),10,t1,t2);
else
        contour(t1,t2,abs(BISPEC),10);
end;        
title('Bispectrum - contour plot');
