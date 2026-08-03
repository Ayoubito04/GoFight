//Aquí vamos a meter el ranking de los juegadores con sus puntos y demás, para que puedan ver su posición en el ranking mundial
import React, { useEffect, useState } from 'react';
import { getRanking } from '../services/services';
import {View, Text, StyleSheet, ScrollView, ActivityIndicator} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TextInputComponent from '../components/TextInput';
import Header from '../components/HeaderComponent';
import Footer from '../components/Footer';
import { COLORS, RADIUS, SPACING, shadow } from '../theme';

const Ranking=()=>{
    const [ranking,setRanking]=useState([]);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState(null);
    const [searchUser,setSearchUser]=useState('');
    //Estado para poder encontrar a un usuario en el ranking,para eso vamos a implementar un buscador,que va a ser un input de texto,que va a filtrar el ranking por el nombre del usuario,para poder encontrarlo más fácilmente,ya que si hay muchos usuarios en el ranking,puede ser difícil encontrarlo,por lo tanto,es importante implementar un buscador para poder encontrarlo más fácilmente
    //Tocará crear un servicio para obtener el ranking,que se va a basar en los puntos_ranking de cada usuario,que se van a actualizar cada vez que se registre una sesión en el historial,ya que cada vez que se registre una sesión en el historial,tenemos que actualizar las gamificaciones,por lo tanto,es importante actualizar el ranking cada vez que se registre una sesión en el historial,para ver si se actualiza correctamente
    useEffect(()=>{
        const fetchRanking=async()=>{
            try{
                const rankingData=await getRanking();
                setRanking(rankingData);
            }catch(error){
                setError(error.message);
            }finally{
                setLoading(false);
            }
        }
        fetchRanking();
    }, []);
    const UsuarioFiltrado=ranking.filter(jugador=>jugador.usuarios.nombre.toLowerCase().includes(searchUser.toLowerCase()));

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

    const isSearching=searchUser.trim().length>0;
    const podio=!isSearching ? UsuarioFiltrado.slice(0,3) : [];
    const resto=isSearching ? UsuarioFiltrado : UsuarioFiltrado.slice(3);

    if(loading){
        return (
            <View style={styles.stateContainer}>
                <ActivityIndicator size="large" color={COLORS.primary}/>
            </View>
        );
    }
    if(error){
        return (
            <View style={styles.stateContainer}>
                <Text style={styles.errorText}>Error: {error}</Text>
            </View>
        );
    }
    return (
       <SafeAreaView style={styles.container}>
        <Header/>
        <Text style={styles.title}>Ranking de luchadores</Text>
        <View style={styles.searchWrapper}>
            <TextInputComponent placeholder="Buscar jugador..." value={searchUser} onChangeText={setSearchUser} iconName="search"/>
        </View>
        <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
            {UsuarioFiltrado.length===0 ? (
                <Text style={styles.emptyText}>No se encontraron jugadores.</Text>
            ) : (
                <>
                    {podio.length>0 && (
                        <View style={styles.podioContainer}>
                            {podio.map((jugador,index)=>(
                                <View key={index} style={[styles.podioCard, index===0 && styles.podioCardFirst]}>
                                    <View style={[styles.podioAvatar, index===0 && styles.podioAvatarFirst, {borderColor: medalColor(index), backgroundColor: medalTint(index)}]}>
                                        <Text style={[styles.podioPosicion, {color: medalColor(index)}]}>{index + 1}</Text>
                                    </View>
                                    <Text style={styles.podioNombre} numberOfLines={1}>{jugador.usuarios.nombre}</Text>
                                    <Text style={styles.podioPuntos}>{jugador.puntos_ranking} pts</Text>
                                </View>
                            ))}
                        </View>
                    )}
                    {resto.map((jugador,index)=>{
                        const posicion=isSearching ? index + 1 : index + 4;
                        return (
                            <View key={index} style={styles.jugadorContainer}>
                                <View style={styles.jugadorPosicionBadge}>
                                    <Text style={styles.jugadorPosicion}>{posicion}</Text>
                                </View>
                                <Text style={styles.jugadorNombre} numberOfLines={1}>{jugador.usuarios.nombre}</Text>
                                <Text style={styles.jugadorPuntos}>{jugador.puntos_ranking} pts</Text>
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
    stateContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },
    errorText: {
        color: COLORS.danger,
        fontSize: 15,
        fontWeight: '600',
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        marginTop: SPACING.lg,
        marginBottom: SPACING.md,
        color: COLORS.primary,
        textAlign: 'center',
        letterSpacing: 3,
        textShadowColor: 'rgba(255, 34, 51, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 8
    },
    searchWrapper: {
        paddingHorizontal: SPACING.lg,
    },
    listContent: {
        paddingHorizontal: SPACING.lg,
        paddingBottom: SPACING.xl,
    },
    emptyText: {
        color: COLORS.textMuted,
        textAlign: 'center',
        marginTop: SPACING.xl,
        fontSize: 14,
    },
    podioContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: SPACING.sm,
        marginBottom: SPACING.lg,
    },
    podioCard: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.lg,
        paddingVertical: SPACING.lg,
        paddingHorizontal: SPACING.xs,
        ...shadow(COLORS.primary, 0.12, 10, 6, { width: 0, height: 4 }),
    },
    podioCardFirst: {
        paddingVertical: SPACING.xl,
        marginBottom: SPACING.sm,
    },
    podioAvatar: {
        width: 48,
        height: 48,
        borderRadius: RADIUS.pill,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    podioAvatarFirst: {
        width: 60,
        height: 60,
    },
    podioPosicion: {
        fontSize: 18,
        fontWeight: '800',
    },
    podioNombre: {
        fontSize: 13,
        color: COLORS.textPrimary,
        fontWeight: '700',
        marginBottom: SPACING.xs,
        textAlign: 'center',
    },
    podioPuntos: {
        fontSize: 13,
        color: COLORS.primary,
        fontWeight: '800',
    },
    jugadorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.sm,
        padding: SPACING.md,
        borderRadius: RADIUS.lg,
        backgroundColor: COLORS.surface,
        gap: SPACING.md,
        ...shadow(COLORS.primary, 0.1, 8, 4, { width: 0, height: 2 }),
    },
    jugadorPosicionBadge: {
        width: 28,
        height: 28,
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
    jugadorNombre: {
        flex: 1,
        fontSize: 16,
        color: COLORS.textPrimary,
        letterSpacing: 0.5,
        fontWeight: '700',
    },
    jugadorPuntos: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.textPrimary,
        letterSpacing: 0.5,
    },

});
export default Ranking;
