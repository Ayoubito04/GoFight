//Aquí irá el gestor de usuarios,que va a ser una pantalla dónde el administrador va a poder gestionar a los usuarios,es decir,va a poder ver la lista de usuarios,eliminar usuarios,modificar usuarios,etc
import Button from '../components/Button';
import { useState} from 'react';
import TextInputComponent from '../components/TextInput';
import Header from '../components/HeaderComponent';
import Footer from '../components/Footer';
import { getAllUsers} from '../services/services';//Obtenemos la función para obtener todos los usuarios,que solo el admin puede usar,ya que es una función propia del administrador
import {View,Text,FlatList,TouchableOpacity,StyleSheet,Platform,StatusBar} from 'react-native';
import { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { makeAdmin,deleteUserById,ActualizarUsuarioAdmin } from '../services/services';
import {Modal} from 'react-native';

//Obtenemos el perfil del usuario primeramente para saber si es admin o no,ya que solo los admin pueden acceder a esta pantalla

const GestorUsuariosAdmin=()=>{
    const [isAdmin,setIsAdmin]=useState(false);
    const [loading,setLoading]=useState(true);
    const [modalVisible,setModalVisible]=useState(false);
    const [usuarioSeleccionado,setUsuarioSeleccionado]=useState(null);
    const [nuevoNombre,setNuevoNombre]=useState('');
    const [nuevoEmail,setNuevoEmail]=useState('');

    const [usuarios,setUsuarios]=useState([]);//Aquí vamos a guardar la lista de usuarios que obtenemos del backend,para mostrarlos en la pantalla
    useEffect(()=>{
        //Aquí vamos a cargar todos los usuarios,pero antes vamos a comprobar si el usuario es admin o no,ya que solo los admin pueden acceder a esta pantalla
        const fetchUsuarios = async () => {
            try{
                const usuarios=await getAllUsers();
                setUsuarios(usuarios);
                setIsAdmin(true);//Si obtenemos la lista de usuarios,es porque el usuario es admin,ya que solo los admin pueden obtener la lista de usuarios,por lo tanto,establecemos el estado de isAdmin en true
                console.log('Usuarios obtenidos en GestorUsuariosAdmin:', usuarios);
                console.log('isAdmin en GestorUsuariosAdmin:', isAdmin);

        }
        catch(error){
            console.error('Error al obtener los usuarios:', error);
        }
        finally{
            setLoading(false);

        }
        }
        fetchUsuarios();

    },[])
    const handleMakeAdmin=async(id_usuario)=>{
        try{
            await makeAdmin(id_usuario);
            const res=await getAllUsers();
            setUsuarios(res);
            //Esto nos permitrá actualizar la lista de usuarios,despùés de haber transformado a un usuario en admin,para que se refleje el cambio en la pantalla,ya que cada vez que se registre una sesión en el historial,tenemos que actualizar las gamificaciones,por lo tanto,es importante probarlo en la pantalla de inicio,para ver si se actualizan correctamente

        }catch(error){
            console.error('Error al transformar el usuario en admin:', error);
        }
    }
    const handleDeleteUser=async(id_usuario)=>{
        try{
            await deleteUserById(id_usuario);
            const res=await getAllUsers();
            setUsuarios(res);
            //Esto nos permitrá actualizar la lista de usuarios,despùés de haber eliminado a un usuario,para que se refleje el cambio en la pantalla,ya que cada vez que se registre una sesión en el historial,tenemos que actualizar las gamificaciones,por lo tanto,es importante probarlo en la pantalla de inicio,para ver si se actualizan correctamente
        }catch(error){
            console.error('Error al eliminar el usuario:', error);
        }
        }
        const handleActualizarUsuarioAdmin=async(id_usuario,nombre,email,rol)=>{
            setUsuarioSeleccionado({id_usuario,nombre,email,rol});
            setNuevoNombre(nombre);
            setNuevoEmail(email);
            setModalVisible(true);
        }
        const handleActualizarUsuario=async()=>{
            try{
                await ActualizarUsuarioAdmin(usuarioSeleccionado.id_usuario,nuevoNombre,nuevoEmail);
                const res=await getAllUsers();
                setUsuarios(res);
                setModalVisible(false);
            }catch(error){
                console.error('Error al actualizar el usuario:', error);
            }

        }
      
      return(
        <SafeAreaView style={styles.Container}>
        
            <Header title="Gestor de Usuarios" />
            <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={()=>setModalVisible(false)}
               >
                <View style={styles.Modal}>
                    <View style={styles.ModalContainer}>
                        <Text style={styles.ModalTextStyle}>Actualizar Usuario</Text>
                        <TextInputComponent placeholder="Introduce su nuevo nombre" value={nuevoNombre} onChangeText={setNuevoNombre} iconName="person-outline"/>
                        <TextInputComponent placeholder="Introduce su nuevo correo" value={nuevoEmail} onChangeText={setNuevoEmail} keyboardType="email-address" iconName="mail-outline"/>
                         <View style={{flexDirection:'row',gap:20,marginTop:20}}>
                            <Button title={"actualizar"} onPress={handleActualizarUsuario}/>
                                <Button title={"cancelar"} onPress={()=>setModalVisible(false)}/>
                            
                         </View>
                    </View>
                </View>

            </Modal>
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                {loading ? (
                    <Text style={styles.TextStyle}>Cargando usuarios...</Text>
                ) : isAdmin ? (
                    <FlatList
                        data={usuarios}
                        keyExtractor={(item) => item.id_usuario.toString()}
                        contentContainerStyle={styles.FlatList}
                        renderItem={({ item }) => ( 
                            <View style={styles.Card}>
                               <View style={styles.RegistrosStyle}>
                                {item.rol==='admin' && <Ionicons name="shield-checkmark" size={15} color="#ff4444" />}
                                {item.rol!=='admin' && <Ionicons name="person" size={15} color="#ff4444" />}
                                <Text style={styles.TextStyle}>nombre:{item.nombre}</Text>
                                   
                                
                                <Text style={styles.TextStyle}>email:{item.email}</Text>
                                 
                                <Text style={styles.TextStyle}>rol:{item.rol}</Text>
                                
                                  </View>
                               <View style={styles.RegistrosStyle}>
                                 <TouchableOpacity style={{padding:10,borderRadius:5}} onPress={() => handleDeleteUser(item.id_usuario)}>
                                  <Ionicons name="trash" size={15} color="#ff4444" />
                                </TouchableOpacity>
                                 <TouchableOpacity style={{padding:10,borderRadius:5}} onPress={() => handleMakeAdmin(item.id_usuario, item.nombre, item.email, item.rol)}>
                                  <Ionicons name="shield-checkmark" size={15} color="#ff4444" />
                                </TouchableOpacity>
                                 <TouchableOpacity style={{padding:10,borderRadius:5}} onPress={() => handleActualizarUsuarioAdmin(item.id_usuario, item.nombre, item.email, item.rol)}>
                                  <Ionicons name="create" size={15} color="#ff4444"/>
                                </TouchableOpacity>
                             
                                </View>
                                

                                {/* Aquí podríamos agregar botones para eliminar o modificar el usuario */}
                            </View>
                            
                        )}
                    />
                ) : (
                    <Text>No tienes permisos para acceder a esta pantalla</Text>
                )}
            </View>
            <Footer />
        </SafeAreaView>
    )
        
}
const styles=StyleSheet.create({
    Container:{
        flex:1,
        backgroundColor:'black',
        
     
    },
    Modal:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'rgba(0,0,0,0.5)',
        width:'100%',
        height:'100%',
      
      

    },
    ModalContainer:{
        width:'90%',
        backgroundColor:'#111',
        padding:20,
        borderRadius:10,
        borderBlockColor:'#ff4444',
        borderWidth:1,
        shadowColor:'#ff4444',
        shadowOffset:{width:0,height:4},
        shadowOpacity:0.15,
        shadowRadius:8,
        elevation:5,
        justifyContent:'center',
        alignItems:'center',
        paddingVertical:30,
        gap:20,
    },
    
   ModalTextStyle:{
    fontSize:18,
    fontWeight:'bold',
    color:'#ff4444',
    marginBottom:20,
    textAlign:'center',

   },
    FlatList:{
        
    padding: 20,
  backgroundColor: '#000',
  flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    justifyContent: 'center',
    
    


    },
    
    Card:{
  backgroundColor: '#111',
  padding: 16,
  borderRadius: 12,
  marginBottom: 12,
  borderLeftWidth: 4,
  borderLeftColor: '#ff0000',
  borderWidth: 0, 
  shadowColor: '#ff0000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.15,
  shadowRadius: 8,
  elevation: 5,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',

        
    
        
    },
  RegistrosStyle:{
    fontSize: 14,
  fontWeight: '600',
  color: '#ffffff',
    letterSpacing: 1,
    gap: 4,

     
  },
    TextStyle:{
        fontSize: 13,
  fontWeight: 'bold',
  letterSpacing: 1,
  color: '#ffffff',
  fontFamily: Platform.OS === 'ios' ? 'Avenir' : 'Roboto',
  textShadowColor: 'rgba(255, 0, 0, 0.5)',
  textShadowOffset: { width: 2, height: 2 },
  textShadowRadius: 4, // ← añade esto

    }
   

        })
    
export default GestorUsuariosAdmin;
