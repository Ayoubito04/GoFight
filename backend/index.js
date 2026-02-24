//Primeramente vamos a  crear un servidor con express,también vamos a conectarnos a la base de datos
//Pero necesitamos instalar express,dotenv,cors,pg
const express =require('express');
const cors=require('cors');//Definimos el cors,que va a ser como nuestro portero de seguridad,para nuestro servidor
//Ahora vamos a traer la base de datos,que la tenemos definida en el archivo db.js
const prisma=require('./src/db/db');//Traemos la base de datos,que tenemos definiada en el archivo
require('dotenv').config();//Para poder usar las variables de entorno,que las tenemos definidas en el archivo .env
const app=express();
app.use(express.json());//Le decimos a express que vamos a usar json,para poder enviar y recibir datos en formato json

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
//Ahora vvamos a escuchar el puerto,que lo tenemos definido en la variable de entorno
const PORT=process.env.RUTA || 3000;
app.listen(PORT,()=>{
    console.log(`Servidor corriendo en el  http://localhost:${PORT}`);


})
app.get('/',(req,res)=>{
    res.send('Hola mundo');
})