function [R]=y2res(Y)
% Y2RES evaluates basic statistics of a data series (column)
% res=y2res(y)
% 
% OUTPUT:
%   res.N     sum (number of samples)
%   res.MU    mean
%   res.SD2   variance
%   res.Max   Maximum
%   res.Min   Minimum 
%   ...   and many more 
% 
% REFERENCES:
% [1] http://www.itl.nist.gov/
% [2] http://mathworld.wolfram.com/

%	Version 2.99b
%	Copyright (C) 1996-2002 by Alois Schloegl <a.schloegl@ieee.org>	


[R.SUM, R.N, R.SSQ] = sumskipnan(Y,1);
%R.S3P = sumskipnan(Y.^3,1);
R.S4P = sumskipnan(Y.^4,1);
%R.S5P = sumskipnan(Y.^5,1);

R.MEAN	= R.SUM./R.N;
R.MSQ   = R.SSQ./R.N;
R.RMS	= sqrt(R.MSQ);
R.SSQ0  = R.SSQ-R.SUM.*R.MEAN;		% sum square of mean removed

if 1,%flag_implicit_unbiased_estim,
    n1 	= max(R.N-1,0);			% in case of n=0 and n=1, the (biased) variance, STD and STE are INF
else
    n1	= R.N;
end;

R.VAR  	= R.SSQ0./n1;	     		% variance (unbiased) 
R.STD  	= sqrt(R.VAR);		     	% standard deviation
R.SEM  	= sqrt(R.SSQ0./(R.N.*n1)); 	% standard error of the mean
R.SEV	= sqrt(n1.*(n1.*R.S4P./R.N+(R.N.^2-2*R.N+3).*(R.SSQ./R.N).^2)./(R.N.^3)); % standard error of the variance
R.Coefficient_of_variation = R.STD./R.MEAN;

R.CM2	= R.SSQ0./n1;

R.Max   = max(Y,[],1);
R.Min   = min(Y,[],1);

%R.NormEntropy = log2(sqrt(2*pi*exp(1)))+log2(R.STD);

Q0500=repmat(nan,1,size(Y,2));
Q0250=Q0500;
Q0750=Q0500;
%MODE=Q0500;
for k=1:size(Y,2),
        tmp = sort(Y(:,k));
        Q0250(k) = flix(tmp,R.N(k)/4   + 0.75);
        Q0500(k) = flix(tmp,R.N(k)/2   + 0.50);
        Q0750(k) = flix(tmp,R.N(k)*3/4 + 0.25);
end;
R.MEDIAN 	= Q0500;
R.Quartiles   	= [Q0250; Q0750];
% R.IQR = H_spread   	= [Q0750 - Q0250];
R.TRIMEAN	= [Q0250 + 2*Q0500 + Q0750]/4;

Y       = Y - repmat(R.MEAN,size(Y)./size(R.MEAN));
R.CM3 	= sumskipnan(Y.^3,1)./n1;
R.CM4 	= sumskipnan(Y.^4,1)./n1;
%R.CM5 	= sumskipnan(Y.^5,1)./n1;

R.SKEWNESS = R.CM3./(R.STD.^3);
R.KURTOSIS = R.CM4./(R.VAR.^2)-3;

%R.Skewness.Fisher = (R.CM3)./(R.STD.^3);	%%% same as R.SKEWNESS

%R.Skewness.Pearson_Mode   = (R.MEAN-R.MODE)./R.STD;
%R.Skewness.Pearson_coeff1 = (3*R.MEAN-R.MODE)./R.STD;
R.Skewness.Pearson_coeff2 = (3*R.MEAN-R.MEDIAN)./R.STD;
R.Skewness.Bowley = (Q0750+Q0250 - 2*Q0500)./(Q0750-Q0250); % quartile skewness coefficient

R.datatype = 'STAT Level 4';

