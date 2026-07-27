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
import { COLORS, RADIUS, SPACING, shadow } from "../theme";


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
                      <View style={style.LoadingContainer}>
                           <Text style={style.LoadingText}>Cargando...</Text>
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
                                    <Ionicons name="flame" size={26} color="#ff4500" style={style.Icon}/>
                                </View>
                            </View>
                            <View style={style.StackConatiner}>
                                <View>
                                        <Text style={style.Subtitle}>Puntos:</Text>
                                        <Text style={style.Text}>  {`${gamificaciones?.gamificaciones?.puntos_ranking} puntos`}</Text>
                                </View>
                                <View>
                                        <FontAwesome name="star" size={26} color="#fee500" style={style.Icon}/>
                                </View>
                                <Button title="ver ranking" variant="secondary" onPress={() => navigation.navigate('Ranking')}/>
                            </View>
                              <View style={style.StackConatiner}>
                                <View>
                                        <Text style={style.Subtitle}>Sesiones:</Text>
                                        <Text style={style.Text}>  {`${sesionesHistorial.length || 0} completas`}</Text>
                                </View>
                                <View>
                                        <FontAwesome name="calendar" size={26} color="#0efd3a" style={style.Icon}/>
                                </View>
                            </View>
                              <View style={style.StackConatiner}>
                                <View>
                                        <Text style={style.Subtitle}>Mis rutinas:</Text>
                                        <Text style={style.Text}>  {`${rutinas?.length || 0}`}</Text>
                                </View>
                                <View>
                                        <FontAwesome name="list" size={26} color="#ffffff" style={style.Icon}/>
                                </View>
                                <Button title="ver rutinas" variant="secondary" onPress={() => navigation.navigate('MisRutinas')}/>
                            </View>

                     </View>
               )
         }
}
const style=StyleSheet.create({
    LoadingContainer:{
         flex:1,
         justifyContent:'center',
         alignItems:'center',
         paddingVertical:SPACING.xxl,
    },
    LoadingText:{
         color:COLORS.textSecondary,
         fontSize:13,
         letterSpacing:1,
         textTransform:'uppercase',
    },
    Container:{
         flexDirection:'row',
         flexWrap:'wrap',
         justifyContent:'center',
         gap:SPACING.md,
         paddingHorizontal:SPACING.lg,
         paddingTop:SPACING.lg,
    },
    StackConatiner:{
            flexDirection:'column',
            justifyContent:'space-around',
            alignItems:'center',
             backgroundColor:COLORS.surfaceElevated,
             padding:SPACING.lg,
                height:170,
                borderRadius:RADIUS.lg,
                width:158,
                borderColor:COLORS.border,
                borderWidth:1,
                ...shadow('#000',0.5,15,8,{width:0,height:10}),
    },
    Text:{
         color:COLORS.textPrimary,
         fontSize:16,
            fontWeight:'700',
            textAlign:'center',
            fontFamily:'Helvetica',
           textTransform:'uppercase',
           letterSpacing:1,

    },
    Icon:{
         marginBottom:SPACING.sm,
    },
    Subtitle:{
         fontFamily:'Helvetica',
         color:COLORS.textSecondary,
         fontSize:10,
         textAlign:'center',
        textTransform:'uppercase',
        letterSpacing:1.5,
        marginBottom:SPACING.xs,
    },

})
export default StackContainer;//Exportamos el componente para usarlo en la pantalla de inicio,para mostrar la racha y los puntos_ranking
