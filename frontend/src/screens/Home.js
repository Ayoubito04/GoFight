//Aquí vamos a implementar la pantalla de incio
//Vamos a implementar cada uno de los componentes que vamos a utilizar en la pantalla de inicio
import React from 'react';
import {View,Text,StyleSheet,ActivityIndicator, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context'
import {useState,useEffect} from 'react';
import Button from '../components/Button';
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
import { useRef } from 'react';
import { COLORS, RADIUS, SPACING, shadow } from '../theme';
//Para eso importamos el servicio para obtener usuarios,ya que necsitamos obtener el rol del usuario,que nos tendría que dar acceso a ese panel




const Home=()=>{
   //Vamnos a usar un useRef para la lógica interna de la actualización de las gamificaciones,ya que no queremos que se ejecute varias veces,ya que cada vez que se registre una sesión en el historial,tenemos que actualizar las gamificaciones,por lo tanto,es importante probarlo en la pantalla de inicio,para ver si se actualizan correctamente
    const isUpdateGamificacionesRunning = useRef(false);
    const navigation = useNavigation();
    //Vamos a implementar la pantalla de inicio,que va a ser básica y muy snecilla
     const [loading,setLoading]=useState(true);
     const [gamificaciones,setGamificaciones]=useState(null);//Traemos las gamificaciones
     const [caloriasQuemadas,setCaloriasQuemadas]=useState(0);
     //Definimos el estado del administrador,que va a ser booleano 
     const [isAdmin,setIsAdmin]=useState(false);
     
     let actualizarGamificacionesEjecutada=false;//Definimos una variable para controlar si la función de actualizar gamificaciones se ha ejecutado,para evitar que se ejecute varias veces,ya que cada vez que se registre una sesión en el historial,tenemos que actualizar las gamificaciones,por lo tanto,es importante probarlo en la pantalla de inicio,para ver si se actualizan correctamente
   useEffect(() => {
    const InicializarHome = async () => {
        // Bloqueo por referencia para evitar doble ejecución al montar
        if (isUpdateGamificacionesRunning.current) return;
        isUpdateGamificacionesRunning.current = true;

        try {
            // 1. Cargamos el perfil (para el rol de admin)
            const perfil = await getUserProfile();
            if (perfil) {
                setIsAdmin(perfil.perfilUsuario?.rol === 'admin');
            }
          

            // 2. Traemos los datos de lectura (Práctico y seguro)
            // Usamos Promise.all para que las dos peticiones se hagan a la vez y sea más rápido
            const [gamificacionesObtenidas, calHoy] = await Promise.all([
                getGamificaciones(),
                getTotalCaloriasQuemadas()
            ]);

            // 3. Seteamos los estados con datos reales de la DB
            setGamificaciones(gamificacionesObtenidas);
            setCaloriasQuemadas(calHoy || 0);

        } catch (error) {
            console.log('Error al cargar datos del Home:', error);
        } finally {
            setLoading(false);
            // IMPORTANTE: No reinicies el flag aquí si quieres que solo 
            // ocurra una vez por sesión de carga del componente.
        }
    };

    InicializarHome();
}, []);

     if(loading){
         return(
               <View style={style.ActivityIndicatorStyle}>
                    <ActivityIndicator size="large" color={COLORS.primary}/>
               </View>
         )
     }
     else{
          return(
               <SafeAreaView style={style.Container}>
                      <Header/>
                      <ScrollView contentContainerStyle={style.ScrollContent}>
                          <View style={style.HeroCard}>
                              <View style={style.HeroAccent}/>
                              <Text style={style.HeroEyebrow}>ENTRENAMIENTO DE HOY</Text>
                              <Text style={style.HeroTitle}>Prepárate para{`\n`}el siguiente round.</Text>
                              <Text style={style.HeroText}>El progreso se gana un asalto a la vez.</Text>
                              <Button title="Explorar rutinas" onPress={()=>navigation.navigate('Rutinas')} style={style.HeroButton}/>
                          </View>
                          <View style={style.SectionHeader}>
                              <Text style={style.SectionTitle}>Tu progreso</Text>
                              <Text style={style.SectionCaption}>ESTA SEMANA</Text>
                          </View>
                          <StackContainer datos={gamificaciones}/>
                              <BarraProgreso actual={caloriasQuemadas} objetivo={300} unidad="kcal"

                              />
                              {
                                   isAdmin && (
                                        <View style={style.AdminButtonContainer}>
                                             <Button title="Panel de administración" variant="secondary" onPress={()=>navigation.navigate('GestorUsuariosAdmin')}/>
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
          backgroundColor:COLORS.background,
     },
     Container:{
          flex:1,
          justifyContent:'space-between',
          backgroundColor:COLORS.background,
     },
     ScrollContent:{
          paddingBottom:SPACING.xxl,
     },
     HeroCard:{
          marginHorizontal:SPACING.lg,
          marginTop:SPACING.md,
          padding:SPACING.xl,
          borderRadius:RADIUS.xl,
          overflow:'hidden',
          backgroundColor:COLORS.surfaceElevated,
          borderWidth:1,
          borderColor:'rgba(255,34,51,0.34)',
          ...shadow(COLORS.primaryGlow,0.3,18,8,{width:0,height:6}),
     },
     HeroAccent:{
          position:'absolute',
          width:180,
          height:180,
          borderRadius:90,
          backgroundColor:'rgba(255,34,51,0.14)',
          right:-68,
          top:-74,
     },
     HeroEyebrow:{
          color:COLORS.primary,
          fontSize:10,
          letterSpacing:1.6,
          fontWeight:'800',
          marginBottom:SPACING.sm,
     },
     HeroTitle:{
          color:COLORS.textPrimary,
          fontSize:27,
          lineHeight:32,
          fontWeight:'900',
          letterSpacing:-0.5,
     },
     HeroText:{
          color:COLORS.textSecondary,
          marginTop:SPACING.sm,
          marginBottom:SPACING.lg,
          fontSize:14,
     },
     HeroButton:{
          alignSelf:'flex-start',
          minWidth:190,
     },
     SectionHeader:{
          flexDirection:'row',
          alignItems:'center',
          justifyContent:'space-between',
          paddingHorizontal:SPACING.lg,
          marginTop:SPACING.xxl,
          marginBottom:SPACING.xs,
     },
     SectionTitle:{
          color:COLORS.textPrimary,
          fontSize:20,
          fontWeight:'800',
     },
     SectionCaption:{
          color:COLORS.textMuted,
          fontSize:10,
          letterSpacing:1.4,
          fontWeight:'800',
     },
     AdminButtonContainer:{
          marginTop:SPACING.xl,
          paddingHorizontal:SPACING.lg,
          alignItems:'center',
     },
})
export default Home;
