//Vamos a crear la pantalla del login
import React from 'react';
import {View,Text,StyleSheet,ActivityIndicator,KeyboardAvoidingView} from 'react-native';
import {useState,useEffect} from 'react';
import Button from '../components/Button';
import TextInputComponent from '../components/TextInput';
import {loginUser} from '../services/services';
import ErrorMsg from '../components/ErrorMsg';
import {Ionicons} from '@expo/vector-icons';

const Login=()=>{
    //Vamos a implemtar el login,que va a ser una pantalla muy sencilla

      const [email,setEmail]=useState('');
       const [password,setPassword]=useState('');
       const [message,setMessage]=useState('');
       const [loading,setLoading]=useState(false);
       const handleLogin=async()=>{
           if(!email || !password){
                setMessage('Por favor,complete todos los campos');
           }
            else{
                //Aquí vamos a implementar la lógica de login,que va a ser muy sencilla,solo vamos a hacer una consulta a la API para verificar si el usuario existe en la base de datos
                await loginUser(email,password);
                setEmail('');
                setPassword('');
                setMessage('');

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
                <ActivityIndicator size="large" color="#ff0000"/>
            </View>

        )

       }
       else{
          return(
            
           <KeyboardAvoidingView style={styles.Container} behavior="padding">
            <View>
                <Text style={styles.TitleStyle}>GoFight</Text>
                <Ionicons name="logo-game-controller" size={50} color="#ff0000" style={{marginBottom:20}}/>
                <Text></Text>
            </View>
           
                <View style={styles.LoginContainer}>
                    <TextInputComponent placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" iconName="mail-outline"/>
                    <TextInputComponent placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry iconName="lock-closed-outline"/>
                    <Button title="Iniciar Sesión" onPress={handleLogin}/>
                    {message ? <ErrorMsg message={message}/> : null}
                </View>
           </KeyboardAvoidingView>
        )
       }
}
const styles=StyleSheet.create({
        ScrollViewStyle:{
            width:'80%',
            backgroundColor:'#f0f0f0',
            padding:20,
            borderRadius:10,
        },
        Container:{
            flex:1,
            justifyContent:'center',
            alignItems:'center',
            backgroundColor:'#000000',
            width:'100%',
           
           
        },
        LoginContainer:{
            width:'80%',
            backgroundColor:'#000000',
            padding:20,
            borderRadius:10,
            borderColor:'red',
            borderWidth:1,
        },
        TitleStyle:{
            fontSize:24,
            fontWeight:'bold',
            color:'#000000',
            marginBottom:20,
        },
            FormStyle:{
            width:'80%',
            backgroundColor:'#f0f0f0',
            padding:20,
            borderRadius:10,
        },
        Mensajes:{
            color:'red',
            marginTop:10,
        }
})
export default Login;