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

# 6.Inicio de sesión / registro / vinculación con Google

Se ha añadido un botón "Continuar con Google" en el Login y el Registro,y un apartado para vincular/desvincular la cuenta de Google desde el Perfil. Para que funcione, cread un archivo `.env` en `/frontend` (no se sube al repositorio) con estas dos variables,con los mismos Client ID que uséis en el backend:

```
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=TU_CLIENT_ID_WEB.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=TU_CLIENT_ID_ANDROID.apps.googleusercontent.com
```

IMPORTANTE: Google ya no permite personalizar el esquema de redirección dentro de Expo Go,así que para probar de verdad el inicio de sesión con Google en Android hace falta una "development build" (por ejemplo con `npx expo run:android` o `eas build --profile development`),en vez del Expo Go normal. El paquete de Android configurado en `app.json` (`com.gofight.app`) debe coincidir con el paquete registrado en el Client ID de Android en Google Cloud Console (junto con el SHA-1 del certificado con el que firméis la development build).

