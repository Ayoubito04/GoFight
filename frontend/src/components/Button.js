import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, shadow } from '../theme';

//Paleta oficial del botón de Google en su versión oscura,que es la que encaja con el tema de GoFight
const GOOGLE = {
    background: '#131314',
    border: '#8E918F',
    text: '#E3E3E3',
};

//Colores de la rueda de carga según la variante,para que siempre contraste con el fondo del botón
const spinnerColor = (variant) => {
    if (variant === 'ghost') return COLORS.primary;
    if (variant === 'google') return GOOGLE.text;
    return COLORS.onPrimary;
};

//Definimos como van a ser todos los botones de la aplicación,con soporte de variante (primary/secondary/ghost/google),icono,estado de carga y estado deshabilitado
const Button = ({
    title,
    onPress,
    variant = 'primary',
    disabled = false,
    loading = false,
    loadingTitle,
    icon,
    style,
    showArrow = variant === 'primary',
}) => {
    //Mientras carga el botón no debe poder pulsarse otra vez,para evitar peticiones duplicadas
    const isDisabled = disabled || loading;
    const content = (
        <View style={styles.content}>
            {loading ? (
                <ActivityIndicator size="small" color={spinnerColor(variant)} />
            ) : icon ? (
                <View style={styles.icon}>{icon}</View>
            ) : null}
            <Text
                style={[
                    styles.text,
                    variant === 'secondary' && styles.textSecondary,
                    variant === 'ghost' && styles.textGhost,
                    variant === 'google' && styles.textGoogle,
                ]}
            >
                {loading ? (loadingTitle || title) : title}
            </Text>
            {showArrow && !loading && <Ionicons name="paper-plane-outline" size={17} color={variant === 'primary' ? COLORS.onPrimary : COLORS.primary}/>}
        </View>
    );

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={isDisabled}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityState={{ disabled: isDisabled, busy: loading }}
            style={[
                styles.base,
                variant === 'secondary' && styles.secondary,
                variant === 'ghost' && styles.ghost,
                variant === 'google' && styles.google,
                disabled && styles.disabled,
                loading && styles.loading,
                style,
            ]}
        >
            {variant === 'primary' ? (
                <LinearGradient colors={[COLORS.backgroundAlt, COLORS.primaryDark, COLORS.primary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.primaryGradient}>
                    {content}
                </LinearGradient>
            ) : content}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    base: {
        minHeight: 50,
        borderRadius: RADIUS.pill,
        borderWidth: 1,
        borderColor: 'rgba(255,71,87,0.72)',
        overflow: 'hidden',
        ...shadow(COLORS.primaryGlow, 0.52, 16, 8, { width: 0, height: 5 }),
    },
    primaryGradient: {
        minHeight: 48,
        justifyContent: 'center',
        paddingHorizontal: SPACING.xl,
    },
    secondary: {
        backgroundColor: COLORS.surfaceElevated,
        borderColor: 'rgba(255,34,51,0.42)',
        paddingHorizontal: SPACING.xl,
        shadowOpacity: 0,
        elevation: 0,
    },
    ghost: {
        backgroundColor: 'transparent',
        borderColor: COLORS.primary,
        paddingHorizontal: SPACING.xl,
        shadowOpacity: 0,
        elevation: 0,
    },
    google: {
        backgroundColor: GOOGLE.background,
        borderColor: GOOGLE.border,
        paddingHorizontal: SPACING.xl,
        shadowOpacity: 0,
        elevation: 0,
    },
    disabled: {
        opacity: 0.5,
    },
    //Cuando está cargando lo atenuamos solo un poco,para que el texto y la rueda se sigan leyendo bien
    loading: {
        opacity: 0.88,
    },
    text: {
        color: COLORS.onPrimary,
        fontSize: 14,
        fontWeight: '800',
        letterSpacing: 0.8,
        textTransform: 'uppercase',
    },
    content: {
        minHeight: 48,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.sm,
    },
    icon: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    textSecondary: {
        color: COLORS.textPrimary,
    },
    textGhost: {
        color: COLORS.primary,
    },
    //Google pide que su botón lleve el texto en caja normal,no en mayúsculas
    textGoogle: {
        color: GOOGLE.text,
        fontSize: 15,
        fontWeight: '600',
        letterSpacing: 0.2,
        textTransform: 'none',
    },
});
export default Button;
