//Diálogo de confirmación con el estilo de GoFight,para sustituir a los Alert.alert del sistema en las acciones que no tienen vuelta atrás
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, shadow } from '../theme';

const ConfirmDialog = ({
    visible,
    title,
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    //Cuando la acción es destructiva (eliminar) pintamos el botón en rojo,para que el usuario sea consciente
    destructive = false,
    icon = 'help-circle',
    onConfirm,
    onCancel,
}) => (
    <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={onCancel}>
        <View style={styles.Overlay}>
            <View style={styles.Dialog}>
                <View style={[styles.IconCircle, destructive && styles.IconCircleDestructive]}>
                    <Ionicons name={icon} size={26} color={destructive ? COLORS.danger : COLORS.primary} />
                </View>
                <Text style={styles.Title}>{title}</Text>
                {message ? <Text style={styles.Message}>{message}</Text> : null}
                <View style={styles.Actions}>
                    <TouchableOpacity style={styles.CancelButton} onPress={onCancel} activeOpacity={0.75}>
                        <Text style={styles.CancelText}>{cancelText}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.ConfirmButton, destructive && styles.ConfirmButtonDestructive]}
                        onPress={onConfirm}
                        activeOpacity={0.75}
                    >
                        <Text style={styles.ConfirmText}>{confirmText}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </Modal>
);

const styles = StyleSheet.create({
    Overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.78)',
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.xl,
    },
    Dialog: {
        width: '100%',
        maxWidth: 380,
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.xl,
        borderWidth: 1,
        borderColor: COLORS.borderStrong,
        padding: SPACING.xl,
        ...shadow(COLORS.black, 0.5, 24, 14, { width: 0, height: 10 }),
    },
    IconCircle: {
        width: 54,
        height: 54,
        borderRadius: 27,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,34,51,0.12)',
        marginBottom: SPACING.md,
    },
    IconCircleDestructive: {
        backgroundColor: 'rgba(255,71,87,0.14)',
    },
    Title: {
        color: COLORS.textPrimary,
        fontSize: 18,
        fontWeight: '800',
        textAlign: 'center',
    },
    Message: {
        color: COLORS.textSecondary,
        fontSize: 14,
        lineHeight: 20,
        textAlign: 'center',
        marginTop: SPACING.sm,
    },
    Actions: {
        flexDirection: 'row',
        gap: SPACING.md,
        marginTop: SPACING.xl,
        width: '100%',
    },
    CancelButton: {
        flex: 1,
        minHeight: 46,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: RADIUS.pill,
        borderWidth: 1,
        borderColor: COLORS.borderStrong,
        backgroundColor: COLORS.surfaceElevated,
    },
    CancelText: {
        color: COLORS.textSecondary,
        fontSize: 13,
        fontWeight: '800',
        letterSpacing: 0.6,
        textTransform: 'uppercase',
    },
    ConfirmButton: {
        flex: 1,
        minHeight: 46,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: RADIUS.pill,
        backgroundColor: COLORS.primary,
    },
    ConfirmButtonDestructive: {
        backgroundColor: COLORS.danger,
    },
    ConfirmText: {
        color: COLORS.onPrimary,
        fontSize: 13,
        fontWeight: '800',
        letterSpacing: 0.6,
        textTransform: 'uppercase',
    },
});

export default ConfirmDialog;
