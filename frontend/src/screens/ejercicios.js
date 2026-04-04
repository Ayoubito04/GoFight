//Vamos a traer los ejercicios de la rutina,cuando el usuario le de a una de las rutinas,podrá ver los ejercicios que contiene esa rutina
import React, { useEffect,useRef,useState } from "react";
import {View,Text,StyleSheet,SafeAreaView,ActivityIndicator,FlatList,Platform,StatusBar, TouchableOpacity} from 'react-native';
import Header from "../components/HeaderComponent";
import Footer from "../components/Footer";
import YouTubePlayer from 'react-native-youtube-iframe';
import { getEjerciciosDeRutina } from "../services/services";
import Button from "../components/Button";
import EjercicioCard from "../components/EjercicioCard";
import { registrarSesionHistorial } from "../services/services";


const Ejercicios=({route})=>{
         const { rutinaId } = route.params;
         const [ejercicios,setEjercicios]=useState([]);//Definimos el edstado de los ehercicios dentro de una array vacia

        const [caloriasQuemadas,setCaloriasQuemadas]=useState(0);//Definimos el estado de calorias quemadas,que después lo utilizaremos para mostrar el progreso del usuario,ya que cada vez que se registre una sesión en el historial,tenemos que actualizar las gamificaciones,por lo tanto,es importante probarlo en la pantalla de inicio,para ver si se actualizan correctamente
        //Definimos el estado de las calorias quemadas,que perderemos en cada una de los ejercicios,que depende de la categoria de ejerciciosl,ya que en el backend se tiene en cuenta categoria*minutos

         const [sesionesCompletadas,setSesionesCompletadas]=useState(0);//Definimos el estado de sesiones completadas,que después lo utilizaremos para mostrar el progreso del usuario,ya que cada vez que se registre una sesión en el historial,tenemos que actualizar las gamificaciones,por lo tanto,es importante probarlo en la pantalla de inicio,para ver si se actualizan correctamente
       //Tremos el estado de las sesiones completadas,para mostrar el progreso del usuario,cada vez que registre o inicie su sesión

         const [loading,setLoading]=useState(true);
         const ref=useRef(null);//Definimos el estado de la referencia del intervalo de tiempo,que después lo utilizaremos para limpiar el intervalo de tiempo,cuando se detenga la ejecución de cada uno de los ejercicios
         useEffect(()=>{
              const cargarEjercicios=(async()=> {
                //Creamos la función para obtener cada uno de los ejercxicios p más bien la llamamos
                try{
                 const ejerciciosRutinaId=await getEjerciciosDeRutina(rutinaId);
                 console.log("Ejercicios de la rutina:",ejerciciosRutinaId);
                 //Obtendremos los ejercicios de la rutina,con el id de la rutina,que se lo pasamos como parametro a la función,que se encuentra en services.js
                 setEjercicios(ejerciciosRutinaId);
                 //Una vez que hayan cargado los ejercicios,los guardamos y ahora toca definir la ejecución de estos
                
                
                 //Una vez que tengamos los ejercicios,dejará de cargar
                }
                catch(error){
                     console.error("Error al obtener los ejercicios de la rutina:",error);
                }finally{
                        setLoading(false);
                }
              })
                cargarEjercicios();
              

           

              
         },[rutinaId])
         //Ahora definimos elintervalo de tiempo deseado que será de 00:00
         const formatTiemppo=(tiempo)=>{
                 const minutos=Math.floor(tiempo/60);
                        const segundos=tiempo%60;
                        return `${minutos.toString().padStart(2,'0')}:${segundos.toString().padStart(2,'0')}`;
                        //Con esto transformamos el intervalo de tiempo


         }
       
         const handleSesiones=async()=>{
                //Vamos a registrar cada una de las sesiones que se completen
                try{
                       const res= await registrarSesionHistorial(rutinaId);
                        //Vamos a tener el cuenta las calorias quemadas por cada  ejercicio
                        //Vamos a tener en cuenta las calorias quemadas por cada ejercicio,que se calcula en el backend,teniendo en cuenta la categoria de cada ejercicio y la duración de cada ejercicio,ya que en el backend se tiene en cuenta categoria*minutos
                        console.log("Respuesta de registrar sesión en el historial:", res);
                                setCaloriasQuemadas(res.calorias);
                                setSesionesCompletadas(prev=>prev+1);
                                console.log("Calorías quemadas obtenidas de la respuesta de registrar sesión en el historial:", res.calorias);

                        

                }catch(error){
                        console.error("Error al registrar la sesión en el historial:",error);
                }
         }
         const getYoutubeId = (url) => {
  const match = url.match(/[?&]v=([^&]+)/);
  return match ? match[1] : null;
};
         
            if(loading){    
                return(
                        <SafeAreaView style={styles.Container}>
                                <Header/>
                                <ActivityIndicator size="large" color="#0000ff" style={styles.ActivityIndicatorStyle}/>
                                <Footer/>
                        </SafeAreaView>
                )
            }
            else{
                return(
                        <SafeAreaView style={styles.Container}>
                                <Header/>
                                <FlatList
                                        data={ejercicios}
                                        contentContainerStyle={styles.flatListContent}
                                        keyExtractor={(item)=>item.id_rutina_ejercicio.toString()}
                                        renderItem={({item})=>(
                                                <EjercicioCard item={item} />   
                                        
                                        )}
                                />
                                        <Button title="Registrar Sesión" onPress={handleSesiones} />
                                <Footer/>
                        </SafeAreaView>
                )

            }
}
const styles=StyleSheet.create({
        Container:{
                flex:1,
                backgroundColor:'#000000',
                 paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0

        },
        ActivityIndicatorStyle:{    
                flex:1,
                justifyContent:'center',
                alignItems:'center',        

        },
        flatListContent:{
                padding:20,
        },
        EjercicioCard:{
                backgroundColor:'#000000',
                borderRadius:10,
                padding:15,
                marginBottom:15,
        },
        EjercicioName:{
                fontSize:18,
                fontWeight:'bold',
                color:'#ffffff',
                marginBottom:5,
        },
        EjercicioDescription:{
                fontSize:14,
                color:'#cccccc',
        },
})
export default Ejercicios;
