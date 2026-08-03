//Aquí centralizamos los colores, espaciados y sombras de toda la app, para que todas las pantallas y componentes compartan el mismo lenguaje visual
export const COLORS = {
    background: '#0A0A0A',
    backgroundAlt: '#000000',

    surface: '#151515',
    surfaceAlt: '#101010',
    surfaceElevated: '#1E1E1E',

    border: 'rgba(255,255,255,0.08)',
    borderStrong: 'rgba(255,255,255,0.14)',

    //Color de marca: rojo,el color de toda la vida de GoFight
    primary: '#FF2233',
    primaryDark: '#B3001E',
    primaryGlow: 'rgba(255,34,51,0.35)',
    //Texto que va encima de fondos de color primary
    onPrimary: '#FFFFFF',

    textPrimary: '#FFFFFF',
    textSecondary: '#9A9A9A',
    textMuted: '#5C5C5C',

    success: '#2ED573',
    warning: '#FFB020',
    danger: '#FF4757',
    info: '#3AA9FF',

    gold: '#ECC112',
    silver: '#C0C0C0',
    bronze: '#CD7F32',

    white: '#FFFFFF',
    black: '#000000',
};

export const SPACING = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 28,
};

export const RADIUS = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    pill: 999,
};

export const FONT = {
    family: 'Helvetica',
};

//Función helper para no repetir la sombra en cada componente,recibe el color y devuelve el objeto de sombra completo compatible con iOS,Android y web
export const shadow = (color = '#000000', opacity = 0.3, radius = 10, elevation = 6, offset = { width: 0, height: 4 }) => ({
    shadowColor: color,
    shadowOffset: offset,
    shadowOpacity: opacity,
    shadowRadius: radius,
    elevation,
});

export const difficultyColor = (dificultad) => {
    switch (dificultad) {
        case 'Fácil': return COLORS.success;
        case 'Intermedio': return COLORS.warning;
        case 'Avanzado': return COLORS.danger;
        default: return COLORS.textPrimary;
    }
};

export const categoriaColor = (categoria) => {
    switch (categoria) {
        case 'Fuerza': return COLORS.primary;
        case 'Cardio': return COLORS.success;
        case 'Saco': return COLORS.info;
        default: return COLORS.textPrimary;
    }
};

export const categoriaDescripcion = (categoria) => {
    switch (categoria) {
        case 'Saco': return 'Trabaja potencia, técnica y resistencia golpeando el saco con combinaciones controladas.';
        case 'Pera': return 'Mejora tu coordinación y velocidad de manos con la pera loca en movimiento constante.';
        case 'Manoplas': return 'Ejercicio con compañero para perfeccionar reflejos, precisión y combinaciones de golpeo.';
        case 'Cardio': return 'Rutina de alta intensidad para quemar calorías y mejorar tu resistencia cardiovascular.';
        case 'Comba': return 'Salta a la comba para ganar agilidad de pies, ritmo y resistencia como un boxeador.';
        default: return 'Ejercicio de entrenamiento de boxeo pensado para mejorar tu rendimiento en el ring.';
    }
};
