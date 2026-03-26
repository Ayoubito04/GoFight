//Aquí vamos a implementar la pantalla de incio
//Vamos a implementar cada uno de los componentes que vamos a utilizar en la pantalla de inicio
import {View,StyleSheet,ActivityIndicator, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context'
import {useState,useEffect} from 'react';
import Header from '../components/HeaderComponent';
import Footer from '../components/Footer';
import { getGamificaciones,ActualizarGamificaciones } from '../services/services';
import StackContainer from '../components/StackContainer';
import BarraProgreso from '../components/BarraProgreso';


const Home=()=>{
     const [loading,setLoading]=useState(true);
     const [gamificaciones,setGamificaciones]=useState(null);
     const [caloriasQuemadas,setCaloriasQuemadas]=useState(0);

     useEffect(()=>{
        setTimeout(async ()=>{
              try{
                 await ActualizarGamificaciones();
                const res=await ActualizarGamificaciones();
                console.log('Respuesta de actualizar gamificaciones:', res);
                const calHoy= parseInt(res.caloriasQuemadas,10) || 0;
                     setCaloriasQuemadas(calHoy);
                    console.log('Calorías quemadas hoy:', calHoy);
                 const data=await getGamificaciones();
                setGamificaciones(data);
              }catch(error){
                  console.log('Error al actualizar las gamificaciones:', error);
              }
              finally{
                    setLoading(false);
              }
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
                             <BarraProgreso caloriasActuales={caloriasQuemadas} caloriasObjetivo={1000}/>
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
})
export default Home;
