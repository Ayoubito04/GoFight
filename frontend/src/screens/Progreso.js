import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/HeaderComponent';
import Footer from '../components/Footer';
import BarraProgreso from '../components/BarraProgreso';
import { getTotalCaloriasQuemadas, getGamificaciones, getSesionesHoy} from '../services/services';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
 
// ─── Constantes de objetivos ──────────────────────────────────────────────────
const CALORIAS_OBJETIVO = 300; // Meta diaria de calorías quemadas
const SESIONES_OBJETIVO = 3;//Meta diaria de sesiones registradas debntro de un rango establecido de 24 horas
 
// ─── Sub-componente: Stat compacto (ícono + número + etiqueta) ───────────────
// Se usa en la fila superior para racha y puntos — dato visible de un vistazo
const StatCompacto = ({ IconComponent, icono, iconoColor, valor, etiqueta }) => (
  <View style={styles.statCompacto}>
    <IconComponent name={icono} size={22} color={iconoColor} />
    <Text style={[styles.statValor, { color: iconoColor }]}>{valor}</Text>
    <Text style={styles.statEtiqueta}>{etiqueta}</Text>
  </View>
);
 

const Progreso = () => {
  const [loading, setLoading] = useState(true);
  const [caloriasQuemadas, setCaloriasQuemadas] = useState(0);
  const [gamificaciones, setGamificaciones] = useState(null);
  const [sesiones, setSesiones] = useState([]);
 
  useEffect(() => {
    setTimeout(async () => {
      try {
          const res = await getGamificaciones();
          console.log('Respuesta del servidor al obtener las gamificaciones:', res);
         const  resSesiones= await getSesionesHoy();
         console.log('Respuesta del servidor al obtener las sesiones de hoy:', resSesiones);
         const calhoy=await getTotalCaloriasQuemadas();
         console.log('Respuesta del servidor al obtener las calorías quemadas hoy:', calhoy);
         const cantidadCaloriasQuemadas = resSesiones.totalSesionesHoy || 0;
         const calCalculadas=calhoy || 0;
         setCaloriasQuemadas(calCalculadas);
         setSesiones(resSesiones.sesionesHoy || 0);
         setGamificaciones(res);
         console.log('Cantidad de sesiones de hoy obtenidas de la respuesta:', resSesiones.totalSesionesHoy);
         console.log('Calorías quemadas hoy obtenidas de la respuesta:', calhoy);
         console.log('Calorías quemadas hoy calculadas a partir de las sesiones:', calCalculadas);
         console.log('Calorías quemadas hoy obtenidas de la respuesta de actualizar gamificaciones:', calhoy);

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
  const totalSesiones = sesiones || 0;
 
  return (
    <SafeAreaView style={styles.pantalla}>
      <Header />
 
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContenido}
        showsVerticalScrollIndicator={false}
      >
    
        <Text style={styles.tituloPantalla}>progreso</Text>

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
            etiqueta="sesiones hoy"
          />
        </View>
 
       
        <Text style={styles.seccionTitulo}>calorías hoy</Text>
        <BarraProgreso
        
          actual={caloriasQuemadas}
          objetivo={CALORIAS_OBJETIVO}
          unidad="kcal"

        />
 
        <Text style={styles.seccionTitulo}>sesiones diarias:</Text>
        <BarraProgreso
        
          actual={totalSesiones} 
          objetivo={SESIONES_OBJETIVO}
          unidad="sesiones"
        />
 
       
        <View style={styles.resumen}>
          <Text style={styles.resumenTitulo}>resumen</Text>
          <Text style={styles.resumenLinea}>calorias quemadas: {caloriasQuemadas} kcal / {CALORIAS_OBJETIVO} kcal</Text>
          <Text style={styles.resumenLinea}>racha diaria: {racha}</Text>
          <Text style={styles.resumenLinea}>puntos: {puntos} puntos</Text>
          <Text style={styles.resumenLinea}>sesiones diarias: {totalSesiones} / {SESIONES_OBJETIVO}</Text>
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