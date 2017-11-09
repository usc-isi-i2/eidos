function ancaphval = analvalH(distn,vclimit,vcbspwr,vcnumspl);

% function ancaphval = analvalH(distn,vclimit,vcbspwr,vcnumspl)
%
% It evaluates the analytic derivatives of B-spline of power k = 1 or 2 (dPHI(y))
% (see equations (2.4) and (3.3) in Chen-Conley):
%            oo
% C(|tau|) = |  [(sin(y|tau|))/y|tau|]dPHI(y)      (2.4)
%            0
%
% PHI(y) = sum(b_j*B(y))                           (3.3)
%
% and returns the analytic value of the integral:
%
%  oo                        k-1
% |  [(sin(y|tau|))/y|tau|]*B   (y)dy,  for 0<=x<oo
% 0
%
% The arguments of the function are:
% distn = tau;
% vcbspwr = k = degree of the b-splines (B) that will make up the basis functions for the var-cov matrix;
% vclimit = upper bound of integration;
% vcnumspl = number of splines used to estimeate the C(d) function (see equations (2.4) and (3.3) in Chen-Conley).
%
% Code written by Francesca Molinari and Robert Vigfusson

 numknots = vcnumspl-(vcbspwr);
 lwbnd = 0;
 knotz = linspace(lwbnd,vclimit,numknots+1);
 gap = knotz(2)-knotz(1);
 allknotz = [(lwbnd-((vcbspwr):-1:1)*gap) knotz (vclimit+(1:(vcbspwr))*gap)];
 
 warning off
 
 if vcbspwr == 1;
    intval = (1/gap)*sivec(knotz'*distn)./(ones(numknots+1,1)*distn);
    inx=find(distn==0);
    if ~isempty(inx);
       intval(:,inx) =(1/gap)*knotz';
    end;
    intval  = cat(1,zeros(1,length(distn)),intval,intval(end,:),intval(end,:));
    
    for zx=1:vcnumspl;
       ancaphval(zx,:) = [-1 2 -1]*intval(zx:zx+2,:);
    end;
    
 elseif vcbspwr == 2;
    intval1 = -1*(1/(gap^2))*sivec(knotz'*distn)./(ones(numknots+1,1)*distn);
    intval2 = (1/(gap^2))*cos((knotz'*distn))./(ones(numknots+1,1)*distn.^2);
    
    inx=find(distn==0);
    
    if ~isempty(inx);
       intval1(:,inx) =-1*(1/(gap^2))*knotz';
       intval2(:,inx) =-1*(0.5/(gap^2))*(knotz.^2)';
    end;
    
    intval1  = cat(1,zeros(2,length(distn)),intval1,intval1(end,:),intval1(end,:),intval1(end,:));
    intval2  = cat(1,zeros(2,length(distn)),intval2,intval2(end,:),intval2(end,:),intval2(end,:));
    zx = 1;
    thrdprt = -1*allknotz(zx+3)*(-intval1(zx+3,:)+intval1(zx+2,:))+(-1*intval2(zx+3,:)+intval2(zx+2,:));
    ancaphval(zx,:) = thrdprt;
    
    zx = 2;
    scndprt=(allknotz(zx+1)+allknotz(zx+2))*(-intval1(zx+2,:)+intval1(zx+1,:)) -2*(-1*intval2(zx+2,:)+intval2(zx+1,:));
    thrdprt = -1*allknotz(zx+3)*(-intval1(zx+3,:)+intval1(zx+2,:))+(-1*intval2(zx+3,:)+intval2(zx+2,:));
    ancaphval(zx,:) = scndprt +thrdprt;
    
    for zx=3:vcnumspl;  
       
       frstprt=(-1*intval2(zx+1,:)+intval2(zx,:)) - allknotz(zx)*(-intval1(zx+1,:)+intval1(zx,:));
       scndprt=(allknotz(zx+1)+allknotz(zx+2))*(-intval1(zx+2,:)+intval1(zx+1,:)) -2*(-1*intval2(zx+2,:)+intval2(zx+1,:));
       thrdprt = -1*allknotz(zx+3)*(-intval1(zx+3,:)+intval1(zx+2,:))+(-1*intval2(zx+3,:)+intval2(zx+2,:));
       ancaphval(zx,:) = frstprt+scndprt+thrdprt;
    end;
    
 else
    disp(['You tried to use this procedure for a B-spline of power' num2str(vcbspwr)])
    error('ANALVALH Analytic Derivatives of B-spline written only for Powers of 1 and 2')
    
    
 end;
 
 warning on