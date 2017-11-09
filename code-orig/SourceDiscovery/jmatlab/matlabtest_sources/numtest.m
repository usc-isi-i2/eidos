function [g,h] = numtest(a,b) 
% Doc example. Chapter 4.

% $Revision: 1.1 $

% Part 1 contains an assertion 
a=real(a); % Assert that "a" contains only real numbers. 
z = (0:0.2:1)';
besselj(1,z);
n = max(size(a)); 
g = zeros(1,n); 
g(1) = a(1) + 1234; 
h(1) = b(1) - 23.345; 
