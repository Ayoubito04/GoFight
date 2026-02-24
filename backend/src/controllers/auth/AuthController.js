//Aquí vamos a definir las fuciones de registro e inicio de sesión,es decir las funciones de autorización
const prisma=require('../../db/db');//Traemos la base de datos,que tenemos definiada en el archivo
const bcrypt=require('bcrypt');//Traemos bcrypt,que es una librería para encriptar las contraseñas

const registro=async(req,res)=>{
    //Vamos a recibir el nombre de usuario,el correo electrónico y la contrasela desde la cuenta cliente
     const {name,email,password}=req.body;
     const salt=await bcrypt.genSalt(10);//Generamos un salt para ocultar la contraseña
     const hashPassword=await bcrypt.hash(password,salt);//Encriptamos la contraseña con el salt
     try{
        const user=await prisma.usuarios.create({
            data:{
                nombre:name,
                email:email,
                contrasena:hashPassword
            }
        })
        res.status(201).json({message:'Usuario registrado exitosamente',user});
           
            
     }catch(error){
        res.status(500).json({message:'Error al registrar el usuario',error:error.message});

     }
}
module.exports={registro};//Exportamos la función de registro,para poder usarla en el archivo UsuariosRoutes.js,que es donde vamos a definir las rutas de registro de usuarios
