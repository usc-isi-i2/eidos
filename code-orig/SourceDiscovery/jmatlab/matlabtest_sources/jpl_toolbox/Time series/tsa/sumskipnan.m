function [o,count,SSQ,S4M] = sumskipnan(i,DIM)
% SUMSKIPNAN adds all non-NaN values. 
%
% All NaN's are skipped; NaN's are considered as missing values. 
% SUMSKIPNAN of NaN's only  gives O; and the number of valid elements is return. 
% SUMSKIPNAN is also the elementary function for calculating 
% various statistics (e.g. MEAN, STD, VAR, RMS, MEANSQ, SKEWNESS, 
% KURTOSIS, MOMENT, STATISTIC etc.) from data with missing values.  
% SUMSKIPNAN implements the DIMENSION-argument for data with missing values.
% Also the second output argument return the number of valid elements (not NaNs) 
% 
% Y = sumskipnan(x [,DIM])
% [Y,N,SSQ] = sumskipnan(x [,DIM])
% 
% DIM	dimension
%	1 sum of columns
%	2 sum of rows
%	default or []: first DIMENSION with more than 1 element
%
% Y	resulting sum
% N	number of valid (not missing) elements
% SSQ	sum of squares
%
% The mean & standard error of the mean and 
%	Y./N & sqrt((SSQ-Y.*Y./N)./(N.*max(N-1,0))); 
% the mean square & the standard error of the mean square and
% 	SSQ./N & sqrt((S4M-SSQ.^2./N)./(N.*max(N-1,0)))
%
% features:
% - can deal with NaN's (missing values)
% - implements dimension argument. 
% - compatible with Matlab and Octave
%
% see also: SUM, NANSUM, MEAN, STD, VAR, RMS, MEANSQ, 
%      SSQ, MOMENT, SKEWNESS, KURTOSIS, SEM


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

%    Copyright (C) 2000-2002 by  Alois Schloegl <a.schloegl@ieee.org>	


if nargin<2,
        DIM=min(find(size(i)>1));
        if isempty(DIM), DIM=1; end;
end;

ver = version;
ver = str2num(ver(1))*1000+str2num(ver(3))*100+str2num(ver(5:6));
if ver < 2136,
        
        %%% This part is neccessary for the following reasons: 
        %%% 1) its workaround for a bug in Octave version <= 2.1.35
        %%%    sum(1:4,1) has not resulted in 1:4
        %%% 2) DIM argument is not implemented in SUM of Octave 2.0.x 
        %%% Once these points are fixed, this part can be removed  
        
        [nr,nc] = size(i);
        if DIM==1,
                o     = zeros(1,nc);
                count = o;
                for k = 1:nc,
                        count(1,k) = sum(~isnan(i(:,k)));
                        o(1,k)     = sum(i(find(~isnan(i(:,k))),k));
                end;		
        elseif DIM==2,
                o     = zeros(nr,1);
                count = o;
                for k = 1:nr,
                        count(k,1) = sum(~isnan(i(k,:)));
                        o(k,1)     = sum(i(k,find(~isnan(i(k,:)))));
                end;		
        else
                fprintf('Error SUMSKIPNAN: DIM argument must be 1 or 2\n');	
        end;
        
        if ~flag_implicit_skip_nan,
        % the following command implements NaN-In -> NaN-Out
        	o(count<size(i,DIM)) = NaN;         
        end;	
        if nargout>2,
                i = i.^2;
                SSQ = sumskipnan(i,DIM);
                if nargout>3,
                        S4M = sum(i.^2,DIM);
                end;
        end
else 

	% an efficient implementation in C of the following lines 
        % could significantly increase performance 
        % only one loop and only one check for isnan is needed
        %
        % Outline of the algorithm: 
        % for { k=1,o=0,count=0; k++; k<N} 
        % 	if ~isnan(i(k)) 
        % 	{ 	o     += i(k);
        %               count += 1;
        %		tmp    = i(k)*i(k)
        %		o2    += tmp;
        %		o3    += tmp.*tmp;
        %       }; 

	if nargout>1
                count = sum(~isnan(i),DIM); 
        end;
	if flag_implicit_skip_nan, %%% skip always NaN's
                i(isnan(i)) = 0;
        end;
        o = sum(i,DIM);
        if nargout>2,
                i = i.^2;
	        SSQ = sum(i,DIM);
                if nargout>3,
                        S4M = sum(i.^2,DIM);
                end;
        end;
end;

