//Vamos a definir el header de la aplicación,que va a ser un componente esencial para casí todas las paginas
import React from 'react';
import {View,Text,StyleSheet,SafeAreaView, Platform, StatusBar, TouchableOpacity, Alert} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import { getUserProfile } from '../services/services';
import { useEffect, useState } from 'react';
import { COLORS, SPACING } from '../theme';
import SideMenu from './SideMenu';


const Header=()=>{
     const [userProfile,setUserProfile]=useState(null);
     const [menuVisible,setMenuVisible]=useState(false);
      useEffect(()=>{
        //Aquí vamos a definir la lógica para obtener el perfil del usuario
        const fetchUserProfile=async()=>{
            try{
                  const profile=await getUserProfile();
                    setUserProfile(profile);


            }catch(error){
                  console.error('Error al obtener el perfil del usuario',error);

            }
        }
        fetchUserProfile();
      },[]);

      const nombre=userProfile?.perfilUsuario?.nombre;
      const isAdmin=userProfile?.perfilUsuario?.rol==='admin';

      return(
            <SafeAreaView style={style.HeaderArea}>
                  <View style={style.HeaderContainer}>
                        <TouchableOpacity style={style.IconButton} onPress={()=>setMenuVisible(true)} hitSlop={10}>
                              <Ionicons name='menu' size={24} color={COLORS.textPrimary}/>
                        </TouchableOpacity>

                        <View style={style.GreetingContainer}>
                              <Text style={style.Greeting} numberOfLines={1}>Hola, {nombre || 'Invitado'} 👋</Text>
                              <Text style={style.Subtitle}>Listo para superar tus objetivos hoy</Text>
                        </View>

                        <TouchableOpacity style={style.IconButton} onPress={()=>Alert.alert('Notificaciones','No tienes notificaciones nuevas')} hitSlop={10}>
                              <Ionicons name='notifications-outline' size={22} color={COLORS.textPrimary}/>
                              <View style={style.NotificationDot}/>
                        </TouchableOpacity>
                  </View>
                  <SideMenu visible={menuVisible} onClose={()=>setMenuVisible(false)} userName={nombre} isAdmin={isAdmin}/>
         </SafeAreaView>
      )
}
const style=StyleSheet.create({
     HeaderArea:{
      backgroundColor:COLORS.background,
      paddingTop:Platform.OS==='android' ? StatusBar.currentHeight : 0,//Ajustamos el SafeAreaView para android
     },
      HeaderContainer:{
                  flexDirection:'row',
                  justifyContent:'space-between',
                  alignItems:'center',
                  backgroundColor:COLORS.background,
                  paddingHorizontal:SPACING.lg,
                  paddingVertical:SPACING.md,
      },
      IconButton:{
            width:42,
            height:42,
            borderRadius:21,
            backgroundColor:COLORS.surfaceElevated,
            alignItems:'center',
            justifyContent:'center',
      },
      NotificationDot:{
            position:'absolute',
            top:10,
            right:11,
            width:7,
            height:7,
            borderRadius:4,
            backgroundColor:COLORS.primary,
            borderWidth:1,
            borderColor:COLORS.surfaceElevated,
      },
      GreetingContainer:{
            flex:1,
            paddingHorizontal:SPACING.md,
      },
      Greeting:{
            fontSize:16,
            fontWeight:'800',
            color:COLORS.textPrimary,
            letterSpacing:0.3,
      },
      Subtitle:{
            fontSize:11,
            color:COLORS.textSecondary,
            marginTop:2,
      },
})

export default Header;
