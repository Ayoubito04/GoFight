import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS, RADIUS, SPACING, shadow } from '../theme';

//Definimos como van a ser todos los botones de la aplicación,con soporte de variante (primary/secondary/ghost) y estado deshabilitado
const Button = ({ title, onPress, variant = 'primary', disabled = false, style }) => {
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
            <Text
                style={[
                    styles.text,
                    variant === 'secondary' && styles.textSecondary,
                    variant === 'ghost' && styles.textGhost,
                ]}
            >
                {title}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    base: {
        backgroundColor: COLORS.primary,
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.lg,
        borderRadius: RADIUS.md,
        alignItems: 'center',
        justifyContent: 'center',
        ...shadow(COLORS.primaryGlow, 0.5, 10, 5, { width: 0, height: 2 }),
    },
    secondary: {
        backgroundColor: COLORS.surfaceElevated,
        borderWidth: 1,
        borderColor: COLORS.borderStrong,
        shadowOpacity: 0,
        elevation: 0,
    },
    ghost: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: COLORS.primary,
        shadowOpacity: 0,
        elevation: 0,
    },
    disabled: {
        opacity: 0.5,
    },
    text: {
        color: COLORS.onPrimary,
        textAlign: 'center',
        fontSize: 15,
        fontWeight: '800',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    textSecondary: {
        color: COLORS.textPrimary,
    },
    textGhost: {
        color: COLORS.primary,
    },
});
export default Button;
