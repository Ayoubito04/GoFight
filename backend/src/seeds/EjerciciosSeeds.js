//Aquí vamos a implementar cada uno de los ejercicios,para que se puedan registrar en el historial,además de que se puedan mostrar en la pantalla de inicio,para que se puedan mostrar en la pantalla de inicio,tenemos que obtenerlos mediante un await,ya que cada vez que se registre una sesión en el historial,tenemos que actualizar las gamificaciones,por lo tanto,es importante probarlo en la pantalla de inicio,para ver si se actualizan correctamente
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const {PrismaClient}=require('../generated/prisma');//Traemos PrismaClient,que es la clase principal de Prisma,que nos permite interactuar con la base de datos
const {PrismaPg}=require('@prisma/adapter-pg');
const {Pool}=require('pg');
const pool=new Pool({
    connectionString:process.env.DATABASE_URL
})
const adapter=new PrismaPg(pool);
const prisma=new PrismaClient({
    adapter
})
const crearEjercicios=async()=>{
const ejercicios = [
  {
    nombre: 'Entrenamiento con Saco Pequeño (Pera Loca)',
    categoria: 'Pera',
    url_video: 'https://res.cloudinary.com/dqkti3ugw/video/upload/v1775826385/ssstik.io__evolutionpersonaltrainer_1775826266880_gzpg0h.mp4'
  },
  {
    nombre: 'Combinaciones para sorprender al rival',
    categoria: 'Manoplas',
    url_video: 'https://res.cloudinary.com/dqkti3ugw/video/upload/v1775828179/ssstik.io__imbrserker_1775828102295_btorvc.mp4'
  },
  {
    nombre: 'Bomba Cardiovascular con Saco',
    categoria: 'Cardio',
    url_video: 'https://res.cloudinary.com/dqkti3ugw/image/upload/v1785716592/GoFight_App/gofight_burpee.gif'
  },
  {
    nombre: 'HIIT Boxeo Alta Intensidad (Sin material)',
    categoria: 'Cardio',
    url_video: 'https://res.cloudinary.com/dqkti3ugw/image/upload/v1785716595/GoFight_App/gofight_mountain_climber.gif'
  },
  {
    nombre: 'Rutina Boxeo para Saco #2',
    categoria: 'Saco',
    url_video: 'https://res.cloudinary.com/dqkti3ugw/video/upload/v1775997440/ssstik.io__mkboxingclub_1775997429276_f5f9cs.mp4'
  },
  {
    nombre: 'Potencia y Desplazamientos en Saco',
    categoria: 'Saco',
    url_video: 'https://res.cloudinary.com/dqkti3ugw/video/upload/v1775997585/ssstik.io__team_sanchez_boxeo_1775997577127_kpte9e.mp4'
  },
  {
    nombre: 'Técnica de Crochet y Hook',
    categoria: 'Saco',
    url_video: 'https://res.cloudinary.com/dqkti3ugw/image/upload/v1785715335/GoFight_App/gofight_left_hook.gif'
  },
  {
    nombre: 'Agilidad de Pies y Trucos',
    categoria: 'Comba',
    url_video: 'https://res.cloudinary.com/dqkti3ugw/image/upload/v1785715333/GoFight_App/gofight_jump_rope.gif'
  },
  {
    nombre: 'Desplazamientos y Giros Básicos',
    categoria: 'Comba',
    url_video: 'https://res.cloudinary.com/dqkti3ugw/image/upload/v1785715333/GoFight_App/gofight_jump_rope.gif'
  },
  {
    nombre: 'Entrenamiento básico de Comba',
    categoria: 'Comba',
    url_video: 'https://res.cloudinary.com/dqkti3ugw/image/upload/v1785715333/GoFight_App/gofight_jump_rope.gif'
  },
];
  try{
    for(const ejercicio of ejercicios){
        await prisma.ejercicios.create({
            data:{
                nombre:ejercicio.nombre,
                categoria:ejercicio.categoria,
                url_video:ejercicio.url_video
            }
        })
    }
      
  }catch(error){
        console.error('Error al crear los ejercicios',error);
  }
}
crearEjercicios();