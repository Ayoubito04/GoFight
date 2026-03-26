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
                          const nombreMatch=rutina.nombre_rutina.toLowerCase().includes(text.toLowerCase());
                          const dificultadMatch=rutina.dificultad.toLowerCase().includes(text.toLowerCase());
                          return nombreMatch || dificultadMatch;
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
                               
                                <ActivityIndicator size="large" color="#ff0000"/>
                       
                        </View>
                )

        }
        else{
                return(
                        <SafeAreaView style={styles.Container}>
                                <Header/>
                                <TextInputComponent placeholder="Buscar rutina para..." value={searchRutina} onChangeText={handleSearch} iconName="search"
                                />
                                
                                 <FlatList
                                       data={rutinasfiltradas}
                                       contentContainerStyle={styles.flatListContent}
                                       horizontal={false}
                                       showsVerticalScrollIndicator={false}
                                       
                                       justifyContent='center'
                                       
                                       
                                       keyExtractor={item => item.id_rutina.toString()}
                                            renderItem={({item})=>(
                                                <TouchableOpacity style={styles.itemContainer
                                                        
                                                }onPress={()=>handleEjercicio(item.id_rutina)}>
                                                        <Text style={styles.TextStyle}>{item.nombre_rutina}</Text>
                                                        <Text style={[
                                                                        item.dificultad === 'Fácil' ? {color:'#00ff00',
                                                                                borderColor:'#384f38',
                                                                                borderWidth:2,
                                                                                borderRadius:10,
                                                                                paddingHorizontal:5,
                                                                                paddingVertical:2,
                                                                                width:'20%',
                                                                                shadowColor:'#112b11',
                                                                                shadowOffset:{width:0,height:2},
                                                                                shadowOpacity:0.5,
                                                                                shadowRadius:4,
                                                                                elevation:5,
                                                                                textAlign:'center',
                                                                                alignSelf:'flex-start'
                                                                        } :
                                                                item.dificultad === 'Intermedio' ? {color:'#ffff00',
                                                                         borderColor:'#363609',
                                                                                borderWidth:2,
                                                                                borderRadius:10,
                                                                                paddingHorizontal:5,
                                                                                paddingVertical:2,
                                                                                width:'30%',
                                                                                shadowColor:'#363609',
                                                                                shadowOffset:{width:0,height:2},
                                                                                shadowOpacity:0.5,
                                                                                shadowRadius:4,
                                                                                elevation:5,
                                                                                textAlign:'center',
                                                                                alignSelf:'flex-start'
                                                                } :
                                                                item.dificultad === 'Avanzado' ? {color:'#ff0000',
                                                                         borderColor:'#511313',
                                                                                borderWidth:2,
                                                                                borderRadius:10,
                                                                                paddingHorizontal:5,
                                                                                paddingVertical:2,
                                                                                width:'30%',
                                                                                shadowColor:'#4d0d0d',
                                                                                shadowOffset:{width:0,height:2},
                                                                                shadowOpacity:0.5,
                                                                                shadowRadius:4,
                                                                                elevation:5,
                                                                                textAlign:'center',
                                                                                alignSelf:'flex-start'
                                                                } :
                                                                {color:'#ffffff'}
                                                        ]}onChangeText={handleSearch}>{item.dificultad}</Text>
                                               <Ionicons name="play" size={20} color="#ffffff" style={{position:'absolute',top:10,right:10}}/>
                                                </TouchableOpacity>
                                            )}
                                 
                              />

                                <Footer/>
                        </SafeAreaView>
                )
        }
}
const styles=StyleSheet.create({
        Container:{
                flex:1,
                backgroundColor:'#000000',
                paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
                

        },
        flatListContent: {
        paddingVertical: 2,
        // Espacio extra para que el Footer no tape nada
        justifyContent: 'center',
        bottom: 0,
        paddingTop: 100,

       
        
        overflow:'scroll'


    },
       itemContainer: {
    backgroundColor: '#1e1e1e', 
    padding: 20,
    marginVertical: 8,         
    marginHorizontal: 20,      
    borderRadius: 15,           
    width: '90%',               
    paddingHorizontal: 25,
    paddingVertical: 15,
    overflow: 'hidden',
    borderLeftColor: '#ff0000',

    
    borderLeftWidth: 5,

    
   
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    
    
    elevation: 8,
    alignSelf:'stretch'
},


        ActivityIndicatorStyle:{
                flex:1,
                justifyContent:'center',
                alignItems:'center',
                backgroundColor:'#000000'
        },
        TextStyle:{
                fontSize:20,
                fontWeight:'bold',
                textAlign:'center',
                marginTop:20,
                color:'#ffffff',

        },

})
export default Rutinas;
