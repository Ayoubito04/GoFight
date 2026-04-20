//Aquí vamos a crear cada uno de los contendores del main dem Home,dónde se indica la racha,los puntos_ranking
import React from "react";
import {Text,View,StyleSheet} from "react-native";
import { getGamificaciones } from "../services/services";
import { getSesionesHistorial } from "../services/services";
import { getUserProfile } from "../services/services";
import { getRutinas } from "../services/services";
import Button from   "./Button.js";
import {useState,useEffect} from "react";
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";


//Tenemos todo lo necesario,para crear el contenedor

const StackContainer=()=>{
         const [gamificaciones,setGamificaciones]=useState(null);//Traemos las gamificaciones
         const [laoding,setLoading]=useState(true);//Definimos el estado de carga
         const [sesionesHistorial,setSesionesHistorial]=useState([]);//Traemos el historial de sesiones,para mostrarlo en la pantalla de inicio,ya que cada vez que se registre una sesión en el historial,tenemos que actualizar las gamificaciones,por lo tanto,es importante mostrar el historial de sesiones en la pantalla de inicio,para ver si se actualiza correctamente
         const [rutinas,setRutinas]=useState([]);//Traemos las rutinas,para mostrar el historial de rutinas en la pantalla de inicio
        const navigation = useNavigation();
         useEffect(()=>{
             setLoading(true);
             //Ahora vamos a obtener las gamificaciones,para mostrar la racha y los puntos_ranking
              const SetTimeout=setTimeout(async()=>{
                //Definimos el tiempo de carga,para simular la carga de datos,ya que cada vez que se registre una sesión en el historial,tenemos que actualizar las gamificaciones,por lo tanto,es importante simular la carga de datos,para ver si se actualizan correctamente
                  setLoading(false);
                   try{
                                const [gamData,sesionesData,rutinasData,perfilData]=await Promise.all([getGamificaciones(),getSesionesHistorial(),getRutinas(),getUserProfile()]);//Obtenemos las gamificaciones,el historial de sesiones,las rutinas y el perfil del usuario mediante un await,para mostrar la racha y los puntos_ranking,el historial de sesiones y las rutinas en la pantalla de inicio,ya que cada vez que se registre una sesión en el historial,tenemos que actualizar las gamificaciones,por lo tanto,es importante mostrar la racha y los puntos_ranking,el historial de sesiones y las rutinas en la pantalla de inicio,para ver si se actualizan correctamente
                                const userId=perfilData?.perfilUsuario?.id_usuario; //Obtenemos el ID del usuario del perfil obtenido
                                setGamificaciones(gamData);
                                setSesionesHistorial(sesionesData?.historial || []); //Si no hay sesiones,establecemos un array vacío
                                setRutinas(rutinasData?.rutinas?.filter(rutina => rutina.id_usuario === userId) || []); //Si no hay rutinas,establecemos un array vacío

                   }catch(error){
                                console.error("Error al obtener las gamificaciones, el historial de sesiones o las rutinas:",error);
                   }
                    //Con esto vamos a atener todas las gamificaciones,para mostrar la racha y los puntos_ranking

              },2000);
                return()=>clearTimeout(SetTimeout);
         },[]);
         
         if(laoding){
               return(
                      <View>
                           <Text>Cargando...</Text>
                      </View>
               )
         }
         else{
               return(
                     <View style={style.Container}>
                            <View style={style.StackConatiner}>
                                <View>
                                    <Text style={style.Subtitle}>Racha:</Text>
                                        <Text style={style.Text}>  {`${gamificaciones?.gamificaciones?.racha_dias} dias`}</Text>
                                </View>
                                <View>
                                    <Ionicons name="flame" size={24} color="#ff4500" style={style.Icon}/>
                                    
                                </View>
                               <View>
                                  
                               </View>
                            </View>
                            <View style={style.StackConatiner}>
                                <View>
                                        <Text style={style.Subtitle}>Puntos:</Text>
                                        <Text style={style.Text}>  {`${gamificaciones?.gamificaciones?.puntos_ranking} puntos`}</Text>
                                </View>
                                <View>
                                        <FontAwesome name="star" size={24} color="#fee500" style={style.Icon}/>
                                </View>
                                <View>
                                       <Button title="ver ranking" onPress={() => navigation.navigate('Ranking')}></Button>
                                </View>
                                  
                            </View>
                              <View style={style.StackConatiner}>
                                <View>
                                        <Text style={style.Subtitle}>Sesiones:</Text>
                                        <Text style={style.Text}>  {`${sesionesHistorial.length || 0} completas`}</Text>
                                </View>
                                <View>
                                        <FontAwesome name="calendar" size={24} color="#0efd3a" style={style.Icon}/>
                                </View>
                                  
                            </View>
                              <View style={style.StackConatiner}>
                                <View>
                                        <Text style={style.Subtitle}>Mis rutinas:</Text>
                                        <Text style={style.Text}>  {`${rutinas?.length || 0}`}</Text>
                                </View>
                                <View>
                                        <FontAwesome name="list" size={24} color="#ffffff" style={style.Icon}/>
                                </View>
                                    <View>
                                            <Button title="ver rutinas" onPress={() => navigation.navigate('MisRutinas')}></Button>
                                </View>
                                  
                            </View>

                     </View>
               )
         }
}
const style=StyleSheet.create({
    Container:{
         flex:1,
         justifyContent:'center',
         alignItems:'center',
         backgroundColor:'#080808',
         flexDirection:'row',
         flexWrap:'wrap',
         gap:15,
         

    },
    StackConatiner:{
            flexDirection:'column',
            justifyContent:'space-around',
            alignItems:'center',
             
             width:'100%',
             backgroundColor:'#1e1b1b',
             marginBottom:20,
                padding:15,
                height:180,
                borderRadius:20,
                width:160,
                borderColor:'#484141',
                borderWidth:1,
                shadowColor:'#000',
                shadowOffset:{width:0,height:10},
                shadowOpacity:0.5,
                shadowRadius:15,
                elevation:8,
                
    },
    Text:{
         color:'#ffff',
         fontSize:16,
            fontWeight:'bold',
            textAlign:'center',
            fontFamily:'helvetica',
            marginBottom:0,
           textTransform:'uppercase',
           letterSpacing:1,
            margin:0,

    },
    Icon:{
         fontSize:27,
         marginBottom:10,
    },
    Subtitle:{
         fontFamily:'helvetica',
         color:'#888',
         fontSize:10,
         textAlign:'center',
        textTransform:'helvetica',
        letterSpacing:1.5,
        marginBottom:5,
        
    },
   
})
export default StackContainer;//Exportamos el componente para usarlo en la pantalla de inicio,para mostrar la racha y los puntos_ranking