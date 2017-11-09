function [D]=dif(d,n);
%D: Matriz de diferenciacion de orden d y dimension nxn
%
% Generacion de la matriz de diferenciacion D: nxn
% dependiendo del orden de diferenciacion d
%       Niveles:             d=0  ---> D=I
%       Primeras diferencias d=1  ---> D=D
%       Segundas diferencias d=2  ---> D=D*D

switch d
case 0 % Niveles 
   D=eye(n);
case 1 % Primeras diferencias
   % Generacion de la matriz de diferenciacion D: nxn
   %       1. Inicializacion: D=0
   %       2. Inclusion del vector [-1 1]
   %		  3. Adicion del vector [1 0 .. 0] 
   %          Esto implica la cond. inicial z(0)=0
   D(1:n-1,1:n)=zeros(n-1,n);
   for i=1:n-1
      D(i,i)   = -1.00;
      D(i,i+1) =  1.00;
   end;
   e=zeros(1,n);
   e(1,1)=1;
   D=[e
      D ];
      clear e;
   case 2 % Segundas diferencias
   % Generacion de la matriz de diferenciacion D: nxn
   %       1. Inicializacion: D=0
   %       2. Inclusion del vector [1 -2 1]
   %		  3. Adicion del vector [1 0 .. 0] dos veces 
   %          Esto implica la cond. inicial z(0)=z(-1)=0
   D(1:n-2,1:n)=zeros(n-2,n);
   for i=1:n-2
      D(i,i)   =  1.00;
      D(i,i+1) = -2.00;
      D(i,i+2) =  1.00;
   end;
   e=zeros(2,n);
   e(1,1)=1;
   e(2,2)=1;
   D=[e
      D ];
      clear e;
   otherwise 
      error (' *** GRADO DE DIFERENCIACION INCORRECTO *** ');
   end

