import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TextInput, FlatList, TouchableOpacity, Modal, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { getRutinas, getUserProfile, getCatalogoEjercicios, crearRutina } from "../services/services";
import Button from "../components/Button.js";

const MisRutinas = () => {
    const [rutinas, setRutinas] = useState([]);
    const [nombre_rutina, setNombreRutina] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [ejercicios, setEjercicios] = useState([]);
    const [ejerciciosSeleccionados, setEjerciciosSeleccionados] = useState([]);
    
    const navigation = useNavigation();

    const cargarDatos = async () => {
        try {
            const perfil = await getUserProfile();
            const userId = perfil?.perfilUsuario?.id_usuario;
            const [rutinasData, ejerciciosData] = await Promise.all([
                getRutinas(),
                getCatalogoEjercicios()
            ]);
            
            const rutinasUsuario = rutinasData?.rutinas?.filter(r => r.id_usuario === userId) || [];
            setRutinas(rutinasUsuario);
            setEjercicios(ejerciciosData || []);
        } catch (error) {
            console.error("Error cargando datos:", error);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const handleSeleccionarEjercicio = (id) => {
        const yaSeleccionado = ejerciciosSeleccionados.includes(id);

        if (yaSeleccionado) {
            setEjerciciosSeleccionados(ejerciciosSeleccionados.filter(eId => eId !== id));
        } else {
            if (ejerciciosSeleccionados.length < 6) {
                setEjerciciosSeleccionados([...ejerciciosSeleccionados, id]);
            } else {
                Alert.alert("Límite alcanzado", "Solo puedes añadir un máximo de 6 ejercicios.");
            }
        }
    };

    const handleGuardarRutina = async () => {
        if (!nombre_rutina.trim() || ejerciciosSeleccionados.length === 0) {
            Alert.alert("Error", "Completa el nombre y selecciona ejercicios.");
            console.log("Validación fallida: nombre_rutina:", nombre_rutina, "ejerciciosSeleccionados:", ejerciciosSeleccionados);
            return;
        }

        try {
            const resultado = await crearRutina(nombre_rutina, ejerciciosSeleccionados);

            if (resultado) {
                await cargarDatos(); 
                setModalVisible(false);
                setNombreRutina('');
                setEjerciciosSeleccionados([]);
                Alert.alert("Éxito", "Rutina guardada correctamente");
            }
        } catch (error) {
            console.error("Error al guardar:", error);
            Alert.alert("Error", "No se pudo guardar la rutina en el servidor.");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Modal visible={modalVisible} animationType="fade" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Nueva Rutina</Text>
                        
                        <TextInput 
                            style={styles.input} 
                            placeholder="Nombre de la rutina" 
                            placeholderTextColor="#999"
                            value={nombre_rutina}
                            onChangeText={setNombreRutina}
                        />

                        <Text style={styles.label}>Ejercicios ({ejerciciosSeleccionados.length}/6)</Text>
                        <FlatList 
                            data={ejercicios}
                            keyExtractor={(item) => item.id_ejercicio.toString()}
                            style={styles.flatList}
                            renderItem={({ item }) => {
                                const isSelected = ejerciciosSeleccionados.includes(item.id_ejercicio);
                                return (
                                    <TouchableOpacity 
                                        style={[styles.ejercicioItem, isSelected && styles.ejercicioSelected]}
                                        onPress={() => handleSeleccionarEjercicio(item.id_ejercicio)}
                                    >
                                        <Text style={[styles.ejercicioText, isSelected && {color: '#fff'}]}>
                                            {item.nombre_ejercicio}
                                        </Text>
                                        <Ionicons 
                                            name={isSelected ? "checkmark-circle" : "add-circle-outline"} 
                                            size={22} 
                                            color={isSelected ? "#fff" : "#d30a0a"} 
                                        />
                                    </TouchableOpacity>
                                );
                            }}
                        />

                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={styles.btnSecundario} onPress={() => setModalVisible(false)}>
                                <Text style={styles.btnSecundarioText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnPrimario} onPress={handleGuardarRutina}>
                                <Text style={styles.btnPrimarioText}>Crear</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Text style={styles.title}>MIS RUTINAS</Text>
            
            <FlatList 
                data={rutinas}
                keyExtractor={(item) => item.id_rutina.toString()}
                ListEmptyComponent={
                    <View style={styles.MessageContainer}>
                        <Text style={styles.noRutinas}>No tienes rutinas creadas.</Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <View style={styles.rutinaContainer}>
                        <Text style={styles.rutinaNombre}>{item.nombre_rutina}</Text>
                        <View style={styles.ejerciciosCount}>
                           <Text style={styles.countText}>Ejercicios seleccionados: {item.ejercicios}</Text>
                        </View>
                    </View>
                )}
            />

            <Button title="CREAR NUEVA RUTINA" onPress={() => setModalVisible(true)} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: 20, 
        backgroundColor: '#060606'

    },
    title: { fontSize: 26, 
        fontWeight: '900', marginBottom: 25,
         color: '#d30a0a',
          textAlign: 'center',
           letterSpacing: 2 
        },
    modalOverlay: { flex: 1,
         backgroundColor: 'rgba(0,0,0,0.9)',
          justifyContent: 'center',
           alignItems: 'center'
         },
    modalContent: { width: '90%',
         backgroundColor: '#161616',
          borderRadius: 20,
           padding: 25, 
           borderWidth: 1,
            borderColor: '#333'
         },
    modalTitle: { fontSize: 22, 
        fontWeight: 'bold', color: '#fff',
         marginBottom: 20, textAlign: 'center' 
        },
    input: { backgroundColor: '#222',
         color: '#fff',
         padding: 15, 
         borderRadius: 10,
          marginBottom: 20, 
          fontSize: 16 

        },
    label: { color: '#888',
         fontSize: 14, 
         fontWeight: 'bold',
          marginBottom: 10, 
          textTransform: 'uppercase'
         },
    flatList: { maxHeight: 300,
         marginBottom: 20 
        },
    ejercicioItem: { flexDirection: 'row',
         justifyContent: 'space-between',
          padding: 15, backgroundColor: '#222',
           borderRadius: 10, 
           marginBottom: 8,
            alignItems: 'center' },

    ejercicioSelected: { backgroundColor: '#d30a0a'

     },
    ejercicioText: { color: '#ddd',
         fontSize: 15 
        },
    buttonRow: { flexDirection: 'row',
         justifyContent: 'space-between',
          marginTop: 10 
        },
    btnPrimario: { backgroundColor: '#d30a0a',
         padding: 15,
          borderRadius: 10,
           width: '48%', 
           alignItems: 'center'
         },
    btnPrimarioText: { color: '#fff'
        , fontWeight: 'bold',
         fontSize: 16 
        },
    btnSecundario: { backgroundColor: '#333',
         padding: 15,
          borderRadius: 10,
           width: '48%', 
           alignItems: 'center'
         },
    btnSecundarioText: { color: '#ccc',
         fontWeight: 'bold',
         fontSize: 16 
        },
    rutinaContainer: { marginBottom: 15,
         padding: 20,
          backgroundColor: '#121212',
           borderRadius: 15,
            borderWidth: 1,
             borderColor: '#222'
             },
    rutinaNombre: { fontSize: 18, color: '#fff',
         fontWeight: 'bold',
          marginBottom: 4 
        },
    ejerciciosCount: { marginTop: 4 },
    countText: { color: '#555',
         fontSize: 12, fontWeight: '600'
         },
    MessageContainer: { padding: 40,
         alignItems: 'center'
         },
    noRutinas: { fontSize: 16, 
        color: '#444',

         fontWeight: 'bold' }
});

export default MisRutinas;