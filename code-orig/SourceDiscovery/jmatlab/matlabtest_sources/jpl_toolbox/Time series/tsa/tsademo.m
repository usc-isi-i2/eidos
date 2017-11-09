% TSADEMO	demonstrates INVEST1 on EEG data

%       Version 2.99        23.05.2002
%	Copyright (c) 1998-2002 by Alois Schloegl <a.schloegl@ieee.org>		

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


if exist('OCTAVE_VERSION')>5;
    load -force eeg8s.mat 
elseif 1
    load eeg8s.mat 
else
    [FileName, PathName]=uigetfile('eeg8s.mat','load demo data EEG8S.MAT');
    load([PathName FileName],'eeg8s');
end;
s = eeg8s';
Pmax=100;
[AutoCov,AutoCorr,ARPMX,E,CRITERIA,MOPS]=invest1(s,Pmax,'s');

if size(ARPMX,2)==2*Pmax,
	%invest1(eeg8s,30,'s');
        AR=ARPMX(:,1:Pmax);
        RC=ARPMX(:,Pmax+1:2*Pmax);
else
	AR=ARPMX(:,Pmax/2*(Pmax-1)+(1:Pmax));
	RC=ARPMX(:,(1:Pmax).*(2:Pmax+1)/2);
end;