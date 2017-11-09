function [loc]=simulaloc(nvar,demnz); 

% function [loc]=simulaloc(nvar,demnz)
%
% Returns a vector of locations generated at random from a uniform distribution.
%
% nvar = number of agents observed at each time;
% demnz = space in which the points are located (example R^3)

rand('state',5);
loc = 1/2*(2*rand(nvar,demnz)-1);
