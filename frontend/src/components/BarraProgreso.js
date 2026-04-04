//Vamos a crear una barra de progreso para mostrar la evolución del usuario teniendo en cuenta las calorias quemadas
import React, { useRef } from "react";
import {View,Text,StyleSheet,Animated,ActivityIndicator} from 'react-native';//Importamos Animated para crear la animación de la barra de progreso
import { useState,useEffect } from "react";
import {Ionicons} from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {LinearGradient} from 'expo-linear-gradient';


const BarraProgreso=({caloriasActuales,caloriasObjetivo})=>{
      //Vamos a crear una barra de progreso para mostrar la evolución del usuario teniendo en cuenta las calorias quemadas,para esto vamos a usar el hook de useRef para crear una animación de la barra de progreso,que se va a actualizar cada vez que se registre una sesión en el historial,ya que cada vez que se registre una sesión en el historial,tenemos que actualizar las gamificaciones,por lo tanto,es importante probarlo en la pantalla de inicio,para ver si se actualizan correctamente
       
        const [loading,setLoading]=useState(true);
        const progresoAnimado=useRef(new Animated.Value(0));//Creamos una animación de la barra de progreso,que se va a actualizar cada vez que se registre una sesión en el historial,ya que cada vez que se registre una sesión en el historial,tenemos que actualizar las gamificaciones,por lo tanto,es importante probarlo en la pantalla de inicio,para ver si se actualizan correctamente
        //Tenemos que calcular el procentaje de calorias quemadas,para eso vamos a usar el Math.min,para tener en cuenta un porcentaje que no sobrepase el 100%
        const porcentajeCaloriasQuemadas=
         caloriasObjetivo>0?Math.min((caloriasActuales/caloriasObjetivo)*100,100):0;
         //Utilizamos un condicional en el caso de que el objetivo sea nulo,para evitar incosistencias

        useEffect(()=>{
               //Aquí vamos a simular la carga de las calorias quemadas,para mostrar la barra de progreso,antes de mostrar la barra de progreso,ya que cada vez que se registre una sesión en el historial,tenemos que actualizar las gamificaciones,por lo tanto,es importante probarlo en la pantalla de inicio,para ver si se actualizan correctamente
                 const timer=setTimeout(()=>{
        
                      
                       Animated.timing(progresoAnimado.current,{
                             toValue:porcentajeCaloriasQuemadas,
                               duration:1000,
                              useNativeDriver:false

                       }).start();
                        setLoading(false);
                 },1500);
                 return()=>clearTimeout(timer);
        },[caloriasActuales,porcentajeCaloriasQuemadas]);
         const width=progresoAnimado.current.interpolate({
              inputRange:[0,100],
              outputRange:['0%','100%'],
              

         })
        if(loading){
              return(
                   <ActivityIndicator size="large" color="#ff0000" />
              )
        }
        else{
            return(
                   <View style={styles.Container}>
                        <View style={styles.TextContainer}>
                           <View style={styles.RowStyle}>
                             <Text style={styles.TextStyle}>calorias quemadas:{caloriasActuales}</Text>
                            <Ionicons name="flame" size={20} color="#ffae00" />
                           </View>
                           <View style={styles.RowStyle}>
                                <Text style={styles.TextStyle}>Objetivo:{caloriasObjetivo}</Text>
                                <MaterialCommunityIcons name="target" size={20} color="#fb0404" />
                           </View>
                          
                        </View>
                        <View style={styles.barraProgresoContainer}>
                               <Animated.View style={{ width, height: 3 }}>
    <LinearGradient
      colors={['#ff0000', '#813838', '#ffe6e6']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{ flex: 1, borderRadius: 2 }}
    />
  </Animated.View>
                              
                        </View>
                         <View style={styles.SubtitleStyleContainer}>
                             <Text style={styles.SubtitleStyle}>Progreso:{porcentajeCaloriasQuemadas.toFixed(2)}/100%</Text>
                                    
                           </View>
                   </View>
                   
            )
               
        }

}
const styles=StyleSheet.create({

    Container:{
  width: '90%',
    alignSelf: 'center',
    marginVertical: 16,
    },
    barraProgresoContainer:{
   width: '100%',
  height: 3,
  backgroundColor: '#222',
  borderRadius: 2,
  overflow: 'hidden',
    },
        barraProgreso:{
             barraProgreso:{
           height: 3,
        backgroundColor: '#ff0000',
           borderRadius: 2,
           shadowColor: '#ff0000',
          shadowOffset: { width: 0, height: 0 },
         shadowOpacity: 0.8,
         shadowRadius: 4,
         elevation: 4,

        
                



        },


        },
        TextStyle:{
          fontSize: 13,
  fontWeight: '600',
  color: '#ffffff',
  letterSpacing: 1.5,
  textTransform: 'uppercase',


        },
        RowStyle:{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
        
        },
        TextContainer:{
 alignItems: 'center',
  justifyContent: 'center',
  padding: 14,
  borderRadius: 12,
  backgroundColor: '#111',
  width: '90%',
  alignSelf: 'center',
  marginBottom: 12,
  borderColor: 'rgba(255, 0, 0, 0.15)',
  borderWidth: 1,
  shadowColor: '#ff0000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.15,
  shadowRadius: 12,
  elevation: 6,
                
        },
        SubtitleStyleContainer:{
          fontSize: 12, // ← de 8 a 12
          color: '#aaaaaa',
          letterSpacing: 1,
            fontWeight: 'bold',
        },
        SubtitleStyle:{
              fontSize: 10, // ← de 8 a 12
             alignItems: 'center',
               justifyContent: 'center',
           marginTop: 8,
            width: '90%',
           alignSelf: 'center',
         borderWidth: 0, // ←
            color: '#aaaaaa',
          letterSpacing: 1,
         fontWeight: 'bold',


        }

})
export default BarraProgreso;
