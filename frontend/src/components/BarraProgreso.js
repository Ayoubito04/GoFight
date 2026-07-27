//Vamos a crear una barra de progreso para mostrar la evolución del usuario teniendo en cuenta las calorias quemadas
import React, { useRef } from "react";
import {View,Text,StyleSheet,Animated,ActivityIndicator} from 'react-native';//Importamos Animated para crear la animación de la barra de progreso
import { useState,useEffect } from "react";
import {Ionicons} from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {LinearGradient} from 'expo-linear-gradient';
import { COLORS, RADIUS, SPACING } from "../theme";



const BarraProgreso=({actual,objetivo,unidad})=>{
      //Vamos a crear una barra de progreso para mostrar la evolución del usuario teniendo en cuenta las calorias quemadas,para esto vamos a usar el hook de useRef para crear una animación de la barra de progreso,que se va a actualizar cada vez que se registre una sesión en el historial,ya que cada vez que se registre una sesión en el historial,tenemos que actualizar las gamificaciones,por lo tanto,es importante probarlo en la pantalla de inicio,para ver si se actualizan correctamente

        const [loading,setLoading]=useState(true);
        const progresoAnimado=useRef(new Animated.Value(0));//Creamos una animación de la barra de progreso,que se va a actualizar cada vez que se registre una sesión en el historial,ya que cada vez que se registre una sesión en el historial,tenemos que actualizar las gamificaciones,por lo tanto,es importante probarlo en la pantalla de inicio,para ver si se actualizan correctamente
        //Tenemos que calcular el procentaje de calorias quemadas,para eso vamos a usar el Math.min,para tener en cuenta un porcentaje que no sobrepase el 100%
        const porcentajeCaloriasQuemadas=
         objetivo>0?Math.min((actual/objetivo)*100,100):0;
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
        },[actual,porcentajeCaloriasQuemadas]);
         const width=progresoAnimado.current.interpolate({
              inputRange:[0,100],
              outputRange:['0%','100%'],


         })
        if(loading){
              return(
                   <ActivityIndicator size="large" color={COLORS.primary} style={{marginVertical:SPACING.lg}}/>
              )
        }
        else{
            return(
                   <View style={styles.Container}>
                        <View style={styles.TextContainer}>
                           <View style={styles.RowStyle}>
                             <Ionicons name="flame" size={18} color="#ffae00" />
                             <Text style={styles.TextStyle}>Actual: {actual} {unidad}</Text>
                           </View>
                           <View style={styles.RowStyle}>
                                <MaterialCommunityIcons name="target" size={18} color={COLORS.primary} />
                                <Text style={styles.TextStyle}>Objetivo: {objetivo} {unidad}</Text>
                           </View>
                        </View>
                        <View style={styles.barraProgresoContainer}>
                               <Animated.View style={{ width, height: '100%' }}>
    <LinearGradient
      colors={[COLORS.primaryDark, COLORS.primary, '#FFE6E6']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{ flex: 1, borderRadius: RADIUS.pill }}
    />
  </Animated.View>

                        </View>
                         <View style={styles.SubtitleStyleContainer}>
                             <Text style={styles.SubtitleStyle}>Progreso: {porcentajeCaloriasQuemadas.toFixed(0)}%</Text>
                           </View>
                   </View>

            )

        }

}
const styles=StyleSheet.create({

    Container:{
        width: '90%',
        alignSelf: 'center',
        marginVertical: SPACING.md,
    },
    barraProgresoContainer:{
        width: '100%',
        height: 10,
        backgroundColor: COLORS.surfaceElevated,
        borderRadius: RADIUS.pill,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    TextStyle:{
        fontSize:11,
        fontWeight: '700',
        color: COLORS.textPrimary,
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    RowStyle:{
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
    },
    TextContainer:{
        flexDirection:'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: SPACING.md,
        borderRadius: RADIUS.md,
        backgroundColor: COLORS.surfaceAlt,
        width: '100%',
        marginBottom: SPACING.sm,
        borderColor: 'rgba(255, 34, 51, 0.15)',
        borderWidth: 1,
    },
    SubtitleStyleContainer:{
        marginTop: SPACING.sm,
        alignItems:'center',
    },
    SubtitleStyle:{
        fontSize: 11,
        color: COLORS.textSecondary,
        letterSpacing: 1,
        fontWeight: 'bold',
    }

})
export default BarraProgreso;
