import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/HeaderComponent';
import Footer from '../components/Footer';
import { getTotalCaloriasQuemadas, getGamificaciones, getSesionesHistorial } from '../services/services';
import { COLORS, RADIUS, SPACING, shadow } from '../theme';
import { RANGOS, calcularEstadisticasProgreso } from '../utils/progresoStats';
import { RingProgress, BarChart, LineChart, TrendBadge } from '../components/ProgressCharts';

// ─── Constantes de objetivos ──────────────────────────────────────────────────
const CALORIAS_OBJETIVO = 300; // Meta diaria de calorías quemadas
const RACHA_OBJETIVO = 30; // Referencia visual para llenar el anillo de racha

const Progreso = () => {
  const [loading, setLoading] = useState(true);
  const [caloriasQuemadas, setCaloriasQuemadas] = useState(0);
  const [gamificaciones, setGamificaciones] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [rango, setRango] = useState('semana');

  useEffect(() => {
    const cargarProgreso = async () => {
      try {
        const [res, calhoy, resHistorial] = await Promise.all([
          getGamificaciones(),
          getTotalCaloriasQuemadas(),
          getSesionesHistorial(),
        ]);
        setGamificaciones(res);
        setCaloriasQuemadas(calhoy || 0);
        setHistorial(resHistorial?.historial || []);
      } catch (error) {
        console.error('Error al cargar el progreso:', error);
      } finally {
        setLoading(false);
      }
    };
    cargarProgreso();
  }, []);

  const racha = gamificaciones?.gamificaciones?.racha_dias || 0;
  const puntos = gamificaciones?.gamificaciones?.puntos_ranking || 0;

  const stats = useMemo(() => calcularEstadisticasProgreso(historial, rango), [historial, rango]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const metaDiariaPct = CALORIAS_OBJETIVO > 0 ? Math.min((caloriasQuemadas / CALORIAS_OBJETIVO) * 100, 100) : 0;
  const metaDiariaCaption = metaDiariaPct >= 100 ? '¡Objetivo cumplido!' : metaDiariaPct >= 50 ? 'Vas bien' : 'Sigue así';

  return (
    <SafeAreaView style={styles.pantalla}>
      <Header />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContenido}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.tituloPantalla}>Tu progreso</Text>
        <Text style={styles.subtituloPantalla}>Pequeños pasos, grandes cambios.</Text>

        {/* Selector de rango */}
        <View style={styles.segmentedControl}>
          {RANGOS.map((r) => {
            const activo = r.key === rango;
            return (
              <TouchableOpacity
                key={r.key}
                style={[styles.segmentPill, activo && styles.segmentPillActive]}
                activeOpacity={0.8}
                onPress={() => setRango(r.key)}
              >
                <Text style={[styles.segmentText, activo && styles.segmentTextActive]}>{r.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Calorías */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View>
              <Text style={styles.cardLabel}>Calorías quemadas</Text>
              <View style={styles.cardValueRow}>
                <Text style={styles.cardValue}>{Math.round(stats.promedioKcalActual)}</Text>
                <Text style={styles.cardUnit}>kcal prom./día</Text>
              </View>
            </View>
            <View style={styles.badgeColumn}>
              <TrendBadge value={stats.cambioKcalPct} />
              <Text style={styles.badgeCaption}>vs periodo anterior</Text>
            </View>
          </View>
          <BarChart data={stats.buckets} color={COLORS.primary} />
        </View>

        {/* Sesiones */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View>
              <Text style={styles.cardLabel}>Sesiones completadas</Text>
              <View style={styles.cardValueRow}>
                <Text style={styles.cardValue}>{stats.totalSesionesActual}</Text>
                <Text style={styles.cardUnit}>en {stats.rango.label.toLowerCase()}</Text>
              </View>
            </View>
            <View style={styles.badgeColumn}>
              <TrendBadge value={stats.cambioSesionesPct} />
              <Text style={styles.badgeCaption}>vs periodo anterior</Text>
            </View>
          </View>
          <LineChart data={stats.buckets} color={COLORS.primary} />
        </View>

        {/* Racha + Meta diaria */}
        <View style={styles.rowCards}>
          <View style={[styles.card, styles.halfCard]}>
            <Text style={styles.cardLabel}>Racha</Text>
            <View style={styles.streakRow}>
              <View>
                <View style={styles.streakValueRow}>
                  <Text style={styles.cardValue}>{racha}</Text>
                  <Text style={styles.cardUnit}>días</Text>
                </View>
                <Text style={styles.halfCardCaption}>{racha > 0 ? '¡Sigue así!' : 'Empieza hoy'}</Text>
              </View>
              <RingProgress progress={(racha / RACHA_OBJETIVO) * 100} color={COLORS.primary}>
                <Ionicons name="flame" size={16} color="#ff4500" />
              </RingProgress>
            </View>
          </View>

          <View style={[styles.card, styles.halfCard]}>
            <Text style={styles.cardLabel}>Meta diaria</Text>
            <View style={styles.streakValueRow}>
              <Text style={styles.cardValue}>{metaDiariaPct.toFixed(0)}%</Text>
              <Text style={styles.cardUnit}>{caloriasQuemadas}/{CALORIAS_OBJETIVO} kcal</Text>
            </View>
            <View style={styles.metaBarTrack}>
              <View style={[styles.metaBarFill, { width: `${metaDiariaPct}%` }]} />
            </View>
            <Text style={[styles.halfCardCaption, { color: COLORS.primary }]}>{metaDiariaCaption}</Text>
          </View>
        </View>

        {/* Resumen / Insights */}
        <Text style={styles.seccionTitulo}>Resumen</Text>
        <View style={styles.insightsRow}>
          <View style={styles.insightCard}>
            <Text style={styles.insightLabel}>Kcal/día</Text>
            <Text style={styles.insightValue}>{Math.round(stats.promedioKcalActual)}</Text>
            <Text style={[styles.insightCaption, { color: stats.cambioKcalPct >= 0 ? COLORS.success : COLORS.danger }]}>
              {stats.cambioKcalPct >= 0 ? '↑' : '↓'} {Math.abs(stats.cambioKcalPct).toFixed(0)}% vs anterior
            </Text>
          </View>
          <View style={styles.insightCard}>
            <View style={styles.insightBadgeRow}>
              <Text style={styles.insightLabel}>Mejor día</Text>
              <View style={styles.starBadge}>
                <Ionicons name="star" size={11} color="#0A0A0A" />
              </View>
            </View>
            <Text style={styles.insightValue} numberOfLines={1}>{stats.mejorBucket?.fullLabel || '—'}</Text>
            <Text style={styles.insightCaption}>{stats.mejorBucket ? `${Math.round(stats.mejorBucket.kcal)} kcal` : 'Sin datos aún'}</Text>
          </View>
          <View style={styles.insightCard}>
            <Text style={styles.insightLabel}>Puntos</Text>
            <Text style={styles.insightValue}>{puntos}</Text>
            <Text style={styles.insightCaption}>ranking global</Text>
          </View>
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
    backgroundColor: COLORS.background,
    justifyContent: 'space-between',
  },
  scroll: {
    flex: 1,
  },
  scrollContenido: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
    gap: SPACING.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },

  tituloPantalla: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: '800',
    marginTop: SPACING.sm,
  },
  subtituloPantalla: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },

  // Selector de rango
  segmentedControl: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  segmentPill: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.pill,
  },
  segmentPillActive: {
    backgroundColor: COLORS.primary,
  },
  segmentText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  segmentTextActive: {
    color: COLORS.onPrimary,
    fontWeight: '700',
  },

  // Tarjetas genéricas
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    gap: SPACING.lg,
    ...shadow('#000', 0.3, 10, 6, { width: 0, height: 4 }),
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardLabel: {
    color: COLORS.textSecondary,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: SPACING.xs,
  },
  cardValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: SPACING.xs,
  },
  cardValue: {
    color: COLORS.textPrimary,
    fontSize: 28,
    fontWeight: '800',
  },
  cardUnit: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  badgeColumn: {
    alignItems: 'flex-end',
    gap: 4,
  },
  badgeCaption: {
    color: COLORS.textMuted,
    fontSize: 9,
  },

  // Racha / meta diaria
  rowCards: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  halfCard: {
    flex: 1,
  },
  halfCardCaption: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '600',
    marginTop: SPACING.xs,
  },
  streakRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  streakValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  metaBarTrack: {
    width: '100%',
    height: 8,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.surfaceElevated,
    overflow: 'hidden',
  },
  metaBarFill: {
    height: '100%',
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.primary,
  },

  // Resumen / Insights
  seccionTitulo: {
    color: COLORS.textSecondary,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: SPACING.xs,
  },
  insightsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  insightCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    gap: 4,
  },
  insightBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  starBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#fee500',
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightValue: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '800',
  },
  insightLabel: {
    color: COLORS.textSecondary,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  insightCaption: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '600',
  },
});

export default Progreso;
