//Aquí vamos a crear cada uno de los contendores del main dem Home,dónde se indica la racha,los puntos_ranking
import React from "react";
import {Text,View,StyleSheet,TouchableOpacity,Animated} from "react-native";
import { getGamificaciones } from "../services/services";
import { getSesionesHistorial } from "../services/services";
import { getUserProfile } from "../services/services";
import { getRutinas } from "../services/services";
import {useState,useEffect,useRef} from "react";
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { COLORS, RADIUS, SPACING, shadow } from "../theme";


//Tarjeta de dato reutilizable: icono,etiqueta,valor grande y abajo o bien una pista o bien una acción
//Cuando lleva acción la tarjeta entera es pulsable,así el usuario tiene una zona de toque grande en vez de un botón diminuto apretujado
const StatCard=({icon,bubbleStyle,cardStyle,label,valor,unidad,hint,accion,onPress})=>{
     const contenido=(
          <>
               <View style={[style.IconBubble,bubbleStyle]}>{icon}</View>
               <Text style={style.Subtitle}>{label}</Text>
               <View style={style.ValueRow}>
                    <Text style={style.Text}>{valor}</Text>
                    {unidad ? <Text style={style.UnitText}>{unidad}</Text> : null}
               </View>
               {accion ? (
                    <View style={style.ActionRow}>
                         <Text style={style.ActionText}>{accion}</Text>
                         <Ionicons name="chevron-forward" size={14} color={COLORS.primary}/>
                    </View>
               ) : (
                    <Text style={style.CardHint}>{hint}</Text>
               )}
          </>
     );

     if(onPress){
          return(
               <TouchableOpacity style={[style.StackConatiner,cardStyle]} onPress={onPress} activeOpacity={0.85} accessibilityRole="button">
                    {contenido}
               </TouchableOpacity>
          )
     }
     return <View style={[style.StackConatiner,cardStyle]}>{contenido}</View>;
};

//Mientras llegan los datos enseñamos la misma rejilla en gris con un parpadeo suave,en vez de un texto de "Cargando..." suelto
const SkeletonCards=()=>{
     const pulso=useRef(new Animated.Value(0.4)).current;
     useEffect(()=>{
          const animacion=Animated.loop(Animated.sequence([
               Animated.timing(pulso,{toValue:1,duration:700,useNativeDriver:true}),
               Animated.timing(pulso,{toValue:0.4,duration:700,useNativeDriver:true}),
          ]));
          animacion.start();
          return()=>animacion.stop();
     },[pulso]);

     return(
          <View style={style.Container}>
               {[0,1,2,3].map((i)=>(
                    <View key={i} style={style.StackConatiner}>
                         <Animated.View style={[style.SkeletonBubble,{opacity:pulso}]}/>
                         <Animated.View style={[style.SkeletonLine,{width:'60%',opacity:pulso}]}/>
                         <Animated.View style={[style.SkeletonLine,{width:'45%',height:22,opacity:pulso}]}/>
                         <Animated.View style={[style.SkeletonLine,{width:'70%',opacity:pulso}]}/>
                    </View>
               ))}
          </View>
     )
};

//Tenemos todo lo necesario,para crear el contenedor

const StackContainer=()=>{
         const [gamificaciones,setGamificaciones]=useState(null);//Traemos las gamificaciones
         const [laoding,setLoading]=useState(true);//Definimos el estado de carga
         const [sesionesHistorial,setSesionesHistorial]=useState([]);//Traemos el historial de sesiones,para mostrarlo en la pantalla de inicio,ya que cada vez que se registre una sesión en el historial,tenemos que actualizar las gamificaciones,por lo tanto,es importante mostrar el historial de sesiones en la pantalla de inicio,para ver si se actualiza correctamente
         const [rutinas,setRutinas]=useState([]);//Traemos las rutinas,para mostrar el historial de rutinas en la pantalla de inicio
        const navigation = useNavigation();
         useEffect(()=>{
             let cancelado=false;
             //Pedimos los datos nada más montar el componente,sin esperas artificiales,para que el Home entre cuanto antes
             const cargarDatos=async()=>{
                   try{
                                const [gamData,sesionesData,rutinasData,perfilData]=await Promise.all([getGamificaciones(),getSesionesHistorial(),getRutinas(),getUserProfile()]);//Obtenemos las gamificaciones,el historial de sesiones,las rutinas y el perfil del usuario mediante un await,para mostrar la racha y los puntos_ranking,el historial de sesiones y las rutinas en la pantalla de inicio
                                if(cancelado) return;
                                const userId=perfilData?.perfilUsuario?.id_usuario; //Obtenemos el ID del usuario del perfil obtenido
                                setGamificaciones(gamData);
                                setSesionesHistorial(sesionesData?.historial || []); //Si no hay sesiones,establecemos un array vacío
                                setRutinas(rutinasData?.rutinas?.filter(rutina => rutina.id_usuario === userId) || []); //Si no hay rutinas,establecemos un array vacío

                   }catch(error){
                                console.error("Error al obtener las gamificaciones, el historial de sesiones o las rutinas:",error);
                   }finally{
                                if(!cancelado) setLoading(false);
                   }
             };
             cargarDatos();
             //Si el usuario sale de la pantalla antes de que lleguen los datos,evitamos actualizar un componente ya desmontado
             return()=>{cancelado=true;};
         },[]);

         if(laoding){
               return <SkeletonCards/>
         }
         else{
               const racha=gamificaciones?.gamificaciones?.racha_dias || 0;
               return(
                     <View style={style.Container}>
                            <StatCard
                                icon={<Ionicons name="flame" size={22} color={COLORS.primary}/>}
                                bubbleStyle={style.FlameBubble}
                                cardStyle={style.FeaturedCard}
                                label="Racha actual"
                                valor={racha}
                                unidad={racha===1 ? 'día' : 'días'}
                                hint="Sigue sumando rounds"
                            />
                            <StatCard
                                icon={<FontAwesome name="star" size={19} color={COLORS.gold}/>}
                                bubbleStyle={style.RankingBubble}
                                label="Puntos ranking"
                                valor={gamificaciones?.gamificaciones?.puntos_ranking || 0}
                                accion="Ver ranking"
                                onPress={() => navigation.navigate('Ranking')}
                            />
                            <StatCard
                                icon={<Ionicons name="checkmark-done" size={21} color={COLORS.success}/>}
                                bubbleStyle={style.SessionBubble}
                                label="Sesiones"
                                valor={sesionesHistorial.length || 0}
                                hint="Completadas"
                            />
                            <StatCard
                                icon={<Ionicons name="barbell" size={20} color={COLORS.info}/>}
                                bubbleStyle={style.RoutineBubble}
                                label="Mis rutinas"
                                valor={rutinas?.length || 0}
                                accion="Ver rutinas"
                                onPress={() => navigation.navigate('MisRutinas')}
                            />
                     </View>
               )
         }
}
const style=StyleSheet.create({
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
            //Todo alineado a la izquierda,que se lee mucho mejor que centrado
            alignItems:'flex-start',
            justifyContent:'flex-start',
             backgroundColor:COLORS.surface,
             padding:SPACING.lg,
                minHeight:172,
                borderRadius:RADIUS.lg,
                width:'47%',
                borderColor:COLORS.border,
                borderWidth:1,
                ...shadow('#000',0.35,14,6,{width:0,height:6}),
    },
    FeaturedCard:{
         borderColor:'rgba(255,34,51,0.4)',
    },
    ValueRow:{
         flexDirection:'row',
         alignItems:'baseline',
         gap:SPACING.xs,
         //Empuja la pista o la acción al fondo de la tarjeta,para que las cuatro queden alineadas entre sí
         marginBottom:'auto',
    },
    Text:{
         color:COLORS.textPrimary,
         fontSize:28,
            fontWeight:'900',
            fontFamily:'Helvetica',
           letterSpacing:-0.8,
    },
    UnitText:{
         color:COLORS.textSecondary,
         fontSize:13,
         fontWeight:'700',
    },
    IconBubble:{
         width:40,
         height:40,
         borderRadius:20,
         alignItems:'center',
         justifyContent:'center',
         marginBottom:SPACING.md,
    },
    FlameBubble:{backgroundColor:'rgba(255,34,51,0.14)'},
    RankingBubble:{backgroundColor:'rgba(236,193,18,0.12)'},
    SessionBubble:{backgroundColor:'rgba(46,213,115,0.12)'},
    RoutineBubble:{backgroundColor:'rgba(58,169,255,0.12)'},
    Subtitle:{
         fontFamily:'Helvetica',
         color:COLORS.textSecondary,
        fontSize:10,
        textAlign:'left',
        textTransform:'uppercase',
        letterSpacing:1.5,
        marginBottom:SPACING.xs,
    },
    CardHint:{
         color:COLORS.textMuted,
         fontSize:12,
         marginTop:SPACING.md,
    },
    //La acción va separada por una línea fina,como un enlace,en vez de un botón grande que no cabe en la tarjeta
    ActionRow:{
         flexDirection:'row',
         alignItems:'center',
         justifyContent:'space-between',
         alignSelf:'stretch',
         marginTop:SPACING.md,
         paddingTop:SPACING.sm,
         borderTopWidth:1,
         borderTopColor:COLORS.border,
    },
    ActionText:{
         color:COLORS.primary,
         fontSize:12,
         fontWeight:'800',
         letterSpacing:0.3,
    },
    SkeletonBubble:{
         width:40,
         height:40,
         borderRadius:20,
         backgroundColor:COLORS.surfaceElevated,
         marginBottom:SPACING.md,
    },
    SkeletonLine:{
         height:11,
         borderRadius:RADIUS.sm,
         backgroundColor:COLORS.surfaceElevated,
         marginBottom:SPACING.sm,
    },

})
export default StackContainer;//Exportamos el componente para usarlo en la pantalla de inicio,para mostrar la racha y los puntos_ranking
