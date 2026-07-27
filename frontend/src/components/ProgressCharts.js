//Pequeños gráficos reutilizables para la pantalla de Progreso: anillo circular,barras y línea,todo hecho con react-native-svg,sin depender de ninguna librería de gráficos externa
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Polyline } from 'react-native-svg';
import { COLORS, RADIUS, SPACING } from '../theme';

export const TrendBadge = ({ value }) => {
    const subiendo = value >= 0;
    return (
        <View style={[chartStyles.badge, { backgroundColor: subiendo ? 'rgba(46,213,115,0.12)' : 'rgba(255,71,87,0.12)' }]}>
            <Text style={[chartStyles.badgeText, { color: subiendo ? COLORS.success : COLORS.danger }]}>
                {subiendo ? '↑' : '↓'} {Math.abs(value).toFixed(0)}%
            </Text>
        </View>
    );
};

export const RingProgress = ({ size = 84, strokeWidth = 8, progress = 0, color = COLORS.primary, children }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const clamped = Math.max(0, Math.min(progress, 100));
    const dashoffset = circumference - (clamped / 100) * circumference;
    return (
        <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
            <Svg width={size} height={size}>
                <Circle cx={size / 2} cy={size / 2} r={radius} stroke={COLORS.surfaceElevated} strokeWidth={strokeWidth} fill="none" />
                <Circle
                    cx={size / 2} cy={size / 2} r={radius}
                    stroke={color} strokeWidth={strokeWidth} fill="none"
                    strokeDasharray={`${circumference} ${circumference}`}
                    strokeDashoffset={dashoffset}
                    strokeLinecap="round"
                    rotation="-90"
                    origin={`${size / 2}, ${size / 2}`}
                />
            </Svg>
            <View style={StyleSheet.absoluteFillObject}>
                <View style={chartStyles.ringCenter}>{children}</View>
            </View>
        </View>
    );
};

//Redondea las marcas del eje a números "bonitos" (25,50,100,250,500...) para que no salgan cifras raras como 733
const tickNice = (max) => {
    if (max <= 0) return 1;
    const pow = Math.pow(10, Math.floor(Math.log10(max)));
    const norm = max / pow;
    const nice = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10;
    return nice * pow;
};

export const BarChart = ({ data, height = 90, color = COLORS.primary }) => {
    const rawMax = Math.max(...data.map(d => d.kcal), 1);
    const axisMax = tickNice(rawMax);
    const promedio = data.reduce((s, d) => s + d.kcal, 0) / data.length;
    const lineaPromedioTop = height - (promedio / axisMax) * height;

    return (
        <View style={chartStyles.chartWithAxis}>
            <View>
                <View style={[chartStyles.plotArea, { height }]}>
                    {promedio > 0 && <View style={[chartStyles.avgLine, { top: lineaPromedioTop }]} />}
                    <View style={chartStyles.chartRow}>
                        {data.map((d, i) => {
                            const barHeight = d.kcal > 0 ? Math.max((d.kcal / axisMax) * height, 4) : 2;
                            const esPico = d.kcal === rawMax && rawMax > 0;
                            return (
                                <View key={i} style={chartStyles.barCol}>
                                    <View style={[chartStyles.barTrack, { height }]}>
                                        <View style={[chartStyles.bar, { height: barHeight, backgroundColor: esPico ? COLORS.warning : color }]} />
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                </View>
                <View style={chartStyles.chartRow}>
                    {data.map((d, i) => <Text key={i} style={[chartStyles.axisLabel, chartStyles.axisLabelFlex]}>{d.label}</Text>)}
                </View>
            </View>
            <View style={[chartStyles.axisTicks, { height }]}>
                <Text style={chartStyles.tickLabel}>{Math.round(axisMax)}</Text>
                <Text style={chartStyles.tickLabel}>{Math.round(axisMax / 2)}</Text>
                <Text style={chartStyles.tickLabel}>0</Text>
            </View>
        </View>
    );
};

export const LineChart = ({ data, height = 90, color = COLORS.primary }) => {
    const [width, setWidth] = useState(0);
    const rawMax = Math.max(...data.map(d => d.sesiones), 1);
    const axisMax = tickNice(rawMax);
    const stepX = data.length > 1 ? width / (data.length - 1) : 0;
    const points = data.map((d, i) => ({
        x: i * stepX,
        y: height - (d.sesiones / axisMax) * (height - 12) - 6,
    }));
    const polylinePoints = points.map(p => `${p.x},${p.y}`).join(' ');

    return (
        <View style={chartStyles.chartWithAxis}>
            <View style={{ flex: 1 }}>
                <View onLayout={(e) => setWidth(e.nativeEvent.layout.width)} style={{ height }}>
                    {width > 0 && (
                        <Svg width={width} height={height}>
                            <Polyline points={polylinePoints} fill="none" stroke={color} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
                            {points.map((p, i) => <Circle key={i} cx={p.x} cy={p.y} r={3.5} fill={color} />)}
                        </Svg>
                    )}
                </View>
                <View style={chartStyles.chartRow}>
                    {data.map((d, i) => (
                        <Text key={i} style={[chartStyles.axisLabel, chartStyles.axisLabelFlex]}>{d.label}</Text>
                    ))}
                </View>
            </View>
            <View style={[chartStyles.axisTicks, { height }]}>
                <Text style={chartStyles.tickLabel}>{Math.round(axisMax)}</Text>
                <Text style={chartStyles.tickLabel}>0</Text>
            </View>
        </View>
    );
};

const chartStyles = StyleSheet.create({
    badge: {
        paddingHorizontal: SPACING.sm,
        paddingVertical: 3,
        borderRadius: RADIUS.pill,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '700',
    },
    ringCenter: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    chartWithAxis: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: SPACING.sm,
    },
    plotArea: {
        justifyContent: 'flex-end',
    },
    avgLine: {
        position: 'absolute',
        left: 0,
        right: 0,
        borderTopWidth: 1,
        borderStyle: 'dashed',
        borderColor: 'rgba(255,255,255,0.18)',
    },
    chartRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    barCol: {
        flex: 1,
        alignItems: 'center',
    },
    barTrack: {
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    bar: {
        width: 10,
        borderRadius: 5,
    },
    axisLabel: {
        fontSize: 10,
        color: COLORS.textMuted,
        fontWeight: '600',
        textAlign: 'center',
        marginTop: SPACING.xs,
    },
    axisLabelFlex: {
        flex: 1,
    },
    axisTicks: {
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        minWidth: 30,
    },
    tickLabel: {
        fontSize: 9,
        color: COLORS.textMuted,
        fontWeight: '600',
    },
});
