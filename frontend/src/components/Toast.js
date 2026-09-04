//Sistema de avisos propio de GoFight,para no depender del alert() del sistema,que rompe totalmente el estilo de la app
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Animated, Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, shadow } from '../theme';

//Cada tipo de aviso tiene su color y su icono,para que se entienda de un vistazo si ha ido bien o mal
const VARIANTS = {
    success: { color: COLORS.success, icon: 'checkmark-circle' },
    error: { color: COLORS.danger, icon: 'alert-circle' },
    info: { color: COLORS.info, icon: 'information-circle' },
};

//Separación desde arriba,para que el aviso no se meta debajo de la barra de estado del móvil
const TOP_OFFSET = Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + SPACING.sm : 54;

const ToastContext = createContext(() => {});

//Hook que usan las pantallas: const showToast=useToast(); showToast('Guardado','success');
export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState(null);
    const translateY = useRef(new Animated.Value(-140)).current;
    const opacity = useRef(new Animated.Value(0)).current;
    const timer = useRef(null);

    const hide = useCallback(() => {
        if (timer.current) clearTimeout(timer.current);
        Animated.parallel([
            Animated.timing(translateY, { toValue: -140, duration: 220, useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 0, duration: 220, useNativeDriver: true }),
        ]).start(({ finished }) => {
            if (finished) setToast(null);
        });
    }, [opacity, translateY]);

    const showToast = useCallback((message, variant = 'info', duration = 3200) => {
        if (!message) return;
        if (timer.current) clearTimeout(timer.current);
        setToast({ message: String(message), variant: VARIANTS[variant] ? variant : 'info' });
        translateY.setValue(-140);
        opacity.setValue(0);
        Animated.parallel([
            Animated.spring(translateY, { toValue: 0, useNativeDriver: true, friction: 9, tension: 70 }),
            Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        ]).start();
        timer.current = setTimeout(hide, duration);
    }, [hide, opacity, translateY]);

    //Si el componente se desmonta con un aviso en pantalla,limpiamos el temporizador para no dejar nada colgado
    useEffect(() => () => {
        if (timer.current) clearTimeout(timer.current);
    }, []);

    const variant = toast ? VARIANTS[toast.variant] : null;

    return (
        <ToastContext.Provider value={showToast}>
            {children}
            {toast && (
                <Animated.View
                    pointerEvents="box-none"
                    style={[styles.Wrapper, { opacity, transform: [{ translateY }] }]}
                >
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={hide}
                        accessibilityRole="alert"
                        style={[styles.Toast, { borderColor: variant.color }]}
                    >
                        <View style={[styles.AccentBar, { backgroundColor: variant.color }]} />
                        <View style={[styles.IconCircle, { backgroundColor: variant.color }]}>
                            <Ionicons name={variant.icon} size={16} color={COLORS.black} />
                        </View>
                        <Text style={styles.Message} numberOfLines={3}>{toast.message}</Text>
                        <Ionicons name="close" size={17} color={COLORS.textMuted} />
                    </TouchableOpacity>
                </Animated.View>
            )}
        </ToastContext.Provider>
    );
};

const styles = StyleSheet.create({
    Wrapper: {
        position: 'absolute',
        top: TOP_OFFSET,
        left: SPACING.lg,
        right: SPACING.lg,
        zIndex: 9999,
        elevation: 24,
    },
    Toast: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.lg,
        borderRadius: RADIUS.lg,
        borderWidth: 1,
        //Fondo sólido para que el texto se lea siempre,sea cual sea la pantalla que hay debajo
        backgroundColor: COLORS.surfaceElevated,
        overflow: 'hidden',
        ...shadow(COLORS.black, 0.45, 16, 12, { width: 0, height: 6 }),
    },
    //Franja de color a la izquierda que identifica el tipo de aviso
    AccentBar: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 4,
    },
    IconCircle: {
        width: 26,
        height: 26,
        borderRadius: 13,
        alignItems: 'center',
        justifyContent: 'center',
    },
    Message: {
        flex: 1,
        color: COLORS.textPrimary,
        fontSize: 13.5,
        fontWeight: '600',
        lineHeight: 19,
    },
});

export default ToastProvider;
