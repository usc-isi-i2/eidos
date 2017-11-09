function [y] = fonzo(Y,x,z,ta,type,file_sal,output);
%FONZO: Desagreg. temporal con restric. transversales y longitudinales
%
%
%       Sintaxis: [y] = fonzo(Y,x,z,ta,type,file_sal,output)
%
%       Requiere como inputs:
%        M series anuales en formato columna Y: NxM
%        M indicadores trimestrales (x) en formato columna x: nxM
%                       1 serie trimestral de restric. transversal z: nx1
%
%       Debe señalarse el tipo de desagregacion (ta):
%        distribucion de un flujo   (ta = 1)
%        distribucion de un indice  (ta = 2)
%        interpolacion de un stock  (ta = 3)
%
%       Debe señalarse el modelo de las perturbaciones trimestrales (type):
%                       ruido blanco (type = 0)
%                       paseo aleatorio (type = 1) ---> Fernandez multivariante
%
%       file_sal: nombre del fichero de salida de resultados
%       Debe indicarse si se desea que la salida sea extensa o no
%             0: abreviada
%             1: extensa
%
%                 Hipotesis de la presente version:
%                   s = 4 ---> trimestralizacion de series anuales
%                        n = 4N ---> distribucion/interpolacion. No extrapolacion.
%                   n = nz ---> No se realiza extrapolacion de z.
%                        p = 2 ---> un indicador por agregado con constante
%
%       DIFONZO V.2.0 /12-Oct-2001/
%       Enrique M. Quilis

t0 = clock;

%--------------------------------------------------------
%       Parametros fijos en la version actual

s = 4;     % Numero de obs. por año
p = 2;     % Numero de regresores: uno por agregado + cte.

%--------------------------------------------------------
%       Chequeos preliminares

[N,M] = size(Y);
[n,m] = size(x);
[nz,mz] = size(z);

if ((M ~=  m) | (n ~=  s*N) | (n ~=  nz) | (mz ~=  1))
   error (' *** DIMENSIONES INCORRECTAS *** ');
else
   clear m nz mz;
end

%--------------------------------------------------------
%  **** MATRICES DE RESTRICCIONES (AGREGADORES) ***
%--------------------------------------------------------
% Se necesitan:
%                                               H1 ---> transversales
%                                               H2 ---> longitudinales
%
%---------------------------------------------------------------
%       Formar H1: n x nM

H1 = kron(ones(1,M),eye(n));

%---------------------------------------------------------------
%       Formar H2: NM x nM.
%
%       Tarea preliminar:
%       Generacion de la matriz de agregacion C = I(N) <kron> c

switch ta
case 1       % Distribucion de un flujo
   c = ones(1,s);
case 2       % Distribucion de un indice
   c = (1/s) * ones(1,s);
case 3       % Interpolacion de un stock
   c = zeros(1,s);
   c(s) = 1;
otherwise
   error (' *** TIPO DE DESAGREGACION INCORRECTO *** ');
end; % of switch ta

C = kron(eye(N),c);
H2 = kron(eye(M),C);

%---------------------------------------------------------------
%       Formar H: n+NM x nM.
%
%       H = [H1
%          H2 ]

H = [H1
   H2];

%--------------------------------------------------------
%  **** PREPARACION DE LAS MATRICES DE DATOS ***
%--------------------------------------------------------
% Se necesitan:
%               x_diag
%                                        Y_big, Y_e
%                                        X_diag, X_e

%--------------------------------------------------------
%       Formar x_diag: nM x pM
%
%       Es una matriz diagonal formada por los indicadores trim.
%  incluyendo un vector de unos para la cte.
%
%       x_diag = [x1 0  0  ... 0
%          0  x2 0  ... 0
%          0  0  x3 ... 0
%          ..............
%          0  0  0  ... xM ]
%
%       Se construye mediante una recursion.

x_diag = [ones(n,1) x(:,1)];   % Inicializacion de la recursion
j = 2;
while (j <=  M)
   xaux = x(:,j);
   xaux = [ones(n,1) xaux];
   x_diag = [x_diag            zeros((j-1)*n,2)
                  zeros(n,2*(j-1))    xaux];
   j = j+1;
end;
clear xaux;

%--------------------------------------------------------
%       Formar X_diag: NM x pM
%
%       Equivalente anual de x_diag. Es el rtdo de aplicar el
%  agregador temporal H2 a dicha matriz.

X_diag = H2 * x_diag;

%--------------------------------------------------------
%       Formar X_e: n+NM x pM
%
%       Es el resultado de aplicar todos los agregadores a x,
%       tanto transversales como longitudinales.
%       La parte inferior es X_diag.

X_e = H * x_diag;

%--------------------------------------------------------
%       Formar Y_big: NM x 1
%
%       Es un vector col. que recoge todas las series anuales
%  segun el esquema: Y_big = [Y1 Y2 ... YM]'
%  Formalmente: Y_big = vec(Y)
%
%       Se construye mediante una recursion.

Y_big = Y(:,1);   % Inicializacion de la recursion
j = 2;
while (j <=  M)
   Y_big = [Y_big
          Y(:,j) ];
   j = j+1;
end;

%--------------------------------------------------------
%       Formar Y_e: n+NM x 1
%
%       Es un vector col. que recoge la restric. transversal y
%       todas las series anuales
%  segun el esquema: Y_e = [ z Y1 Y2 ... YM]' = [z Y_big]'

Y_e = [ z
      Y_big];

%--------------------------------------------------------
%  **** ESTIMACION PRELIMINAR DE SIGMA ***
%--------------------------------------------------------

% La aplicacion del metodo de Di Fonzo requiere la determinacion
% previa de la matriz SIGMA de VCV de las innovaciones del modelo
% anual. Dicha determinacion se efectua estimando, ecuacion por
% ecuacion, las correspondientes regresiones de las series que
% verifican la restriccion temporal y haciendo SIGMA=VCV de los
% residuos asociados.
% Formalmente, equivale a estimar un SURE no acoplado. Este es el
% procedimiento que se sigue.

BETA = (X_diag' * X_diag) \ (X_diag' * Y_big); % Estimador MCO
U_big = Y_big - X_diag*BETA;                  % Residuos formato vec

% Residuos formato col. U: NxM

U(:,1) = U_big(1:N,1);
j=2;
while (j <= M)
   U = [ U  U_big( (j-1)*N+1 : j*N , 1)];
   j=j+1;
end

SIGMA=cov(U,1);      % Estimacion preliminar de SIGMA

%--------------------------------------------------------
%  **** APLICACION DEL PROCEDIMIENTO DE DI FONZO ***
%--------------------------------------------------------

%--------------------------------------------------------
%       Matriz VCV trimestal v: nM x nM

switch type
case 0 % Ruido blanco
   v = kron(SIGMA,eye(n));
case 1 % Paseo aleatorio con la condicion U(0)=0
   D = dif(1,n);
   DDi = inv(D'*D);
   v = kron(SIGMA,DDi);
end;

%--------------------------------------------------------
%       Matriz VCV anual V: n+NM x n+NM y su inversa generalizada

V = H * v * H';
Vi = pinv(V);      % Moore-Penrose

%--------------------------------------------------------
%       Formacion del filtro distribuidor L: nM x (n+NM)

L = v * H' * Vi;

%--------------------------------------------------------
%       Estimacion de beta mediante MCG en un contexto SURE

beta = (X_e' * Vi * X_e) \ (X_e' * Vi * Y_e);

U_e = Y_e - X_e * beta;

%--------------------------------------------------------
%       Estimacion de las series objetivo

y_big = x_diag * beta + L * U_e;

% Series y en formato col. y: nxM
y(:,1) = y_big(1:n,1);
j=2;
while (j <= M)
   y = [ y  y_big( (j-1)*n+1 : j*n , 1)];
   j=j+1;
end

%--------------------------------------------------------
%  **** PRESENTACION DE LOS RESULTADOS ***
%--------------------------------------------------------

switch output
case 0
   %    Salida reducida: solo las serie desagregadas y conciliadas
   fid=fopen(file_sal,'w');
   for i=1:n
      fprintf(fid,'%10.4f ',y(i,:) );
      fprintf(fid,'\n');
   end
   fclose(fid);
case 1
   %--------------------------------------------------------
   %       Matriz VCV de las estimaciones y: nxn
   sigma_y = (eye(n*M) - L*H)*v + ...
      (x_diag - L*X_e)*inv(X_e'*Vi*X_e)*(x_diag - L*X_e)';
   d_y_big = sqrt(diag(sigma_y));  % En formato vec
   % Series dt_y en formato col. dt_y: nxM
   d_y(:,1) = d_y_big(1:n,1);
   j=2;
   while (j <= M)
      d_y = [ d_y  d_y_big( (j-1)*n+1 : j*n , 1)];
      j=j+1;
   end
   k = 1.0000;                             % Coeficiente para los limites
   y_li = y - k*d_y;           % Lim. inf. de la estimacion trimestral
   y_ls = y + k*d_y;           % Lim. sup. de la estimacion trimestral
   %--------------------------------------------------------
   %    Salida extensa
   % -----------------------------------------------------------
   % Salida de los resultados en ficheros ASCII
   sep='-----------------------------------------------------------------';
   fid=fopen(file_sal,'w');
   fprintf(fid,'\n ');
   fprintf(fid,'**************************************\n ');
   fprintf(fid,' DESAGREGACION TEMPORAL MULTIVARIANTE \n ');
   fprintf(fid,' CON RESTRICCION TRANSVERSAL: DI FONZO\n ');
   fprintf(fid,'**************************************\n ');
   fprintf(fid,'\n ');
   fprintf(fid,' Programado por: Enrique M. Quilis\n ');
   fprintf(fid,'                 Instituto Nacional de Estadistica \n ');
   fprintf(fid,'\n ');
   fprintf(fid,'%s \n ', sep );
   fprintf(fid,'No. datos de baja frecuencia: %4d\n ',N );
   fprintf(fid,'Factor de conversion        : %4d\n ',s );
   fprintf(fid,'No. datos de alta frecuencia: %4d\n ',n );
   fprintf(fid,'No. series                  : %4d\n ',M );
   fprintf(fid,'%s \n ', sep );
   fprintf(fid,'Tipo de desagregacion: ');
   switch ta
   case 1
      fprintf(fid,'distribucion de un flujo. \n');
   case 2
      fprintf(fid,'distribucion de un indice. \n');
   case 3
      fprintf(fid,'interpolacion. \n');
   end; %of switch ta
   fprintf(fid,'%s \n ', sep );
   fprintf(fid,'Series de alta frecuencia (por columnas):\n ');
   fprintf(fid,'  * Puntual: y \n ');
   fprintf(fid,'%s \n ', sep );
   for i=1:n
      fprintf(fid,'%10.4f ',y(i,:) );
      fprintf(fid,'\n');
   end
   fprintf(fid,'%s \n ', sep );
   fprintf(fid,'Series de alta frecuencia (por columnas):\n ');
   fprintf(fid,'  * Desviacion tipica: d_y \n ');
   fprintf(fid,'%s \n ', sep );
   for i=1:n
      fprintf(fid,'%10.4f ',d_y(i,:) );
      fprintf(fid,'\n');
   end
   fclose(fid);
   %---------------------------------------------------------------
   %    Graficos
   t=1:n;
   plot(t,sum(y'),'ro',t,z);
   legend('Agregacion transversal','z: Restriccion transversal',0);
   e=100*((sum(y')')-z)./z;   % Grado de desajuste final
   figure;
   plot(e);
   title ('Grado de desajuste final (en %)');
   axis ([0 n -1 1]);
otherwise
   error (' ******* OPCION DE OUTPUT INCORRECTA ******* ');
end

etime(clock,t0)

