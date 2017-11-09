function valuz = sivec(x);

% function valuz = sivec(x)
%
% To vectorize the sine integral function from the Nag toolbox.
% Sine integral = int[sin(x)/x]
%
% Code written by Francesca Molinari and Robert Vigfusson

if exist('s13adf')
   
   [n1,n2] = size(x);
   
   for zx = 1:n1;
      for zy = 1:n2;
         [valuz(zx,zy),ifail] = s13adf(x(zx,zy));
         if ifail == -1;
            warning on
            warning('Algorithm For Computing Sine Integral Failed')
            valuz(zx,zy) = NaN;
            warning off
         end;      
      end;
   end;
   
else;
   warning('NAG toolbox not found. Using other code')
   valuz = sineint(x);
end;

   
   
