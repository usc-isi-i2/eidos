
% This program generates the data and calls all the necessary subroutines to run a Monte Carlo 
% Simlulation of the estimation method for Spatial VAR Models as the one described in "A New 
% Semiparametric Spatial Model for Panel Time Series" by X. Chen and T. Conley.
%
% The default code is written for economic distance configurations that can be represented by a set of points
% (one for each agent at each time period) in R^3.
% If the available points are in R^k, with k~=3, you have three choices:
% 1) use the file mds2.m to transform it in an R^3 configuration (see Mardia K.V., Kent J.T., and
% Bibby J.M. [1979], "Multivariate Analysis", Academic Press);
% 2) adapt maingen.m for k~=3, k<oo;
% 3) adapt maininf.m for k=oo.
%
% The results of the experiment are saved in a file called results.mat. They can be elaborated by using
% elabresults.m and ristable.m; elabresults.m provides the following:
% point estimates, symmetric and non-symmetric confidence intervals (90% and 95%), and standard deviations for
% alpha, sigma^2, coefficients on the B-splines for the g-function, and coefficients on the B-splines for the
% C-function; plots of the estimated g-function and the estimated C-function against the true functions and the 
% confidence intervals; plots of the coverage probabilities and t-test for the g-function and for the C-function.
% ristable.m does the following:
% loads all the available results from the several repetitions of the experiment, and returns
% the true value, the percentiles in the Monte Carlo Distribution, the Bias, the Root MSE, and the 90% CI
% Coverage Probability of the following parameters: alpha, sigma^2, g-function evaluated at three points, and
% C-function evaluated at the same three points (approximately, the 10-th, 50-th, and 90-th percentiles of the
% distances' distribution).
%
% Code written by Francesca Molinari and Robert Vigfusson



disp('Monte Carlo Simulations')
disp('Fixed Distance Case')
disp('Each Simulation will take approximately 12 minutes on 500 Mhz Pentium.')

% Step 1: Load the data and give all the control parameters

nvar = 20;
load loc;
demnz = size(loc,2); % the points are in R^k, demnz = k. By default, this program assumes k = 3.

dmat = zeros(nvar,nvar);

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
numsimz = 100; % Number of bootstrap draws.
pctg = [0.025 0.05]; % The confidence interval values. 
theoptz = [bspwr,numspl,method1,vclimit,vcbspwr,vcnumspl,splub];

totalsims = 50; % Number of simulations to do.  
nobs = 200; % Number of observations


% The following four lines contain the setup of the model, as in expressions (2.1), (2.2)
% and (2.3) of Chen-Conley

gd = max(.06-(.06/.35)*dmat,zeros(nvar));
ad = gd-diag(diag(gd))+(0.4)*eye(nvar);
capsigma = exp(-2*dmat)+eye(nvar);
cqd = chol(capsigma)';

% The following loop is necessary if the locations are fixed across time, to make the matrix of economic distances
% have the temporal dimension

odmat = dmat;
for t=1:nobs;
   dmat(:,:,t) = odmat;
end;

% The function 'Hvalue' requires the NAG toolbox. If you don't have it
% open analvalH.m, and replace sivec with sineint.


[caphval,bigx] = Hvalue(dmat,vcbspwr,vcnumspl,vclimit);


% Step 2: Run the simulations. First of Two Sets.

t0 = clock;

for nsim=1:totalsims ;
   disp(['Current Simulation ' num2str(nsim)]);
   
   % First: Create the variables as a function of distance. 
   
   x = simuladata(ad,cqd,nvar,nobs,dmat,nsim);
   
   % Second: Estimate the VAR-slope coefficients
   
   disp(['Estimation of the coefficients of the Spatial VAR Model in Simulation ' num2str(nsim)])
   
   [pv26,ad0,ures,spall] = espvar(x,dmat,method1,bspwr,numspl,splub);

   alfdiag(1:nvar,nsim) = pv26(1,1:end)'; % these are the alpha(i) the diagonal terms on A(d) 2.2
   
   alfv(1:numspl,nsim) = pv26(2:end,1); % these are the coefficients for the b-splines to construct g(d)
   
   
   % Step 3: Estimate the variance covariance matrix of the residuals.
   
   % The function 'Hvalue' requires the NAG toolbox. If you don't have it
   % open analvalH.m, and replace sivec with sineint.
   
   % To make sure that the variance covariance matrix is positive definite
   % requires the optimzation 2 toolbox, to use the function fmincon. If only have optimization
   % toolbox ver 1 need to change to constr.
   
   disp(['Estimation of the variance covariance matrix of the residuals of the Spatial VAR Model in Simulation ' num2str(nsim)])
   
   [betacoef,sigmasq,bigsigma] = espvarcov(ures(:,2:end),caphval,bigx(nvar^2+1:end,2:vcnumspl));
   
   
   
   betas(1:vcnumspl,nsim) = cumsum([0; betacoef]);
   diagz(1:nvar,nsim) = sigmasq;
   
   %now take the cholesky of the variance covariance matrix. 
   for zx=1:size(bigsigma,3);
      chbsin(:,:,zx) = chol(bigsigma(:,:,zx));
   end;
   disp('Bootstrap of the Confidence Intervals')
   
   [rezalfz(:,:,nsim),rezgfun(:,:,nsim),rezcfun(:,:,nsim),rezbetz(:,:,nsim),rezdiag(:,:,nsim),rezaval(:,:,nsim)]...
      = bootstrap(ad0,ures(:,2:end),spall,betacoef,bigx(nvar^2+1:end,2:vcnumspl),chbsin,x(:,1),theoptz,sigmasq,...
      pv26(1,1:end)',pv26(2:end,1),numsimz,pctg);
   
   
end;


save(['results1.mat'],'betas','diagz','rezalfz','rezgfun','rezcfun','rezbetz',...
   'rezdiag','alfdiag','alfv','rezaval')
diary(['results1.txt'])
diary on
disp(t0(3:5));
t1 = clock;
disp(t1(3:5)); 
etime(t1,t0)
diary off


t0 = clock;

for nsim=1:totalsims ;
   disp(['Current Simulation ' num2str(nsim)]);
   
   % First: Create the variables as a function of distance. 
   
   x = simuladata(ad,cqd,nvar,nobs,dmat,nsim);
   
   % Second: Estimate the VAR-slope coefficients
   
   disp(['Estimation of the coefficients of the Spatial VAR Model in Simulation ' num2str(nsim)])
   
   [pv26,ad0,ures,spall] = espvar(x,dmat,method1,bspwr,numspl,splub);
   
   alfdiag(1:nvar,nsim) = pv26(1,1:end)'; % these are the alpha(i) the diagonal terms on A(d) 2.2
   
   alfv(1:numspl,nsim) = pv26(2:end,1); % these are the coefficients for the b-splines to construct g(d)
   
   
   % Step 3: Estimate the variance covariance matrix of the residuals.
   
   % The function 'Hvalue' requires the NAG toolbox. If you don't have it
   % open analvalH.m, and replace sivec with sineint.
   
   % To make sure that the variance covariance matrix is positive definite
   % requires the optimzation 2 toolbox, to use the function fmincon. If only have optimization
   % toolbox ver 1 need to change to constr.
   
   disp(['Estimation of the variance covariance matrix of the residuals of the Spatial VAR Model in Simulation ' num2str(nsim)])
   
   [betacoef,sigmasq,bigsigma] = espvarcov(ures(:,2:end),caphval,bigx(nvar^2+1:end,2:vcnumspl));
   
   
   
   betas(1:vcnumspl,nsim) = cumsum([0; betacoef]);
   diagz(1:nvar,nsim) = sigmasq;
   
   %now take the cholesky of the variance covariance matrix. 
   for zx=1:size(bigsigma,3);
      chbsin(:,:,zx) = chol(bigsigma(:,:,zx));
   end;
   disp('Bootstrap of the Confidence Intervals')
   
   [rezalfz(:,:,nsim),rezgfun(:,:,nsim),rezcfun(:,:,nsim),rezbetz(:,:,nsim),rezdiag(:,:,nsim),rezaval(:,:,nsim)]...
      = bootstrap(ad0,ures(:,2:end),spall,betacoef,bigx(nvar^2+1:end,2:vcnumspl),chbsin,x(:,1),theoptz,sigmasq,...
      pv26(1,1:end)',pv26(2:end,1),numsimz,pctg);
   
   
end;



save(['results2.mat'],'betas','diagz','rezalfz','rezgfun','rezcfun','rezbetz',...
   'rezdiag','alfdiag','alfv','rezaval')
diary(['results.txt'])
diary on
disp(t0(3:5));
t1 = clock;
disp(t1(3:5)); 
etime(t1,t0)
diary off

