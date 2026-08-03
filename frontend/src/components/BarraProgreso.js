//Vamos a crear una barra de progreso para mostrar la evolución del usuario teniendo en cuenta las calorias quemadas
import React, { useRef } from "react";
import {View,Text,StyleSheet,Animated,ActivityIndicator} from 'react-native';//Importamos Animated para crear la animación de la barra de progreso
import { useState,useEffect } from "react";
import {Ionicons} from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, shadow } from "../theme";



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
                        <View style={styles.HeaderRow}>
                             <Ionicons name="flame" size={16} color={COLORS.primary} />
                             <Text style={styles.LabelText}>Calorías quemadas</Text>
                        </View>
                        <View style={styles.ValueRow}>
                             <Text style={styles.PercentText}>{porcentajeCaloriasQuemadas.toFixed(0)}%</Text>
                             <Text style={styles.SeparatorText}> · </Text>
                             <Text style={styles.ValueText}>{actual} de {objetivo} {unidad}</Text>
                        </View>
                        <View style={styles.ScaleRow}>
                             <Text style={styles.ScaleText}>0</Text>
                             <Text style={styles.ScaleText}>{Math.round(objetivo/2)}</Text>
                             <Text style={styles.ScaleText}>{objetivo}</Text>
                        </View>
                        <View style={styles.TrackOuter}>
                               <Animated.View style={[styles.TrackFill,{ width }]}/>
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
        backgroundColor: COLORS.surfaceAlt,
        borderRadius: RADIUS.xl,
        borderWidth: 1,
        borderColor: 'rgba(255, 34, 51, 0.2)',
        padding: SPACING.lg,
    },
    HeaderRow:{
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
        marginBottom: SPACING.sm,
    },
    LabelText:{
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.textSecondary,
        letterSpacing: 0.5,
    },
    ValueRow:{
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: SPACING.md,
    },
    PercentText:{
        fontSize: 26,
        fontWeight: '800',
        color: COLORS.primary,
        letterSpacing: 0.3,
    },
    SeparatorText:{
        fontSize: 18,
        fontWeight: '800',
        color: COLORS.textPrimary,
    },
    ValueText:{
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    ScaleRow:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.xs,
        paddingHorizontal: 2,
    },
    ScaleText:{
        fontSize: 11,
        fontWeight: '600',
        color: COLORS.textMuted,
    },
    TrackOuter:{
        width: '100%',
        height: 34,
        borderRadius: RADIUS.pill,
        borderWidth: 1,
        borderColor: COLORS.border,
        padding: 4,
    },
    TrackFill:{
        height: '100%',
        borderRadius: RADIUS.pill,
        backgroundColor: COLORS.primary,
        ...shadow(COLORS.primaryGlow, 0.9, 10, 6, {width:0,height:0}),
    },

})
export default BarraProgreso;
