//Primeramente vamos a  crear un servidor con express,también vamos a conectarnos a la base de datos
//Pero necesitamos instalar express,dotenv,cors,pg
const express =require('express');
const cors=require('cors');//Definimos el cors,que va a ser como nuestro portero de seguridad,para nuestro servidor
//Ahora vamos a traer la base de datos,que la tenemos definida en el archivo db.js
const prisma=require('./src/db/db');//Traemos la base de datos,que tenemos definiada en el archivo
const UsuariosRoutes=require('./src/routes/UsuariosRoutes');//Traemos las rutas de usuarios,que las tenemos definidas en el archivo UsuariosRoutes.js
const EjerciciosRoutes=require('./src/routes/EjerciciosRoutes');//Traemos las rutas de ejercicios,que las tenemos definidas en el archivo EjerciciosRoutes.js
const RutinasRoutes=require('./src/routes/RutinasRoutes');//Traemos las rutas de rutinas,que las tenemos definidas en el archivo RutinasRoutes.js
const Sesiones_historialRoutes=require('./src/routes/Sesiones_historialRoutes');//Traemos las rutas de sesiones_historial,que las tenemos definidas en el archivo Sesiones_historialRoutes.js
const GamificacionesRoutes=require('./src/routes/GamificacionesRoutes');//Traemos las rutas de gamificaciones,que las tenemos definidas en el archivo GamificacionesRoutes.js
require('dotenv').config();//Para poder usar las variables de entorno,que las tenemos definidas en el archivo .env

const app=express();
app.use(express.json());//Le decimos a express que vamos a usar json,para poder enviar y recibir datos en formato json
app.use(express.urlencoded({extended:true}));//Le decimos a express que vamos a usar urlencoded,para poder enviar y recibir datos en formato urlencoded


app.use(cors());
async function ConectionDB(){
    try{
        await prisma.$connect();
        console.log('Conexión a la base de datos exitosa');
        
    }
    catch(error){
        console.error('Error al conectar a la base de datos',error);
    }
}
ConectionDB();
app.use('/api/auth',UsuariosRoutes);//Le decimos a express que vamos a usar las rutas de usuarios,que las tenemos definidas en el archivo UsuariosRoutes.js, y que van a estar disponibles en la ruta /api/auth

app.use('/api/ejercicios',EjerciciosRoutes)
app.use('/api/rutinas',RutinasRoutes)
app.use('/api/sesiones_historial',Sesiones_historialRoutes)
app.use('/api/gamificaciones',GamificacionesRoutes)
//Ahora vvamos a escuchar el puerto,que lo tenemos definido en la variable de entorno
const PORT=process.env.RUTA || 3000;
app.listen(PORT,()=>{
    console.log(`Servidor corriendo en el  http://localhost:${PORT}`);


})
app.get('/',(req,res)=>{
    res.send('Hola mundo');
})
