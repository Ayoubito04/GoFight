import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TextInput, FlatList, TouchableOpacity, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { getRutinas, getUserProfile, getCatalogoEjercicios, crearRutina,EliminarRutina} from "../services/services";
import Button from "../components/Button.js";
import Footer from "../components/Footer.js";
import { COLORS, RADIUS, SPACING, difficultyColor, shadow } from "../theme";
import ErrorMsg from "../components/ErrorMsg.js";
import ConfirmDialog from "../components/ConfirmDialog.js";
import { useToast } from "../components/Toast.js";

const MisRutinas = () => {
    const [rutinas, setRutinas] = useState([]);
    const [nombre_rutina, setNombreRutina] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [ejercicios, setEjercicios] = useState([]);
    const [ejerciciosSeleccionados, setEjerciciosSeleccionados] = useState([]);
    //Los errores del formulario se muestran dentro del propio modal,porque un aviso flotante quedaría tapado por él
    const [modalError, setModalError] = useState('');
    //Guardamos el id de la rutina que se quiere eliminar,para enseñar el diálogo de confirmación
    const [rutinaAEliminar, setRutinaAEliminar] = useState(null);

    const navigation = useNavigation();
    const showToast = useToast();

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
            showToast('No se han podido cargar tus rutinas', 'error');
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const handleSeleccionarEjercicio = (id) => {
        const yaSeleccionado = ejerciciosSeleccionados.includes(id);

        if (yaSeleccionado) {
            setEjerciciosSeleccionados(ejerciciosSeleccionados.filter(eId => eId !== id));
            setModalError('');
        } else {
            if (ejerciciosSeleccionados.length < 6) {
                setEjerciciosSeleccionados([...ejerciciosSeleccionados, id]);
                setModalError('');
            } else {
                setModalError('Solo puedes añadir un máximo de 6 ejercicios.');
            }
        }
    };

    //Al cerrar el modal dejamos el formulario limpio,para que la próxima vez se abra en blanco
    const cerrarModal = () => {
        setModalVisible(false);
        setNombreRutina('');
        setEjerciciosSeleccionados([]);
        setModalError('');
    };

    const handleGuardarRutina = async () => {
        if (!nombre_rutina.trim() || ejerciciosSeleccionados.length === 0) {
            setModalError('Completa el nombre y selecciona al menos un ejercicio.');
            console.log("Validación fallida: nombre_rutina:", nombre_rutina, "ejerciciosSeleccionados:", ejerciciosSeleccionados);
            return;
        }

        try {
            const resultado = await crearRutina(nombre_rutina, ejerciciosSeleccionados);

            if (resultado) {
                await cargarDatos();
                cerrarModal();
                showToast('Rutina guardada correctamente', 'success');
            }
        } catch (error) {
            console.error("Error al guardar:", error);
            setModalError('No se ha podido guardar la rutina en el servidor.');
        }
    };
    //Antes de borrar pedimos confirmación con el diálogo propio de la app,para evitar eliminaciones accidentales
    const handleEliminarRutina =(id)=>{
        setRutinaAEliminar(id);
    };
    const confirmarEliminarRutina=async()=>{
        const id=rutinaAEliminar;
        setRutinaAEliminar(null);
        try{
            const eliminarResultado=await EliminarRutina(id);
            if(eliminarResultado){
                await cargarDatos();
                showToast('Rutina eliminada','success');
            }
        }catch(error){
            console.error("Error al eliminar:",error);
            showToast('No se ha podido eliminar la rutina','error');
        }
    }

    return (
        <SafeAreaView style={styles.safeArea}>
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
                                        <Text style={[styles.ejercicioText, isSelected && {color: COLORS.onPrimary}]}>
                                            {item.nombre}
                                        </Text>
                                        <Ionicons
                                            name={isSelected ? "checkmark-circle" : "add-circle-outline"}
                                            size={22}
                                            color={isSelected ? COLORS.onPrimary : COLORS.primary}
                                        />
                                    </TouchableOpacity>
                                );
                            }}
                        />

                        {modalError ? <ErrorMsg message={modalError}/> : null}

                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={styles.btnSecundario} onPress={cerrarModal}>
                                <Text style={styles.btnSecundarioText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnPrimario} onPress={handleGuardarRutina}>
                                <Text style={styles.btnPrimarioText}>Crear</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <ConfirmDialog
                visible={rutinaAEliminar !== null}
                title="Eliminar rutina"
                message="Esta acción no se puede deshacer. ¿Seguro que quieres eliminarla?"
                confirmText="Eliminar"
                icon="trash"
                destructive
                onConfirm={confirmarEliminarRutina}
                onCancel={() => setRutinaAEliminar(null)}
            />

            <View style={styles.container}>
                <Text style={styles.title}>MIS RUTINAS</Text>

                <FlatList
                    data={rutinas}
                    keyExtractor={(item) => item.id_rutina.toString()}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.MessageContainer}>
                            <Text style={styles.noRutinas}>No tienes rutinas creadas.</Text>
                        </View>
                    }
                    renderItem={({ item }) => {
                        const color = difficultyColor(item.dificultad);
                        return (
                        <View style={styles.rutinaContainer}>
                            <Text style={styles.rutinaNombre}>{item.nombre_rutina}</Text>
                            <View style={styles.ejerciciosDificultadView}>
                                <Text style={[styles.dificultadTag, { borderColor: color, color }]}>{item.dificultad}</Text>
                                <Button title="Eliminar" variant="secondary" onPress={() => handleEliminarRutina(item.id_rutina)} />
                            </View>
                        </View>
                        );
                    }}
                />

                <Button title="CREAR NUEVA RUTINA" onPress={() => { setModalError(''); setModalVisible(true); }} />
            </View>

            <Footer />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.background,
        justifyContent: 'space-between',
    },
    container: {
        flex: 1,
        padding: SPACING.xl,
    },
    listContent: {
        paddingBottom: SPACING.md,
    },
    title: {
        fontSize: 26,
        fontWeight: '800',
        marginBottom: SPACING.lg,
        color: COLORS.primary,
        textAlign: 'center',
        letterSpacing: 3,
        textShadowColor: 'rgba(255, 34, 51, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 8
        },
    modalOverlay: {    flex: 1,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'center',
        alignItems: 'center'
         },
    modalContent: {   width: '90%',
        maxHeight: '85%',
        backgroundColor: COLORS.surfaceAlt,
        borderRadius: RADIUS.xl,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 34, 51, 0.15)',
        ...shadow(COLORS.primary,0.1,20,10,{width:0,height:0}),
         },
    modalTitle: {  fontSize: 22,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: SPACING.lg,
        textAlign: 'center',
        letterSpacing: 1
        },
    input: { backgroundColor: COLORS.surfaceElevated,
        color: COLORS.textPrimary,
        padding: SPACING.lg,
        borderRadius: RADIUS.md,
        marginBottom: SPACING.lg,
        fontSize: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
        fontWeight: '500'

        },
    label: {color: COLORS.textSecondary,
        fontSize: 13,
        fontWeight: '700',
        marginBottom: SPACING.md,
        textTransform: 'uppercase',
        letterSpacing: 1.5
         },
    flatList: {  maxHeight: 320,
        marginBottom: SPACING.lg
        },
    ejercicioItem: {   flexDirection: 'row',
        justifyContent: 'space-between',
        padding: SPACING.lg,
        backgroundColor: COLORS.surfaceElevated,
        borderRadius: RADIUS.md,
        marginBottom: SPACING.sm,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border },

    ejercicioSelected: { backgroundColor: COLORS.primary

     },
    ejercicioText: { color: '#ddd',
         fontSize: 15
        },
    buttonRow: { flexDirection: 'row',
         justifyContent: 'space-between',
          marginTop: SPACING.sm
        },
    btnPrimario: { backgroundColor: COLORS.primary,
         padding: SPACING.lg,
          borderRadius: RADIUS.md,
           width: '48%',
           alignItems: 'center'
         },
    btnPrimarioText: { color: COLORS.onPrimary
        , fontWeight: 'bold',
         fontSize: 16
        },
    btnSecundario: { backgroundColor: COLORS.surfaceElevated,
         padding: SPACING.lg,
          borderRadius: RADIUS.md,
           width: '48%',
           alignItems: 'center'
         },
    btnSecundarioText: { color: '#ccc',
         fontWeight: 'bold',
         fontSize: 16
        },
    rutinaContainer: { marginBottom: SPACING.md,
         padding: SPACING.xl,
          backgroundColor: COLORS.surface,
           borderRadius: RADIUS.lg,
            borderWidth: 1,
             borderColor: COLORS.border
             },
    rutinaNombre: { fontSize: 18, color: COLORS.textPrimary,
         fontWeight: 'bold',
          marginBottom: 4
        },
    ejerciciosDificultadView: {
        marginTop: SPACING.sm,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: SPACING.sm,
    },
    dificultadTag: {
        borderWidth: 1,
        borderRadius: RADIUS.sm,
        paddingHorizontal: SPACING.sm,
        paddingVertical: 4,
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
        alignSelf: 'flex-start',
    },
    countText: { color: '#353131',
         fontSize: 12, fontWeight: '600'
         },
    MessageContainer: { padding: 40,
         alignItems: 'center'
         },
    noRutinas: { fontSize: 16, 
        color: '#444',

         fontWeight: 'bold' },

         
});

export default MisRutinas;