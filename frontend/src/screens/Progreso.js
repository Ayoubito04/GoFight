import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/HeaderComponent';
import Footer from '../components/Footer';
import BarraProgreso from '../components/BarraProgreso';
import { getTotalCaloriasQuemadas, getGamificaciones, getSesionesHistorial } from '../services/services';
 
// ─── Constantes de objetivos ──────────────────────────────────────────────────
const CALORIAS_OBJETIVO = 1000;
const SESIONES_OBJETIVO = 30;
 
// ─── Sub-componente: Stat compacto (ícono + número + etiqueta) ───────────────
// Se usa en la fila superior para racha y puntos — dato visible de un vistazo
const StatCompacto = ({ IconComponent, icono, iconoColor, valor, etiqueta }) => (
  <View style={styles.statCompacto}>
    <IconComponent name={icono} size={22} color={iconoColor} />
    <Text style={[styles.statValor, { color: iconoColor }]}>{valor}</Text>
    <Text style={styles.statEtiqueta}>{etiqueta}</Text>
  </View>
);
 
// ─── Pantalla principal ───────────────────────────────────────────────────────
const Progreso = () => {
  const [loading, setLoading] = useState(true);
  const [caloriasQuemadas, setCaloriasQuemadas] = useState(0);
  const [gamificaciones, setGamificaciones] = useState(null);
  const [sesiones, setSesiones] = useState([]);
 
  useEffect(() => {
    setTimeout(async () => {
      try {
        const [calorias, gamData, sesionesData] = await Promise.all([
          getTotalCaloriasQuemadas(),
          getGamificaciones(),
          getSesionesHistorial(),
        ]);
        setCaloriasQuemadas(calorias || 0);
        setGamificaciones(gamData);
        setSesiones(sesionesData?.historial || []);
      } catch (error) {
        console.error('Error al cargar el progreso:', error);
      } finally {
        setLoading(false);
      }
    }, 2000);
  }, []);
 
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff0000" />
      </View>
    );
  }
 
  const racha = gamificaciones?.gamificaciones?.racha_dias || 0;
  const puntos = gamificaciones?.gamificaciones?.puntos_ranking || 0;
  const totalSesiones = sesiones.length;
 
  return (
    <SafeAreaView style={styles.pantalla}>
      <Header />
 
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContenido}
        showsVerticalScrollIndicator={false}
      >
        {/* Título */}
        <Text style={styles.tituloPantalla}>progreso</Text>
 
        {/* ── Fila de stats rápidos: racha y puntos ───────────────────────── */}
        {/* El usuario ve racha y puntos de un vistazo antes de ver las barras */}
        <View style={styles.filaSats}>
          <StatCompacto
            IconComponent={Ionicons}
            icono="flame"
            iconoColor="#ff4500"
            valor={racha}
            etiqueta="días racha"
          />
          <StatCompacto
            IconComponent={FontAwesome}
            icono="star"
            iconoColor="#fee500"
            valor={puntos}
            etiqueta="puntos"
          />
          <StatCompacto
            IconComponent={FontAwesome}
            icono="calendar-check-o"
            iconoColor="#00e676"
            valor={totalSesiones}
            etiqueta="sesiones"
          />
        </View>
 
        {/* ── Sección calorías ─────────────────────────────────────────────── */}
        {/* BarraProgreso del compañero — ya tiene su propia animación interna */}
        <Text style={styles.seccionTitulo}>calorías hoy</Text>
        <BarraProgreso
          caloriasActuales={caloriasQuemadas}
          caloriasObjetivo={CALORIAS_OBJETIVO}
        />
 
        {/* ── Sección sesiones ─────────────────────────────────────────────── */}
        {/* Reutilizamos BarraProgreso pasándole sesiones en lugar de calorías */}
        <Text style={styles.seccionTitulo}>sesiones completadas</Text>
        <BarraProgreso
          caloriasActuales={totalSesiones}
          caloriasObjetivo={SESIONES_OBJETIVO}
        />
 
        {/* ── Resumen textual ──────────────────────────────────────────────── */}
        {/* Redundancia intencionada: el usuario ya vio los datos arriba,      */}
        {/* este bloque los confirma en texto plano de un solo vistazo         */}
        <View style={styles.resumen}>
          <Text style={styles.resumenTitulo}>resumen</Text>
          <Text style={styles.resumenLinea}>🔥 {caloriasQuemadas} / {CALORIAS_OBJETIVO} kcal</Text>
          <Text style={styles.resumenLinea}>⚡ {racha} días de racha</Text>
          <Text style={styles.resumenLinea}>⭐ {puntos} puntos</Text>
          <Text style={styles.resumenLinea}>📅 {totalSesiones} / {SESIONES_OBJETIVO} sesiones</Text>
        </View>
      </ScrollView>
 
      <Footer />
    </SafeAreaView>
  );
};
 
// ─── Estilos ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: '#080808',
    justifyContent: 'space-between',
  },
  scroll: {
    flex: 1,
  },
  scrollContenido: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#080808',
  },
 
  // Título principal
  tituloPantalla: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 4,
    textTransform: 'uppercase',
    marginTop: 16,
    marginBottom: 20,
  },
 
  // Fila de stats compactos
  filaSats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
    gap: 10,
  },
  statCompacto: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#111',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    paddingVertical: 16,
    gap: 4,
  },
  statValor: {
    fontSize: 22,
    fontWeight: '800',
  },
  statEtiqueta: {
    color: '#555',
    fontSize: 9,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
 
  // Títulos de sección
  seccionTitulo: {
    color: '#555',
    fontSize: 10,
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 4,
    marginLeft: 4,
  },
 
  // Resumen textual
  resumen: {
    backgroundColor: '#111',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    padding: 18,
    marginTop: 10,
    gap: 8,
  },
  resumenTitulo: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  resumenLinea: {
    color: '#888',
    fontSize: 13,
    letterSpacing: 0.5,
  },
});
 
export default Progreso;