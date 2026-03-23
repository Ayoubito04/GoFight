require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const { PrismaClient, dificultad: Dificultad } = require('../generated/prisma');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const crearRutinas = async () => {
    //Primaremente vamos a cragar 5 rutinas,que vienen predtermibnadas en la app,estas rutinas estaran vinculadas a varios ejercicios,se vinculara´na por el id del ejercicio y estas rutinas serán del administrador
    //Los usuarios pueden ver sus rutinas que han creado,pero si no saben como crear una rutina,tienen rutinas disponibles y predeterminadas
  try {
    const r1 = await prisma.rutinas.create({
      data: {
        nombre_rutina: 'Iniciación al Boxeo',//Definimos el nombre de la rutina
        dificultad: Dificultad.F_cil,//Dificultad
        usuarios: { connect: { id_usuario: 1 } },//Los vinculamos al usuario administrador
        rutinas_ejercicios: { create: [
          { id_ejercicios: 5, orden: 1, duracion_ejercicio: 120, duracion_descanso: 60 },//Creamos la relación entre rutina y ejercicio,todo esto aparece dentro de la tabla intermedia
          { id_ejercicios: 3, orden: 2, duracion_ejercicio: 120, duracion_descanso: 60 },
          { id_ejercicios: 8, orden: 3, duracion_ejercicio: 90,  duracion_descanso: 45 },
        ]},
      },
    });
    console.log(` ${r1.nombre_rutina} (ID: ${r1.id_rutina})`);

    const r2 = await prisma.rutinas.create({
      data: {
        nombre_rutina: 'Potencia en Manoplas',
        dificultad: Dificultad.Intermedio,
        usuarios: { connect: { id_usuario: 1 } },
        rutinas_ejercicios: { create: [
          { id_ejercicios: 2, orden: 1, duracion_ejercicio: 120, duracion_descanso: 60 },
          { id_ejercicios: 7, orden: 2, duracion_ejercicio: 120, duracion_descanso: 60 },
          { id_ejercicios: 6, orden: 3, duracion_ejercicio: 120, duracion_descanso: 45 },
          { id_ejercicios: 1, orden: 4, duracion_ejercicio: 90,  duracion_descanso: 45 },
        ]},
      },
    });
    console.log(` ${r2.nombre_rutina} (ID: ${r2.id_rutina})`);

    const r3 = await prisma.rutinas.create({
      data: {
        nombre_rutina: 'Cardio y Resistencia',
        dificultad: Dificultad.Intermedio,
        usuarios: { connect: { id_usuario: 1 } },
        rutinas_ejercicios: { create: [
          { id_ejercicios: 3, orden: 1, duracion_ejercicio: 180, duracion_descanso: 60 },
          { id_ejercicios: 4, orden: 2, duracion_ejercicio: 180, duracion_descanso: 60 },
          { id_ejercicios: 9, orden: 3, duracion_ejercicio: 120, duracion_descanso: 45 },
        ]},
      },
    });
    console.log(` ${r3.nombre_rutina} (ID: ${r3.id_rutina})`);

    const r4 = await prisma.rutinas.create({
      data: {
        nombre_rutina: 'Velocidad y Precisión',
        dificultad: Dificultad.Avanzado,
        usuarios: { connect: { id_usuario: 1 } },
        rutinas_ejercicios: { create: [
          { id_ejercicios: 1,  orden: 1, duracion_ejercicio: 90,  duracion_descanso: 30 },
          { id_ejercicios: 6,  orden: 2, duracion_ejercicio: 120, duracion_descanso: 30 },
          { id_ejercicios: 2,  orden: 3, duracion_ejercicio: 120, duracion_descanso: 45 },
          { id_ejercicios: 10, orden: 4, duracion_ejercicio: 120, duracion_descanso: 30 },
        ]},
      },
    });
    console.log(` ${r4.nombre_rutina} (ID: ${r4.id_rutina})`);

    const r5 = await prisma.rutinas.create({
      data: {
        nombre_rutina: 'Full Combat',
        dificultad: Dificultad.Avanzado,
        usuarios: { connect: { id_usuario: 1 } },
        rutinas_ejercicios: { create: [
          { id_ejercicios: 3,  orden: 1, duracion_ejercicio: 180, duracion_descanso: 60 },
          { id_ejercicios: 5,  orden: 2, duracion_ejercicio: 180, duracion_descanso: 60 },
          { id_ejercicios: 7,  orden: 3, duracion_ejercicio: 120, duracion_descanso: 45 },
          { id_ejercicios: 2,  orden: 4, duracion_ejercicio: 120, duracion_descanso: 45 },
          { id_ejercicios: 4,  orden: 5, duracion_ejercicio: 180, duracion_descanso: 60 },
          { id_ejercicios: 10, orden: 6, duracion_ejercicio: 120, duracion_descanso: 30 },
        ]},
      },
    });
    console.log(` ${r5.nombre_rutina} (ID: ${r5.id_rutina})`);

    console.log('🏆 Seed completado con éxito');
  } catch (e) {
    console.error('❌ Error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
};

crearRutinas();