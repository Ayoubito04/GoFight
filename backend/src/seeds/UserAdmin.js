const {PrismaClient}=require('../generated/prisma');//Traemos PrismaClient,que es la clase principal de Prisma,que nos permite interactuar con la base de datos
const bcrypt=require('bcrypt');//Traemos bcrypt para hashear la contraseña del usuario
const {PrismaPg}=require('@prisma/adapter-pg');//Traemos el adapter para que se pueda conectar a nuestra base de datos de pgadmin
const {Pool}=require('pg');//Traemos Pool para crear una conexión a la base de datos de pgadmin
require('dotenv').config();//Traemos dotenv para poder usar las variables de entorno,que tenemos definidas en el archivo .env,que es donde vamos a definir la conexión a la base de datos y el puerto del servidor
const pool=new Pool({
    connectionString:process.env.DATABASE_URL

});
const adapter=new PrismaPg(pool);
const prisma=new PrismaClient({
    adapter
})

const crearAdmin=async()=>{
    const adminEmail='admin@GoFight.com';//Definimos el correo electrónico del administrador
    const adminPassword='admin123';//Definimos la contraseña del administrador
    const salt=await bcrypt.genSalt(10);//Generamos un salt,que nos servirá para hashear la contraseña
    const hashPassword=await bcrypt.hash(adminPassword,salt);//Hasheamos la contraseña del administrador con el salt generado
    try{
        const admin=await prisma.usuarios.upsert({
            where:{email:adminEmail},
            update:{},
            create:{
                nombre:'Admin',
                email:adminEmail,
                contrasena:hashPassword,
                rol:'admin'
                
            }
    })
    console.log('Usuario admin creado exitosamente',admin);


}catch(error){
     console.error('Error al crear el usuario admin',error);
}
}

crearAdmin();