function [g,h] = inttest(a,b) ;
% Doc example. Chapter 4.

% $Revision: 1.1 $

% Part 1 contains an assertion 
n = max(size(a)); 
g = zeros(1,n); 
g(1) = a(1) + 10; 
h(1) = b(1) - 23; 
