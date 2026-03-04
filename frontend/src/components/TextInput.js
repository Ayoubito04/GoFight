//Vamos a crear un componente para los inputs de texto,que van a contar con iconos cada uno
import React, { useEffect, useState } from 'react';
import {View,TextInput,StyleSheet} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
//Tenemos los iconos de Ionicons
//Vamos a implementar hovers dentro de los inputs de texto,para que se vean mejor y sean más interactivo y se sienta vivo


//
const TextInputComponent=({placeholder,value,onChangeText,secureTextEntry,iconName})=>{
    const [Hover,setHovered]=useState(false);
   
    return(
        <View style={[styles.ButtonContainer,Hover ? styles.HoveredStyle : null]
            
        }> 
            <Ionicons name={iconName} size={20} color={Hover ? 'red': 'white'} style={styles.IconStyle}/>
            <TextInput style={styles.TextInputStyle} placeholder={placeholder} value={value} onChangeText={onChangeText} secureTextEntry={secureTextEntry} placeholderTextColor={Hover ? 'red':'grey'}
            onFocus={()=>setHovered(true)}
            onBlur={()=>setHovered(false)}/>
        </View>
    )
}
const styles=StyleSheet.create({
    ButtonContainer:{
        flexDirection:'row',
        alignItems:'center',
        borderColor:'gray',
        borderWidth:1,
     
        borderRadius:5,
        paddingHorizontal:10,
        marginBottom:10,
       
        color:'red',
        
    },
    IconStyle:{
        marginRight:10,
            
        

   
    },
    TextInputStyle:{
        flex:1,
        height:40,
        borderRadius:5,
        color:'white',
        paddingHorizontal:10,
        backgroundColor:'transparent',
        color:'white',
        placeholderTextColor:'red',

    },
    HoveredStyle:{
        borderColor:'red',
        borderWidth:2,
        backgroundColor:'rgba(255,0,0,0.1)',

           
            boxShadow:'5px 20px 15px rgba(255,0,0,0.2)',
           
    }
})
export default TextInputComponent;

    