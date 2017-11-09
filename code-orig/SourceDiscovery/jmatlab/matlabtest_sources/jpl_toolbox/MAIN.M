
% This program loads the available data set and calls all the necessary subroutines to estimate
% the coefficients of a Spatial VAR Model and to bootstrap the confidence intervals as
% described in "A New Semiparametric Spatial Model for Panel Time Series" by X. Chen and T. Conley.
%
% The default code is written for economic distance configurations that can be represented by a set of points
% (one for each agent at each time period) in R^3.
% If the available points are in R^k, with k~=3, you have three choices:
% 1) use the file mds2.m to transform it in an R^3 configuration (see Mardia K.V., Kent J.T., and
% Bibby J.M. [1979], "Multivariate Analysis", Academic Press);
% 2) use maingen.m for k~=3, k<oo;
% 3) use maininf.m for k=oo.
%
% The results of the experiment (that can be saved in a file called results.mat) are elaborated as follows:
% given a data set of interest, we provide :
% point estimates, symmetric and non-symmetric confidence intervals (90% and 95%), and standard deviations for
% alpha, sigma^2, coefficients on the B-splines for the g-function, and coefficients on the B-splines for the
% C-function. Note that the program estimates alpha_j, sigma^2_j for each agent j; in elaborating the results
% it averages them across all j's, and returns point estimates and statistics for these averages.
% To see the values of each alpha_j and sigma^2_j, once the program finishes to run type at the MATLAB prompt:
%
% To elaborate the results of a Monte Carlo simulation as the one described in Chen-Conley's Section 5 you can use
% elabresults.m and ristable.m
% We then plot the estimated g-function and the estimated C-function against the confidence intervals.
% Code written by Francesca Molinari and Robert Vigfusson



disp('"A New Semiparametric Spatial Model for Panel Time Series" by X. Chen and T. Conley')

disp('Estimation of the coefficients of the Spatial VAR Model')

% Step 1: Load the data and give all the control parameters

load data; % data is the name of the file containing the data set of interest; unless you provide your own data,
% the program will use a generated data set which you downloaded with the code.


[nvar,nobs]=size(data);

load loc; % loc is the name of the file containing the locations of the observations; unless you provide your own
% locations, the program will use generated locations which you downloaded with the code.

demnz = size(loc,2); % the points are in R^k, demnz = k. By default, this program assumes k = 3.

% If you want to simulate the locations, you can use (or modify) the following command:
% loc = simulaloc(nvar,demnz);


dmat = zeros(nvar,nvar); % this is the matrix of euclidean distances between observations

for zx=1:nvar;
   for zy=zx+1:nvar;
      dmat(zx,zy) = sqrt(sum((loc(zx,:)-loc(zy,:)).^2));
      dmat(zy,zx) = dmat(zx,zy);
   end;
end;


% The following are all the control parameters.

bspwr = 2; % Degree of the b-splines that will make up the basis functions. Note that the convention used 
% in all the code-files is different from the one in Chen-Conley: a b-spline of order k in this code 
% corresponds to a b-spline of order k+1 in Chen-Conley

numspl = 6; % Number of splines used to estimeate the g(d) function (see equation (3.2) in Chen-Conley) 
method1= 0;  % Determines whether individual g(d)-functions are estimated for each variable
splub = max(dmat(:));

vcbspwr = 2; % Degree of the b-splines that will make up the basis functions for the var-cov matrix. 
vcnumspl = 8; % Number of splines used to estimeate the C(d) function (see equations (2.4) and (3.3) in Chen-Conley) 
vclimit =  60; % Upper bound of integration (see equation (2.4) in Chen-Conley)
numsimz = 200; % Number of bootstrap draws.
pctg = [0.025 0.05]; % The confidence interval values. 
theoptz = [bspwr,numspl,method1,vclimit,vcbspwr,vcnumspl,splub];

% The following loop is necessary if the locations are fixed across time, to make the matrix of economic distances
% have the temporal dimension

odmat = dmat;
for t = 1:nobs;
   dmat(:,:,t) = odmat;
end;

% The function 'Hvalue' requires the NAG toolbox. If you don't have it
% open analvalH.m, and replace sivec with sineint.


[caphval,bigx] = Hvalue(dmat,vcbspwr,vcnumspl,vclimit); 

% Step 2: Estimate the VAR-slope coefficients

[pv26,ad0,ures,spall] = espvar(data,dmat,method1,bspwr,numspl,splub);

alfdiag(1:nvar) = pv26(1,1:end)'; % these are the alpha(i) the diagonal terms on A(d) 2.2

alfv(1:numspl) = pv26(2:end,1); % these are the coefficients for the b-splines to construct g(d)


% Step 3: Estimate the variance covariance matrix of the residuals.

% To make sure that the variance covariance matrix is positive definite
% requires the optimzation 2 toolbox, to use the function fmincon. If only have optimization
% toolbox ver 1 need to change to constr.

disp('Estimation of the variance covariance matrix of the residuals of the Spatial VAR Model')

[betacoef,sigmasq,bigsigma] = espvarcov(ures(:,2:end),caphval,bigx(nvar^2+1:end,2:vcnumspl));

betas(1:vcnumspl) = cumsum([0; betacoef]);
diagz(1:nvar) = sigmasq;

% now take the cholesky of the variance covariance matrix

for zx=1:size(bigsigma,3);
   chbsin(:,:,zx) = chol(bigsigma(:,:,zx));
end;

disp('Bootstrap of the Confidence Intervals')

[rezalfz(:,:),rezgfun(:,:),rezcfun(:,:),rezbetz(:,:),rezdiag(:,:),rezaval(:,:)]=...
   bootstrap(ad0,ures(:,2:end),spall,betacoef,bigx(nvar^2+1:end,2:vcnumspl),chbsin,data(:,1),theoptz,sigmasq,...
   pv26(1,1:end)',pv26(2:end,1),numsimz,pctg);


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% The following lines are to save the results in a file called results.mat %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%save(['results.mat'],'betas','diagz','rezalfz','rezgfun','rezcfun','rezbetz',...
%   'rezdiag','alfdiag','alfv','rezaval')
%diary(['results.txt'])
%diary on
%disp(t0(3:5));
%t1 = clock;
%disp(t1(3:5)); 
%etime(t1,t0)
%diary off




%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% The following piece of code elaborates the results %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

clear alfv_nwci
clear bet_nwci
clear finrez
clear nwci

for zx=1:4;
   nwci(:,zx) = mean(2*alfdiag-rezalfz(:,zx)');
end;

nwci(:,[4 3 1 2]) = nwci;


zx = 5;
nwci(:,zx) = mean(alfdiag - rezalfz(:,zx)');
zx = 6;
nwci(:,zx) = mean(alfdiag - rezalfz(:,zx)');
zx = 5;
nwci(:,8) = mean(alfdiag + rezalfz(:,zx)');
zx = 6;
nwci(:,7) = mean(alfdiag + rezalfz(:,zx)');

finrez(1,:) = ([mean(alfdiag,2) nwci mean(rezalfz(:,7)')]);

clear nwci


for zx = 1:4;
   nwci(:,zx) = mean(2*diagz - rezdiag(:,zx)');
end;

nwci(:,[4 3 1 2]) = nwci;

zx = 5;
nwci(:,zx) = mean(diagz - rezdiag(:,zx)');
zx = 6;
nwci(:,zx) = mean(diagz - rezdiag(:,zx)');
zx = 5;
nwci(:,8) = mean(diagz + rezdiag(:,zx)');
zx = 6;
nwci(:,7) = mean(diagz + rezdiag(:,zx)');


finrez(2,:) = ([mean(diagz,2) nwci mean(rezdiag(:,7)')]);

for zx=1:4;
   alfv_nwci(:,zx) = (2*alfv - rezaval(:,zx)')';
end;

alfv_nwci(:,[4 3 1 2]) = alfv_nwci;


zx = 5;
alfv_nwci(:,zx) = (alfv - rezaval(:,zx)')';
zx = 6;
alfv_nwci(:,zx) = (alfv - rezaval(:,zx)')';
zx = 5;
alfv_nwci(:,8) = (alfv + rezaval(:,zx)')';
zx = 6;
alfv_nwci(:,7) = (alfv + rezaval(:,zx)')';

finrez(3:8,:) = (([alfv' alfv_nwci (rezaval(:,7))]));

vcnumspl = 8; % Number of splines. 

for zx=1:4;
   bet_nwci(:,zx) = (2*betas-rezbetz(:,zx)')';
end;

bet_nwci(:,[4 3 1 2]) = bet_nwci;


zx = 5;
bet_nwci(:,zx) = (betas - rezbetz(:,zx)')';
zx = 6;
bet_nwci(:,zx) = (betas - rezbetz(:,zx)')';
zx = 5;
bet_nwci(:,8) = (betas + rezbetz(:,zx)')';
zx = 6;
bet_nwci(:,7) = (betas + rezbetz(:,zx)')';

finrez(9:9+vcnumspl-1,:) = (([betas' bet_nwci (rezbetz(:,7))]));

% Here are the point estimates and the Confidence Intervals

disp('Here are the estimated parameters for alpha, sigma^2, and the g-function:')
disp('(Note that the values of alpha and sigma^2 reported here are averages across all agents)')

rows = char(' ','point_estimate','nonsym_LB_95','nonsym_LB_90','nonsym_UB_90','nonsym_UB_95',...
   'sym_LB_95','sym_LB_90','sym_UB_90','sym_UB_95','std_dev.');

labelz1 = char('alpha','sigma^2','a1','a2','a3','a4','a5','a6');

finrez1 = finrez(1:8,:)';

colz1 = [];
for zy=1:size(finrez1,2);
   colz1 = [colz1 blanks(11)' blanks(11)' strjust(char(labelz1(zy,:),num2str(finrez1(:,zy))),'center')];
end

[rows blanks(11)' colz1]

disp('Here are the estimated parameters for the C-function: ')

labelz2 = char('b1','b2','b3','b4','b5','b6','b7','b8');

finrez2 = finrez(9:end,:)';

colz2 = [];
for zy=1:size(finrez2,2);
   colz2 = [colz2 blanks(11)' blanks(11)' strjust(char(labelz2(zy,:),num2str(finrez2(:,zy))),'center')];
end

[rows blanks(11)' colz2]

disp('Here are the estimated alpha_j and sigma^2_j for each agent: ')

labelz3 = char('alpha_j','sigma^2_j');

finrez3 = [alfdiag' sigmasq];

colz3 = [];
for zy=1:size(finrez3,2);
   colz3 = [colz3 blanks(nvar+1)' blanks(nvar+1)' strjust(char(labelz3(zy,:),num2str(finrez3(:,zy))),'center')];
end

[colz3]



% Here are the pictures

usedmat = dmat;

figure
usedmat = nonzeros(usedmat(:));
[a,b]=hist(usedmat(:));
hold on
bar(b,a,1,'w')

sdmat = sort(usedmat(:));
totlz = length(usedmat(:));
dpr15 = sdmat(round(0.15*totlz));
dpr25 = sdmat(round(0.25*totlz));
dpr85 = sdmat(round(0.85*totlz));
dpr75 = sdmat(round(0.75*totlz));
vaxis = axis;
plot([dpr15 dpr15],vaxis(3:4),'k*-');
plot([dpr25 dpr25],vaxis(3:4),'k*-');
plot([dpr75 dpr75],vaxis(3:4),'k*-');
plot([dpr85 dpr85],vaxis(3:4),'k*-');
text(dpr85,vaxis(4),'85%','vertical','top');
text(dpr75,vaxis(4),'75%','vertical','top');
text(dpr25,vaxis(4),'25%','vertical','top');
text(dpr15,vaxis(4),'15%','vertical','top');
title('Histogram of Distances')
% print -depsc histdist

dspaz = linspace(0,splub,30);
splinspace = bspval(dspaz,0,splub,bspwr,numspl-bspwr);
hvallinspace = analvalH(dspaz,vclimit,vcbspwr,vcnumspl);

allgz = alfv*splinspace;
allcz = betas*hvallinspace;


figure
plot(dspaz,allcz,'ko-')
hold on
plot(dspaz,(2*allcz - rezcfun(:,1)'),'k+-')
plot(dspaz,(2*allcz - rezcfun(:,3)'),'k+-')
plot(dspaz,(allcz - rezcfun(:,6)'),'kx-')
plot(dspaz,(allcz + rezcfun(:,6)'),'kx-')
legend('Estimate','Non-Sym LB','Non-Sym UB','Sym LB','Sym UB')
title('C-function 8 Splines')
%print -deps cfuncfixs5


figure
plot(dspaz,allgz,'ko-','linewidth',2)
hold on
plot(dspaz,(2*allgz - rezgfun(:,1)'),'k+-')
plot(dspaz,(2*allgz - rezgfun(:,3)'),'k+-')
plot(dspaz,(allgz - rezgfun(:,6)'),'kx-')
plot(dspaz,(allgz + rezgfun(:,6)'),'kx-')
legend('Estimate','Non-Sym LB','Non-Sym UB','Sym LB','Sym UB')
%axis([0.1 0.8 -0.01 0.1])
title('G-Function with 8 splines for the C-function')
%print -depsc gfuncfixs5




