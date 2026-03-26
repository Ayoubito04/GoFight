//Aquí vamos a definir el componente footer,que es el pie de la aplicación,dónde se va a colocar cada uno de las secciones de la aplicación
import {View,Text,StyleSheet,FlatList,TouchableOpacity} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


const Footer=()=>{
      const navigation=useNavigation();
      const sections=[
            {id:'1',title:'Inicio',icono:'home',screen:'home'},
            {id:'2',title:'Rutinas',icono:'dumbbell',screen:'Rutinas'},
            {id:'3',title:'Progreso',icono:'chart-line',screen:'Progreso'},
            {id:'4',title:'Perfil',icono:'account',screen:'Perfil'},

      ];
      //Hemosdefinido las secciones,es hora de implementarlas en una FlatList,que es para renderizar listas
      return(
        <View style={styles.Container}>
          <FlatList
           data={sections}
           flexDirection='row'
           horizontal={true}
           showsHorizontalScrollIndicator={false}
           alignItems='center'
           justifyContent='center'
           contentContainerStyle={styles.ListStyle}







           keyExtractor={(item)=>item.id}
           renderItem={({item})=>{
             return (
             <View style={styles.Item}>
                 <TouchableOpacity style={styles.TouchableOpacity}
                 onPress={() => navigation.navigate(item.screen)}>
                  <MaterialCommunityIcons name={item.icono} size={24} style={styles.IconStyle}/>

                 </TouchableOpacity>
                  <Text style={styles.TextStyle}>{item.title}</Text>

             </View>
             )
           }}
            />
            </View>
            //Ya hemos definido la FlatList del footer,que va renderizar cada una de las secciones en uno en uno
      )

}
const styles=StyleSheet.create({

  ListStyle:{
      flex:1,
      flexDirection:'row',
      justifyContent:'space-between',
      alignItems:'center',
      padding:10,
      gap:10,




  },
        Container:{
            flexDirection:'row',
            justifyContent:'center',
            alignItems:'center',
            padding:10,
            gap:10,
              borderRadius:5,

              backgroundColor:'#080808',


              borderTopColor:'rgb(0, 0, 0)'









        },
        Item:{
             borderTopColor:'black',
            borderWidth:1,
            borderRadius:5,

              width:80,
              height:80,
              justifyContent:'center',

              alignItems:'center',
              backgroundColor:'black',
              gap:5,




        },
        TouchableOpacity:{
              padding:5,
              borderRadius:5,

        },
        TextStyle:{
              fontSize:12,
              color:'white',
              fontWeight:'bold',
              textShadowColor:'rgba(255, 255, 255, 0.5)',
              textShadowOffset:{width:1,height:1},
              textShadowRadius:3,
              textTransform:'uppercase',
              letterSpacing:1.1,
              textAlign:'center'



        },
        IconStyle:{
         color:'white',
          textShadowColor:'rgba(255, 255, 255, 0.5)',
          textShadowOffset:{width:1,height:1},
          textShadowRadius:3,

          padding:2,
          borderRadius:3,
        }
})
export default Footer;
