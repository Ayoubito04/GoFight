//Aquí vamos a simular la carga de cada una de las rutinas,para mostrar la pantalla de carga,antes de mostrar la pantalla de rutinas,ya que cada vez que se registre una sesión en el historial,tenemos que actualizar las gamificaciones,por lo tanto,es importante probarlo en la pantalla de inicio,para ver si se actualizan correctamente
import React,{useState,useEffect} from 'react';
import {View,Text,StyleSheet,ActivityIndicator,SafeAreaView,Platform,StatusBar,FlatList,TextInput} from 'react-native';
import Header from '../components/HeaderComponent';
import Footer from '../components/Footer';
import { getRutinasDisponibles } from '../services/services';

const Rutinas=()=>{
        const [loading,setLoading]=useState(true);
        const [rutinas,setRutinas]=useState([]);
        useEffect(()=>{
                setTimeout(async ()=>{
                     try{
                           
                        //Vamos a cargar las rutinas disponibles,para mostrar la pantalla de carga,antes de mostrar la pantalla de rutinas,ya que cada vez que se registre una sesión en el historial,tenemos que actualizar las gamificaciones,por lo tanto,es importante probarlo en la pantalla de inicio,para ver si se actualizan correctamente
                         const res= await getRutinasDisponibles()
                            
                        //Una vez que hayamos cargado las rutinas,utilizamos una función seteadora
                        if(res && res.rutinas){
                                setRutinas(res.rutinas);
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
                },2000);
        },[]);
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
                                <TextInput
                                        style={styles.TextInput}
                                        placeholder="Buscar rutina..."
                                        placeholderTextColor="#888"
                                        
                                />

                                 <FlatList
                                       data={rutinas}
                                       contentContainerStyle={styles.flatListContent}
                                       horizontal={false}
                                       showsVerticalScrollIndicator={false}
                                       
                                       justifyContent='center'
                                      
                                       
                                       keyExtractor={item => item.id_rutina.toString()}
                                            renderItem={({item})=>(
                                                <View style={styles.itemContainer}>
                                                        <Text style={styles.TextStyle}>{item.nombre_rutina}</Text>
                                                        <Text style={{color:'#888',marginTop:5}}>{item.dificultad}</Text>
                                                        
                                                </View>
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
        paddingBottom: 10, // Espacio extra para que el Footer no tape nada
        justifyContent: 'center',
        bottom: 0,
       
        marginTop:170,
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


    
    borderLeftWidth: 5,
    borderLeftColor: '#ff0000', 
    
   
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    
    
    elevation: 8,
    alignSelf:'stretch'
},
TextInput:{
        backgroundColor:'#1e1e1e',
        borderRadius:10,
        borderColor:'#372f2f',
        borderWidth:1,
        color:'#ffffff',
        paddingHorizontal:15,
        paddingVertical:10,
        borderRadius:10,
        marginHorizontal:20,
        marginBottom:10,

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

        }
})
export default Rutinas;
