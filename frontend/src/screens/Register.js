import React from 'react';
import {View,Text,TouchableOpacity,StyleSheet,ActivityIndicator,KeyboardAvoidingView,Image,Platform,ScrollView} from 'react-native';

import {useState,useEffect} from 'react';
import {registerUser} from '../services/services';
import Button from '../components/Button';
import TextInputComponent from '../components/TextInput';
import {useNavigation} from '@react-navigation/native';
import {Ionicons} from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ErrorMsg from '../components/ErrorMsg';
import { COLORS, RADIUS, SPACING, shadow } from '../theme';




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
                    <ActivityIndicator size="large" color={COLORS.primary}/>
                </View>
            )


         }
         const navigation=useNavigation();
          //Vamos a implemenatar la lógica para navegar a la pantalla de login
          const handleToLogin=()=>{
                navigation.navigate('login');
          }
          const handleClick=async()=>{
              if(!nombre  || !email || !password || !confirmPassword){
                   setMessage('Por favor,complete todos los campos');
                   return;
              }
              else if(password!==confirmPassword){
                   setMessage('Las contraseñas no coinciden');
                   return;
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
                <KeyboardAvoidingView style={styles.Container} behavior={Platform.OS==='ios' ? 'padding' : undefined}>
                    <View style={styles.BackgroundGlow}/>
                    <ScrollView contentContainerStyle={styles.ScrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                    <View style={styles.FlexView}>
                        <Image
                            source={require('../../assets/GF Boxing Pulse Logo.png')}
                            style={styles.LogoImage}
                            resizeMode="contain"
                        />
                        <Text style={styles.Eyebrow}>TU PRÓXIMO ROUND EMPIEZA AQUÍ</Text>
                        <Text style={styles.WelcomeTitle}>Únete a GoFight</Text>
                        <Text style={styles.WelcomeText}>Crea tu cuenta y empieza a entrenar a tu ritmo.</Text>
                    </View>
                    
                       

                    <View style={styles.FormStyle}>
                      <Text style={styles.RegistrarseText}>Registrarse</Text>
                      <Text style={styles.FormSubtitle}>Completa tus datos para crear tu perfil.</Text>
                        <TextInputComponent placeholder="Nombre" value={nombre} onChangeText={setNombre} iconName="person-outline"/>
                        <TextInputComponent placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" iconName="mail-outline"/>
                        <TextInputComponent placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry iconName="lock-closed-outline"/>
                        <TextInputComponent placeholder="Confirmar Contraseña" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry iconName="lock-closed-outline"/>
                        <Button title="Registrar" onPress={handleClick}/>
                        <TouchableOpacity onPress={handleToLogin}>
                            <Text style={styles.LinkStyle}>¿Ya tienes una cuenta? <Text style={styles.IniciarSesionText}>Iniciar sesión</Text></Text>
                        </TouchableOpacity>
                       <View>
                        {message ? <ErrorMsg message={message}/> : null}
                        </View>

                    </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            )
}


const styles=StyleSheet.create({
    //Vamos a definir los estilos para la pantalla de registro
      Container:{
        flex:1,
        backgroundColor:COLORS.background,
      },
      ScrollContent:{
        flexGrow:1,
        justifyContent:'center',
        padding:SPACING.xl,
        zIndex:1,
      },
      BackgroundGlow:{
        position:'absolute',
        width:330,
        height:330,
        borderRadius:165,
        backgroundColor:'rgba(255,34,51,0.11)',
        top:-145,
        left:-95,
      },
      LoadingContainer:{
         flex:1,
         justifyContent:'center',
         alignItems:'center',
         backgroundColor:COLORS.background,
      },
      FlexView:{
        alignItems:'center',
        justifyContent:'center',
        marginBottom:SPACING.xl,
      },
      RegistrarseText:{
        fontSize:21,
        fontWeight:'800',
        marginBottom:SPACING.xs,
        color:COLORS.textPrimary,
        },
      LogoImage:{
        width:154,
        height:88,
        marginBottom:SPACING.sm,
      },
      Eyebrow:{
        color:COLORS.primary,
        fontSize:10,
        fontWeight:'800',
        letterSpacing:1.45,
        marginBottom:SPACING.sm,
        textAlign:'center',
      },
      WelcomeTitle:{
        color:COLORS.textPrimary,
        fontSize:27,
        fontWeight:'800',
        letterSpacing:-0.4,
      },
      WelcomeText:{
        color:COLORS.textSecondary,
        fontSize:14,
        marginTop:SPACING.xs,
        textAlign:'center',
      },
      FormStyle:{
        width:'100%',
        padding:SPACING.xl,
        borderRadius:RADIUS.xl,
        backgroundColor:COLORS.surface,
        borderColor:'rgba(255, 34, 51,0.32)',
        borderWidth:1,
        ...shadow(COLORS.primaryGlow,0.28,18,8,{width:0,height:6}),
      },
      FormSubtitle:{
        color:COLORS.textSecondary,
        fontSize:13,
        lineHeight:19,
        marginBottom:SPACING.md,
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
        marginTop:SPACING.lg,

      },
      IniciarSesionText:{
        color:COLORS.primary,
        fontWeight:'800',

      }

})
