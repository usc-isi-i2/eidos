
% This program elaborates the results from a Spatial VAR estimation; the code has been written for Monte Carlo 
% simulations. It loads all the available results from the several repetitions of the experiment, and returns
% the true value, the percentiles in the Monte Carlo Distribution, the Bias, the Root MSE, and the 90% CI
% Coverage Probability of the following parameters: alpha, sigma^2, g-function evaluated at three points, and
% C-function evaluated at the same three points (approximately, the 10-th, 50-th, and 90-th percentiles of the
% distances' distribution).
%
% Code written by Francesca Molinari and Robert Vigfusson


zy = 1;
load(['results1'])

strz = char('alfdiag','rezaval','betas', 'rezalfz', 'rezcfun', 'rezgfun', 'alfv',  'diagz', 'rezbetz', 'rezdiag');
for zx=1:size(strz,1);
   eval(['all_' strz(zx,:) ' = ' strz(zx,:) ';']);
end;

zy = 1;
load(['results2'])

strz = char('alfdiag','rezaval','betas', 'rezalfz', 'rezcfun', 'rezgfun', 'alfv',  'diagz', 'rezbetz', 'rezdiag');
for zx=1:size(strz,1);
   	eval(['all_' strz(zx,:) ' = ' 'cat(ndims(all_' strz(zx,:) '),all_' strz(zx,:) ',' strz(zx,:),');']);   
end;

nobs = 200; %number of observations
demnz = 3; % dimension of the space the industries inhabit. 
nvar = 20; %number of variables 'industries'

% ALPHA

alpha = mean(mean(all_alfdiag,2));
salpha = sort(all_alfdiag(:));
totlz = length(all_alfdiag(:));
dpralpha10 = salpha(round(0.10*totlz));
dpralpha30 = salpha(round(0.30*totlz));
dpralpha50 = salpha(round(0.50*totlz));
dpralpha70 = salpha(round(0.70*totlz));
dpralpha90 = salpha(round(0.90*totlz));
decilesalpha = [dpralpha10 dpralpha30 dpralpha50 dpralpha70 dpralpha90];

biasalpha = abs(alpha-0.4);

msealpha = sqrt((sum((all_alfdiag(:)-0.4*ones(totlz,1)).^2))/totlz);

upbnd1 = 2*all_alfdiag-squeeze(all_rezalfz(:,2,:));
lwbnd1 = 2*all_alfdiag-squeeze(all_rezalfz(:,4,:));
rejectalpha90 = mean(mean((lwbnd1<0.4).*(upbnd1>0.4),2));

alphatable = [0.4 decilesalpha biasalpha msealpha rejectalpha90];

% SIGMA^2
clear totlz;
sigmasq = mean(mean(all_diagz,2));
ssigmasq = sort(all_diagz(:));
totlz = length(all_diagz(:));
dprsigmasq10 = ssigmasq(round(0.10*totlz));
dprsigmasq30 = ssigmasq(round(0.30*totlz));
dprsigmasq50 = ssigmasq(round(0.50*totlz));
dprsigmasq70 = ssigmasq(round(0.70*totlz));
dprsigmasq90 = ssigmasq(round(0.90*totlz));
decilessigmasq = [dprsigmasq10 dprsigmasq30 dprsigmasq50 dprsigmasq70 dprsigmasq90];

biassigmasq = abs(sigmasq-1);

msesigmasq = sqrt(sum((all_diagz(:)-ones(totlz,1)).^2))/totlz;

upbnd1 = 2*all_diagz-squeeze(all_rezdiag(:,2,:));
lwbnd1 = 2*all_diagz-squeeze(all_rezdiag(:,4,:));
rejectsigmasq90 = mean(mean((lwbnd1<1).*(upbnd1>1),2));

sigmasqtable = [1 decilessigmasq biassigmasq msesigmasq rejectsigmasq90];

% Now we need dmat and all the parameters

demnz = 3; 
load loc; 

for zx=1:nvar;
   for zy=zx+1:nvar;
      dmat(zx,zy) = sqrt(sum((loc(zx,:)-loc(zy,:)).^2));
      dmat(zy,zx) = dmat(zx,zy);
   end;
end;

usedmat = dmat;
splub = max(usedmat(:));

bspwr = 2; % Degree of the b-splines that will make up the basis functions. 
numspl = 6; % Number of splines. 
method1= 0  %Determines whether individual alphas are estimated for each variable

vcbspwr = 2; % Degree of the b-splines that will make up the basis functions for the var-cov matrix. 
vcnumspl = 8; % Number of splines. 
vclimit =  60; % Upper bound of integration 
numsimz = 100; %Number of bootstrap draws.
pctg = [0.025 0.05]; % the confidence interval values. 
theoptz = [bspwr,numspl,method1,vclimit,vcbspwr,vcnumspl,splub];



% G_FUNCTION

clear totlz;

geval = [0.1214 0.2670 0.4855];
splinspace = bspval(geval,0,splub,bspwr,numspl-bspwr);
allgz = all_alfv'*splinspace;
gs = mean(allgz);
gtrue = max(.06-(.06/.35)*geval,zeros(1,3));

sgs1 = sort(allgz(:,1));
totlz = length(allgz);
dprsgs110 = sgs1(round(0.10*totlz));
dprsgs130 = sgs1(round(0.30*totlz));
dprsgs150 = sgs1(round(0.50*totlz));
dprsgs170 = sgs1(round(0.70*totlz));
dprsgs190 = sgs1(round(0.90*totlz));
decilessgs1 = [dprsgs110 dprsgs130 dprsgs150 dprsgs170 dprsgs190];

biassgs1 = abs(gs(1)-gtrue(1));

msesgs1 = sqrt(sum((allgz(:,1)-gtrue(1)*ones(totlz,1)).^2))/totlz;

upciforg1 = 2*allgz(:,1) - squeeze(all_rezgfun(6,1,:));
lwciforg1 = 2*allgz(:,1) - squeeze(all_rezgfun(6,3,:));
rejectsgs190 = mean(mean((lwciforg1<gtrue(1)).*(upciforg1>gtrue(1)),2));

sgs1table = [gtrue(1) decilessgs1 biassgs1 msesgs1 rejectsgs190];


sgs2 = sort(allgz(:,2));
dprsgs210 = sgs2(round(0.10*totlz));
dprsgs230 = sgs2(round(0.30*totlz));
dprsgs250 = sgs2(round(0.50*totlz));
dprsgs270 = sgs2(round(0.70*totlz));
dprsgs290 = sgs2(round(0.90*totlz));
decilessgs2 = [dprsgs210 dprsgs230 dprsgs250 dprsgs270 dprsgs290];

biassgs2 = abs(gs(2)-gtrue(2));

msesgs2 = sqrt(sum((allgz(:,2)-gtrue(2)*ones(totlz,1)).^2))/totlz;

upciforg2 = 2*allgz(:,2) - squeeze(all_rezgfun(12,1,:));
lwciforg2 = 2*allgz(:,2) - squeeze(all_rezgfun(12,3,:));
rejectsgs290 = mean(mean((lwciforg2<gtrue(2)).*(upciforg2>gtrue(2)),2));

sgs2table = [gtrue(2) decilessgs2 biassgs2 msesgs2 rejectsgs290];

sgs3 = sort(allgz(:,3));
dprsgs310 = sgs3(round(0.10*totlz));
dprsgs330 = sgs3(round(0.30*totlz));
dprsgs350 = sgs3(round(0.50*totlz));
dprsgs370 = sgs3(round(0.70*totlz));
dprsgs390 = sgs3(round(0.90*totlz));
decilessgs3 = [dprsgs310 dprsgs330 dprsgs350 dprsgs370 dprsgs390];

biassgs3 = abs(gs(3)-gtrue(3));

msesgs3 = sqrt(sum((allgz(:,3)-gtrue(3)*ones(totlz,1)).^2))/totlz;

upciforg3 = 2*allgz(:,3) - squeeze(all_rezgfun(21,1,:));
lwciforg3 = 2*allgz(:,3) - squeeze(all_rezgfun(21,3,:));
rejectsgs390 = mean(mean((lwciforg3<gtrue(3)).*(upciforg3>gtrue(3)),2));

sgs3table = [gtrue(3) decilessgs3 biassgs3 msesgs3 rejectsgs390];


% C_FUNCTION

clear totlz;

ceval = [0.1214 0.2670 0.4855];
hvallinspace = analvalz3(ceval,vclimit,vcbspwr,vcnumspl);
allcz = all_betas'*hvallinspace;
cs = mean(allcz);
ctrue = exp(-2*ceval);

scs1 = sort(allcz(:,1));
totlz = length(allcz);
dprscs110 = scs1(round(0.10*totlz));
dprscs130 = scs1(round(0.30*totlz));
dprscs150 = scs1(round(0.50*totlz));
dprscs170 = scs1(round(0.70*totlz));
dprscs190 = scs1(round(0.90*totlz));
decilesscs1 = [dprscs110 dprscs130 dprscs150 dprscs170 dprscs190];

biasscs1 = abs(cs(1)-ctrue(1));

msescs1 = sqrt(sum((allcz(:,1)-ctrue(1)*ones(totlz,1)).^2))/totlz;

upciforc1 = 2*allcz(:,1) - squeeze(all_rezcfun(6,1,:));
lwciforc1 = 2*allcz(:,1) - squeeze(all_rezcfun(6,3,:));
rejectscs190 = mean(mean((lwciforc1<ctrue(1)).*(upciforc1>ctrue(1)),2));

scs1table = [ctrue(1) decilesscs1 biasscs1 msescs1 rejectscs190];

scs2 = sort(allcz(:,2));
dprscs210 = scs2(round(0.10*totlz));
dprscs230 = scs2(round(0.30*totlz));
dprscs250 = scs2(round(0.50*totlz));
dprscs270 = scs2(round(0.70*totlz));
dprscs290 = scs2(round(0.90*totlz));
decilesscs2 = [dprscs210 dprscs230 dprscs250 dprscs270 dprscs290];

biasscs2 = abs(cs(2)-ctrue(2));

msescs2 = sqrt(sum((allcz(:,2)-ctrue(2)*ones(totlz,1)).^2))/totlz;

upciforc2 = 2*allcz(:,2) - squeeze(all_rezcfun(12,1,:));
lwciforc2 = 2*allcz(:,2) - squeeze(all_rezcfun(12,3,:));
rejectscs290 = mean(mean((lwciforc2<ctrue(2)).*(upciforc2>ctrue(2)),2));

scs2table = [ctrue(2) decilesscs2 biasscs2 msescs2 rejectscs290];

scs3 = sort(allcz(:,3));
dprscs310 = scs3(round(0.10*totlz));
dprscs330 = scs3(round(0.30*totlz));
dprscs350 = scs3(round(0.50*totlz));
dprscs370 = scs3(round(0.70*totlz));
dprscs390 = scs3(round(0.90*totlz));
decilesscs3 = [dprscs310 dprscs330 dprscs350 dprscs370 dprscs390];

biasscs3 = abs(cs(3)-ctrue(3));

msescs3 = sqrt(sum((allcz(:,3)-ctrue(3)*ones(totlz,1)).^2))/totlz;

upciforc3 = 2*allcz(:,3) - squeeze(all_rezcfun(21,1,:));
lwciforc3 = 2*allcz(:,3) - squeeze(all_rezcfun(21,3,:));
rejectscs390 = mean(mean((lwciforc3<ctrue(3)).*(upciforc3>ctrue(3)),2));

decilesc = [decilesscs1; decilesscs2; decilesscs3]
biasc = [biasscs1 biasscs2 biasscs3];
msec = [msescs1 msescs2 msescs3];
rejectc90 = [rejectscs190 rejectscs290 rejectscs390];

scs3table = [ctrue(3) decilesscs3 biasscs3 msescs3 rejectscs390];

table = [alphatable;sigmasqtable;sgs1table;sgs2table;sgs3table;scs1table;scs2table;scs3table]
