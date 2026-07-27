//Aquí calculamos los datos agregados de la pantalla de Progreso (barras/línea por rango de tiempo,comparación con el periodo anterior,mejor día),a partir del historial de sesiones en bruto que nos da el backend
const DIAS_CORTOS = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
const DIAS_LARGOS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const MESES_CORTOS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

export const RANGOS = [
    { key: 'semana', label: 'Semana', dias: 7 },
    { key: 'mes', label: 'Mes', dias: 28 },
    { key: '3meses', label: '3 Meses', dias: 90 },
    { key: 'año', label: 'Año', dias: 365 },
];

const startOfDay = (value) => {
    const d = new Date(value);
    d.setHours(0, 0, 0, 0);
    return d;
};

const addDays = (date, dias) => {
    const d = new Date(date);
    d.setDate(d.getDate() + dias);
    return d;
};

const parseHistorial = (historial) => (historial || []).map(h => ({
    fecha: startOfDay(h.fecha_entreno),
    calorias: parseFloat(h.calorias) || 0,
}));

const sumEnRango = (entradas, inicio, fin) =>
    entradas.filter(e => e.fecha >= inicio && e.fecha <= fin).reduce((acc, e) => acc + e.calorias, 0);

const contarEnRango = (entradas, inicio, fin) =>
    entradas.filter(e => e.fecha >= inicio && e.fecha <= fin).length;

//Construye las barras/puntos a mostrar en los gráficos según el rango elegido (semana=por día,mes=por semana,3meses/año=por mes)
const construirBuckets = (entradas, rangoKey, hoy) => {
    if (rangoKey === 'semana') {
        return Array.from({ length: 7 }, (_, i) => {
            const dia = addDays(hoy, i - 6);
            return {
                label: DIAS_CORTOS[dia.getDay()],
                fullLabel: DIAS_LARGOS[dia.getDay()],
                kcal: sumEnRango(entradas, dia, dia),
                sesiones: contarEnRango(entradas, dia, dia),
            };
        });
    }
    if (rangoKey === 'mes') {
        return Array.from({ length: 4 }, (_, i) => {
            const fin = addDays(hoy, (i - 3) * 7);
            const inicio = addDays(fin, -6);
            return {
                label: `S${i + 1}`,
                fullLabel: `Semana ${i + 1}`,
                kcal: sumEnRango(entradas, inicio, fin),
                sesiones: contarEnRango(entradas, inicio, fin),
            };
        });
    }
    //3meses y año se agrupan por mes natural,3 o 12 barras respectivamente
    const totalMeses = rangoKey === 'año' ? 12 : 3;
    return Array.from({ length: totalMeses }, (_, i) => {
        const ref = new Date(hoy.getFullYear(), hoy.getMonth() - (totalMeses - 1 - i), 1);
        const inicio = new Date(ref.getFullYear(), ref.getMonth(), 1);
        const fin = new Date(ref.getFullYear(), ref.getMonth() + 1, 0);
        return {
            label: MESES_CORTOS[ref.getMonth()],
            fullLabel: MESES_CORTOS[ref.getMonth()],
            kcal: sumEnRango(entradas, inicio, fin),
            sesiones: contarEnRango(entradas, inicio, fin),
        };
    });
};

const cambioPorcentual = (actual, anterior) => {
    if (anterior > 0) return ((actual - anterior) / anterior) * 100;
    return actual > 0 ? 100 : 0;
};

//Función principal: recibe el historial crudo y el rango elegido,devuelve todo lo que necesita la pantalla de Progreso para pintarse
export const calcularEstadisticasProgreso = (historial, rangoKey) => {
    const rango = RANGOS.find(r => r.key === rangoKey) || RANGOS[0];
    const entradas = parseHistorial(historial);
    const hoy = startOfDay(new Date());

    const inicioActual = addDays(hoy, -(rango.dias - 1));
    const finAnterior = addDays(inicioActual, -1);
    const inicioAnterior = addDays(finAnterior, -(rango.dias - 1));

    const buckets = construirBuckets(entradas, rango.key, hoy);

    const totalKcalActual = sumEnRango(entradas, inicioActual, hoy);
    const totalKcalAnterior = sumEnRango(entradas, inicioAnterior, finAnterior);
    const totalSesionesActual = contarEnRango(entradas, inicioActual, hoy);
    const totalSesionesAnterior = contarEnRango(entradas, inicioAnterior, finAnterior);

    const mejorBucket = buckets.reduce((mejor, b) => (b.kcal > (mejor?.kcal ?? -1) ? b : mejor), null);

    return {
        rango,
        buckets,
        totalKcalActual,
        promedioKcalActual: totalKcalActual / rango.dias,
        cambioKcalPct: cambioPorcentual(totalKcalActual, totalKcalAnterior),
        totalSesionesActual,
        promedioSesionesActual: totalSesionesActual / rango.dias,
        cambioSesionesPct: cambioPorcentual(totalSesionesActual, totalSesionesAnterior),
        mejorBucket: mejorBucket && mejorBucket.kcal > 0 ? mejorBucket : null,
    };
};
