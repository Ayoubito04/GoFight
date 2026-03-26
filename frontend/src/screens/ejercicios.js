//Vamos a traer los ejercicios de la rutina,cuando el usuario le de a una de las rutinas,podrá ver los ejercicios que contiene esa rutina
import React, { useEffect,useState } from "react";
import {View,Text,StyleSheet,SafeAreaView,ActivityIndicator,FlatList} from 'react-native';
import Header from "../components/HeaderComponent";
import Footer from "../components/Footer";
import { getEjerciciosDeRutina } from "../services/services";

const Ejercicios=({route})=>{
         const { rutinaId } = route.params;
         const [ejercicios,setEjercicios]=useState([]);
         const [loading,setLoading]=useState(true);
         useEffect(()=>{
              const cargarEjercicios=(async()=> {
                //Creamos la función para obtener cada uno de los ejercxicios p más bien la llamamos
                try{
                 const ejerciciosRutinaId=await getEjerciciosDeRutina(rutinaId);
                 console.log("Ejercicios de la rutina:",ejerciciosRutinaId);
                 //Obtendremos los ejercicios de la rutina,con el id de la rutina,que se lo pasamos como parametro a la función,que se encuentra en services.js
                 setEjercicios(ejerciciosRutinaId);
                
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
                                                <View style={styles.EjercicioCard}>
                                                       
                                                        <Text style={styles.EjercicioName}>{item.ejercicios.nombre}</Text>
                                                        <Text style={styles.EjercicioDescription}>{item.ejercicios.categoria}</Text>
                                                        <Text style={styles.EjercicioDescription}>{item.duracion_descanso}</Text>
                                                        <Text style={styles.EjercicioDescription}>{item.duracion_ejercicio}</Text>
                                                </View> 
                                        )}
                                />
                                <Footer/>
                        </SafeAreaView>
                )

            }
}
const styles=StyleSheet.create({
        Container:{
                flex:1,
                backgroundColor:'#000000',
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
