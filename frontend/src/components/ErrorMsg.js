//Vamos a crear el componente para los mensajes de error,que va mostrar

import React from 'react';
import {View,Text,StyleSheet} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../theme';

const ErrorMsg=({message})=>{
      return(
        <View style={styles.Container}>
            <Ionicons name="alert-circle-outline" size={18} color={COLORS.danger} style={styles.IconStyle}/>
            <Text style={styles.ErrorText}>{message}</Text>
        </View>
      )
}
const styles=StyleSheet.create({

    Container:{
        marginTop:SPACING.sm,
        paddingVertical:SPACING.sm,
        paddingHorizontal:SPACING.md,
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row',
        backgroundColor:'rgba(255,71,87,0.1)',
        borderRadius:RADIUS.sm,
        borderWidth:1,
        borderColor:'rgba(255,71,87,0.3)',
    },
    IconStyle:{
        marginRight:SPACING.sm,
    },
    ErrorText:{
        color:COLORS.danger,
        fontSize:13,
        fontWeight:'600',
        flexShrink:1,
    },
})
export default ErrorMsg;
