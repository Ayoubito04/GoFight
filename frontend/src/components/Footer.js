//Aquí vamos a definir el componente footer,que es el pie de la aplicación,dónde se va a colocar cada uno de las secciones de la aplicación
import React from 'react';
import {View,StyleSheet,TouchableOpacity} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { COLORS, SPACING, shadow } from '../theme';


const Footer=()=>{
      const navigation=useNavigation();
      const currentRoute=useNavigationState(state=>state?.routes?.[state.index]?.name);
      const sections=[
            {id:'1',icono:'home',screen:'home'},
            {id:'2',icono:'barbell',screen:'Rutinas'},
            {id:'3',icono:'stats-chart',screen:'Progreso'},
            {id:'4',icono:'person',screen:'Perfil'},

      ];
      return(
        <View style={styles.Wrapper}>
          <View style={styles.Pill}>
                {sections.map((item)=>{
                      const active=currentRoute===item.screen;
                      return (
                            <TouchableOpacity
                                  key={item.id}
                                  style={styles.Item}
                                  activeOpacity={0.7}
                                  onPress={() => !active && navigation.navigate(item.screen)}>
                                  <Ionicons name={active ? item.icono : `${item.icono}-outline`} size={22} color={active ? COLORS.primary : COLORS.textMuted}/>
                                  <View style={[styles.Dot, active && styles.DotActive]}/>
                            </TouchableOpacity>
                      )
                })}
          </View>
        </View>
      )

}
const styles=StyleSheet.create({
        Wrapper:{
              backgroundColor:COLORS.background,
              paddingHorizontal:SPACING.xl,
              paddingBottom:SPACING.md,
              paddingTop:SPACING.xs,
        },
        Pill:{
              flexDirection:'row',
              justifyContent:'space-around',
              alignItems:'center',
              backgroundColor:COLORS.surfaceElevated,
              borderRadius:32,
              paddingVertical:SPACING.sm,
              borderWidth:1,
              borderColor:COLORS.border,
              ...shadow('#000',0.4,14,8,{width:0,height:6}),
        },
        Item:{
              width:52,
              height:44,
              alignItems:'center',
              justifyContent:'center',
              gap:5,
        },
        Dot:{
              width:4,
              height:4,
              borderRadius:2,
              backgroundColor:'transparent',
        },
        DotActive:{
              backgroundColor:COLORS.primary,
        },
})
export default Footer;
