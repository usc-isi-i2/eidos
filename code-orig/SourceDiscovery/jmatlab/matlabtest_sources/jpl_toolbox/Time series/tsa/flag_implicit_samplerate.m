function DIM=flag_implicit_samplerate(i)
% The use of FLAG_IMPLICIT_SAMPLERATE is in experimental state. 
% FLAG_IMPLICIT_SAMPLERATE might even become obsolete.
% Do not use it. 

% FLAG_IMPLICIT_SAMPLERATE sets and gets default mode for handling NaNs
% The default DIM argument is stored in the global variable FLAG_implicit_samplerate
% The idea is that the DIM-argument is not necessary. This might enable 
% more readable code. 
% 
%   flag_implicit_samplerate(0) 
%	calculation along first non-singleton dimension
%   flag_implicit_samplerate(1) 
%	calculation along columns
%   flag_implicit_samplerate(2) 
%	calculation along rows
% 
% DIM = flag_implicit_samplerate()
% 	gets default mode
%
% flag_implicit_samplerate(DIM)
% 	sets default DIM
%
% DIM = flag_implicit_samplerate(DIM)
%	gets and sets DIM 
%
% features:
% - compatible to Matlab and Octave
%
% see also: SINVEST1

%    This program is free software; you can redistribute it and/or modify
%    it under the terms of the GNU General Public License as published by
%    the Free Software Foundation; either version 2 of the License, or
%    (at your option) any later version.
%
%    This program is distributed in the hope that it will be useful,
%    but WITHOUT ANY WARRANTY; without even the implied warranty of
%    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
%    GNU General Public License for more details.
%
%    You should have received a copy of the GNU General Public License
%    along with this program; if not, write to the Free Software
%    Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA

%	Version 2.99;	10 May 2002
%	Copyright (c) 2000-2002 by  Alois Schloegl   <a.schloegl@ieee.org>	

global FLAG_implicit_samplerate;

%%% check whether FLAG was already defined 
if exist('FLAG_implicit_samplerate')~=1,
	FLAG_implicit_samplerate = 1;
end;
if isempty(FLAG_implicit_samplerate),
	FLAG_implicit_samplerate = 1;
end;

if nargin>0,
        fprintf(2,'Warning: FLAG_IMPLICIT_SAMPLERATE is in an experimental state\n');
        fprintf(2,'It might become obsolete.\n');
        FLAG_implicit_samplerate = i; 
end;    

DIM = FLAG_implicit_samplerate;
