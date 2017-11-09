
% This program elaborates the results from a Spatial VAR estimation; the code has been written for Monte Carlo 
% simulations. It loads all the available results from the several repetitions of the experiment, and returns:
% point estimates, symmetric and non-symmetric confidence intervals (90% and 95%), and standard deviations for
% alpha, sigma^2, coefficients on the B-splines for the g-function, and coefficients on the B-splines for the
% C-function.
%
% It then plots the estimated g-function and the estimated C-function against the true functions and the 
% confidence intervals, and it plots the coverage probabilities and t-test for the g-function and for the C-function.
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


clear finrez nwci


for zx=1:4;
nwci(:,zx) = mean(2*all_alfdiag-squeeze(all_rezalfz(:,zx,:)),2);
end;

nwci(:,[4 3 1 2]) = nwci;


zx = 5;
nwci(:,zx)= mean(all_alfdiag-squeeze(all_rezalfz(:,zx,:)),2);
zx = 6;
nwci(:,zx)= mean(all_alfdiag-squeeze(all_rezalfz(:,zx,:)),2);
zx = 5;
nwci(:,8)= mean(all_alfdiag+squeeze(all_rezalfz(:,zx,:)),2);
zx = 6;
nwci(:,7)= mean(all_alfdiag+squeeze(all_rezalfz(:,zx,:)),2);


finrez(1,:) = mean(([mean(all_alfdiag,2) nwci mean(all_rezalfz(:,7,:),3)]));

clear nwci

for zx=1:4;
nwci(:,zx) = mean(2*all_diagz-squeeze(all_rezdiag(:,zx,:)),2);
end;


nwci(:,[4 3 1 2]) = nwci;

zx = 5;
nwci(:,zx)= mean(all_diagz-squeeze(all_rezdiag(:,zx,:)),2);
zx = 6;
nwci(:,zx)= mean(all_diagz-squeeze(all_rezdiag(:,zx,:)),2);
zx = 5;
nwci(:,8)= mean(all_diagz+squeeze(all_rezdiag(:,zx,:)),2);
zx = 6;
nwci(:,7)= mean(all_diagz+squeeze(all_rezdiag(:,zx,:)),2);


finrez(2,:) = mean(([mean(all_diagz,2) nwci mean(all_rezdiag(:,7,:),3)]));

for zx=1:4;
alfv_nwci(:,zx) = mean(2*all_alfv-squeeze(all_rezaval(:,zx,:)),2);
end;

alfv_nwci(:,[4 3 1 2]) = alfv_nwci;


zx = 5;
alfv_nwci(:,zx)= mean(all_alfv-squeeze(all_rezaval(:,zx,:)),2);
zx = 6;
alfv_nwci(:,zx)= mean(all_alfv-squeeze(all_rezaval(:,zx,:)),2);
zx = 5;
alfv_nwci(:,8)= mean(all_alfv+squeeze(all_rezaval(:,zx,:)),2);
zx = 6;
alfv_nwci(:,7)= mean(all_alfv+squeeze(all_rezaval(:,zx,:)),2);

finrez(3:8,:) = (([mean(all_alfv,2) alfv_nwci mean(all_rezaval(:,7,:),3)]));

vcnumspl = 8; % Number of splines. 

for zx=1:4;
bet_nwci(:,zx) = mean(2*all_betas-squeeze(all_rezbetz(:,zx,:)),2);
end;

bet_nwci(:,[4 3 1 2]) = bet_nwci;


zx = 5;
bet_nwci(:,zx)= mean(all_betas-squeeze(all_rezbetz(:,zx,:)),2);
zx = 6;
bet_nwci(:,zx)= mean(all_betas-squeeze(all_rezbetz(:,zx,:)),2);
zx = 5;
bet_nwci(:,8)= mean(all_betas+squeeze(all_rezbetz(:,zx,:)),2);
zx = 6;
bet_nwci(:,7)= mean(all_betas+squeeze(all_rezbetz(:,zx,:)),2);

finrez(9:9+vcnumspl-1,:) = (([mean(all_betas,2) bet_nwci mean(all_rezbetz(:,7,:),3)]));


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

nvar = size(sigmasq,1);

colz3 = [];
for zy=1:size(finrez3,2);
   colz3 = [colz3 blanks(nvar+1)' blanks(nvar+1)' strjust(char(labelz3(zy,:),num2str(finrez3(:,zy))),'center')];
end

[colz3]


% Here are the pictures

load loc;
nobs = 200; %number of observations
demnz = 3; % dimension of the space the industries inhabit. 
nvar = 20; %number of variables 'industries'

dmat = zeros(nvar,nvar); % this is the matrix of euclidean distances between observations

for zx=1:nvar;
   for zy=zx+1:nvar;
      dmat(zx,zy) = sqrt(sum((loc(zx,:)-loc(zy,:)).^2));
      dmat(zy,zx) = dmat(zx,zy);
   end;
end;

odmat = dmat;
for t = 1:nobs;
   dmat(:,:,t) = odmat;
end;

usedmat = dmat;


figure
usedmat = nonzeros(usedmat(:));
[a,b]=hist(usedmat(:));

%close all
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
%print -depsc histdist

splub = max(usedmat(:));

bspwr = 2; % Degree of the b-splines that will make up the basis functions. 
numspl = 6; % Number of splines. 
method1= 0  % Determines whether individual alphas are estimated for each variable

vcbspwr = 2; % Degree of the b-splines that will make up the basis functions for the var-cov matrix. 
vcnumspl = 8; % Number of splines. 
vclimit =  60; % Upper bound of integration 
numsimz = 200; % Number of bootstrap draws.
pctg = [0.025 0.05]; % the confidence interval values. 
theoptz = [bspwr,numspl,method1,vclimit,vcbspwr,vcnumspl,splub];

dspaz = linspace(0,splub,30);

splinspace = bspval(dspaz,0,splub,bspwr,numspl-bspwr);
hvallinspace = analvalH(dspaz,vclimit,vcbspwr,vcnumspl);

allgz = all_alfv'*splinspace;
allcz = all_betas'*hvallinspace;

figure
plot(dspaz,exp(-2*dspaz),'k-')
hold on
plot(dspaz,mean(allcz),'ko-')
plot(dspaz,mean(2*allcz - squeeze(all_rezcfun(:,1,:))'),'k+-')
plot(dspaz,mean(2*allcz - squeeze(all_rezcfun(:,3,:))'),'k+-')
plot(dspaz,mean(allcz - squeeze(all_rezcfun(:,6,:))'),'kx-')
plot(dspaz,mean(allcz + squeeze(all_rezcfun(:,6,:))'),'kx-')
legend('True','Estimate')
text(0.5,-0.2,['Black +  95 % CI (Non-Symmetric)'],'Color','k')
text(0.5,-0.4,['Black x  95% CI (Symmetric)']) 
title('C-function 8 Splines')
% print -deps cfuncfixs5


upciforc = 2*allcz - squeeze(all_rezcfun(:,1,:))';
lwciforc = 2*allcz - squeeze(all_rezcfun(:,3,:))';
for zy=1:30;
   valforc(zy) = mean((lwciforc(:,zy)<exp(-2*dspaz(zy))).*(upciforc(:,zy)>exp(-2*dspaz(zy))));
end;


upciforg = 2*allgz - squeeze(all_rezgfun(:,1,:))';
lwciforg = 2*allgz - squeeze(all_rezgfun(:,3,:))';
gtrue = max(.06-(.06/.35)*dspaz,zeros(1,30));

for zy=1:30;
   valforg(zy) = mean((lwciforg(:,zy)<gtrue(zy)).*(upciforg(:,zy)>gtrue(zy)));
end;

upciforcsym = allcz + squeeze(all_rezcfun(:,6,:))';
lwciforcsym = allcz - squeeze(all_rezcfun(:,6,:))';
for zy=1:30;
   valforcsym(zy) = mean((lwciforcsym(:,zy)<exp(-2*dspaz(zy))).*(upciforcsym(:,zy)>exp(-2*dspaz(zy))));
end;

for zy=1:30;
   ttest = (allcz(:,zy)-exp(-2*dspaz(zy)))./squeeze(all_rezcfun(zy,7,:));
   valforcttest(zy) = mean((ttest>-1.96).*(ttest<1.96));
end;

figure
plot(dspaz,valforc,'k-',dspaz,valforcsym,'kx-',dspaz,valforcttest,'ko-')
legend('Nonsym CI','Sym CI','T-test')
title('C-function 8 Splines')
% print -depsc cicfuncfixs5

upciforgsym = allgz + squeeze(all_rezgfun(:,6,:))';
lwciforgsym = allgz - squeeze(all_rezgfun(:,6,:))';
gtrue = max(.06-(.06/.35)*dspaz,zeros(1,30));

for zy=1:30;
   valforgsym(zy) = mean((lwciforgsym(:,zy)<gtrue(zy)).*(upciforgsym(:,zy)>gtrue(zy)));
end;

for zy=1:30;
   gttest = (allgz(:,zy)-gtrue(zy))./squeeze(all_rezgfun(zy,7,:));
   valforgttest(zy) = mean((ttest>-1.96).*(ttest<1.96));
   
end;

figure
plot(dspaz,valforg,'k-',dspaz,valforgsym,'kx-',dspaz,valforgttest,'ko-')
legend('Nonsym CI','Sym CI','T-test')
title('G-function with 8 splines for the C-function')
%print -depsc cigfuncfixs5

figure
plot(dspaz,max(.06-(.06/.35)*dspaz,0),'k-')
hold on
plot(dspaz,mean(2*allgz - squeeze(all_rezgfun(:,1,:))'),'k+-')
plot(dspaz,mean(2*allgz - squeeze(all_rezgfun(:,3,:))'),'k+-')
plot(dspaz,mean(allgz),'ko-','linewidth',2)
plot(dspaz,mean(allgz - squeeze(all_rezgfun(:,6,:))'),'kx-')
plot(dspaz,mean(allgz + squeeze(all_rezgfun(:,6,:))'),'kx-')
legend('True','Estimate')
text(0.25,-0.02,['Black +  95 % CI (Non-Symmetric)'],'Color','k')
text(0.25,-0.03,['Black x  95% CI (Symmetric)']) 
axis([0.1 0.8 -0.01 0.1])
title('G-Function with 8 splines for the C-function')
%print -depsc gfuncfixs5



