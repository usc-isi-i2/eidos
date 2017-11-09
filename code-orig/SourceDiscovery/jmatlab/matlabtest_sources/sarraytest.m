function [g,h] = sarraytest(a,b) 
% Doc example. Chapter 4.

% $Revision: 1.1 $

% Part 1 contains an assertion 
g = a;
g(1,1) = {'testest'};
g(1,2) = {'testest2'};
h = b;
h(1,1) = {'asa'};
s={ones(3,1)};
h(2,2) = s;
