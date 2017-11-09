function bcurr = bspval(xval,lwbnd,splub,bspwr,numknots);

% function bcurr =bspval(xval,lwbnd,splub,bspwr,numknots)
%
% Calculates B-splines of degree bspwr evaluated at point xval;
% xval has to be between lwbnd and splub for it to be sensible. 
% numknots = numspl-bspwr
%
% Code written by Francesca Molinari and Robert Vigfusson


if length(xval)>size(xval,2);
   xval = xval';
end;


knotz = linspace(lwbnd,splub,numknots+1);
gap = knotz(2)-knotz(1);
allknotz = [(lwbnd-(bspwr:-1:1)*gap) knotz (splub+(1:bspwr)*gap)];
   
n = numknots;
k = bspwr;

% we are interested in B_i, where i ranges between -k to n-1
% so that is n+k splines.

bprev=zeros(n+2*k,length(xval));
for zx = 1:n+2*k-1;
   bprev(zx,:) = and(xval>=allknotz(zx),xval<allknotz(zx+1));
end;
      
for curk=1:k;
   bcurr = zeros(n+2*k-curk,length(xval));
   for zx= 1:n+2*k-curk;
      bcurr(zx,:) = (1/(allknotz(zx+curk)-allknotz(zx)))*(xval-allknotz(zx)).*bprev(zx,:)+...
         (1/(allknotz(zx+curk+1)-allknotz(zx+1)))*(allknotz(zx+curk+1)-xval).*bprev(zx+1,:);
   end;
   bprev = bcurr;
end;


