function [coord,gof1,gof2]=mds2(D,k)

% function [coord,gof1,gof2]=mds2(D,k)
%
% This program will return the classical multidimensional scaling configuration (coord),
% and two measures of the goodness of fit (gof1 = quadratic; gof2 = absolute value),
% given as input a distance matrix D and the selection of the dimension of fit k, (see 
% Mardia K.V., Kent J.T., and Bibby J.M. [1979], "Multivariate Analysis", Academic Press).



[T,unused]=size(D);
iota=ones(T,1);

A=-.5*D.^2;

H=eye(T)-iota*iota'/T;

B=H*A*H;


[vectors,valmat]=eig(B);
values=diag(valmat);
[unused,order]=sort(-real(values));

svalues=values(order);
svectors=vectors(:,order);

coord=ones(T,k);

for jj=1:k,
	coord(:,jj)=sqrt(svalues(jj))*svectors(:,jj);
end

gof1=sum(svalues(1:k).^2)/sum(svalues.^2);
gof2=sum(abs(svalues(1:k)))/sum(abs(svalues));


