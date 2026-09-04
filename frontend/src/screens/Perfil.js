import { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { getUserProfile, getGamificaciones,actualizarPerfil,vincularGoogle,desvincularGoogle} from '../services/services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Footer from '../components/Footer';
import { Image } from 'react-native';
import Button from '../components/Button';
import { Modal } from 'react-native';
import TextInput from '../components/TextInput';
import { COLORS } from '../theme';
import useGoogleAuth from '../hooks/useGoogleAuth';
import GoogleLogo from '../components/GoogleLogo';
import { useToast } from '../components/Toast';
const Perfil = ({ navigation }) => {
    const showToast = useToast();
    const [loading, setLoading] = useState(true);
    const [perfil, setPerfil] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [newPassword, setNewPassword] = useState('');//Vamos a actualizar la contraseña del usuario,en caso de que quiera cambiarlo
    const [newNombre, setNewNombre] = useState('');//Vamos a actualizar el nombre del usuario,en caso de que quiera cambiarlo
    const [newEmail, setNewEmail] = useState('');//Vamos a actualizar el email del usuario,en caso de que quiera cambiarlo
    const [gamificaciones, setGamificaciones] = useState(null);
    const [googleActionLoading, setGoogleActionLoading] = useState(false);

    const fetchData = async () => {
        try {
            const [profileData, gamData] = await Promise.all([
                getUserProfile(),
                getGamificaciones(),
            ]);
            setPerfil(profileData);
            setGamificaciones(gamData);
        } catch (error) {
            console.error('Error al obtener los datos del perfil:', error);
            showToast('No se han podido cargar tus datos', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleGoogleIdToken = async (idToken, error) => {
        if (error || !idToken) {
            showToast('No se ha podido vincular la cuenta de Google', 'error');
            setGoogleActionLoading(false);
            return;
        }
        try {
            setGoogleActionLoading(true);
            await vincularGoogle(idToken);
            showToast('Cuenta de Google vinculada', 'success');
            await fetchData();
        } catch (error) {
            showToast(`No se ha podido vincular: ${error.message}`, 'error');
        } finally {
            setGoogleActionLoading(false);
        }
    };
    const { request: googleRequest, promptAsync: promptGoogleAsync } = useGoogleAuth(handleGoogleIdToken);

    //Activamos la rueda nada más pulsar,y la apagamos si el usuario cierra la ventana de Google sin llegar a identificarse
    const handleGooglePress = async () => {
        try {
            setGoogleActionLoading(true);
            const result = await promptGoogleAsync();
            if (result?.type !== 'success') {
                setGoogleActionLoading(false);
            }
        } catch (error) {
            showToast('No se ha podido abrir la vinculación con Google', 'error');
            setGoogleActionLoading(false);
        }
    };

    const handleUnlinkGoogle = async () => {
        try {
            setGoogleActionLoading(true);
            await desvincularGoogle();
            showToast('Cuenta de Google desvinculada', 'success');
            await fetchData();
        } catch (error) {
            showToast(`No se ha podido desvincular: ${error.message}`, 'error');
        } finally {
            setGoogleActionLoading(false);
        }
    };

    const handleLogout = async () => {
        await AsyncStorage.removeItem('token');
        navigation.replace('login');
    };
  const handleChangeProfile=async()=>{
            const nombreActual=perfil?.perfilUsuario?.nombre || '';
             const emailActual=perfil?.perfilUsuario?.email || '';

             const nombreFinal=newNombre.trim()!== '' ? newNombre : nombreActual;
             const emailFinal=newEmail.trim()!== '' ? newEmail : emailActual;
          //No traemos la contraseña actual por motivos de seguridad y porque el usuario cualquier usuario no debería tener acceso a la contraseña actual,ya que es un dato sensible,por lo tanto,si el usuario quiere actualizar su contraseña,puede ingresar una nueva contraseña,pero no puede ver la contraseña actual,lo cual es una ventaja de seguridad
      try {
           await actualizarPerfil(
            nombreFinal,
            emailFinal,
            newPassword.trim()!== '' ? newPassword : undefined
           )
           showToast('Perfil actualizado', 'success');
          console.log('Datos a actualizar:', { nombreFinal, emailFinal, newPassword });
          //El usuario puede actualizar su nombre,email y contraseña,si no quiere actualizar alguno de esos campos,puede dejarlo vacío y se mantendrá el valor actual,ya que en el servicio de actualizarPerfil,si el campo está vacío,se mantiene el valor actual,lo cual es una ventaja para el usuario,ya que no tiene que llenar todos los campos si solo quiere actualizar uno o dos campos

          // Aquí podrías mostrar un mensaje de éxito al usuario
      } catch (error) {
          console.error('Error al actualizar el perfil:', error);
          showToast('No se ha podido actualizar el perfil', 'error');
      } finally {
          setModalVisible(false);
          setNewNombre('');
          setNewEmail('');
          setNewPassword('');
      }
  }
    if (loading) {
        return (
            <View style={styles.LoadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    const nombre = perfil?.perfilUsuario?.nombre || 'Usuario';
    const email = perfil?.perfilUsuario?.email || '—';
    const tipoPerfil = perfil?.perfilUsuario?.perfil || '—';
    const racha = gamificaciones?.gamificaciones?.racha_dias ?? 0;
    const puntos = gamificaciones?.gamificaciones?.puntos_ranking ?? 0;
    const googleVinculado = !!perfil?.perfilUsuario?.google_id;

    return (
        <SafeAreaView style={styles.Container}>
        <Modal visible={modalVisible} animationType="slide" transparent={true}>
            <View style={styles.ModalContainer}>
                <View style={styles.ModalContent}>
                    <Text style={styles.ModalTitle}>Actualizar perfil</Text>
                    <TextInput
                        style={styles.ModalInput}
                        placeholder="Nuevo nombre"
                        value={newNombre}
                        onChangeText={setNewNombre}
                         iconName="person-outline"
                        
                    />
                    <TextInput
                        style={styles.ModalInput}
                        placeholder="Nuevo email"
                        value={newEmail}
                        onChangeText={setNewEmail}
                        iconName="mail-outline"
                       
                    />
                    <TextInput
                        style={styles.ModalInput}
                        placeholder="Nueva contraseña"
                        secureTextEntry
                        value={newPassword}
                        onChangeText={setNewPassword}
                        iconName="lock-closed-outline"
                    />
                    <Button title="Guardar" onPress={handleChangeProfile} />
                    <Button title="Cancelar" variant="secondary" onPress={() => setModalVisible(false)} />
                </View>
            </View>
        </Modal>
            <ScrollView contentContainerStyle={styles.ScrollContent} showsVerticalScrollIndicator={false}>

                {/* Header de perfil */}
                <View style={styles.ProfileHeader}>
                  <View style={styles.AvatarWrapper}>
  {perfil?.perfilUsuario?.perfil ? (
    <Image
      source={{ uri: perfil.perfilUsuario.perfil }}
      style={styles.AvatarImage}
    />
  ) : (
    <Ionicons name="person-circle" size={90} color={COLORS.primary} />
  )}
</View>
                    <Text style={styles.NombreText}>{nombre}</Text>
                    
                </View>

                {/* Info personal */}
                <View style={styles.Section}>
                    <Text style={styles.SectionTitle}>Información personal</Text>

                    <View style={styles.InfoRow}>
                        <MaterialCommunityIcons name="email-outline" size={20} color={COLORS.primary} />
                        <Text style={styles.InfoLabel}>Email</Text>
                        <Text style={styles.InfoValue}>{email}</Text>
                    </View>

                    <View style={styles.Divider} />

                    <View style={styles.InfoRow}>
                        <Ionicons name="key-outline" size={20} color={COLORS.primary} />
                        <Text style={styles.InfoLabel}>Contraseña</Text>
                        <Text style={styles.InfoValue}>********</Text>
                       
                    </View>
                      <View>
                          <Button title="Actualizar perfil" onPress={() => setModalVisible(true)} />
                           
                        </View>
                </View>

                {/* Cuenta de Google */}
                <View style={styles.Section}>
                    <Text style={styles.SectionTitle}>Cuenta de Google</Text>
                    <View style={styles.InfoRow}>
                        <GoogleLogo size={19} />
                        <Text style={styles.InfoLabel}>Estado</Text>
                        <Text style={styles.InfoValue}>{googleVinculado ? 'Vinculada' : 'No vinculada'}</Text>
                    </View>
                    <View>
                        {googleVinculado ? (
                            <Button
                                title="Desvincular de Google"
                                loadingTitle="Desvinculando..."
                                variant="secondary"
                                loading={googleActionLoading}
                                onPress={handleUnlinkGoogle}
                            />
                        ) : (
                            <Button
                                title="Vincular con Google"
                                loadingTitle="Conectando con Google..."
                                variant="google"
                                icon={<GoogleLogo size={19} />}
                                loading={googleActionLoading}
                                disabled={!googleRequest}
                                onPress={handleGooglePress}
                            />
                        )}
                    </View>
                </View>

                {/* Stats */}
                <View style={styles.Section}>
                    <Text style={styles.SectionTitle}>Mis estadísticas</Text>
                    <View style={styles.StatsRow}>

                        <View style={styles.StatCard}>
                            <Ionicons name="flame" size={30} color="#ff4500" />
                            <Text style={styles.StatValue}>{racha}</Text>
                            <Text style={styles.StatLabel}>Días de racha</Text>
                        </View>

                        <View style={styles.StatCard}>
                            <FontAwesome name="star" size={30} color="#fee500" />
                            <Text style={styles.StatValue}>{puntos}</Text>
                            <Text style={styles.StatLabel}>Puntos</Text>
                        </View>

                    </View>
                </View>

                {/* Botón cerrar sesión */}
                <TouchableOpacity style={styles.LogoutButton} onPress={handleLogout} activeOpacity={0.8}>
                    <MaterialCommunityIcons name="logout" size={20} color={COLORS.danger} />
                    <Text style={styles.LogoutText}>Cerrar sesión</Text>
                </TouchableOpacity>

            </ScrollView>

            <Footer navigation={navigation} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    ModalContainer:{
       backfaceVisibility:'hidden',
        justifyContent:'center',
       alignItems:'center',
       bottom:0,
       top:0,
       left:0,
         right:0,
        backgroundColor:'rgba(0,0,0,0.5)',
        position:'absolute',
        zIndex:10,

    },
    ModalContent:{
        width:'80%',
        backgroundColor:COLORS.surfaceAlt,
        padding:20,
        borderRadius:10,
        borderWidth:1,
        borderColor:'rgba(255, 34, 51,0.2)',
        shadowColor:COLORS.primary,
        shadowOffset:{width:0,height:4},
        shadowOpacity:0.2,
        shadowRadius:15,
        elevation:8,
        gap:15,
    },
    ModalTitle:{
        fontSize:18,
        fontWeight:'700',
        color:'#ffffff',
        fontFamily:'Helvetica',
        letterSpacing:1,
        textTransform:'uppercase',
        marginBottom:15,
    },

    LoadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },
    Container: {
        flex: 1,
        backgroundColor: COLORS.background,
        justifyContent: 'space-between',
    },
    ScrollContent: {
        padding: 20,
        gap: 20,
    },

    // Header avatar
    ProfileHeader: {
        alignItems: 'center',
        paddingVertical: 30,
        borderRadius: 20,
        backgroundColor: COLORS.surfaceAlt,
        borderWidth: 1,
        borderColor: 'rgba(255, 34, 51, 0.2)',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 8,
    },
    AvatarWrapper: {
        marginBottom: 10,
    },
    NombreText: {
        fontSize: 22,
        fontWeight: '700',
        color: '#ffffff',
        fontFamily: 'Helvetica',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    TipoText: {
        marginTop: 6,
        fontSize: 10,
        color: COLORS.primary,
        letterSpacing: 2.5,
        fontFamily: 'Helvetica',
        textTransform: 'uppercase',
    },

    // Secciones
    Section: {
        backgroundColor: COLORS.surfaceAlt,
        borderRadius: 20,
        padding: 18,
        borderWidth: 1,
        borderColor: COLORS.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 6,
        gap: 12,
    },
    SectionTitle: {
        fontSize: 11,
        color: '#888',
        letterSpacing: 2,
        textTransform: 'uppercase',
        fontFamily: 'Helvetica',
        marginBottom: 4,
    },

    // Fila de info
    InfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    InfoLabel: {
        color: '#888',
        fontSize: 13,
        flex: 1,
        fontFamily: 'Helvetica',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    InfoValue: {
        color: '#ffffff',
        fontSize: 13,
        fontWeight: '600',
        fontFamily: 'Helvetica',
        letterSpacing: 0.5,
    },
    Divider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
    },

    // Stats
    StatsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        gap: 15,
    },
    StatCard: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.surfaceElevated,
        borderRadius: 15,
        paddingVertical: 20,
        borderWidth: 1,
        borderColor: COLORS.border,
        gap: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 5,
    },
    StatValue: {
        color: '#ffffff',
        fontSize: 22,
        fontWeight: '700',
        letterSpacing: 1,
    },
    StatLabel: {
        color: '#888',
        fontSize: 9,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        fontFamily: 'Helvetica',
        textAlign: 'center',
    },

    // Logout
    LogoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,71,87,0.12)',
        borderWidth: 1,
        borderColor: 'rgba(255,71,87,0.35)',
        borderRadius: 14,
        paddingVertical: 16,
        gap: 10,
        marginBottom: 10,
    },
    LogoutText: {
        color: COLORS.danger,
        fontSize: 14,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 2,
        fontFamily: 'Helvetica',
    },
    AvatarImage: {
  width: 90,
  height: 90,
  borderRadius: 45,
  borderWidth: 2,
  borderColor: COLORS.primary,
},
});

export default Perfil;