//Vamos a traer la base de datos para poder hacer las consultas desde el frontend
const BASE_URL='http://192.168.0.22:3000/api';
import AsyncStorage from "@react-native-async-storage/async-storage";

//Ahora vamos a crear cada una de las funciones para hacer las peticiones a la API,tendremos que hacer un fecth,para poder conectarse a la API
//Empezamos por el auth,que es la función de resgistro de usuarios
export const registerUser=async(name,email,password,perfil)=>{
     try{
         const response=await fetch(`${BASE_URL}/auth/registro`,{
             method:'POST',
             headers:{
                'Content-Type':'application/json'
                
                
             }
             ,
             body:JSON.stringify({name,email,password,perfil})//Pasamos los datos a json para poder enviarlos bien a la base de datos
         });//Acvcedemos a la ruta de registro como en el Insomnia,si también te fijas bien en los headers,se declara como un tipo de contendio,representando los datos que vamos a enviar
         //Una vez que ya tengamos el response,toca definir el metodo,que se va a emplear,que en este caso va a ser de tipo POST
         
         const data=await response.json();
   
         if(!response.ok){
            throw new Error(data.message || `Error al registrar el usuario ${error.message}`);//Si la respuesta no es ok,entonces lanzamos un error,con el mensaje que nos devuelve la API,si no hay mensaje,entonces mostramos un mensaje genérico de error

         }
         
         else{
            
            //Esto guardará el token de autenticación en el almacenamiento local del dispositivo
            alert('Usuario registrado exitosamente');
            //Nos dará una alerta de que el usuario se ha registrado correctamente,si todo
         }
     }catch(error){
        alert(`Error al registrar el usuario: ${error.message}`);
        console.error('Error al registrar el usuario',error);
        //Nos dará una alerta de error en caso de que no hayampos registrado el usuario correcto
        
     }
     
}
export const loginUser=async(email,password)=>{
     //EL login vamos a capturar el email y la contraseña del usuario,para poder hacer la consulta a la API y verificar si el usuario existe en la base de datos
     try{
         const response=await fetch(`${BASE_URL}/auth/login`,{
            //Hacemos la consulta a la API,para poder verificar el usuario
            method:'POST',
            headers:{
                  'Content-Type':'application/json'
            }
            ,
            body:JSON.stringify({email,password})//Pasamos los datos a json para poder enviarlos bien a la base de datos


         })
         const data=await response.json();
         //Lo pasamos a json para poder usarlo en el frontend
         if(!response.ok){
            throw new Error(data.message || `Error al iniciar sesión ${error.message}`);
            console.error('Error al iniciar sesión',error);
         }        
         else{
            await AsyncStorage.setItem('token',data.token);
            alert('Inicio de sesión exitoso');
            //Esta alerta nos avisara de que el usuario sha iniciado sesión correctamente,si todo ha ido bien

         }

   }catch(error){
         alert(`Error al iniciar sesión: ${error.message}`);
         console.error('Error al iniciar sesión',error);
         
   }
}
