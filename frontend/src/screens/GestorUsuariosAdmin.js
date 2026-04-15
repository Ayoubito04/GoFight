//Aquí irá el gestor de usuarios,que va a ser una pantalla dónde el administrador va a poder gestionar a los usuarios,es decir,va a poder ver la lista de usuarios,eliminar usuarios,modificar usuarios,etc
import Button from '../components/Button';
import { useState} from 'react';
import TextInputComponent from '../components/TextInput';
import Header from '../components/HeaderComponent';
import Footer from '../components/Footer';
import { getAllUsers} from '../services/services';//Obtenemos la función para obtener todos los usuarios,que solo el admin puede usar,ya que es una función propia del administrador
import {View,Text,FlatList,TouchableOpacity} from 'react-native';
import { useEffect } from 'react';
//Obtenemos el perfil del usuario primeramente para saber si es admin o no,ya que solo los admin pueden acceder a esta pantalla

const GestorUsuariosAdmin=()=>{
    const [isAdmin,setIsAdmin]=useState(false);
    const [loading,setLoading]=useState(true);
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
      return(
        <View style={{flex:1}}>
            <Header title="Gestor de Usuarios" />
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                {loading ? (
                    <Text>Cargando usuarios...</Text>
                ) : isAdmin ? (
                    <FlatList
                        data={usuarios}
                        keyExtractor={(item) => item.id_usuario.toString()}
                        renderItem={({ item }) => ( 
                            <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
                                <Text style={{ fontSize: 18 }}>{item.nombre}</Text>
                                <Text style={{ color: '#666' }}>{item.email}</Text>
                                <Text style={{ color: '#666' }}>Rol: {item.rol}</Text>
                                {/* Aquí podríamos agregar botones para eliminar o modificar el usuario */}
                            </View>
                        )}
                    />
                ) : (
                    <Text>No tienes permisos para acceder a esta pantalla</Text>
                )}
            </View>
            <Footer />
        </View>
    )
        
}
export default GestorUsuariosAdmin;
