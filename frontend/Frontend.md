# GUIA DE CLONACIÓN E INSTALACIÓN DE LAS DEPENDENCIAS DE EXPO GO

--Ya que sois colaboradores de proyecto de mi repositorio,podeis aceptar la invitación que os he mandado por gmail,clonais mi repositorio y creais una nueva rama para trabajar,con esta ramma podeis cambiar cosas de proyecto y subir directamente al repositorio los cambios

# Una cosa antes de arrancar:

requisitos:
--Tener el backend con todas las dependencias instaladas
--Tener expo go(versión 54),para poder scanear el QR

# 1.Clonar el repositorio

git clone https://github.com/Ayoubito04/GoFight.git

# 2.Crear vuestra rama

git checkout -b "nombre de la rama"

# 3.Instalar las dependencias

cd /frontend
npm install

# 4.Configurad el sistema de servicios

id a la carpeta /services del frontend y cambiad vuestra BASE_URL,que tendrá que estar basada en vustra dirección ip,por ejemplo const BASE_URL='http://TU_DIRECCIÓN_IP:3000/api';

# 5.Arrancad el frontend

cd frontend
npx expo start --tunnel
