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
import { COLORS, RADIUS, SPACING, shadow } from '../theme';

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
            <View style={styles.ListArea}>
                {loading ? (
                    <Text style={styles.TextStyle}>Cargando usuarios...</Text>
                ) : isAdmin ? (
                    <FlatList
                        data={usuarios}
                        keyExtractor={(item) => item.id_usuario.toString()}
                        contentContainerStyle={styles.FlatList}
                        renderItem={({ item }) => (
                            <View style={styles.Card}>
                               <View style={styles.InfoColumn}>
                                <View style={styles.RolRow}>
                                    <Ionicons name={item.rol==='admin' ? 'shield-checkmark' : 'person'} size={15} color={COLORS.primary} />
                                    <Text style={styles.RolText}>{item.rol}</Text>
                                </View>
                                <Text style={styles.NombreText}>{item.nombre}</Text>
                                <Text style={styles.EmailText}>{item.email}</Text>
                                  </View>
                               <View style={styles.ActionsRow}>
                                 <TouchableOpacity style={styles.ActionButton} onPress={() => handleDeleteUser(item.id_usuario)}>
                                  <Ionicons name="trash" size={16} color={COLORS.danger} />
                                </TouchableOpacity>
                                 <TouchableOpacity style={styles.ActionButton} onPress={() => handleMakeAdmin(item.id_usuario, item.nombre, item.email, item.rol)}>
                                  <Ionicons name="shield-checkmark" size={16} color={COLORS.info} />
                                </TouchableOpacity>
                                 <TouchableOpacity style={styles.ActionButton} onPress={() => handleActualizarUsuarioAdmin(item.id_usuario, item.nombre, item.email, item.rol)}>
                                  <Ionicons name="create" size={16} color={COLORS.success}/>
                                </TouchableOpacity>

                                </View>

                            </View>

                        )}
                    />
                ) : (
                    <Text style={styles.TextStyle}>No tienes permisos para acceder a esta pantalla</Text>
                )}
            </View>
            <Footer />
        </SafeAreaView>
    )
        
}
const styles=StyleSheet.create({
    Container:{
        flex:1,
        backgroundColor:COLORS.background,
    },
    ListArea:{
        flex:1,
    },
    Modal:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'rgba(0,0,0,0.7)',
        width:'100%',
        height:'100%',
    },
    ModalContainer:{
        width:'90%',
        backgroundColor:COLORS.surfaceAlt,
        padding:SPACING.xl,
        borderRadius:RADIUS.lg,
        borderColor:'rgba(255, 34, 51,0.2)',
        borderWidth:1,
        ...shadow(COLORS.primary,0.15,8,5,{width:0,height:4}),
        justifyContent:'center',
        alignItems:'center',
        paddingVertical:30,
        gap:SPACING.xl,
    },

   ModalTextStyle:{
    fontSize:18,
    fontWeight:'700',
    color:COLORS.primary,
    marginBottom:SPACING.md,
    textAlign:'center',
    textTransform:'uppercase',
    letterSpacing:1,

   },
    FlatList:{
    padding: SPACING.lg,
    flexGrow: 1,
    },

    Card:{
      backgroundColor: COLORS.surface,
      padding: SPACING.lg,
      borderRadius: RADIUS.md,
      marginBottom: SPACING.md,
      borderLeftWidth: 4,
      borderLeftColor: COLORS.primary,
      ...shadow('#000',0.3,8,5,{width:0,height:4}),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    },
    InfoColumn:{
        flex:1,
        gap:4,
    },
    RolRow:{
        flexDirection:'row',
        alignItems:'center',
        gap:6,
        marginBottom:2,
    },
    RolText:{
        fontSize:11,
        fontWeight:'700',
        color:COLORS.primary,
        textTransform:'uppercase',
        letterSpacing:1,
    },
    NombreText:{
        fontSize:15,
        fontWeight:'700',
        color:COLORS.textPrimary,
    },
    EmailText:{
        fontSize:12,
        color:COLORS.textSecondary,
    },
    ActionsRow:{
        flexDirection:'row',
        gap:SPACING.xs,
    },
    ActionButton:{
        padding:SPACING.sm,
        borderRadius:RADIUS.sm,
        backgroundColor:COLORS.surfaceElevated,
    },
    TextStyle:{
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 1,
        color: COLORS.textSecondary,
        fontFamily: Platform.OS === 'ios' ? 'Avenir' : 'Roboto',
        textAlign:'center',
        marginTop:SPACING.xl,
    }


        })

export default GestorUsuariosAdmin;
