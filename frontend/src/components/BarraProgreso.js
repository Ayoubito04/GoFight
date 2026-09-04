//Vamos a crear una barra de progreso para mostrar la evolución del usuario teniendo en cuenta las calorias quemadas
import React, { useRef } from "react";
import {View,Text,StyleSheet,Animated} from 'react-native';//Importamos Animated para crear la animación de la barra de progreso
import { useEffect } from "react";
import {Ionicons} from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, RADIUS, SPACING, shadow } from "../theme";



const BarraProgreso=({actual,objetivo,unidad})=>{
        const progresoAnimado=useRef(new Animated.Value(0)).current;//Animamos la barra desde 0 hasta el porcentaje real,para que se vea el progreso al entrar en la pantalla
        //Tenemos que calcular el procentaje de calorias quemadas,para eso vamos a usar el Math.min,para tener en cuenta un porcentaje que no sobrepase el 100%
        const porcentajeCaloriasQuemadas=
         objetivo>0?Math.min((actual/objetivo)*100,100):0;
         //Utilizamos un condicional en el caso de que el objetivo sea nulo,para evitar incosistencias

        //Cuando el usuario llega a su meta cambiamos el color a verde y se lo decimos,que es más motivador que dejarlo en rojo
        const metaAlcanzada=porcentajeCaloriasQuemadas>=100;
        const restante=Math.max(objetivo-actual,0);

        useEffect(()=>{
               //Un respiro mínimo antes de animar,lo justo para que la barra se vea crecer y no aparezca ya rellena
               const timer=setTimeout(()=>{
                       Animated.timing(progresoAnimado,{
                             toValue:porcentajeCaloriasQuemadas,
                               duration:900,
                              useNativeDriver:false

                       }).start();
               },250);
                 return()=>clearTimeout(timer);
        },[porcentajeCaloriasQuemadas,progresoAnimado]);

         const width=progresoAnimado.interpolate({
              inputRange:[0,100],
              outputRange:['0%','100%'],
         })

            return(
                   <View style={styles.Container}>
                        <View style={styles.HeaderRow}>
                             <View style={[styles.IconBubble,metaAlcanzada && styles.IconBubbleDone]}>
                                  <Ionicons name="flame" size={17} color={metaAlcanzada ? COLORS.success : COLORS.primary}/>
                             </View>
                             <View style={styles.HeaderTexts}>
                                  <Text style={styles.LabelText}>Calorías quemadas</Text>
                                  <Text style={styles.SubLabelText}>Objetivo diario</Text>
                             </View>
                             <View style={[styles.PercentBadge,metaAlcanzada && styles.PercentBadgeDone]}>
                                  <Text style={[styles.PercentText,metaAlcanzada && styles.PercentTextDone]}>{porcentajeCaloriasQuemadas.toFixed(0)}%</Text>
                             </View>
                        </View>

                        <View style={styles.ValueRow}>
                             <Text style={styles.ValueText}>{actual}</Text>
                             <Text style={styles.GoalText}>/ {objetivo} {unidad}</Text>
                        </View>

                        <View style={styles.TrackOuter}>
                               <Animated.View style={[styles.TrackFillWrapper,{ width }]}>
                                    <LinearGradient
                                         colors={metaAlcanzada ? [COLORS.success,'#7BED9F'] : [COLORS.primaryDark,COLORS.primary]}
                                         start={{x:0,y:0}}
                                         end={{x:1,y:0}}
                                         style={styles.TrackFill}
                                    />
                               </Animated.View>
                        </View>

                        <View style={styles.FooterRow}>
                             <Text style={styles.ScaleText}>0</Text>
                             <Text style={[styles.RemainingText,metaAlcanzada && styles.RemainingTextDone]}>
                                  {metaAlcanzada ? '¡Objetivo conseguido!' : `Te faltan ${restante} ${unidad}`}
                             </Text>
                             <Text style={styles.ScaleText}>{objetivo}</Text>
                        </View>
                   </View>

            )

}
const styles=StyleSheet.create({

    Container:{
        marginHorizontal: SPACING.lg,
        marginVertical: SPACING.md,
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.xl,
        borderWidth: 1,
        borderColor: COLORS.border,
        padding: SPACING.lg,
        ...shadow('#000', 0.35, 14, 6, {width:0,height:6}),
    },
    HeaderRow:{
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
    },
    IconBubble:{
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,34,51,0.14)',
    },
    IconBubbleDone:{
        backgroundColor: 'rgba(46,213,115,0.14)',
    },
    HeaderTexts:{
        flex: 1,
    },
    LabelText:{
        fontSize: 13,
        fontWeight: '800',
        color: COLORS.textPrimary,
    },
    SubLabelText:{
        fontSize: 10,
        fontWeight: '700',
        color: COLORS.textMuted,
        letterSpacing: 1,
        textTransform: 'uppercase',
        marginTop: 2,
    },
    //El porcentaje va en una pastilla,para que destaque sin competir con la cifra principal
    PercentBadge:{
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs,
        borderRadius: RADIUS.pill,
        backgroundColor: 'rgba(255,34,51,0.12)',
        borderWidth: 1,
        borderColor: 'rgba(255,34,51,0.32)',
    },
    PercentBadgeDone:{
        backgroundColor: 'rgba(46,213,115,0.12)',
        borderColor: 'rgba(46,213,115,0.34)',
    },
    PercentText:{
        fontSize: 13,
        fontWeight: '900',
        color: COLORS.primary,
    },
    PercentTextDone:{
        color: COLORS.success,
    },
    ValueRow:{
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: SPACING.xs,
        marginTop: SPACING.lg,
        marginBottom: SPACING.sm,
    },
    ValueText:{
        fontSize: 32,
        fontWeight: '900',
        color: COLORS.textPrimary,
        letterSpacing: -1,
    },
    GoalText:{
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.textSecondary,
    },
    //Barra fina y limpia,en vez del bloque de 34px de antes
    TrackOuter:{
        width: '100%',
        height: 10,
        borderRadius: RADIUS.pill,
        backgroundColor: COLORS.surfaceElevated,
        overflow: 'hidden',
    },
    TrackFillWrapper:{
        height: '100%',
        borderRadius: RADIUS.pill,
        overflow: 'hidden',
        ...shadow(COLORS.primaryGlow, 0.9, 8, 4, {width:0,height:0}),
    },
    TrackFill:{
        flex: 1,
        borderRadius: RADIUS.pill,
    },
    FooterRow:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: SPACING.sm,
    },
    ScaleText:{
        fontSize: 11,
        fontWeight: '600',
        color: COLORS.textMuted,
    },
    RemainingText:{
        fontSize: 11,
        fontWeight: '700',
        color: COLORS.textSecondary,
    },
    RemainingTextDone:{
        color: COLORS.success,
    },

})
export default BarraProgreso;
