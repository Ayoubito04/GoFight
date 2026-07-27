//Menú lateral (drawer) que se abre desde el icono de hamburguesa del Header,damos accseso rápido a todas las secciones de la app y al cierre de sesión
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated, Dimensions, Pressable } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, RADIUS, SPACING, shadow } from '../theme';

const { width } = Dimensions.get('window');
const PANEL_WIDTH = Math.min(width * 0.78, 320);

const LINKS = [
    { label: 'Inicio', icon: 'home-outline', screen: 'home' },
    { label: 'Rutinas', icon: 'barbell-outline', screen: 'Rutinas' },
    { label: 'Mis rutinas', icon: 'list-outline', screen: 'MisRutinas' },
    { label: 'Progreso', icon: 'stats-chart-outline', screen: 'Progreso' },
    { label: 'Ranking', icon: 'trophy-outline', screen: 'Ranking' },
    { label: 'Perfil', icon: 'person-outline', screen: 'Perfil' },
];

const SideMenu = ({ visible, onClose, userName, isAdmin }) => {
    const navigation = useNavigation();
    const translateX = useRef(new Animated.Value(-PANEL_WIDTH)).current;
    const backdropOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(translateX, {
                toValue: visible ? 0 : -PANEL_WIDTH,
                duration: 260,
                useNativeDriver: true,
            }),
            Animated.timing(backdropOpacity, {
                toValue: visible ? 1 : 0,
                duration: 260,
                useNativeDriver: true,
            }),
        ]).start();
    }, [visible]);

    const goTo = (screen) => {
        onClose();
        navigation.navigate(screen);
    };

    const handleLogout = async () => {
        onClose();
        await AsyncStorage.removeItem('token');
        navigation.replace('login');
    };

    return (
        <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
            <View style={styles.root}>
                <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
                    <Pressable style={styles.backdropPressable} onPress={onClose} />
                </Animated.View>

                <Animated.View style={[styles.panel, { transform: [{ translateX }] }]}>
                    <View style={styles.panelHeader}>
                        <View style={styles.avatarCircle}>
                            <Ionicons name="person" size={26} color={COLORS.primary} />
                        </View>
                        <View>
                            <Text style={styles.brand}>GoFight</Text>
                            <Text style={styles.userName} numberOfLines={1}>{userName || 'Invitado'}</Text>
                        </View>
                        <TouchableOpacity style={styles.closeButton} onPress={onClose} hitSlop={10}>
                            <Ionicons name="close" size={22} color={COLORS.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.linksContainer}>
                        {LINKS.map((link) => (
                            <TouchableOpacity key={link.screen} style={styles.linkItem} activeOpacity={0.7} onPress={() => goTo(link.screen)}>
                                <Ionicons name={link.icon} size={20} color={COLORS.textPrimary} />
                                <Text style={styles.linkText}>{link.label}</Text>
                                <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
                            </TouchableOpacity>
                        ))}

                        {isAdmin && (
                            <TouchableOpacity style={styles.linkItem} activeOpacity={0.7} onPress={() => goTo('GestorUsuariosAdmin')}>
                                <MaterialCommunityIcons name="shield-crown-outline" size={20} color={COLORS.primary} />
                                <Text style={[styles.linkText, { color: COLORS.primary }]}>Panel de administración</Text>
                                <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
                            </TouchableOpacity>
                        )}
                    </View>

                    <TouchableOpacity style={styles.logoutButton} activeOpacity={0.8} onPress={handleLogout}>
                        <MaterialCommunityIcons name="logout" size={18} color={COLORS.danger} />
                        <Text style={styles.logoutText}>Cerrar sesión</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        flexDirection: 'row',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    backdropPressable: {
        flex: 1,
    },
    panel: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        width: PANEL_WIDTH,
        backgroundColor: COLORS.surfaceAlt,
        paddingTop: SPACING.xxl,
        paddingHorizontal: SPACING.lg,
        borderRightWidth: 1,
        borderRightColor: COLORS.border,
        ...shadow('#000', 0.5, 20, 12, { width: 4, height: 0 }),
    },
    panelHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
        paddingBottom: SPACING.xl,
        marginBottom: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    avatarCircle: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: COLORS.surfaceElevated,
        borderWidth: 1,
        borderColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    brand: {
        color: COLORS.primary,
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    userName: {
        color: COLORS.textPrimary,
        fontSize: 15,
        fontWeight: '700',
        maxWidth: PANEL_WIDTH - 130,
    },
    closeButton: {
        marginLeft: 'auto',
        padding: SPACING.xs,
    },
    linksContainer: {
        flex: 1,
        gap: SPACING.xs,
    },
    linkItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.sm,
        borderRadius: RADIUS.md,
    },
    linkText: {
        flex: 1,
        color: COLORS.textPrimary,
        fontSize: 14,
        fontWeight: '600',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.sm,
        paddingVertical: SPACING.md,
        marginBottom: SPACING.xl,
        borderRadius: RADIUS.md,
        borderWidth: 1,
        borderColor: 'rgba(255,71,87,0.35)',
        backgroundColor: 'rgba(255,71,87,0.08)',
    },
    logoutText: {
        color: COLORS.danger,
        fontSize: 14,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
});

export default SideMenu;
