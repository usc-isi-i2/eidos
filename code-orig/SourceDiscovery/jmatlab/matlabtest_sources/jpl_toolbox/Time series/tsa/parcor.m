function [PARCOR,ARP, PE] = parcor(AutoCov);
% estimates partial autocorrelation coefficients 
% Multiple channels can be used (one per row).
%
% [PARCOR, AR, PE] = parcor(AutoCov); % calculates Partial autocorrelation, autoregressive coefficients and residual error variance from the Autocorrelation function. 
%
% [PARCOR] = parcor(acovf(x,p)); % calculates the Partial Autocorrelation coefficients of the data series x up to order p
%
%  INPUT:
% AutoCov	Autocorrelation function for lag=0:P
%
%  OUTPUT
% AR	autoregressive model parameter	
% PARCOR partial correlation coefficients (= -reflection coefficients)
% PE    remaining error variance
%
% All input and output parameters are organized in rows, one row 
% corresponds to the parameters of one channel. 
% The PARCOR coefficients are the negative reflection coefficients. 
% A significance test is implemented in PACF.
%
% see also: PACF ACOVF ACORF DURLEV AC2RC 
% 
% REFERENCES:
%  P.J. Brockwell and R.A. Davis "Time Series: Theory and Methods", 2nd ed. Springer, 1991.
%  S. Haykin "Adaptive Filter Theory" 3ed. Prentice Hall, 1996.
%  M.B. Priestley "Spectral Analysis and Time Series" Academic Press, 1981. 
%  W.S. Wei "Time Series Analysis" Addison Wesley, 1990.

%       Version 2.99b       24 Oct 2002
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

[ARP,PARCOR,PE] = durlev(AutoCov);
PARCOR=-PARCOR;