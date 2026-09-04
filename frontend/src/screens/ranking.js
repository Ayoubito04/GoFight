//Aquí vamos a meter el ranking de los juegadores con sus puntos y demás, para que puedan ver su posición en el ranking mundial
import React, { useEffect, useRef, useState } from 'react';
import { getRanking, getUserProfile } from '../services/services';
import {View, Text, StyleSheet, ScrollView, Animated} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import TextInputComponent from '../components/TextInput';
import Header from '../components/HeaderComponent';
import Footer from '../components/Footer';
import { useToast } from '../components/Toast';
import { COLORS, RADIUS, SPACING, shadow } from '../theme';

//Colores de medalla para los tres primeros,el resto va en el rojo de la marca
const medalColor=(index)=>{
    if(index===0) return COLORS.gold;
    if(index===1) return COLORS.silver;
    if(index===2) return COLORS.bronze;
    return COLORS.primary;
};
const medalTint=(index)=>{
    if(index===0) return 'rgba(236,193,18,0.12)';
    if(index===1) return 'rgba(192,192,192,0.1)';
    if(index===2) return 'rgba(205,127,50,0.12)';
    return COLORS.surfaceElevated;
};
//El primero se lleva el trofeo,el segundo y el tercero una medalla
const medalIcon=(index)=>(index===0 ? 'trophy' : 'medal');

//La inicial del nombre nos sirve de avatar,así cada luchador se distingue de un vistazo sin necesitar fotos
const inicial=(nombre)=>(nombre?.trim()?.charAt(0) || '?').toUpperCase();

//Mientras llegan los datos enseñamos la misma lista en gris con un parpadeo suave,igual que en el Home
const SkeletonRanking=()=>{
    const pulso=useRef(new Animated.Value(0.4)).current;
    useEffect(()=>{
        const animacion=Animated.loop(Animated.sequence([
            Animated.timing(pulso,{toValue:1,duration:700,useNativeDriver:true}),
            Animated.timing(pulso,{toValue:0.4,duration:700,useNativeDriver:true}),
        ]));
        animacion.start();
        return()=>animacion.stop();
    },[pulso]);

    return(
        <View style={styles.listContent}>
            <View style={styles.podioContainer}>
                {[0,1,2].map((i)=>(
                    <Animated.View key={i} style={[styles.podioCard, i===1 && styles.podioCardFirst, {opacity:pulso}]}/>
                ))}
            </View>
            {[0,1,2,3,4].map((i)=>(
                <Animated.View key={i} style={[styles.skeletonRow,{opacity:pulso}]}/>
            ))}
        </View>
    )
};

const Ranking=()=>{
    const [ranking,setRanking]=useState([]);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState(null);
    const [searchUser,setSearchUser]=useState('');
    //Guardamos el id del usuario que ha iniciado sesión,para poder resaltar su fila dentro del ranking
    const [miId,setMiId]=useState(null);
    const showToast=useToast();
    //Estado para poder encontrar a un usuario en el ranking,para eso vamos a implementar un buscador,que va a ser un input de texto,que va a filtrar el ranking por el nombre del usuario,para poder encontrarlo más fácilmente,ya que si hay muchos usuarios en el ranking,puede ser difícil encontrarlo,por lo tanto,es importante implementar un buscador para poder encontrarlo más fácilmente
    //Tocará crear un servicio para obtener el ranking,que se va a basar en los puntos_ranking de cada usuario,que se van a actualizar cada vez que se registre una sesión en el historial
    useEffect(()=>{
        const fetchRanking=async()=>{
            try{
                //Si falla el perfil no queremos cargarnos el ranking entero,solo nos quedaríamos sin resaltar la fila propia
                const [rankingData,perfilData]=await Promise.all([
                    getRanking(),
                    getUserProfile().catch(()=>null),
                ]);
                setRanking(rankingData);
                setMiId(perfilData?.perfilUsuario?.id_usuario ?? null);
            }catch(error){
                setError(error.message);
                showToast('No se ha podido cargar el ranking','error');
            }finally{
                setLoading(false);
            }
        }
        fetchRanking();
    }, []);
    const UsuarioFiltrado=ranking.filter(jugador=>jugador.usuarios.nombre.toLowerCase().includes(searchUser.toLowerCase()));

    const isSearching=searchUser.trim().length>0;
    const podio=!isSearching ? UsuarioFiltrado.slice(0,3) : [];
    const resto=isSearching ? UsuarioFiltrado : UsuarioFiltrado.slice(3);
    //En el podio el primero va en el centro y más alto,como en un podio de verdad
    const podioVisual=[1,0,2]
        .map((i)=>(podio[i] ? {jugador:podio[i],index:i} : null))
        .filter(Boolean);

    if(loading){
        return (
            <SafeAreaView style={styles.container}>
                <Header/>
                <SkeletonRanking/>
                <Footer/>
            </SafeAreaView>
        );
    }
    if(error){
        return (
            <SafeAreaView style={styles.container}>
                <Header/>
                <View style={styles.stateContainer}>
                    <View style={styles.stateBubble}>
                        <Ionicons name="cloud-offline-outline" size={26} color={COLORS.danger}/>
                    </View>
                    <Text style={styles.stateTitle}>No hemos podido cargar el ranking</Text>
                    <Text style={styles.stateText}>{error}</Text>
                </View>
                <Footer/>
            </SafeAreaView>
        );
    }
    return (
       <SafeAreaView style={styles.container}>
        <Header/>
        <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <View style={styles.HeroCard}>
                <View style={styles.HeroAccent}/>
                <Text style={styles.HeroEyebrow}>CLASIFICACIÓN GLOBAL</Text>
                <Text style={styles.HeroTitle}>Ranking de luchadores</Text>
                <View style={styles.HeroMetaRow}>
                    <Ionicons name="people" size={14} color={COLORS.textSecondary}/>
                    <Text style={styles.HeroText}>{ranking.length} {ranking.length===1 ? 'luchador compitiendo' : 'luchadores compitiendo'}</Text>
                </View>
            </View>

            <View style={styles.searchWrapper}>
                <TextInputComponent placeholder="Buscar jugador..." value={searchUser} onChangeText={setSearchUser} iconName="search"/>
            </View>

            {UsuarioFiltrado.length===0 ? (
                <View style={styles.stateContainer}>
                    <View style={styles.stateBubbleMuted}>
                        <Ionicons name="search" size={24} color={COLORS.textMuted}/>
                    </View>
                    <Text style={styles.stateTitle}>Sin resultados</Text>
                    <Text style={styles.stateText}>No hay ningún luchador con ese nombre.</Text>
                </View>
            ) : (
                <>
                    {podioVisual.length>0 && (
                        <View style={styles.podioContainer}>
                            {podioVisual.map(({jugador,index})=>{
                                const esMio=miId!==null && jugador.id_usuario===miId;
                                return (
                                <View
                                    key={index}
                                    style={[
                                        styles.podioCard,
                                        index===0 && styles.podioCardFirst,
                                        {borderColor: medalColor(index)},
                                        esMio && styles.podioCardMio,
                                    ]}
                                >
                                    <View style={[styles.podioMedalla,{backgroundColor: medalTint(index)}]}>
                                        <Ionicons name={medalIcon(index)} size={index===0 ? 17 : 15} color={medalColor(index)}/>
                                    </View>
                                    <View style={[styles.podioAvatar, index===0 && styles.podioAvatarFirst, {borderColor: medalColor(index), backgroundColor: medalTint(index)}]}>
                                        <Text style={[styles.podioInicial, index===0 && styles.podioInicialFirst, {color: medalColor(index)}]}>{inicial(jugador.usuarios.nombre)}</Text>
                                    </View>
                                    <Text style={styles.podioNombre} numberOfLines={1}>{jugador.usuarios.nombre}</Text>
                                    <View style={styles.podioPuntosRow}>
                                        <Text style={[styles.podioPuntos,{color: medalColor(index)}]}>{jugador.puntos_ranking}</Text>
                                        <Text style={styles.podioPuntosUnidad}>pts</Text>
                                    </View>
                                    {esMio && <View style={styles.tuBadgePodio}><Text style={styles.tuBadgeText}>TÚ</Text></View>}
                                </View>
                                );
                            })}
                        </View>
                    )}

                    {resto.length>0 && (
                        <View style={styles.SectionHeader}>
                            <Text style={styles.SectionTitle}>Clasificación</Text>
                            <Text style={styles.SectionCaption}>{isSearching ? 'RESULTADOS' : 'DEL 4º EN ADELANTE'}</Text>
                        </View>
                    )}

                    {resto.map((jugador,index)=>{
                        const posicion=isSearching ? ranking.indexOf(jugador) + 1 : index + 4;
                        const esMio=miId!==null && jugador.id_usuario===miId;
                        //En la búsqueda un top 3 puede aparecer en la lista,así que le mantenemos su color de medalla
                        const esPodio=posicion<=3;
                        return (
                            <View key={jugador.id_usuario ?? index} style={[styles.jugadorContainer, esMio && styles.jugadorContainerMio]}>
                                <View style={[styles.jugadorPosicionBadge, esPodio && {backgroundColor: medalTint(posicion-1)}]}>
                                    <Text style={[styles.jugadorPosicion, esPodio && {color: medalColor(posicion-1)}]}>{posicion}</Text>
                                </View>
                                <View style={[styles.jugadorAvatar, esMio && styles.jugadorAvatarMio]}>
                                    <Text style={[styles.jugadorInicial, esMio && styles.jugadorInicialMio]}>{inicial(jugador.usuarios.nombre)}</Text>
                                </View>
                                <View style={styles.jugadorInfo}>
                                    <View style={styles.jugadorNombreRow}>
                                        <Text style={styles.jugadorNombre} numberOfLines={1}>{jugador.usuarios.nombre}</Text>
                                        {esMio && <View style={styles.tuBadge}><Text style={styles.tuBadgeText}>TÚ</Text></View>}
                                    </View>
                                    {jugador.usuarios.perfil ? <Text style={styles.jugadorPerfil} numberOfLines={1}>{jugador.usuarios.perfil}</Text> : null}
                                </View>
                                <View style={styles.jugadorPuntosRow}>
                                    <Text style={styles.jugadorPuntos}>{jugador.puntos_ranking}</Text>
                                    <Text style={styles.jugadorPuntosUnidad}>pts</Text>
                                </View>
                            </View>
                        );
                    })}
                </>
            )}
        </ScrollView>
        <Footer/>
       </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    listContent: {
        paddingHorizontal: SPACING.lg,
        paddingBottom: SPACING.xxl,
    },
    //Cabecera con el mismo formato que la tarjeta principal del Home,para que las pantallas se reconozcan entre sí
    HeroCard: {
        marginTop: SPACING.md,
        marginBottom: SPACING.lg,
        padding: SPACING.xl,
        borderRadius: RADIUS.xl,
        overflow: 'hidden',
        backgroundColor: COLORS.surfaceElevated,
        borderWidth: 1,
        borderColor: 'rgba(255,34,51,0.34)',
        ...shadow(COLORS.primaryGlow, 0.3, 18, 8, { width: 0, height: 6 }),
    },
    HeroAccent: {
        position: 'absolute',
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: 'rgba(255,34,51,0.14)',
        right: -68,
        top: -74,
    },
    HeroEyebrow: {
        color: COLORS.primary,
        fontSize: 10,
        letterSpacing: 1.6,
        fontWeight: '800',
        marginBottom: SPACING.sm,
    },
    HeroTitle: {
        color: COLORS.textPrimary,
        fontSize: 26,
        fontWeight: '900',
        letterSpacing: -0.5,
    },
    HeroMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
        marginTop: SPACING.sm,
    },
    HeroText: {
        color: COLORS.textSecondary,
        fontSize: 13,
    },
    searchWrapper: {
        marginBottom: SPACING.xs,
    },
    SectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: SPACING.md,
        marginBottom: SPACING.md,
    },
    SectionTitle: {
        color: COLORS.textPrimary,
        fontSize: 18,
        fontWeight: '800',
    },
    SectionCaption: {
        color: COLORS.textMuted,
        fontSize: 10,
        letterSpacing: 1.4,
        fontWeight: '800',
    },
    //Estados de error y de búsqueda sin resultados,con la misma tarjeta centrada
    stateContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SPACING.xxl,
        paddingHorizontal: SPACING.lg,
    },
    stateBubble: {
        width: 54,
        height: 54,
        borderRadius: 27,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,71,87,0.12)',
        marginBottom: SPACING.md,
    },
    stateBubbleMuted: {
        width: 54,
        height: 54,
        borderRadius: 27,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.surfaceElevated,
        marginBottom: SPACING.md,
    },
    stateTitle: {
        color: COLORS.textPrimary,
        fontSize: 15,
        fontWeight: '800',
        textAlign: 'center',
    },
    stateText: {
        color: COLORS.textSecondary,
        fontSize: 13,
        textAlign: 'center',
        marginTop: SPACING.xs,
    },
    //Podio: el primero en el centro y más alto,como en un podio real
    podioContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: SPACING.sm,
        marginBottom: SPACING.lg,
    },
    podioCard: {
        flex: 1,
        minHeight: 168,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.lg,
        borderWidth: 1,
        paddingVertical: SPACING.lg,
        paddingHorizontal: SPACING.xs,
        ...shadow('#000', 0.35, 12, 6, { width: 0, height: 5 }),
    },
    podioCardFirst: {
        minHeight: 196,
        paddingVertical: SPACING.xl,
    },
    podioCardMio: {
        backgroundColor: 'rgba(255,34,51,0.07)',
    },
    podioMedalla: {
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.sm,
    },
    podioAvatar: {
        width: 46,
        height: 46,
        borderRadius: RADIUS.pill,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    podioAvatarFirst: {
        width: 56,
        height: 56,
    },
    podioInicial: {
        fontSize: 18,
        fontWeight: '900',
    },
    podioInicialFirst: {
        fontSize: 22,
    },
    podioNombre: {
        fontSize: 13,
        color: COLORS.textPrimary,
        fontWeight: '700',
        marginBottom: SPACING.xs,
        textAlign: 'center',
    },
    podioPuntosRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 3,
    },
    podioPuntos: {
        fontSize: 17,
        fontWeight: '900',
        letterSpacing: -0.4,
    },
    podioPuntosUnidad: {
        fontSize: 11,
        fontWeight: '700',
        color: COLORS.textSecondary,
    },
    //Filas de la clasificación
    jugadorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.sm,
        padding: SPACING.md,
        borderRadius: RADIUS.lg,
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
        gap: SPACING.md,
        ...shadow('#000', 0.3, 10, 4, { width: 0, height: 3 }),
    },
    //Tu propia fila se resalta en rojo,para localizarte de un vistazo en la lista
    jugadorContainerMio: {
        borderColor: 'rgba(255,34,51,0.55)',
        backgroundColor: 'rgba(255,34,51,0.07)',
    },
    jugadorPosicionBadge: {
        width: 30,
        height: 30,
        borderRadius: RADIUS.pill,
        backgroundColor: COLORS.surfaceElevated,
        justifyContent: 'center',
        alignItems: 'center',
    },
    jugadorPosicion: {
        fontSize: 13,
        fontWeight: '800',
        color: COLORS.textSecondary,
        textAlign: 'center',
    },
    jugadorAvatar: {
        width: 38,
        height: 38,
        borderRadius: RADIUS.pill,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.surfaceElevated,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    jugadorAvatarMio: {
        backgroundColor: 'rgba(255,34,51,0.14)',
        borderColor: 'rgba(255,34,51,0.4)',
    },
    jugadorInicial: {
        fontSize: 15,
        fontWeight: '900',
        color: COLORS.textSecondary,
    },
    jugadorInicialMio: {
        color: COLORS.primary,
    },
    jugadorInfo: {
        flex: 1,
    },
    jugadorNombreRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
    },
    jugadorNombre: {
        flexShrink: 1,
        fontSize: 15,
        color: COLORS.textPrimary,
        fontWeight: '700',
    },
    jugadorPerfil: {
        fontSize: 11,
        color: COLORS.textMuted,
        marginTop: 2,
    },
    tuBadge: {
        paddingHorizontal: SPACING.sm,
        paddingVertical: 2,
        borderRadius: RADIUS.pill,
        backgroundColor: COLORS.primary,
    },
    tuBadgePodio: {
        marginTop: SPACING.sm,
        paddingHorizontal: SPACING.sm,
        paddingVertical: 2,
        borderRadius: RADIUS.pill,
        backgroundColor: COLORS.primary,
    },
    tuBadgeText: {
        fontSize: 9,
        fontWeight: '900',
        letterSpacing: 0.8,
        color: COLORS.onPrimary,
    },
    jugadorPuntosRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 3,
    },
    jugadorPuntos: {
        fontSize: 17,
        fontWeight: '900',
        color: COLORS.textPrimary,
        letterSpacing: -0.4,
    },
    jugadorPuntosUnidad: {
        fontSize: 11,
        fontWeight: '700',
        color: COLORS.textSecondary,
    },
    skeletonRow: {
        height: 62,
        borderRadius: RADIUS.lg,
        backgroundColor: COLORS.surface,
        marginBottom: SPACING.sm,
    },

});
export default Ranking;
