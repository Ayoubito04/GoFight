//Vamos a traer la base de datos para poder hacer las consultas desde el frontend
const BASE_URL=process.env.EXPO_PUBLIC_SERVICES_URL;
import AsyncStorage from "@react-native-async-storage/async-storage";



//Ahora vamos a crear cada una de las funciones para hacer las peticiones a la API,tendremos que hacer un fecth,para poder conectarse a la API
//Empezamos por el auth,que es la función de resgistro de usuarios
//---------------AUTH----------------//
export const registerUser=async(name,email,password,perfil)=>{
     try{
         const response=await fetch(`${BASE_URL}/auth/registro`,{
             method:'POST',
             headers:{
                'Content-Type':'application/json'
                
                
             }
             ,
             body:JSON.stringify({name,email,password,perfil})//Pasamos los datos a json para poder enviarlos bien a la base de datos´
            
         });//Acvcedemos a la ruta de registro como en el Insomnia,si también te fijas bien en los headers,se declara como un tipo de contendio,representando los datos que vamos a enviar
         //Una vez que ya tengamos el response,toca definir el metodo,que se va a emplear,que en este caso va a ser de tipo POST
         
         const data=await response.json();
         //Una vez que lo hayamos pasado a json,loo guardamos en una variable,en una especia de localstorage,es AsyncStoragew
 
            
           //Esto no guarda el usuario,solo guarda eltoken con el cual se ha registrado

   
         if(!response.ok){
            throw new Error(data.message || `Error al registrar el usuario ${data.message}`);//Si la respuesta no es ok,entonces lanzamos un error,con el mensaje que nos devuelve la API,si no hay mensaje,entonces mostramos un mensaje genérico de error

         }
         
         else{
            
            //Esto guardará el token de autenticación en el almacenamiento local del dispositivo
               await AsyncStorage.setItem('token',data.token);
               console.log('Token guardado en AsyncStorage:',data.token);
            alert('Usuario registrado exitosamente');
            //Nos dará una alerta de que el usuario se ha registrado correctamente,si todo
         }
     }catch(error){
       throw error;
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
         throw error;
         
   }
   
}
export const getUserProfile=async()=>{
    //Con esta función obtenemos el perfil del usuario una vez que haya iniciado sesión
     try{
         const token=await AsyncStorage.getItem('token');
         //Obtenemos el token de autenticación del almacenamiento local,es decir el token del usuario logeado
         const response=await fetch(`${BASE_URL}/auth/ver_perfil_usuario`,{
             method:'GET',
             headers:{
               'Content-Type':'application/json',
                'Authorization':`Bearer ${token}`//Pasamos el token de autenticación en los headers,para poder acceder a las rutas protegidas de la API
                
             }
             
         })
         const text=await response.text();
         //Obtenemos la respuesta en forma de texto para verificar usuario
          console.log('Respuesta del servidor:',text);
         const data=JSON.parse(text);
         if(!response.ok){
             throw new Error(data.message || `Error al obtener el perfil del usuario ${error.message}`);
         }
         else{
             return data;
             //Si la respuesta es ok,entonces devolvemos los datos del perfil del usuario,que nos devuelve la API
         }
     }catch(error){
         alert(`Error al obtener el perfil del usuario: ${error.message}`);
         console.error('Error al obtener el perfil del usuario',error);
     }
}
//------------Gamificaciones----------------//

//Vamos a implemenatr las gamificaciones,que es una de las carcacteriisticas más importantes de la app
export const getGamificaciones=async()=>{
       try{
            const token=await AsyncStorage.getItem('token');
            //Recogemos el token del usuario logeado,para poder acceder a las gamificaciones
             const url= await fetch(`${BASE_URL}/gamificaciones`,{
                 //Vamos a hacer consultas a la API para obtener las gamificaciones,que es una de las carcaterisiticas
                  headers:{'Authorization':`Bearer ${token}`}
             });
             //Recogeremos todas las gamificaciones,ya sean rachas y puntos ranking
               const data= await url.json();//Lo pasamos a json para poder usarlo en el frontend
               if(!url.ok){
                     throw new Error(data.message || `Error al obtener las gamificaciones ${error.message}`);
               }
               
               
               return data;
            
               
       }catch(error){
            throw error;
       }
}
//----------Sesiones Historial---------//
export const getSesionesHistorial=async()=>{
     //Aquí vamos a obtenere todas las sesiones del usuario
     try{
        const token= await AsyncStorage.getItem('token');//Obtenemos el token del usuario loegado
     const url=await fetch(`${BASE_URL}/sesiones_historial/obtener_historial_de_sesiones`,{
        headers:{'Authorization':`Bearer ${token}`//Pasamos el token de autenticación en los headers,para poder acceder a las rutas protegidas de la API


}     });
       const text=await url.text();
       console.log('Respuesta del servidor al obtener el historial de sesiones:',text);
       const data=JSON.parse(text);
       if(url.status===404){
            return {historial:[]};
       }
       if(!url.ok){
            throw new Error(data.message || `Error al obtener el historial de sesiones ${error.message}`);
       }
         return data;
     }catch(error){
         throw error;
     }

}
//------------Rutinas-----------------//

//Vamos a a traer las rutinas,para que el usuario pueda ver las sesiones que tiene en el historial
export const getRutinas=async()=>{
      try{
            const token= await AsyncStorage.getItem('token');//Obtenemos el token del usuario loegado
             const url=await fetch(`${BASE_URL}/rutinas/ver_rutinas`,{
                headers:{'Authorization':`Bearer ${token}`//Pasamos el token de autenticación en los headers,para poder acceder a las rutas protegidas de la API
                  }
      });
       const text=await url.text();
       console.log('Respuesta del servidor al obtener las rutinas:',text);
       const data=JSON.parse(text);
       if(url.status===404){
            throw new Error(data.message || `No se han encontrado rutinas para este usuario ${error.message}`);
       }
       if(!url.ok){
            throw new Error(data.message || `Error al obtener las rutinas ${data.message}`);
       }
       if(data.rutinas && Array.isArray(data.rutinas)){
            data.rutinas=data.rutinas.map(rutina=>({
                ...rutina,
                dificultad:rutina.dificultad==='F_cil' ? 'Fácil' : rutina.dificultad // Asignamos un valor por defecto si dificultad es null
            }));
        }
         return data;
     }catch(error){
         throw error;
     }

}
//-------Vamos a obtener las sesiones del historial,para poder obtener el total de calorias quemadas---
//---Vamnos a intentar obtener el total de calorias quemadas,para mostrarlo en la barra de progreso
export const getTotalCaloriasQuemadas = async () => {
  const token = await AsyncStorage.getItem('token');
  try {
    const res = await fetch(`${BASE_URL}/sesiones_historial/obtener_historial_de_sesiones`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Error al obtener historial');
    }

    const hoy = new Date();
    const fechaHoy = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
    console.log('Fecha hoy:', fechaHoy);

    const caloriasHoy = data.historial
      ?.filter(s => {
        const fechaSesion = s.fecha_entreno.split('T')[0];
        console.log('Comparando:', fechaSesion, '===', fechaHoy);
        return fechaSesion === fechaHoy;
      })
      ?.reduce((total, s) => total + parseFloat(s.calorias || 0), 0) || 0;

    console.log('Calorías quemadas hoy:', caloriasHoy);
    return caloriasHoy;
  } catch (error) {
    throw error;
  }
};
 export const ActualizarGamificaciones=async(req,res)=>{
    const token=await AsyncStorage.getItem('token');
    try{
        const url=await fetch(`${BASE_URL}/gamificaciones`,{
            method:'PUT',
            headers:{'Authorization':`Bearer ${token}`//Pasamos el token de autenticación en los headers,para poder acceder a las rutas protegidas de la API
            }
        })
        const text=await url.text();
        console.log('Respuesta del servidor al obtener las gamificaciones para actualizar:',text);
        const data=JSON.parse(text);
        if(!url.ok){
             throw new Error(data.message || `Error al obtener las gamificaciones para actualizar ${error.message}`);
        }
        return data;


}catch(error){
    throw error;
}
}
export const getRutinasDisponibles=async()=>{
    //Vamos a imprimir p0or la pantalla diferentes rutinas disponibles,para que el usuario pueda elegir la rutina,estas rutinas vienen vinculadas con id,este id es del administrador
    try{
        const token=await AsyncStorage.getItem('token');
        //Obtenemos el token del usuario logeado para poder acceder a las rutinas disponibles
        const url=await fetch(`${BASE_URL}/rutinas/ver_rutinas`,{
            headers:{'Authorization':`Bearer ${token}`//Pasamos el token de autenticación en los headers,para poder acceder a las rutas protegidas de la API
            }
        });
        //Obtenemos las rutinas disponibles,que son las rutinas del administrador,para que el usuario pueda elegir la rutina que quiera hacer
        const text=await url.text();
      
         console.log('Respuesta del servidor al obtener las rutinas disponibles:',text);
         const data=JSON.parse(text);
         if(!url.ok){
                throw new Error(data.message || `Error al obtener las rutinas disponibles ${error.message}`);
            }
            if(data.rutinas && Array.isArray(data.rutinas)){
                data.rutinas=data.rutinas.map(rutina=>({
                    ...rutina,
                    dificultad:rutina.dificultad==='F_cil' ? 'Fácil' : rutina.dificultad // Asignamos un valor por defecto si dificultad es null

                }));
            }
            return data;
            //Esto nos retornará las rutinas disponibles,que son como bien hemos dicho rut9inas del adminstrador
            
    }catch(error){
        throw error;
    }
}
//----------Ejercicios-----------------//
//Vamos a traer los ejercicios de la rutina,cuando el usuario le de a una de las rutinas
export const getEjerciciosDeRutina=async(rutinaId)=>{
    //Vamos a usar un aparametro en esepcifico que es el id de la rutina,para poder obtener los ejercicios,que contiene esa rutina
    try{
        const token=await AsyncStorage.getItem('token');
        console.log(`Obteniendo ejercicios para la rutina con ID ${rutinaId} utilizando el token:`, token);
        //Obtenermos siempre el token del usuario
        const url=await fetch(`${BASE_URL}/rutinas/obtener_ejercicios/${rutinaId}`,{
            headers:{'Authorization':`Bearer ${token}`//Pasamos el token de autenticación en los headers,para poder acceder a las rutas protegidas de la API
            }
        });
        //Esto nos permitirá obtener los ejercicios de la rutina,para que el usuario pueda ver los ejercicios que contiene cadav una d3e la rutinas
        //Ahora los pasamos a Jason jejejej
         
        const text=await url.text();

        console.log(`Respuesta del servidor al obtener los ejercicios de la rutina ${rutinaId}:`,text);
        const data=JSON.parse(text);
        if(!url.ok){
            throw new Error(data.message || `Error al obtener los ejercicios de la rutina ${rutinaId} ${error.message}`);
        }
        return data.rutina.rutinas_ejercicios || [];
        //Nos va a delvolver toda la información de cada uno de los ejercicios y la rutina que hemos escogido
        
    }catch(error){
        throw error;
    }
}

export const registrarSesionHistorial=async(rutinaId)=>{
      //Para guardar cada una de las sesiones en el historial se va a tener en cuenta varias codsas,elo id de la rutina y las calorias que va a quemar el usuario en esa rutina
      try{
          const token=await AsyncStorage.getItem('token');
          //Obtenemos el token del usuariologeado para poder registrar la sesión en el historial
          const res=await fetch(`${BASE_URL}/sesiones_historial/registrar_historial`,{
           //Eligimos el metodo de tipo POST,para poder registrar la sesión en el historial
           method:'POST',
           headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`//Pasamos el token de autenticación en los headers,para poder acceder a las rutas protegidas de la API
           },
           body:JSON.stringify({id_rutina: rutinaId})//Pasamos el id de la rutina y las calorias quemadas a json para poder enviarlo bien a la base de datos
           //Lo transformamos a json

        }
            );
            const text=await res.text();
            console.log('Respuesta del servidor al registrar la sesión en el historial:',text);
            const data=JSON.parse(text);
            if(!res.ok){
                throw new Error(data.message || `Error al registrar la sesión en el historial ${error.message}`);
            }
            return data;
      }catch(error){
            throw error;
      }
}
export const getAllUsers=async()=>{
    //Vamos a obtener todos los usuarios,para que el administrador pueda gestionarlos
    try{
        const token=await AsyncStorage.getItem('token');
        const res=await fetch(`${BASE_URL}/auth/panel_usuarios`,{
            headers:{'Authorization':`Bearer ${token}`//Pasamos el token de autenticación en los headers,para poder acceder a las rutas protegidas de la API
            }
        });
        const text=await res.text();
        console.log('Respuesta del servidor al obtener todos los usuarios:',text);
        const data=JSON.parse(text);
        if(!res.ok){
            throw new Error(data.message || `Error al obtener todos los usuarios ${error.message}`);
        }
        return data.getAllUsuarios || [];
        //Esto nos devolverá la lista de todos los usuarios,para que el administrador pueda gestionarlos
    }catch(error){
        throw error;

    }
}
//------Operaciones del administrador sobre los usuarios------//
export const makeAdmin=async(id_usuario)=>{
    //Esta función es para transformar a un usuario en admin,solo el admin puede hacer esto,por lo tanto,es importante que esta función esté protegida por el middleware de autenticación y autorización,para que solo el admin pueda acceder a ella
    try{
        const token=await AsyncStorage.getItem('token');
        const res=await fetch(`${BASE_URL}/auth/make_admin`,{
            method:'PUT',
            headers:{'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`//Pasamos el token de autenticación en los headers,para poder acceder a las rutas protegidas de la API
            },
            body:JSON.stringify({id_usuario})//Pasamos el id del usuario que queremos transformar a admin a json para poder enviarlo bien a la base de datos
        });
        const text=await res.text();
        console.log('Respuesta del servidor al transformar a un usuario en admin:',text);
        const data=JSON.parse(text);
        if(!res.ok){
            throw new Error(data.message || `Error al transformar a un usuario en admin ${error.message}`);
        }
        return data.UserToAdmin || {};
        //Esto nos devolverá la información del usuario que hemos transformado a admin,para que el administrador pueda ver que se ha transformado correctamente
    }
    catch(error){
        throw error;
    }
}
export const deleteUserById=async(id_usuario)=>{
    //Esta función es para eliminar a un usuario por su id,solo el admin puede hacer esto,por lo tanto,es importante que esta función esté protegida por el middleware de autenticación y autorización,para que solo el admin pueda acceder a ella,esta función es de emergencia,por ejemplo si un usuario está causando problemas en la plataforma,el admin podrá borrarlo sin necesidad de iniciar sesión
    try{
        const token=await AsyncStorage.getItem('token');
        const res=await fetch(`${BASE_URL}/auth/delete_user_by_id/${id_usuario}`,{
            method:'DELETE',
            headers:{'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`//Pasamos el token de autenticación en los headers,para poder acceder a las rutas protegidas de la API
            },
            
        });
        const text=await res.text();
        console.log('Respuesta del servidor al eliminar a un usuario:',text);
        const data=JSON.parse(text);
        if(!res.ok){
            throw new Error(data.message || `Error al eliminar a un usuario ${error.message}`);
        }
        return data.UserDeleted || {};
        //Esto nos devolverá la información del usuario que hemos eliminado,para que el administrador pueda ver que se ha eliminado correctamente
    }catch(error){
        throw error;
    }
}
export const ActualizarUsuarioAdmin=async(id_usuario,nombre,email,rol)=>{
    //Esta función es para actualizar a un usuario por su id,solo el admin puede hacer esto,por lo tanto,es importante que esta función esté protegida por el middleware de autenticación y autorización,para que solo el admin pueda acceder a ella
    try{
        const token=await AsyncStorage.getItem('token');
        const res=await fetch(`${BASE_URL}/auth/actualizar_usuario_admin`,{
            method:'PUT',
            headers:{'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`//Pasamos el token de autenticación en los headers,para poder acceder a las rutas protegidas de la API
            },
            body:JSON.stringify({id_usuario,nombre,email,rol})//Pasamos el id del usuario que queremos actualizar a json para poder enviarlo bien a la base de datos
        });
        const text=await res.text();
        console.log('Respuesta del servidor al actualizar a un usuario:',text);
        const data=JSON.parse(text);
        if(!res.ok){
            throw new Error(data.message || `Error al actualizar a un usuario ${error.message}`);
        }
        return data.UserUpdated || {};
        //Esto nos devolverá la información del usuario que hemos actualizado,para que el administrador pueda ver que se ha actualizado correctamente
    }catch(error){
        throw error;
    }
}
//-------Ranking---------//
//Vamos a obtener el ranking de los usuarios,para que puedan ver su posición en el ranking mundial,este ranking se basará en los puntos que han obtenido los usuarios,que se van acumulando a medida que van haciendo ejercicio,por lo tanto,es importante que cada vez que un usuario haga ejercicio,actualicemos su puntuación en la base de datos,para que el ranking esté actualizado
export const getRanking=async()=>{
    try{
        const token=await AsyncStorage.getItem('token');
          const res=await fetch(`${BASE_URL}/gamificaciones/ranking`,{
            headers:{'Authorization':`Bearer ${token}`//Pasamos el token de autenticación en los headers,para poder acceder a las rutas protegidas de la API
            }
        });
        const text=await res.text();
        console.log('Respuesta del servidor al obtener el ranking:',text);
        const data=JSON.parse(text);
        if(!res.ok){
            throw new Error(data.message || `Error al obtener el ranking ${error.message}`);
        }
        return data.ranking || [];
        //Esto nos devolverá el ranking de los usuarios,en caso de que no hgaya usuarios,devuelve una array vacia

    }catch(error){
        throw error;
    }
}
//Vamos a a traer las sesiones de hoy,para poder obtener el total de sesiones que ha completado el usuario hoy,para poder actualizar su puntuación en el ranking
export const getSesionesHoy=async()=>{
    try{
        const token=await AsyncStorage.getItem('token');
        const res=await fetch(`${BASE_URL}/sesiones_historial/obtener_sesiones_de_hoy`,{
            headers:{'Authorization':`Bearer ${token}`//Pasamos el token de autenticación en los headers,para poder acceder a las rutas protegidas de la API
            }
        });
        const data=await res.json();
        console.log('Respuesta del servidor al obtener las sesiones de hoy:',data);
        if(!res.ok){
            throw new Error(data.message || `Error al obtener las sesiones de hoy ${error.message}`);
        }
        return {
            sesionesHoy: data.totalSesionesHoy 
            
        }
        

        //Esto nos devolverá el total de sesiones que ha completado el usuario hoy,para poder actualizar su puntuación en el ranking

    }catch(error){
        throw error;
    }
}
//Definimos el servicios para obtener todo el catalogo de ejercicios,para que el administrador pueda elegir los ejercicios que quiere incluir en las rutinas,ya que el administrador puede crear rutinas personalizadas para los usuarios,por lo tanto,es importante que esta función esté protegida por el middleware de autenticación y autorización,para que solo el admin pueda acceder a ella
export const getCatalogoEjercicios=async()=>{
    try{
        const token=await AsyncStorage.getItem('token');
        const res=await fetch(`${BASE_URL}/ejercicios/obtener`,{
            headers:{'Authorization':`Bearer ${token}`//Pasamos el token de autenticación en los headers,para poder acceder a las rutas protegidas de la API
            }
        });
        const data=await res.json();
        if(!res.ok){
            throw new Error(data.message || `Error al obtener el catálogo de ejercicios ${error.message}`);
        }
        return data.ejercicios || [];
    }catch(error){
        throw error;
    }
}
//------Crear rutinas-----//
//-----Este ya es el ultimo servicio que vamos a crear y está enfocado en la creación de rutinas por parte del usuario/administrador,ya que el administrador puede crear rutinas para que los usuarios puedan elegirlas,por lo tanto,es importante que esta función esté protegida por el middleware de autenticación y autorización,para que solo el admin pueda acceder a ella
export const crearRutina = async (nombre_rutina, ejerciciosIds) => {
    try {
        const token = await AsyncStorage.getItem('token');
        const res = await fetch(`${BASE_URL}/rutinas/crear_rutina`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            // Enviamos los tres datos clave
            body: JSON.stringify({
                nombre_rutina,
                id_ejercicio: ejerciciosIds.map(id => ({ id })) // Convertimos el array de IDs a un formato que el backend espera
            })
        });

        const text = await res.text();
        const data = JSON.parse(text);

        // Si el backend devuelve la rutina en 'data.rutina' o 'data.nuevaRutina'
        // Asegúrate de retornar el objeto correcto para actualizar la lista
        return data.nuevaRutina || data.rutina || data;

    } catch (err) {
        throw err;
    }
}