//Vamos a crear el componente para los mensajes de error,que va mostrar 

import React from 'react';
import {View,Text,StyleSheet} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

const ErrorMsg=({message})=>{
      return(
        <View style={styles.Container}>
            <Ionicons name="alert-circle-outline" size={20} color="red" style={styles.IconStyle}/>
            <Text style={styles.ErrorText}>{message}</Text>
        </View>
      )
}
const styles=StyleSheet.create({

    Container:{
        paddingBottom:10,
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row',
       
        
        backgroundColor:'transparent',
    },
    IconStyle:{
        marginRight:10,
    },
    ErrorText:{
        color:'red',
        fontSize:14,
        marginTop:5,
    },
})
export default ErrorMsg;