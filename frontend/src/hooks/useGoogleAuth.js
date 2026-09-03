//Este hook centraliza toda la lógica de autenticación con Google (expo-auth-session),para poder reutilizarla tanto en el Login,el Registro,como en la vinculación de cuentas desde el Perfil
import { useEffect, useRef } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

//Esto es necesario para que la ventana/pestaña de autenticación se cierre automáticamente al terminar el proceso
WebBrowser.maybeCompleteAuthSession();

//Traemos los Client ID de Google desde las variables de entorno públicas de Expo (EXPO_PUBLIC_*)
const GOOGLE_CLIENT_ID_WEB = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
const GOOGLE_CLIENT_ID_ANDROID = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;

//El hook recibe una función "onIdToken",que se ejecuta automáticamente cuando el usuario ha iniciado sesión correctamente con Google,con el idToken que hay que mandar al backend
const useGoogleAuth = (onIdToken) => {
    const callbackRef = useRef(onIdToken);
    callbackRef.current = onIdToken;

    //useIdTokenAuthRequest se encarga de pedir directamente un idToken,tanto en web (flujo implícito) como en Android (código + PKCE,intercambiado automáticamente)
    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        webClientId: GOOGLE_CLIENT_ID_WEB,
        androidClientId: GOOGLE_CLIENT_ID_ANDROID,
    });

    useEffect(() => {
        if (response?.type === 'success') {
            //El idToken puede venir directamente en los parámetros de la respuesta,o dentro de "authentication",según la plataforma
            const idToken = response.params?.id_token || response.authentication?.idToken;
            if (idToken) {
                callbackRef.current?.(idToken, null);
            } else {
                callbackRef.current?.(null, new Error('No se ha podido obtener el token de Google'));
            }
        } else if (response?.type === 'error') {
            callbackRef.current?.(null, response.error);
        }
    }, [response]);

    return { request, response, promptAsync };
};

export default useGoogleAuth;
