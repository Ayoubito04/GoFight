//Aquí vamos a implementar la pantalla de incio
//Vamos a implementar cada uno de los componentes que vamos a utilizar en la pantalla de inicio
import React, { act } from 'react';
import {View,Text,StyleSheet,ActivityIndicator, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context'
import {useState,useEffect} from 'react';
import Button from '../components/Button';
import TextInputComponent from '../components/TextInput';
import Header from '../components/HeaderComponent';
import Footer from '../components/Footer';
import { getGamificaciones,ActualizarGamificaciones } from '../services/services';//Obtenemos las gamificaciones y lo probamos en la pantalla de inicio,para ver si se actualizan cada vez que se registre una sesión en el historial,ya que cada vez que se registre una sesión en el historial,tenemos que actualizar las gamificaciones,por lo tanto,es importante probarlo en la pantalla de inicio,para ver si se actualizan correctamente
import StackContainer from '../components/StackContainer';
import BarraProgreso from '../components/BarraProgreso';
import { getTotalCaloriasQuemadas } from '../services/services';
//Vamos a implementar en el home un boton para poder ver ese panel de usuarios y poder eliminnar el usuario y poder darle acceso como administrador
import { getUserProfile } from '../services/services';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
//Para eso importamos el servicio para obtener usuarios,ya que necsitamos obtener el rol del usuario,que nos tendría que dar acceso a ese panel




const Home=()=>{
     let gamificacionesActualizadas=false;//Definimos una variable para controlar si las gamificaciones se han actualizado
    const navigation = useNavigation();
    //Vamos a implementar la pantalla de inicio,que va a ser básica y muy snecilla
     const [loading,setLoading]=useState(true);
     const [gamificaciones,setGamificaciones]=useState(null);//Traemos las gamificaciones
     const [caloriasQuemadas,setCaloriasQuemadas]=useState(0);
     //Definimos el estado del administrador,que va a ser booleano 
     const [isAdmin,setIsAdmin]=useState(false);
     
     let actualizarGamificacionesEjecutada=false;//Definimos una variable para controlar si la función de actualizar gamificaciones se ha ejecutado,para evitar que se ejecute varias veces,ya que cada vez que se registre una sesión en el historial,tenemos que actualizar las gamificaciones,por lo tanto,es importante probarlo en la pantalla de inicio,para ver si se actualizan correctamente
     useEffect(()=>{
        //Aquí vamos a simular la pantalla de carga
        setTimeout(async ()=>{
             
              try{
                   const perfil=await getUserProfile();
                   setIsAdmin(perfil.perfilUsuario?.rol === 'admin');//Si el rol del usuario es admin,entonces le damos acceso al panel de administración
                    console.log('Perfil del usuario:', perfil); // Agrega este console.log para verificar el perfil del usuario
                    
                    if (actualizacion && actualizacion.gamificaciones) {
                // Seteamos los datos que vienen directamente de la actualización
                    setGamificaciones(actualizacion.gamificaciones);
                
                // Si el server devuelve las calorías, las usamos, si no, llamamos al servicio
                if (actualizacion.caloriasQuemadas !== undefined) {
                    setCaloriasQuemadas(actualizacion.caloriasQuemadas);
                } else {
                    const calHoy = await getTotalCaloriasQuemadas();
                    setCaloriasQuemadas(calHoy);
                }
            }

              }catch(error){
                  console.log('Error al actualizar las gamificaciones:', error);
              }
              finally{
                    setLoading(false);
              }


                //Vamos a simular una carga de 2 segundos,para que se muestre la pantalla de carga,antes de mostrar la pantalla de inicio
             //La función va esperar 2 segundos a que la carga termine
        },2000);
     },[]);
     if(loading){
         return(
               <View style={style.ActivityIndicatorStyle}>
                    <ActivityIndicator size="large" color="#ff0000"/>
               </View>
         )
     }
     else{
          return(
               <SafeAreaView style={style.Container}>
                     <Header/>
                      <ScrollView>
                          <StackContainer datos={gamificaciones}/>
                              <BarraProgreso actual={caloriasQuemadas} objetivo={300} unidad="kcal"/>
                              {
                                   isAdmin && (
                                        <View style={{marginTop:20,alignItems:'center', flexDirection:'row', justifyContent:'center'}}>
                                             <Button title="Panel de administración" onPress={()=>navigation.navigate('GestorUsuariosAdmin')}/>
                                      
                                        </View>
                                   )
                              }
                      </ScrollView>
                      
                     <Footer/>
                </SafeAreaView>
          )
     }
}
const style=StyleSheet.create({
     ActivityIndicatorStyle:{
          flex:1,
          justifyContent:'center',
          alignItems:'center',
          backgroundColor:'#080808'


     },
     Container:{
          flex:1,
          justifyContent:'space-between',
          backgroundColor:'#080808'

          
         

          
     },
     StacksConatainer:{
          flexDirection:'row',
          justifyContent:'space-around',
          alignItems:'center',
          padding:10,
          gap:10,
      
          gap:10,
          flexWrap:'wrap'
         
          
          

     },
     StackStats:{
          flexDirection:'row',
          justifyContent:'space-around',
          alignItems:'center',
          padding:10,
          gap:10,
          backgroundColor:'white',
          
          borderWidth:1,
          height:200,
          borderRadius:5,
          width:200,
          backgroundColor:'#1a1a1a',
          elevation:5,
          boxShadow:'rgba(255,0,0,0.5)',
          shadowColor:'rgba(255,0,0,0.5)',
          shadowOffset:{width:0,height:2},
          shadowOpacity:0.5,
          shadowRadius:12,
          borderColor:'rgba(70, 34, 34, 0.5)',


          
     },
     TextStyle:{
          fontSize:18,
          fontWeight:'bold',
          color:'white',
          textShadowColor:'rgba(255, 0, 0, 0.5)',
          textShadowOffset:{width:0,height:2},
          textShadowRadius:12,
          
     },
})
export default Home;