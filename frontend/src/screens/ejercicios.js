//Vamos a traer los ejercicios de la rutina,cuando el usuario le de a una de las rutinas,podrá ver los ejercicios que contiene esa rutina
import React, { useEffect,useRef,useState } from "react";
import {View,Text,StyleSheet,SafeAreaView,ActivityIndicator,ScrollView,Platform,StatusBar, TouchableOpacity} from 'react-native';
import {Ionicons, MaterialCommunityIcons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import Footer from "../components/Footer";
import { getEjerciciosDeRutina } from "../services/services";
import Button from "../components/Button";
import EjercicioCard from "../components/EjercicioCard";
import { registrarSesionHistorial } from "../services/services";
import { COLORS, SPACING, RADIUS, shadow } from "../theme";
import { useToast } from "../components/Toast";




const Ejercicios=({route})=>{
         const navigation=useNavigation();
         const showToast=useToast();
         const { rutinaId } = route.params;
         const [ejercicios,setEjercicios]=useState([]);//Definimos el edstado de los ehercicios dentro de una array vacia

        const [caloriasQuemadas,setCaloriasQuemadas]=useState(0);//Definimos el estado de calorias quemadas,que después lo utilizaremos para mostrar el progreso del usuario,ya que cada vez que se registre una sesión en el historial,tenemos que actualizar las gamificaciones,por lo tanto,es importante probarlo en la pantalla de inicio,para ver si se actualizan correctamente
        //Definimos el estado de las calorias quemadas,que perderemos en cada una de los ejercicios,que depende de la categoria de ejerciciosl,ya que en el backend se tiene en cuenta categoria*minutos

         const [sesionesCompletadas,setSesionesCompletadas]=useState(0);//Definimos el estado de sesiones completadas,que después lo utilizaremos para mostrar el progreso del usuario,ya que cada vez que se registre una sesión en el historial,tenemos que actualizar las gamificaciones,por lo tanto,es importante probarlo en la pantalla de inicio,para ver si se actualizan correctamente
       //Tremos el estado de las sesiones completadas,para mostrar el progreso del usuario,cada vez que registre o inicie su sesión
         const [ejercicioActual,setEjercicioActual]=useState(0);//Índice del ejercicio que el usuario tiene que completar ahora mismo,para que vaya haciendo los ejercicios de uno en uno y en orden,sin poder saltarse al siguiente hasta terminar el actual

         const [loading,setLoading]=useState(true);
         const ref=useRef(null);//Definimos el estado de la referencia del intervalo de tiempo,que después lo utilizaremos para limpiar el intervalo de tiempo,cuando se detenga la ejecución de cada uno de los ejercicios
         useEffect(()=>{
              const cargarEjercicios=(async()=> {
                //Creamos la función para obtener cada uno de los ejercxicios p más bien la llamamos
                try{
                 const ejerciciosRutinaId=await getEjerciciosDeRutina(rutinaId);
                 console.log("Ejercicios de la rutina:",ejerciciosRutinaId);
                 //Obtendremos los ejercicios de la rutina,con el id de la rutina,que se lo pasamos como parametro a la función,que se encuentra en services.js
                 setEjercicios(ejerciciosRutinaId);
                 //Una vez que hayan cargado los ejercicios,los guardamos y ahora toca definir la ejecución de estos
                
                
                 //Una vez que tengamos los ejercicios,dejará de cargar
                }
                catch(error){
                     console.error("Error al obtener los ejercicios de la rutina:",error);
                }finally{
                        setLoading(false);
                }
              })
                cargarEjercicios();
              

           

              
         },[rutinaId])
       
         //Ahora definimos elintervalo de tiempo deseado que será de 00:00
         const formatTiemppo=(tiempo)=>{
                 const minutos=Math.floor(tiempo/60);
                        const segundos=tiempo%60;
                        return `${minutos.toString().padStart(2,'0')}:${segundos.toString().padStart(2,'0')}`;
                        //Con esto transformamos el intervalo de tiempo


         }
         const handleCompletado=()=>{
                //Definimos la función para manejar el estado de cada uno de los ejercicios,cuando se completen,ya que cada vez que se registre una sesión en el historial,tenemos que actualizar las gamificaciones,por lo tanto,es importante probarlo en la pantalla de inicio,para ver si se actualizan correctamente
                setSesionesCompletadas(prev=>prev+1);
                //Cada vez que se complete un ejercicio,se incrementará el estado de sesiones completadas,que después lo utilizaremos para mostrar el progreso del usuario,ya que cada vez que se registre una sesión en el historial,tenemos que actualizar las gamificaciones,por lo tanto,es importante probarlo en la pantalla de inicio,para ver si se actualizan correctamente
                setEjercicioActual(prev=>prev+1);
                //Al completar el ejercicio actual (incluido su descanso),pasamos al siguiente índice,que es lo único que hace falta para desbloquear el próximo ejercicio,ya que solo renderizamos el ejercicio correspondiente a este índice
         }
         const handleSesiones=async()=>{
                //Vamos a registrar cada una de las sesiones que se completen
                try{
                       const res= await registrarSesionHistorial(rutinaId);
                        //Vamos a tener el cuenta las calorias quemadas por cada  ejercicio
                        //Vamos a tener en cuenta las calorias quemadas por cada ejercicio,que se calcula en el backend,teniendo en cuenta la categoria de cada ejercicio y la duración de cada ejercicio,ya que en el backend se tiene en cuenta categoria*minutos
                        console.log("Respuesta de registrar sesión en el historial:", res);
                                setCaloriasQuemadas(res.calorias);
                                setSesionesCompletadas(prev=>prev+1);
                                console.log("Calorías quemadas obtenidas de la respuesta de registrar sesión en el historial:", res.calorias);

                        

                }catch(error){
                        console.error("Error al registrar la sesión en el historial:",error);
                }
         }
         const getYoutubeId = (url) => {
  const match = url.match(/[?&]v=([^&]+)/);
  return match ? match[1] : null;
};
         
            const TopBar=()=>(
                <View style={styles.topBar}>
                        <TouchableOpacity style={styles.topBarButton} onPress={()=>navigation.goBack()} hitSlop={10}>
                                <Ionicons name="arrow-back" size={20} color={COLORS.textPrimary}/>
                        </TouchableOpacity>
                        <Text style={styles.topBarTitle}>Ejercicios</Text>
                        <TouchableOpacity style={styles.topBarButton} onPress={()=>showToast('Más opciones muy pronto','info')} hitSlop={10}>
                                <Ionicons name="ellipsis-vertical" size={20} color={COLORS.textPrimary}/>
                        </TouchableOpacity>
                </View>
            )
            if(loading){
                return(
                        <SafeAreaView style={styles.Container}>
                                <TopBar/>
                                <ActivityIndicator size="large" color={COLORS.primary} style={styles.ActivityIndicatorStyle}/>
                                <Footer/>
                        </SafeAreaView>
                )
            }
            else{
                const rutinaCompletada=ejercicios.length>0 && ejercicioActual>=ejercicios.length;
                return(
                        <SafeAreaView style={styles.Container}>
                                <TopBar/>
                                {ejercicios.length>0 && !rutinaCompletada && (
                                        <View style={styles.progressCard}>
                                                <View style={styles.progressHeaderRow}>
                                                        <View style={styles.progressIconCircle}>
                                                                <MaterialCommunityIcons name="boxing-glove" size={18} color={COLORS.primary}/>
                                                        </View>
                                                        <Text style={styles.progressTitle}>Progreso de la rutina</Text>
                                                        <Text style={styles.progressSubtitle}>{ejercicioActual + 1} de {ejercicios.length}</Text>
                                                </View>
                                                <View style={styles.progressBarsRow}>
                                                        {ejercicios.map((_,idx)=>{
                                                                const completado=idx<ejercicioActual;
                                                                const actual=idx===ejercicioActual;
                                                                return(
                                                                        <View
                                                                                key={idx}
                                                                                style={[
                                                                                        styles.progressSegment,
                                                                                        completado && styles.progressSegmentCompletado,
                                                                                        actual && styles.progressSegmentActual,
                                                                                ]}
                                                                        />
                                                                )
                                                        })}
                                                </View>
                                        </View>
                                )}
                                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                                        {ejercicios.length===0 ? (
                                                <Text style={styles.emptyText}>Esta rutina no tiene ejercicios.</Text>
                                        ) : rutinaCompletada ? (
                                                <View style={styles.completadoContainer}>
                                                        <Text style={styles.completadoTitulo}>¡Rutina completada! 🥊</Text>
                                                        <Text style={styles.completadoTexto}>Has terminado los {ejercicios.length} ejercicios en orden. Registra la sesión para guardar tu progreso.</Text>
                                                </View>
                                        ) : (
                                                <EjercicioCard key={ejercicios[ejercicioActual].id_rutina_ejercicio} item={ejercicios[ejercicioActual]} onCompletado={handleCompletado}/>
                                        )}
                                </ScrollView>
                                {sesionesCompletadas===ejercicios.length && ejercicios.length>0 && (
                                        <View style={styles.RegistrarContainer}>
                                                <Button title="Registrar sesión" onPress={handleSesiones} />
                                        </View>
                                )}
                                <Footer/>
                        </SafeAreaView>
                )

            }
}
const styles=StyleSheet.create({
        Container:{
                flex:1,
                backgroundColor:COLORS.background,
                 paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0

        },
        topBar:{
                flexDirection:'row',
                alignItems:'center',
                justifyContent:'space-between',
                paddingHorizontal:SPACING.lg,
                paddingVertical:SPACING.md,
        },
        topBarButton:{
                width:40,
                height:40,
                borderRadius:RADIUS.pill,
                backgroundColor:COLORS.surfaceElevated,
                alignItems:'center',
                justifyContent:'center',
                borderWidth:1,
                borderColor:COLORS.border,
        },
        topBarTitle:{
                fontSize:16,
                fontWeight:'800',
                color:COLORS.textPrimary,
                letterSpacing:0.5,
        },
        ActivityIndicatorStyle:{
                flex:1,
                justifyContent:'center',
                alignItems:'center',

        },
        scrollContent:{
                padding:SPACING.xl,
        },
        progressCard:{
                marginHorizontal:SPACING.xl,
                marginBottom:SPACING.md,
                backgroundColor:COLORS.surface,
                borderRadius:RADIUS.xl,
                padding:SPACING.md,
                borderWidth:1,
                borderColor:COLORS.border,
        },
        progressHeaderRow:{
                flexDirection:'row',
                alignItems:'center',
                gap:SPACING.sm,
                marginBottom:SPACING.md,
        },
        progressIconCircle:{
                width:38,
                height:38,
                borderRadius:RADIUS.pill,
                backgroundColor:'rgba(255,34,51,0.15)',
                alignItems:'center',
                justifyContent:'center',
        },
        progressTitle:{
                flex:1,
                fontSize:14,
                fontWeight:'800',
                color:COLORS.textPrimary,
                letterSpacing:0.2,
        },
        progressSubtitle:{
                fontSize:12,
                fontWeight:'600',
                color:COLORS.textSecondary,
        },
        progressBarsRow:{
                flexDirection:'row',
                alignItems:'center',
                gap:4,
        },
        progressSegment:{
                flex:1,
                height:26,
                borderRadius:RADIUS.pill,
                backgroundColor:COLORS.surfaceElevated,
        },
        progressSegmentCompletado:{
                backgroundColor:COLORS.primary,
                ...shadow(COLORS.primaryGlow,0.6,6,3,{width:0,height:0}),
        },
        progressSegmentActual:{
                backgroundColor:'transparent',
                borderWidth:2,
                borderColor:COLORS.primary,
        },
        emptyText:{
                color:COLORS.textMuted,
                textAlign:'center',
                marginTop:SPACING.xl,
                fontSize:14,
        },
        completadoContainer:{
                alignItems:'center',
                paddingVertical:SPACING.xxl,
                paddingHorizontal:SPACING.lg,
        },
        completadoTitulo:{
                fontSize:22,
                fontWeight:'800',
                color:COLORS.primary,
                marginBottom:SPACING.sm,
                textAlign:'center',
        },
        completadoTexto:{
                fontSize:14,
                color:COLORS.textSecondary,
                textAlign:'center',
                lineHeight:20,
        },
        RegistrarContainer:{
                paddingHorizontal:SPACING.xl,
                paddingBottom:SPACING.lg,
        },
})
export default Ejercicios;
