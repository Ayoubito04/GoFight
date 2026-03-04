import react from 'react';
import {View,Text,TextInput,TouchableOpacity,StyleSheet,ScrolView, ScrollView,ActivityIndicator} from 'react-native';

import {useState,useEffect} from 'react';
import {registerUser} from '../services/services';
import Button from '../components/Button';
import TextInputComponent from '../components/TextInput';
import {useNavigation} from '@react-navigation/native';
import {Ionicons} from '@expo/vector-icons';
import ErrorMsg from '../components/ErrorMsg';

//Traemos el servicio para poder registrar el usuario desde el frontend,que es la función que hemos creado en services.js,que se encarga de hacer la petición a la API para registrar el usuario en la base de datos

export default function Register({}){
         const [nombre,setNombre]=useState('');
         
            const [email,setEmail]=useState('');
            const [password,setPassword]=useState('');
            const [confirmPassword,setConfirmPassword]=useState('');
            const [message,setMessage]=useState('');
            const [laoding,setLoading]=useState(false);

            //Tenemos los hooks necesarios para manejar el esatdo de los campos formularios
           //Antes de empezar con la lógica de los hooks,vamos a poner una pantalla de carga
           //Vamos a simular una pantalla de carga durante 2-3 segundos
        //Empezamos metiendo un UseEffect para simular la pantalla de carga
        useEffect(()=>{
            setLoading(true);
            setTimeout(()=>{
                //Simulamos una carga de 2-3 segundos
                setLoading(false);
                //Indicamos que la carga ha termiando,para que se muestre la pantalla de registro
            },2000);
        },[]);
         if(laoding){
            return(
                <View style={styles.LoadingContainer}>
                    <ActivityIndicator size="large" color="#ff0000"/>
                </View>
            )


         }
          const handleClick=async()=>{
              if(!nombre  || !email || !password || !confirmPassword){
                   setMessage('Por favor,complete todos los campos');
                   
              }
              else if(password!==confirmPassword){
                   setMessage('Las contraseñas no coinciden');
              }
                else{
                    await registerUser(nombre,email,password,'user');
                    setNombre('');
                    
                    setEmail('');
                    setPassword('');
                    setConfirmPassword('');
                    setMessage('');
                }

          }
          const navigation=useNavigation();
          //Vamos a implemenatar la lógica para navegar a la pantalla de login
          const handleToLogin=()=>{
                navigation.navigate('login');
          }

            return(
                <View style={styles.Container}>
                    <View style={styles.FlexView}>
                        <Text style={styles.TitleStyle}>GoFight</Text>
                        <Ionicons name="hand-left-outline" size={20} color="red" style={styles.IconStyle}/>

                    </View>
                    <View>
                         <Text style={styles.RegistrarseText}>Registrarse</Text>
                    </View>
                        {message ? <ErrorMsg message={message}/> : null}

                    <ScrollView style={styles.FormStyle}>
                        <TextInputComponent placeholder="Nombre" value={nombre} onChangeText={setNombre} iconName="person-outline"/>
                        <TextInputComponent placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" iconName="mail-outline"/>
                        <TextInputComponent placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry iconName="lock-closed-outline"/>
                        <TextInputComponent placeholder="Confirmar Contraseña" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry iconName="lock-closed-outline"/>
                        <Button title="Registrar" onPress={handleClick}/>
                        <TouchableOpacity onPress={handleToLogin}>
                            <Text style={styles.LinkStyle}>¿Ya tienes una cuenta? Inicia sesión</Text>
                        </TouchableOpacity>
                       
                    </ScrollView>
                </View>
            )
}


const styles=StyleSheet.create({
    //Vamos a definir los estilos para la pantalla de registro
      Container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        padding:20,
        backgroundColor:'black',
        
        
      },
      LoadingContainer:{
         flex:1,
         justifyContent:'center',
         alignItems:'center',
         backgroundColor:'black',
      },
      IconStyle:{
        marginLeft:10,
        marginTop:10,
        color:'red',
      },
      FlexView:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
      },
      RegistrarseText:{
        fontSize:20,
        fontWeight:'bold',
        marginBottom:20,
        color:'white',
        paddingTop:20,
        },
      TitleStyle:{
        fontSize:24,
        fontWeight:'bold',
        marginBottom:20,
        marginTop:20,
        margin:0,
        alignContent:'center',
        textAlign:'center',
        color:'red',
        fontFamily:'Arial',
        



      },
      ViewStyle:{
        width:'100%',
        marginBottom:20,
        padding:20,
        borderRadius:10,
        backgroundColor:'transparent',
        borderColor:'red',


        
      },
      FormStyle:{
        width:'100%',
        marginBottom:20,
        padding:20,
        borderRadius:10,
        backgroundColor:'transparent',
        borderColor:'red',
        borderWidth:1,
        boxShadow:'5px 20px 15px rgba(255,0,0,0.2)',
        shadowColor:'red',



      },

      TextInput:{
        width:'100%',
        height:40,
        borderColor:'gray',
        borderWidth:1,
        marginBottom:10,
        borderRadius:5,
        paddingHorizontal:10,


      },
      ButtonStyle:{
        width:'100%',
        height:40,
        backgroundColor:'#007bff',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:5,
      },
      Mensajes:{
        color:'red',
        marginBottom:10,
        textAlign:'center',
        borderColor:'red',
        borderWidth:1,
        padding:10,
        borderRadius:5,
        top:10,
        
      },
      LinkStyle:{
        color:'#007bff',
        textAlign:'center',
        marginTop:10,
      }
})