import React from 'react';
import {TouchableOpacity,Text,StyleSheet} from 'react-native';
import { useState } from 'react';
const  Button=({title,onPress})=>{
    const [Hover,setHover]=useState(false);
    //Definimos el hook de hover,para definir el cambio de estado

    //En componentes vamos a definir como van a ser todos los buttons de la aplicación
    return(
        <TouchableOpacity onPress={onPress} onPressIn={()=>setHover(true)} onPressOut={()=>setHover(false)} style={styles.ButtonStyle}>
            <Text style={styles.ButtonStyle}>{title}</Text>
        </TouchableOpacity>
    )

}
const styles=StyleSheet.create({
    ButtonStyle:{
        backgroundColor:'#f80404',
        padding:10,
        borderRadius:5,
        color:'white',
        textAlign:'center',
        fontSize:16,
        fontWeight:'bold',
    },

})
export default Button;