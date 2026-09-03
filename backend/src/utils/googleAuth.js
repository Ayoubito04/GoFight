//Aquí vamos a definir la verificación de los tokens de Google,tanto para el login/registro como para la vinculación de cuentas
const { OAuth2Client } = require('google-auth-library');//Traemos la librería oficial de Google para verificar los tokens de identidad (ID Token)

//Guardamos los Client ID configurados en las variables de entorno,tanto el de la app web como el de Android
const GOOGLE_CLIENT_ID_WEB = process.env.GOOGLE_WEB_CLIENT_ID;
const GOOGLE_CLIENT_ID_ANDROID = process.env.GOOGLE_ANDROID_CLIENT_ID;

//El token puede venir firmado para cualquiera de estos dos Client ID,dependiendo de la plataforma desde la que el usuario inicie sesión
const audiencias = [GOOGLE_CLIENT_ID_WEB, GOOGLE_CLIENT_ID_ANDROID].filter(Boolean);

const client = new OAuth2Client();

//Esta función recibe el idToken que nos manda el cliente (frontend) y lo verifica contra los servidores de Google
const verificarTokenGoogle = async (idToken) => {
    if (!idToken) {
        throw new Error('No se ha proporcionado el token de Google');
    }
    if (audiencias.length === 0) {
        throw new Error('No se han configurado los Client ID de Google en el servidor (GOOGLE_WEB_CLIENT_ID / GOOGLE_ANDROID_CLIENT_ID)');
    }
    const ticket = await client.verifyIdToken({
        idToken,
        audience: audiencias,
    });
    const payload = ticket.getPayload();//Obtenemos los datos del usuario (sub,email,name,picture) que vienen dentro del token ya verificado
    if (!payload) {
        throw new Error('No se ha podido verificar el token de Google');
    }
    return payload;
};

module.exports = verificarTokenGoogle;
