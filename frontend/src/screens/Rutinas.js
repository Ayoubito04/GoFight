//Aquí vamos a simular la carga de cada una de las rutinas,para mostrar la pantalla de carga,antes de mostrar la pantalla de rutinas,ya que cada vez que se registre una sesión en el historial,tenemos que actualizar las gamificaciones,por lo tanto,es importante probarlo en la pantalla de inicio,para ver si se actualizan correctamente
import React,{useState,useEffect} from 'react';
import {View,Text,StyleSheet,ActivityIndicator,SafeAreaView,Platform,StatusBar,FlatList,TextInput,TouchableOpacity} from 'react-native';
import Header from '../components/HeaderComponent';
import Footer from '../components/Footer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getRutinasDisponibles } from '../services/services';
import Button from '../components/Button';
import TextInputComponent from '../components/TextInput';
import { useNavigation } from '@react-navigation/native';
import { COLORS, RADIUS, SPACING, difficultyColor, shadow } from '../theme';


const Rutinas=()=>{
        //Vamos a crear una función para poder encontrar las rutinas por su nombre y dificulatd
        //También queremos filtrar las rutinas,usamos selectores para obtener las rutinas del estado global,para mostrar la pantalla de carga,antes de mostrar la pantalla de rutinas,ya que cada vez que se registre una sesión en el historial,tenemos que actualizar las gamificaciones,por lo tanto,es importante probarlo en la pantalla de inicio,para ver si se actualizan correctamente
        //Una que ya tengamos las rutinas creadas y la función de busqueda implementada,ahora vamos a acceder a una rutina especifica,esa rutina nos mostrara los ejercicios que contiene ,para ir empezzandolos,el usuario tendra que darle al card o al icono patra emepzar rutina
        const [loading,setLoading]=useState(true);
        const [rutinas,setRutinas]=useState([]);
        const [rutinasfiltradas,setRutinasFiltradas]=useState([]);

        const [searchRutina,setSearchRutina]=useState('');
        //Vamos a usar un hook de efecto para poder encontrar las rutinas por su nombre y dificulatd,para mostrar la pantalla de carga,antes de mostrar la pantalla de rutinas,ya que cada vez que se registre una sesión en el historial,tenemos que actualizar las gamificaciones,por lo tanto,es importante probarlo en la pantalla de inicio,para ver si se actualizan correctamente
        useEffect(()=>{
                setTimeout(async ()=>{
                     try{
                           
                        //Vamos a cargar las rutinas disponibles,para mostrar la pantalla de carga,antes de mostrar la pantalla de rutinas,ya que cada vez que se registre una sesión en el historial,tenemos que actualizar las gamificaciones,por lo tanto,es importante probarlo en la pantalla de inicio,para ver si se actualizan correctamente
                         const res= await getRutinasDisponibles()
                            
                        //Una vez que hayamos cargado las rutinas,utilizamos una función seteadora
                        if(res && res.rutinas){
                                setRutinas(res.rutinas);
                                        setRutinasFiltradas(res.rutinas);
                        }
                        //Imrpimimos las rutinas por consola para verificar que se están obteniendo correctamente,ya que cada vez que se registre una sesión en el historial,tenemos que actualizar las gamificaciones,por lo tanto,es importante probarlo en la pantalla de inicio,para ver si se actualizan correctamente
                        console.log('Rutinas disponibles:',rutinas);
                        //Para poder enderizar las rutinas,usamos unn FlatList
                     }catch(error){
                        console.log('Error al cargar las rutinas:',error);
                     }
                     finally{
                        setLoading(false);
                     }
                },1000);
        },[]);
         const handleSearch=(text)=>{
                setSearchRutina(text);
                //Aquí vamos a filtrar las rutinas por su nombre y dificultad,para mostrar la pantalla de carga,antes de mostrar la pantalla de rutinas,ya que cada vez que se registre una sesión en el historial,tenemos que actualizar las gamificaciones,por lo tanto,es importante probarlo en la pantalla de inicio,para ver si se actualizan correctamente
                const filtrarRutinas=rutinas.filter(rutina=>{
        const nombre = (rutina.nombre_rutina || "").toLowerCase();
        const dificultad = (rutina.dificultad || "").toLowerCase();
        const busqueda = text.toLowerCase();

        return nombre.includes(busqueda) || dificultad.includes(busqueda);
                });
                setRutinasFiltradas(filtrarRutinas);
        };
        const navigation=useNavigation();
        const handleEjercicio=(rutinaId)=>{
                navigation.navigate('Ejercicios',{rutinaId});
        }
        if(loading){
                return(
                        <View style={styles.ActivityIndicatorStyle}>
                                <ActivityIndicator size="large" color={COLORS.primary}/>
                        </View>
                )

        }
        else{
                return(
                        <SafeAreaView style={styles.Container}>
                                <Header/>
                                <View style={styles.SearchContainer}>
                                        <TextInputComponent placeholder="Buscar rutina..." value={searchRutina} onChangeText={handleSearch} iconName="search"
                                        />
                                </View>

                                 <FlatList
                                       data={rutinasfiltradas}
                                       contentContainerStyle={styles.flatListContent}
                                       horizontal={false}
                                       showsVerticalScrollIndicator={false}
                                       keyExtractor={item => item.id_rutina.toString()}
                                            renderItem={({item})=>{
                                                const color=difficultyColor(item.dificultad);
                                                return(
                                                <TouchableOpacity style={styles.itemContainer} activeOpacity={0.75} onPress={()=>handleEjercicio(item.id_rutina)}>
                                                        <Text style={styles.TextStyle}>{item.nombre_rutina}</Text>
                                                        <Text style={[styles.dificultadTag,{color,borderColor:color}]}>{item.dificultad}</Text>
                                               <Ionicons name="play-circle" size={26} color={COLORS.primary} style={styles.playIcon}/>
                                                </TouchableOpacity>
                                                )
                                            }}

                              />

                                <Footer/>
                        </SafeAreaView>
                )
        }
}
const styles=StyleSheet.create({
        Container:{
               flex: 1,
               backgroundColor: COLORS.background,
               paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
        },
        SearchContainer:{
                paddingHorizontal: SPACING.lg,
                paddingTop: SPACING.md,
        },
        flatListContent: {
                paddingHorizontal: SPACING.lg,
                paddingTop: SPACING.sm,
                paddingBottom: SPACING.xl,
        },
       itemContainer: {
                backgroundColor: COLORS.surface,
                padding: SPACING.xl,
                marginVertical: SPACING.sm,
                borderRadius: RADIUS.lg,
                width: '100%',
                borderLeftColor: COLORS.primary,
                borderLeftWidth: 5,
                ...shadow('#000',0.3,5,10,{width:0,height:4}),
                position: 'relative',
        },
        dificultadTag:{
                marginTop: SPACING.sm,
                borderWidth: 1,
                borderRadius: RADIUS.sm,
                paddingHorizontal: SPACING.sm,
                paddingVertical: 3,
                fontSize: 11,
                fontWeight: '700',
                letterSpacing: 1,
                textTransform: 'uppercase',
                alignSelf: 'flex-start',
        },
        playIcon:{
                position:'absolute',
                top:SPACING.lg,
                right:SPACING.lg,
        },
        ActivityIndicatorStyle:{
                flex:1,
                justifyContent:'center',
                alignItems:'center',
                backgroundColor:COLORS.background,
        },
        TextStyle:{
                fontSize:17,
                fontWeight:'700',
                color:COLORS.textPrimary,
        },

})
export default Rutinas;
