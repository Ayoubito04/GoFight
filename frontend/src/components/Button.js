import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, shadow } from '../theme';

//Definimos como van a ser todos los botones de la aplicación,con soporte de variante (primary/secondary/ghost) y estado deshabilitado
const Button = ({ title, onPress, variant = 'primary', disabled = false, style, showArrow = variant === 'primary' }) => {
    const content = (
        <View style={styles.content}>
            <Text
                style={[
                    styles.text,
                    variant === 'secondary' && styles.textSecondary,
                    variant === 'ghost' && styles.textGhost,
                ]}
            >
                {title}
            </Text>
            {showArrow && <Ionicons name="paper-plane-outline" size={17} color={variant === 'primary' ? COLORS.onPrimary : COLORS.primary}/>} 
        </View>
    );

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.75}
            style={[
                styles.base,
                variant === 'secondary' && styles.secondary,
                variant === 'ghost' && styles.ghost,
                disabled && styles.disabled,
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
    disabled: {
        opacity: 0.5,
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
    textSecondary: {
        color: COLORS.textPrimary,
    },
    textGhost: {
        color: COLORS.primary,
    },
});
export default Button;
