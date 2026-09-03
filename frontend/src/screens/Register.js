import react from 'react';
import {View,Text,TouchableOpacity,StyleSheet,ActivityIndicator,KeyboardAvoidingView} from 'react-native';

import {useState,useEffect} from 'react';
import {registerUser,googleAuth} from '../services/services';
import Button from '../components/Button';
import TextInputComponent from '../components/TextInput';
import {useNavigation} from '@react-navigation/native';
import {Ionicons} from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ErrorMsg from '../components/ErrorMsg';
import { COLORS, RADIUS, SPACING, shadow } from '../theme';
import useGoogleAuth from '../hooks/useGoogleAuth';




//Traemos el servicio para poder registrar el usuario desde el frontend,que es la función que hemos creado en services.js,que se encarga de hacer la petición a la API para registrar el usuario en la base de datos

export default function Register({}){
         const [nombre,setNombre]=useState('');
         
            const [email,setEmail]=useState('');
            const [password,setPassword]=useState('');
            const [confirmPassword,setConfirmPassword]=useState('');
            const [message,setMessage]=useState('');
            const [laoding,setLoading]=useState(false);
            const [googleLoading,setGoogleLoading]=useState(false);
            const navigation=useNavigation();
            const handleGoogleIdToken=async(idToken,error)=>{
                if(error || !idToken){
                     setMessage('No se ha podido registrar con Google');
                     return;
                }
                try{
                     setGoogleLoading(true);
                     await googleAuth(idToken);
                     setMessage('');
                     alert('Registro con Google exitoso');
                     navigation.navigate('home');
                }catch(error){
                     setMessage(`Error al registrar con Google: ${error.message}`);
                }finally{
                     setGoogleLoading(false);
                }
            }
            const {request:googleRequest,promptAsync:promptGoogleAsync}=useGoogleAuth(handleGoogleIdToken);

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
                    <ActivityIndicator size="large" color={COLORS.primary}/>
                </View>
            )


         }
         //Vamos a implemenatar la lógica para navegar a la pantalla de login
          const handleToLogin=()=>{
                navigation.navigate('login');
          }
          const handleClick=async()=>{
              if(!nombre  || !email || !password || !confirmPassword){
                   setMessage('Por favor,complete todos los campos');
                   
              }
              else if(password!==confirmPassword){
                   setMessage('Las contraseñas no coinciden');
              }
               try{
                 
                    await registerUser(nombre,email,password,'user');
                    setNombre('');
                    
                    setEmail('');
                    setPassword('');
                    setConfirmPassword('');
                    setMessage('');
                      alert('Registro exitoso,ahora puedes iniciar sesión');
                      navigation.navigate('home');
                      
              
               }catch(error){
                    setMessage(`Error al registrar el usuario: ${error.message}`);
               }

          }
          
        

            return(
                <View style={styles.Container}>
                    <View style={styles.FlexView}>
                        <Text style={styles.TitleStyle}>GoFight</Text>
                        

                    </View>
                    
                       

                    <KeyboardAvoidingView style={styles.FormStyle}>
                      <Text style={styles.RegistrarseText}>Registrarse</Text>
                        <TextInputComponent placeholder="Nombre" value={nombre} onChangeText={setNombre} iconName="person-outline"/>
                        <TextInputComponent placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" iconName="mail-outline"/>
                        <TextInputComponent placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry iconName="lock-closed-outline"/>
                        <TextInputComponent placeholder="Confirmar Contraseña" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry iconName="lock-closed-outline"/>
                        <Button title="Registrar" onPress={handleClick}/>
                        <Button title="Continuar con Google" variant="secondary" disabled={!googleRequest || googleLoading} onPress={()=>promptGoogleAsync()}/>
                        <TouchableOpacity onPress={handleToLogin}>
                            <Text style={styles.LinkStyle}>¿Ya tienes una cuenta?<Text style={styles.IniciarSesionText}>Iniciar Sesión</Text></Text>
                        </TouchableOpacity>
                       <View>
                        {message ? <ErrorMsg message={message}/> : null}
                        </View>

                    </KeyboardAvoidingView>
                </View>
            )
}


const styles=StyleSheet.create({
    //Vamos a definir los estilos para la pantalla de registro
      Container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        padding:SPACING.xl,
        backgroundColor:COLORS.background,
      },
      LoadingContainer:{
         flex:1,
         justifyContent:'center',
         alignItems:'center',
         backgroundColor:COLORS.background,
      },
      FlexView:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
      },
      RegistrarseText:{
        fontSize:20,
        fontWeight:'700',
        marginBottom:SPACING.xl,
        color:COLORS.primary,
        paddingTop:SPACING.xl,
        textAlign:'center',
        textShadowColor:'rgba(255, 34, 51,0.5)',
        },
      TitleStyle:{
        fontSize:26,
        fontWeight:'800',
        color:COLORS.primary,
        marginBottom:SPACING.xl,
        marginTop:SPACING.xl,
        textAlign:'center',
          textShadowColor:COLORS.primary,
          textShadowOffset:{width:1,height:1},
          textShadowRadius:6,
          textTransform:'uppercase',
          letterSpacing:3,
      },
      FormStyle:{
        width:'100%',
        marginBottom:SPACING.xl,
        padding:24,
        borderRadius:RADIUS.xl,
        backgroundColor:COLORS.surfaceAlt,
        borderColor:'rgba(255, 34, 51,0.25)',
        borderWidth:1,
        ...shadow(COLORS.primary,0.5,10,5,{width:0,height:4}),
      },
      Mensajes:{
        color:COLORS.danger,
        marginBottom:SPACING.md,
        textAlign:'center',
        borderColor:COLORS.danger,
        borderWidth:1,
        padding:SPACING.md,
        borderRadius:RADIUS.sm,
      },
      LinkStyle:{
       fontSize:14,
        color:COLORS.textSecondary,
        alignItems:'center',
        justifyContent:'center',
        textAlign:'center',
        marginTop:SPACING.xl,

      },
      IniciarSesionText:{
        color:COLORS.info,
        fontWeight:'bold',
        textDecorationLine:'underline',

      }

})
