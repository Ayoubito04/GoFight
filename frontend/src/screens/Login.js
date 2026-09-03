//Vamos a crear la pantalla del login
import React from 'react';
import {View,Text,StyleSheet,ActivityIndicator,KeyboardAvoidingView,Image,Platform} from 'react-native';
import {useState,useEffect} from 'react';
import Button from '../components/Button';
import TextInputComponent from '../components/TextInput';
import {useNavigation} from '@react-navigation/native';


import {loginUser} from '../services/services';
import ErrorMsg from '../components/ErrorMsg';
import {Ionicons, MaterialCommunityIcons} from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, shadow } from '../theme';

const Login=()=>{
    const navigation=useNavigation();
    //Vamos a implemtar el login,que va a ser una pantalla muy sencilla

      const [email,setEmail]=useState('');
       const [password,setPassword]=useState('');
       const [message,setMessage]=useState('');
       const [loading,setLoading]=useState(false);
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
            
           <KeyboardAvoidingView style={styles.Container} behavior={Platform.OS==='ios' ? 'padding' : undefined}>
            <View style={styles.BackgroundGlow}/>
            <View style={styles.Content}>
                <View style={styles.TitleContainer}>
                    <Image
                        source={require('../../assets/GF Boxing Pulse Logo.png')}
                        style={styles.LogoImage}
                        resizeMode="contain"
                    />
                    <Text style={styles.Eyebrow}>ENTRENA. SUPÉRATE. REPITE.</Text>
                    <Text style={styles.WelcomeTitle}>Bienvenido de nuevo</Text>
                    <Text style={styles.WelcomeText}>Continúa construyendo tu mejor versión.</Text>
                </View>
                <View style={styles.LoginContainer}>
                     <Text style={styles.TitleStyle}>Iniciar sesión</Text>
                     <Text style={styles.FormSubtitle}>Accede para continuar con tu entrenamiento.</Text>
                    <TextInputComponent placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" iconName="mail-outline"/>
                    <TextInputComponent placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry iconName="lock-closed-outline"/>
                    <Button title="Iniciar Sesión" onPress={handleLogin}/>
                    <Text style={styles.Mensajes}>¿Aún no tienes cuenta? <Text style={styles.MensajeStyle} onPress={()=>navigation.navigate('register')}>Crear cuenta</Text></Text>
                    {message ? <ErrorMsg message={message}/> : null}
                </View>
            </View>
           </KeyboardAvoidingView>
        )
       }
}
const styles=StyleSheet.create({
        Container:{
            flex:1,
            backgroundColor:COLORS.background,
            width:'100%',
        },
        Content:{
            flex:1,
            justifyContent:'center',
            paddingHorizontal:SPACING.xl,
            zIndex:1,
        },
        BackgroundGlow:{
            position:'absolute',
            width:330,
            height:330,
            borderRadius:165,
            backgroundColor:'rgba(255,34,51,0.11)',
            top:-145,
            right:-95,
        },
        TitleContainer:{
            alignItems:'center',
            marginBottom:SPACING.xl,
        },
        LoginContainer:{
            backgroundColor:COLORS.surface,
            padding:SPACING.xl,
            borderRadius:RADIUS.xl,
            borderColor:'rgba(255, 34, 51,0.32)',
            borderWidth:1,
            gap:SPACING.sm,
            ...shadow(COLORS.primaryGlow,0.28,18,8,{width:0,height:6}),
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
            letterSpacing:1.8,
            marginBottom:SPACING.sm,
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
        },
        TitleStyle:{
            fontSize:21,
            fontWeight:'800',
            color:COLORS.textPrimary,
            marginBottom:SPACING.xs,
        },
        FormSubtitle:{
            color:COLORS.textSecondary,
            fontSize:13,
            lineHeight:19,
            marginBottom:SPACING.md,
        },
        Mensajes:{
            color:COLORS.textSecondary,
            marginTop:SPACING.md,
            textAlign:'center',
            fontSize:13,
        },
        MensajeStyle:{
            color:COLORS.primary,
            fontWeight:'800',
        }

})
export default Login;
