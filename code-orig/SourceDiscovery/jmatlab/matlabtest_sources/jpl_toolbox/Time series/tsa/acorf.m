function [AUTOCOV,stderr,lpq,qpval] = acorf(Z,N);
%  Calculates autocorrelations for multiple data series.
%  Missing values in Z (NaN) are considered. 
%  Also calculates Ljung-Box Q stats and p-values.
%
%    [AutoCorr,stderr,lpq,qpval] = acorf(Z,N);
%  If mean should be removed use
%    [AutoCorr,stderr,lpq,qpval] = acorf(detrend(Z',0)',N);
%  If trend should be removed use
%    [AutoCorr,stderr,lpq,qpval] = acorf(detrend(Z')',N);
%
% INPUT
%  Z	is data series for which autocorrelations are required
%       each in a row
%  N	maximum lag
%
% OUTPUT
%  AutoCorr nr x N matrix of autocorrelations
%  stderr   nr x N matrix of (approx) std errors
%  lpq      nr x M matrix of Ljung-Box Q stats
%  qpval    nr x N matrix of p-values on Q stats
%   
% All input and output parameters are organized in rows, one row 
% corresponds to one series
%
% REFERENCES:
%  S. Haykin "Adaptive Filter Theory" 3ed. Prentice Hall, 1996.
%  M.B. Priestley "Spectral Analysis and Time Series" Academic Press, 1981. 
%  W.S. Wei "Time Series Analysis" Addison Wesley, 1990.
%  J.S. Bendat and A.G.Persol "Random Data: Analysis and Measurement procedures", Wiley, 1986.

%       Version 2.99a       Date: 13 Jul 2002
%	Copyright (c) 1998-2002 by Alois Schloegl <a.schloegl@ieee.org>		

% calculating lpq, stderr, qpval from 
% suggested by Philip Gray, University of New South Wales, 

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

[nr,nc] = size(Z);
NC = sum(~isnan(Z),2); % missing values

AUTOCOV = acovf(Z,N);
AUTOCOV = AUTOCOV(:,2:N+1) ./ AUTOCOV(:,ones(1,N));

if nargout > 1 
        stderr = sqrt(1./NC)*ones(1,N);
        lpq = zeros(nr,N);
        qpval = zeros(nr,N);
        
        cum=zeros(nr,1);
        for k=1:N,
                cum = cum+AUTOCOV(:,k).*conj(AUTOCOV(:,k))./(NC-k);
                lpq(:,k) = NC.*(NC+2).*cum;                 % Ljung box Q for k lags
                %qpval(:,k) = 1 - chi2cdf(lpq(:,k),k);	% p-value of Q stat
                qpval(:,k) = 1 - gammainc(lpq(:,k)/2,k/2);	% replace chi2cdf by gammainc
        end;
end;