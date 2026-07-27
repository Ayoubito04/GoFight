//Vamos a crear un componente para los inputs de texto,que van a contar con iconos cada uno
import React, { useState } from 'react';
import {View,TextInput,StyleSheet} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../theme';
//Tenemos los iconos de Ionicons
//Vamos a implementar un estado de foco dentro de los inputs de texto,para que se vean mejor y se sientan interactivos

const TextInputComponent=({placeholder,value,onChangeText,secureTextEntry,iconName,keyboardType,style})=>{
    const [focused,setFocused]=useState(false);

    return(
        <View style={[styles.Container, focused && styles.ContainerFocused, style]}>
            {iconName ? <Ionicons name={iconName} size={19} color={focused ? COLORS.primary : COLORS.textSecondary} style={styles.IconStyle}/> : null}
            <TextInput
                style={styles.TextInputStyle}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                placeholderTextColor={COLORS.textMuted}
                onFocus={()=>setFocused(true)}
                onBlur={()=>setFocused(false)}
            />
        </View>
    )
}
const styles=StyleSheet.create({
    Container:{
        flexDirection:'row',
        alignItems:'center',
        borderColor:COLORS.border,
        borderWidth:1,
        borderRadius:RADIUS.md,
        paddingHorizontal:SPACING.md,
        marginBottom:SPACING.md,
        backgroundColor:COLORS.surfaceElevated,
    },
    ContainerFocused:{
        borderColor:COLORS.primary,
        backgroundColor:'rgba(255, 34, 51,0.06)',
    },
    IconStyle:{
        marginRight:SPACING.sm,
    },
    TextInputStyle:{
        flex:1,
        height:44,
        color:COLORS.textPrimary,
        fontSize:15,
    },
})
export default TextInputComponent;
