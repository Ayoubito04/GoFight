//Vamos a crear la pantalla del login
import React from 'react';
import {View,Text,StyleSheet,ActivityIndicator,KeyboardAvoidingView} from 'react-native';
import {useState,useEffect} from 'react';
import Button from '../components/Button';
import TextInputComponent from '../components/TextInput';
import {useNavigation} from '@react-navigation/native';


import {loginUser,googleAuth} from '../services/services';
import ErrorMsg from '../components/ErrorMsg';
import {Ionicons, MaterialCommunityIcons} from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, shadow } from '../theme';
import useGoogleAuth from '../hooks/useGoogleAuth';

const Login=()=>{
    const navigation=useNavigation();
    //Vamos a implemtar el login,que va a ser una pantalla muy sencilla

      const [email,setEmail]=useState('');
       const [password,setPassword]=useState('');
       const [message,setMessage]=useState('');
       const [loading,setLoading]=useState(false);
       const [googleLoading,setGoogleLoading]=useState(false);
       const handleLogin=async()=>{
           if(!email || !password){
                setMessage('Por favor,complete todos los campos');
                return;
           }
            try{
               await loginUser(email,password);
                setEmail('');
                setPassword('');
                setMessage('');
                navigation.navigate('home');
            }catch(error){
                setMessage('Error al iniciar sesión,compruebe que el email y la contraseña sean correctos');
                //Comprobamos que el email y la contraseña sean correctos
            }
       }
       const handleGoogleIdToken=async(idToken,error)=>{
           if(error || !idToken){
                setMessage('No se ha podido iniciar sesión con Google');
                return;
           }
           try{
                setGoogleLoading(true);
                await googleAuth(idToken);
                setMessage('');
                navigation.navigate('home');
           }catch(error){
                setMessage(`Error al iniciar sesión con Google: ${error.message}`);
           }finally{
                setGoogleLoading(false);
           }
       }
       const {request:googleRequest,promptAsync:promptGoogleAsync}=useGoogleAuth(handleGoogleIdToken);
       useEffect(()=>{
        setLoading(true);
        setTimeout(()=>{
            setLoading(false);
        },2000);
       },[]);
       if(loading){
        return(
            <View style={styles.Container}>
                <ActivityIndicator size="large" color={COLORS.primary}/>
            </View>

        )

       }
       else{
          return(
            
           <KeyboardAvoidingView style={styles.Container} behavior="padding">
            <View style={styles.TitleContainer}>
                <Text style={styles.LogoStyle}>GoFight</Text>
                
            </View>
        
           
                <View style={styles.LoginContainer}>
                     <Text style={styles.TitleStyle}>Inciar Sesión</Text>
                    <TextInputComponent placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" iconName="mail-outline"/>
                    <TextInputComponent placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry iconName="lock-closed-outline"/>
                    <Button title="Iniciar Sesión" onPress={handleLogin}/>
                    <Button title="Continuar con Google" variant="secondary" disabled={!googleRequest || googleLoading} onPress={()=>promptGoogleAsync()}/>
                    <Text style={styles.Mensajes}>¿No tienes una cuenta? <Text style={styles.MensajeStyle} onPress={()=>navigation.navigate('register')}>Regístrate</Text></Text>
                    {message ? <ErrorMsg message={message}/> : null}
                </View>
           </KeyboardAvoidingView>
        )
       }
}
const styles=StyleSheet.create({
        Container:{
            flex:1,
            justifyContent:'center',
            alignItems:'center',
            backgroundColor:COLORS.background,
            width:'100%',
        },
        TitleContainer:{
            alignItems:'center',
        },
        LoginContainer:{
            width:'85%',
            backgroundColor:COLORS.surfaceAlt,
            padding:24,
            borderRadius:RADIUS.xl,
            borderColor:'rgba(255, 34, 51,0.25)',
            borderWidth:1,
            gap:SPACING.sm,
            marginTop:SPACING.xl,
            ...shadow(COLORS.primaryGlow,0.5,10,5,{width:0,height:4}),
        },
        LogoStyle:{
            fontSize:26,
            fontWeight:'800',
            color:COLORS.primary,
            letterSpacing:2,
            marginBottom:SPACING.xl,
            textTransform:'uppercase',
            textShadowColor:'rgba(255, 34, 51,0.5)',
            textShadowOffset:{width:2,height:2},
            textShadowRadius:10,
        },
        TitleStyle:{
            fontSize:18,
            fontWeight:'800',
            color:COLORS.primary,
            letterSpacing:2,
            marginBottom:SPACING.lg,
            textTransform:'uppercase',
            textShadowColor:'rgba(255, 34, 51,0.5)',
            textShadowOffset:{width:2,height:2},
            textShadowRadius:10,
            textAlign:'center',
        },
        Mensajes:{
            color:COLORS.textSecondary,
            marginTop:SPACING.sm,
            textAlign:'center',
        },
        MensajeStyle:{
            color:COLORS.info,
            textDecorationLine:'underline',
        }

})
export default Login;