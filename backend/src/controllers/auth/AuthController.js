//Aquí vamos a definir las fuciones de registro e inicio de sesión,es decir las funciones de autorización
const prisma=require('../../db/db');//Traemos la base de datos,que tenemos definiada en el archivo
const bcrypt=require('bcrypt');//Traemos bcrypt,que es una librería para encriptar las contraseñas
const generarToken=require('../../utils/jwt');//Traemos la función de generar token,que tenemos definida en el archivo jwt.js,que es donde vamos a definir el jwt,que es el token que se va a generar
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
                contrasena:hashPassword,
                rol:'user'
            }
        })
        res.status(201).json({message:'Usuario registrado exitosamente',user});
           
            
     }catch(error){
        res.status(500).json({message:'Error al registrar el usuario',error:error.message});

     }
}

const login=async(req,res)=>{
    //Vamos a recibir el correo electrónico y la contraseña desde la cuenta del cliente
    const {email,password}=req.body;
    //recibimos el correo electrónico y la contraseña desde la cuenta del cliente
    try{
        const user=await prisma.usuarios.findUnique({
            where:{
                email:email
            }
        })
        //Buscamos el usuario por su email
        if(!user){
            return res.status(404).json({message:'Usuario no encontrado'});
            //Indicamos que el usuario no fue encontrado,si el email no existe en la base de datos
        }
        const validPassword=await bcrypt.compare(password,user.contrasena);//Comparamos la contraseña ingresada con la contraseña encriptada en la base de datos
        if(!validPassword){
            return res.status(401).json({message:'Contraseña incorrecta'});
            //Indicamos que la contraseña es incorrecta,en el caso de que lo sea
        }
        const token=generarToken(user.id_usuario,user.email,user.rol);//Generamos el token con estos parametros
        //Una vez que tengamos el token creado,lo vamos a enviar al cliente para que lo pueda usar en las siguientes peticiones
         res.status(200).json({message:'Inicio de sesión exitoso',token});//Una vez que el usuario se haya logeado le aparecerá el token desde Insomnia

    }catch(error){
        res.status(500).json({message:'Error al iniciar sesión',error:error.message});
    }
}
module.exports={registro,login};//Exportamos la función de registro,para poder usarla en el archivo UsuariosRoutes.js,que es donde vamos a definir las rutas de registro de usuarios
