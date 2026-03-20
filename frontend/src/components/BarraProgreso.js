//Vamos a crear una barra de progreso para mostrar la evolución del usuario teniendo en cuenta las calorias quemadas
import React, { useRef } from "react";
import {View,Text,StyleSheet,Animated,ActivityIndicator} from 'react-native';//Importamos Animated para crear la animación de la barra de progreso
import { useState,useEffect } from "react";
import {Ionicons} from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
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
                   <View>
                        <View style={styles.TextContainer}>
                           <View style={styles.RowStyle}>
                             <Text style={styles.TextStyle}>Calorias quemadas:{caloriasActuales}</Text>
                            <Ionicons name="flame" size={20} color="#ffae00" />
                           </View>
                           <View style={styles.RowStyle}>
                                <Text style={styles.TextStyle}>Objetivo de calorias quemadas:{caloriasObjetivo}</Text>
                                <MaterialCommunityIcons name="target" size={20} color="#49362c" />
                           </View>
                           <View style={styles.RowStyle}>
                             <Text style={styles.TextStyle}>Progreso:{porcentajeCaloriasQuemadas.toFixed(2)}%</Text>
                                    <Ionicons name="barbell" size={20} color="#000000" />
                           </View>
                        </View>
                        <View style={styles.barraProgresoContainer}>
                              <Animated.View  style={[styles.barraProgreso,{width}]} />
                              
                        </View>
                   </View>
                   
            )
               
        }

}
const styles=StyleSheet.create({
    barraProgresoContainer:{
        width:'100%',
        height:20,
        backgroundColor:'#333333',

   
        borderRadius:10,
        marginTop:10,
        overflow:'hidden',
        borderColor:'rgba(255,0,0,0.5)',
        borderWidth:2,
        shadowColor:'#ff0000',
        shadowOffset:{width:0,height:2},
        shadowOpacity:0.8,
        shadowRadius:4,
         elevation:5,


    },
        barraProgreso:{
                height:20,
                backgroundColor:'#ff0000',
                borderRadius:10,
                marginTop:10,
                alignItems:'center',
                justifyContent:'center',
                borderColor:'rgba(255,0,0,0.5)',
                borderWidth:2,
                shadowColor:'#ff0000',
                shadowOffset:{width:0,height:2},
                shadowOpacity:0.8,
                shadowRadius:4,
                 elevation:5,
                 marginTop:0,

        
                



        },
        TextStyle:{
            fontSize:16,
            fontWeight:'bold',
            color:'#ffffff',
            marginBottom:5,
            letterSpacing:1,
            textShadowColor:'rgba(255,0,0,0.5)',
            textShadowOffset:{width:1,height:1},
            textShadowRadius:2,
            fontFamily:'Helvetica',
         



        },
        RowStyle:{
            flexDirection:'row',
            alignItems:'center',
            justifyContent:'center',
            gap:5,
            underlayColor:'rgba(255,0,0,0.1)',
                padding:5,
                borderRadius:5,
        
        },
        TextContainer:{
                alignItems:'center',
                    justifyContent:'center',
                    borderColor:'rgba(255, 4, 4, 0.8)',
                    borderWidth:1,
                    padding:10,
                    borderRadius:5,
                    backgroundColor:'#1a1a1a',
                    shadowColor:'rgba(255, 82, 82, 0.5)',
                    
        
                    
                    elevation:5,
                    width:'90%',
                    alignSelf:'center',
                
        }

})
export default BarraProgreso;
