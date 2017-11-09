function [ARF,RCF,PE,DC,varargout] = mvar(Y, Pmax, Mode);
% Estimates Multi-Variate AutoRegressive model parameters 
% function  [AR,RC,PE] = mvar(Y, Pmax);
%
%  INPUT:
% Y	Multivariate data series 
% Pmax 	Model order
%
%  OUTPUT
% AR    multivariate autoregressive model parameter (same format as in [4]	
% RC    reflection coefficients (= -PARCOR coefficients)
% PE    remaining error variance
%
% All input and output parameters are organized in columns, one column 
% corresponds to the parameters of one channel.
%
% A multivariate inverse filter can be realized with 
%       [AR,RC,PE] = mvar(Y,P);
%	e = mvfilter([eye(size(AR,1)),-AR],eye(size(AR(1))),Y);
%
% see also: MVFILTER, COVM, SUMSKIPNAN, ARFIT2

% REFERENCES:
%  [1] M.S. Kay "Modern Spectral Estimation" Prentice Hall, 1988. 
%  [2] S.L. Marple "Digital Spectral Analysis with Applications" Prentice Hall, 1987.
%  [3] M. Kaminski, M. Ding, W. Truccolo, S.L. Bressler, Evaluating causal realations in neural systems:
%	Granger causality, directed transfer functions and statistical assessment of significance.
%	Biol. Cybern., 85,145-157 (2001)
%  [4] T. Schneider and A. Neumaier, A. 2001. 
%	Algorithm 808: ARFIT-a Matlab package for the estimation of parameters and eigenmodes 
%	of multivariate autoregressive models. ACM-Transactions on Mathematical Software. 27, (Mar.), 58-65.
%  [5] A. Schlogl 2002. 
%	Validation of MVAR estimators or Remark on Algorithm 808: ARFIT, 
%	ACM-Transactions on Mathematical Software. submitted.

%	Version 3.02 	Date: 01 Jan 2003
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


% Inititialization
[N,M] = size(Y);

if nargin<2, 
        Pmax=max([N,M])-1;
end;

M2 = N+1;
global AS_FLAG
AS_FLAG.MVAR.histoN = zeros(M2,1); 


if iscell(Y)
        Pmax = min(max(N ,M ),Pmax);
        C    = Y;
else
        %%%%% Estimate Autocorrelation funtion 	
        if 0, 
                [tmp,LAG]=xcorr(Y,Pmax,'biased');
                for K=0:Pmax,
                        %C{K+1}=reshape(tmp(find(LAG==K)),M ,M );	
                        C(:,K*M+(1:M))=reshape(tmp(find(LAG==K)),M ,M );	
                end;
        else
                for K =0:Pmax;
                        %C{K+1}=Y(1:N-K,:)'*Y(K+1:N ,:)/N ;
                        %C{K+1}=Y(K+1:N,:)'*Y(1:N-K,:)/N; % =Rxx(-k)=conj(Rxx(k)) in [2] with K=k+1; 
                end;
        end;
end;
if nargin<3,
        % tested with a bootstrap validation, Mode 2 or 5 are recommended
        %Mode=5;  % M*P << N
        %Mode=5;  % 5*6 << 100, test=900, permutations 1000
        Mode=2;    % M*P ~~ N
end;

[C(:,1:M),n] = covm(Y,'M');
PE(:,1:M)  = C(:,1:M)./n;

AS_FLAG.MVAR.histoN = AS_FLAG.MVAR.histoN + sparse(n+1,1,1,M2,1); %%%%%%% profiling: number of samples for estimates 

if Mode==0;  % %%%%% multi-channel Levinsion algorithm [2]
        % multivariate Autoregressive parameter estimation
        fprintf('Warning MDURLEV: It''s not recommended to use this mode\n')        
        C(:,1:M) = C(:,1:M)/N;
        F = Y;
        B = Y;
        PEF = C(:,1:M);
        PEB = C(:,1:M);
        for K=1:Pmax,
                [D,n] = covm(Y(K+1:N,:),Y(1:N-K,:),'M');
	        D = D/N;
                ARF(:,K*M+(1-M:0)) = D/PEB;	
                ARB(:,K*M+(1-M:0)) = D'/PEF;	
                
                tmp        = F(K+1:N,:) - B(1:N-K,:)*ARF(:,K*M+(1-M:0))';
                B(1:N-K,:) = B(1:N-K,:) - F(K+1:N,:)*ARB(:,K*M+(1-M:0))';
                F(K+1:N,:) = tmp;
                
                for L = 1:K-1,
                        tmp      = ARF(:,L*M+(1-M:0))   - ARF(:,K*M+(1-M:0))*ARB(:,(K-L)*M+(1-M:0));
                        ARB(:,(K-L)*M+(1-M:0)) = ARB(:,(K-L)*M+(1-M:0)) - ARB(:,K*M+(1-M:0))*ARF(:,L*M+(1-M:0));
                        ARF(:,L*M+(1-M:0))   = tmp;
                end;
                
                RCF(:,K*M+(1-M:0)) = ARF(:,K*M+(1-M:0));
                RCB(:,K*M+(1-M:0)) = ARB(:,K*M+(1-M:0));
                
                PEF = [eye(M) - ARF(:,K*M+(1-M:0))*ARB(:,K*M+(1-M:0))]*PEF;
                PEB = [eye(M) - ARB(:,K*M+(1-M:0))*ARF(:,K*M+(1-M:0))]*PEB;
                PE(:,K*M+(1:M)) = PEF;        
        end;
        
elseif Mode==1, 
        %%%%% multi-channel Levinson algorithm 
        %%%%% with correlation function estimation method 
        %%%%% also called the "multichannel Yule-Walker"
        %%%%% using the biased correlation 
        C(:,1:M) = C(:,1:M)/N;
        PEF = C(:,1:M);
        PEB = C(:,1:M);
        
        for K=1:Pmax,
                [C(:,K*M+(1:M)),n] = covm(Y(K+1:N,:),Y(1:N-K,:),'M');
                C(:,K*M+(1:M)) = C(:,K*M+(1:M))/N;
		AS_FLAG.MVAR.histoN = AS_FLAG.MVAR.histoN + sparse(n+1,1,1,M2,1); %%%%%%% profiling: number of samples for estimates 

                D = C(:,K*M+(1:M));
                for L = 1:K-1,
                        D = D - ARF(:,L*M+(1-M:0))*C(:,(K-L)*M+(1:M));
                end;
                ARF(:,K*M+(1-M:0)) = D / PEB;	
                ARB(:,K*M+(1-M:0)) = D'/ PEF;	
                for L = 1:K-1,
                        tmp                    = ARF(:,L*M+(1-M:0)) - ARF(:,K*M+(1-M:0))*ARB(:,(K-L)*M+(1-M:0));
                        ARB(:,(K-L)*M+(1-M:0)) = ARB(:,(K-L)*M+(1-M:0)) - ARB(:,K*M+(1-M:0))*ARF(:,L*M+(1-M:0));
                        ARF(:,L*M+(1-M:0))     = tmp;
                        %tmp      = ARF{L}   - ARF{K}*ARB{K-L};
                        %ARB{K-L} = ARB{K-L} - ARB{K}*ARF{L};
                        %ARF{L}   = tmp;
                end;
                
                RCF(:,K*M+(1-M:0)) = ARF(:,K*M+(1-M:0));
                RCB(:,K*M+(1-M:0)) = ARB(:,K*M+(1-M:0));
                
                PEF = [eye(M) - ARF(:,K*M+(1-M:0))*ARB(:,K*M+(1-M:0))]*PEF;
                PEB = [eye(M) - ARB(:,K*M+(1-M:0))*ARF(:,K*M+(1-M:0))]*PEB;
                PE(:,K*M+(1:M)) = PEF;        
        end;
        
elseif Mode==6, 
        %%%%% multi-channel Levinson algorithm 
        %%%%% with correlation function estimation method 
        %%%%% also called the "multichannel Yule-Walker"
        %%%%% using the unbiased correlation 
        
        C(:,1:M) = C(:,1:M)/N;
        PEF = C(:,1:M);
        PEB = C(:,1:M);
        
        for K=1:Pmax,
                [C(:,K*M+(1:M)),n] = covm(Y(K+1:N,:),Y(1:N-K,:),'M');
                C(:,K*M+(1:M)) = C(:,K*M+(1:M))./n;
		%C{K+1} = C{K+1}/N;
		AS_FLAG.MVAR.histoN = AS_FLAG.MVAR.histoN + sparse(n+1,1,1,M2,1); %%%%%%% profiling: number of samples for estimates 

                D = C(:,K*M+(1:M));
                for L = 1:K-1,
                        D = D - ARF(:,L*M+(1-M:0))*C(:,(K-L)*M+(1:M));
                end;
                ARF(:,K*M+(1-M:0)) = D / PEB;	
                ARB(:,K*M+(1-M:0)) = D'/ PEF;	
                for L = 1:K-1,
                        tmp      = ARF(:,L*M+(1-M:0))   - ARF(:,K*M+(1-M:0))*ARB(:,(K-L)*M+(1-M:0));
                        ARB(:,(K-L)*M+(1-M:0)) = ARB(:,(K-L)*M+(1-M:0)) - ARB(:,K*M+(1-M:0))*ARF(:,L*M+(1-M:0));
                        ARF(:,L*M+(1-M:0))   = tmp;
                end;
                
                RCF(:,K*M+(1-M:0)) = ARF(:,K*M+(1-M:0));
                RCB(:,K*M+(1-M:0)) = ARB(:,K*M+(1-M:0));
                
                PEF = [eye(M) - ARF(:,K*M+(1-M:0))*ARB(:,K*M+(1-M:0))]*PEF;
                PEB = [eye(M) - ARB(:,K*M+(1-M:0))*ARF(:,K*M+(1-M:0))]*PEB;
                PE(:,K*M+(1:M)) = PEF;        
        end;
        
elseif Mode==2, 
        %%%%% multi-channel Levinsion algorithm 
        %%%%% using Nutall-Strand Method [2]
        %%%%% Covariance matrix is normalized by N=length(X)-p 
        C(:,1:M) = C(:,1:M)/N;
        F = Y;
        B = Y;
        PEF = C(:,1:M);
        PEB = C(:,1:M);
        for K=1:Pmax,
                [D,n]	= covm(F(K+1:N,:),B(1:N-K,:),'M');
                D = D./n;
		AS_FLAG.MVAR.histoN = AS_FLAG.MVAR.histoN + sparse(n+1,1,1,M2,1); %%%%%%% profiling: number of samples for estimates 

		ARF(:,K*M+(1-M:0)) = D / PEB;	
                ARB(:,K*M+(1-M:0)) = D'/ PEF;	
                
                tmp        = F(K+1:N,:) - B(1:N-K,:)*ARF(:,K*M+(1-M:0)).';
                B(1:N-K,:) = B(1:N-K,:) - F(K+1:N,:)*ARB(:,K*M+(1-M:0)).';
                F(K+1:N,:) = tmp;
                
                for L = 1:K-1,
                        tmp      = ARF(:,L*M+(1-M:0))   - ARF(:,K*M+(1-M:0))*ARB(:,(K-L)*M+(1-M:0));
                        ARB(:,(K-L)*M+(1-M:0)) = ARB(:,(K-L)*M+(1-M:0)) - ARB(:,K*M+(1-M:0))*ARF(:,L*M+(1-M:0));
                        ARF(:,L*M+(1-M:0))   = tmp;
                end;
                
                RCF(:,K*M+(1-M:0)) = ARF(:,K*M+(1-M:0));
                RCB(:,K*M+(1-M:0)) = ARB(:,K*M+(1-M:0));
                
                [PEF,n] = covm(F(K+1:N,:),F(K+1:N,:),'M');
                PEF = PEF./n;
		AS_FLAG.MVAR.histoN = AS_FLAG.MVAR.histoN + sparse(n+1,1,1,M2,1); %%%%%%% profiling: number of samples for estimates 

		[PEB,n] = covm(B(1:N-K,:),B(1:N-K,:),'M');
                PEB = PEB./n;
		AS_FLAG.MVAR.histoN = AS_FLAG.MVAR.histoN + sparse(n+1,1,1,M2,1); %%%%%%% profiling: number of samples for estimates 

                PE(:,K*M+(1:M)) = PEF;        
        end;
        
elseif Mode==5, %%%%% multi-channel Levinsion algorithm [2] using Nutall-Strand Method
        %%%%% multi-channel Levinsion algorithm 
        %%%%% using Nutall-Strand Method [2]
        %%%%% Covariance matrix is normalized by N=length(X) 
        
        %C{1} = C{1}/N;
        F = Y;
        B = Y;
        PEF = C(:,1:M);
        PEB = C(:,1:M);
        for K=1:Pmax,
                [D,n]  = covm(F(K+1:N,:),B(1:N-K,:),'M');
                %D=D/N;
		AS_FLAG.MVAR.histoN = AS_FLAG.MVAR.histoN + sparse(n+1,1,1,M2,1); %%%%%%% profiling: number of samples for estimates 

                ARF(:,K*M+(1-M:0)) = D / PEB;	
                ARB(:,K*M+(1-M:0)) = D'/ PEF;	
                
                tmp        = F(K+1:N,:) - B(1:N-K,:)*ARF(:,K*M+(1-M:0)).';
                B(1:N-K,:) = B(1:N-K,:) - F(K+1:N,:)*ARB(:,K*M+(1-M:0)).';
                F(K+1:N,:) = tmp;
                
                for L = 1:K-1,
                        tmp      = ARF(:,L*M+(1-M:0))   - ARF(:,K*M+(1-M:0))*ARB(:,(K-L)*M+(1-M:0));
                        ARB(:,(K-L)*M+(1-M:0)) = ARB(:,(K-L)*M+(1-M:0)) - ARB(:,K*M+(1-M:0))*ARF(:,L*M+(1-M:0));
                        ARF(:,L*M+(1-M:0))   = tmp;
                end;
                
                RCF(:,K*M+(1-M:0)) = ARF(:,K*M+(1-M:0));
                RCB(:,K*M+(1-M:0)) = ARB(:,K*M+(1-M:0));
                
                [PEB,n] = covm(B(1:N-K,:),B(1:N-K,:),'M');
                %PEB = D/N;

		AS_FLAG.MVAR.histoN = AS_FLAG.MVAR.histoN + sparse(n+1,1,1,M2,1); %%%%%%% profiling: number of samples for estimates 
                [PEF,n] = covm(F(K+1:N,:),F(K+1:N,:),'M');
                %PEF = D/N;
		AS_FLAG.MVAR.histoN = AS_FLAG.MVAR.histoN + sparse(n+1,1,1,M2,1); %%%%%%% profiling: number of samples for estimates 

                PE(:,K*M+(1:M)) = PEF;        
        end;
        
elseif Mode==3, %%%%% multi-channel Levinsion algorithm [2] using Vieira-Morf Method
        fprintf('Warning MDURLEV: It''s not recommended to use this mode\n')        
        C(:,1:M) = C(:,1:M)/N;
        F = Y;
        B = Y;
        PEF = C(:,1:M);
        PEB = C(:,1:M);
        for K=1:Pmax,
                [D, n]  = covm(F(K+1:N,:),B(1:N-K,:),'M');
                D = D./n;
		AS_FLAG.MVAR.histoN = AS_FLAG.MVAR.histoN + sparse(n+1,1,1,M2,1); %%%%%%% profiling: number of samples for estimates 

		ARF(:,K*M+(1-M:0)) = (PEF.^-.5)*D*(PEB.^-.5)';	
                ARB(:,K*M+(1-M:0)) = ARF(:,K*M+(1-M:0)); 
                
                tmp        = F(K+1:N,:) - B(1:N-K,:)*ARF(:,K*M+(1-M:0)).';
                B(1:N-K,:) = B(1:N-K,:) - F(K+1:N,:)*ARB(:,K*M+(1-M:0)).';
                F(K+1:N,:) = tmp;
                
                for L = 1:K-1,
                        tmp      = ARF(:,L*M+(1-M:0))   - ARF(:,K*M+(1-M:0))*ARB(:,(K-L)*M+(1-M:0));
                        ARB(:,(K-L)*M+(1-M:0)) = ARB(:,(K-L)*M+(1-M:0)) - ARB(:,K*M+(1-M:0))*ARF(:,L*M+(1-M:0));
                        ARF(:,L*M+(1-M:0))   = tmp;
                end;
                
                %RCF{K} = ARF{K};
                RCF = ARF(:,K*M+(1-M:0));
                
                [PEF,n] = covm(F(K+1:N,:),F(K+1:N,:),'M');
                PEF = PEF./n;
		AS_FLAG.MVAR.histoN = AS_FLAG.MVAR.histoN + sparse(n+1,1,1,M2,1); %%%%%%% profiling: number of samples for estimates 

		[PEB,n] = covm(B(1:N-K,:),B(1:N-K,:),'M');
                PEB = PEB./n;
		AS_FLAG.MVAR.histoN = AS_FLAG.MVAR.histoN + sparse(n+1,1,1,M2,1); %%%%%%% profiling: number of samples for estimates 

                %PE{K+1} = PEF;        
                PE(:,K*M+(1:M)) = PEF;        
        end;
        
elseif Mode==7 %%%%% multi-channel Levinsion algorithm [2] using Vieira-Morf Method
        fprintf('Warning MDURLEV: It''s not recommended to use this mode\n')        
        C(:,1:M) = C(:,1:M)/N;
        F = Y;
        B = Y;
        PEF = C(:,1:M);
        PEB = C(:,1:M);
        for K=1:Pmax,
                [D,n]  = covm(F(K+1:N,:),B(1:N-K,:),'M');
                D = D./n;
		AS_FLAG.MVAR.histoN = AS_FLAG.MVAR.histoN + sparse(n+1,1,1,M2,1); %%%%%%% profiling: number of samples for estimates 

		ARF(:,K*M+(1-M:0)) = (PEF.^-.5)*D*(PEB.^-.5);	
                ARB(:,K*M+(1-M:0)) = (PEF.^-.5)*D'*(PEB.^-.5);	
                
                tmp        = F(K+1:N,:) - B(1:N-K,:)*ARF(:,K*M+(1-M:0)).';
                B(1:N-K,:) = B(1:N-K,:) - F(K+1:N,:)*ARB(:,K*M+(1-M:0)).';
                F(K+1:N,:) = tmp;
                
                for L = 1:K-1,
                        tmp      = ARF(:,L*M+(1-M:0))   - ARF(:,K*M+(1-M:0))*ARB(:,(K-L)*M+(1-M:0));
                        ARB(:,(K-L)*M+(1-M:0)) = ARB(:,(K-L)*M+(1-M:0)) - ARB(:,K*M+(1-M:0))*ARF(:,L*M+(1-M:0));
                        ARF(:,L*M+(1-M:0))   = tmp;
                end;
                
                %RCF{K} = ARF{K};
                RCF = ARF(:,K*M+(1-M:0));
                
                [PEF,n] = covm(F(K+1:N,:),F(K+1:N,:),'M');
                PEF = PEF./n;
		AS_FLAG.MVAR.histoN = AS_FLAG.MVAR.histoN + sparse(n+1,1,1,M2,1); %%%%%%% profiling: number of samples for estimates 

                [PEB,n] = covm(B(1:N-K,:),B(1:N-K,:),'M');
                PEB = PEB./n;
		AS_FLAG.MVAR.histoN = AS_FLAG.MVAR.histoN + sparse(n+1,1,1,M2,1); %%%%%%% profiling: number of samples for estimates 

                %PE{K+1} = PEF;        
                PE(:,K*M+(1:M)) = PEF;        
        end;
        
elseif Mode==4,  %%%%% nach Kay, not fixed yet. 
        fprintf('Warning MDURLEV: It''s not recommended to use this mode\n')        
        
        C(:,1:M) = C(:,1:M)/N;
        K = 1;
        [C(:,M+(1:M)),n] = covm(Y(2:N,:),Y(1:N-1,:));
        C(:,M+(1:M)) = C(:,M+(1:M))/N;  % biased estimate
	AS_FLAG.MVAR.histoN = AS_FLAG.MVAR.histoN + sparse(n+1,1,1,M2,1); %%%%%%% profiling: number of samples for estimates 

        D = C(:,M+(1:M));
        ARF(:,1:M) = C(:,1:M)\D;
        ARB(:,1:M) = C(:,1:M)\D';
        RCF(:,1:M) = ARF(:,1:M);
        RCB(:,1:M) = ARB(:,1:M);
        PEF = C(:,1:M)*[eye(M) - ARB(:,1:M)*ARF(:,1:M)];
        PEB = C(:,1:M)*[eye(M) - ARF(:,1:M)*ARB(:,1:M)];
        
        for K=2:Pmax,
                [C(:,K*M+(1:M)),n] = covm(Y(K+1:N,:),Y(1:N-K,:),'M');
                C(:,K*M+(1:M)) = C(:,K*M+(1:M)) / N; % biased estimate
		AS_FLAG.MVAR.histoN = AS_FLAG.MVAR.histoN + sparse(n+1,1,1,M2,1); %%%%%%% profiling: number of samples for estimates 

                D = C(:,K*M+(1:M));
                for L = 1:K-1,
                        D = D - ARF(:,L*M+(1-M:0))*C(:,(K-L)*M+(1:M));
                end;
                ARF(:,K*M+(1-M:0)) = PEB \ D;	
                ARB(:,K*M+(1-M:0)) = PEF \ D';	
                for L = 1:K-1,
                        ARFtmp(:,L*M+(1-M:0))  = ARF(:,L*M+(1-M:0))  - ARB(:,(K-L)*M+(1-M:0)) *ARF(:,K*M+(1-M:0)) ;
                        ARB(:,L*M+(1-M:0))  = ARB(:,L*M+(1-M:0))  - ARF(:,(K-L)*M+(1-M:0)) *ARB(:,K*M+(1-M:0)) ;
                end;
                ARF(:,1:(K-1)*M) = ARFtmp;
                RCF(:,K*M+(1-M:0)) = ARF(:,K*M+(1-M:0)) ;
                RCB(:,K*M+(1-M:0)) = ARB(:,K*M+(1-M:0)) ;
                
                PEF = PEF*[eye(M) - ARB(:,K*M+(1-M:0)) *ARF(:,K*M+(1-M:0)) ];
                PEB = PEB*[eye(M) - ARF(:,K*M+(1-M:0)) *ARB(:,K*M+(1-M:0)) ];
                PE(:,K*M+(1:M))  = PEF;        
        end;
end;

if any(ARF(:)==inf),
% Test for matrix division bug. 
% This bug was observed in LNX86-ML53, but not in SGI-ML6.5, LNX86-ML6.5, Octave 2.1.35-40; Other platforms unknown.
FLAG_MATRIX_DIVISION_ERROR = ~all(all(isnan([0,0;0,0]/[0,0;0,0]))) | ~all(all(isnan([nan,nan;nan,nan]/[nan,nan;nan,nan])));

if FLAG_MATRIX_DIVISION_ERROR, 
	%fprintf(2,'### Warning MVAR: Bug in Matrix-Division 0/0 and NaN/NaN yields INF instead of NAN.  Workaround is applied.\n');
	warning('MVAR: bug in Matrix-Division 0/0 and NaN/NaN yields INF instead of NAN.  Workaround is applied.');

	%%%%% Workaround 
	ARF(ARF==inf)=NaN;
	RCF(RCF==inf)=NaN;
end;
end;	

%MAR   = zeros(M,M*Pmax);
DC     = zeros(M);
for K  = 1:Pmax,
%       VAR{K+1} = -ARF(:,K*M+(1-M:0))';
        DC  = DC + ARF(:,K*M+(1-M:0))'.^2; %DC meausure [3]
end;
