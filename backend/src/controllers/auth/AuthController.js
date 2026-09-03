//Aquí vamos a definir las fuciones de registro e inicio de sesión,es decir las funciones de autorización
const prisma=require('../../db/db');//Traemos la base de datos,que tenemos definiada en el archivo
const bcrypt=require('bcrypt');//Traemos bcrypt,que es una librería para encriptar las contraseñas
const generarToken=require('../../utils/jwt');//Traemos la función de generar token,que tenemos definida en el archivo jwt.js,que es donde vamos a definir el jwt,que es el token que se va a generar
const verificarTokenGoogle=require('../../utils/googleAuth');//Traemos la función que verifica el idToken de Google contra los servidores de Google
const registro=async(req,res)=>{
    //Vamos a recibir el nombre de usuario,el correo electrónico y la contrasela desde la cuenta cliente
     const {name,email,password}=req.body;
     let perfil=req.file?.path;//Obtenemos la ruta de la foto de perfil desde el midleware
     if(!perfil){
        perfil='https://images.unsplash.com/vector-1767626090408-a23fae603963?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
     }
        //Verificamos que no se repita el correo electronico ni la contraseña,ni el nombre de cada usuario

     try{
        if(!name || !email || !password){
            return res.status(400).json({message:'Por favor,complete todos los campos'});
        }
        if(!email.includes('@')){
            return res.status(400).json({message:'Por favor ingrese un correo electrónico valido,tiene que incluir el caracter @'})
        }
        if(password.length<6){
            return res.status(400).json({message:'La contraseña debe tener un mínimo de 6 caracteres'});
        }
        const nameExists=await prisma.usuarios.findFirst({
            where:{nombre:name}
        })
        const emailExists=await prisma.usuarios.findFirst({
            where:{email:email}
        })
        if(nameExists || emailExists){
            return res.status(400).json({message:'El nombre o correo electrónico ya existe'});
        }
    const salt=await bcrypt.genSalt(10);//Generamos un salt para ocultar la contraseña
     const hashPassword=await bcrypt.hash(password,salt);//Encriptamos la contraseña con el salt
        const user=await prisma.usuarios.create({
            data:{
                nombre:name,
                email:email,
                contrasena:hashPassword,
                rol:'user',
                perfil:perfil,
                gamificaciones:{
                     create:{
                        racha_dias:0,
                        puntos_ranking:0
                     }
                },
               
                
            },
            include:{gamificaciones:true
            }
        })
        //Una vez que se haya creado el usuario,generamos el token de autenticación
          const token=generarToken(user.id_usuario,user.email,user.rol);
          //Una vez que tengamos el token creado,lo vamos a enviar al cliente para que lo pueda usar en las siguientes peticiones

        res.status(201).json({message:'Usuario registrado exitosamente',user,token});
           
            
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
        if(!user.contrasena){
            //Si el usuario se registró con Google,no tendrá una contraseña,por lo tanto no puede iniciar sesión con este método
            return res.status(400).json({message:'Esta cuenta se registró con Google,por favor inicia sesión con Google'});
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

//Con esta función el usuario puede registrarse o iniciar sesión con Google,todo en una sola petición
const googleAuth=async(req,res)=>{
    //Recibimos el idToken que genera Google en el frontend,una vez que el usuario ha elegido su cuenta de Google
    const {idToken}=req.body;
    try{
        if(!idToken){
            return res.status(400).json({message:'Por favor,proporcione el token de Google'});
        }
        const payload=await verificarTokenGoogle(idToken);//Verificamos el token contra los servidores de Google
        const {sub:googleId,email,name,picture}=payload;//El campo "sub" es el identificador único e inmutable de la cuenta de Google
        if(!email){
            return res.status(400).json({message:'La cuenta de Google no tiene un correo electrónico asociado'});
        }
        //Primero comprobamos si ya existe un usuario vinculado a este id de Google
        let user=await prisma.usuarios.findUnique({where:{google_id:googleId}});
        if(!user){
            //Si no hay ningún usuario vinculado,comprobamos si ya existe una cuenta registrada con ese mismo email,para vincularla automáticamente
            const usuarioExistente=await prisma.usuarios.findUnique({where:{email:email}});
            if(usuarioExistente){
                user=await prisma.usuarios.update({
                    where:{id_usuario:usuarioExistente.id_usuario},
                    data:{google_id:googleId}
                });
            }else{
                //Si no existe ninguna cuenta con ese email,creamos un usuario nuevo,sin contraseña,ya que se autentica solo con Google
                user=await prisma.usuarios.create({
                    data:{
                        nombre:name || email.split('@')[0],
                        email:email,
                        contrasena:null,
                        google_id:googleId,
                        rol:'user',
                        perfil:picture || 'https://images.unsplash.com/vector-1767626090408-a23fae603963?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                        gamificaciones:{
                            create:{racha_dias:0,puntos_ranking:0}
                        }
                    }
                });
            }
        }
        const token=generarToken(user.id_usuario,user.email,user.rol);
        res.status(200).json({message:'Inicio de sesión con Google exitoso',token});
    }catch(error){
        res.status(401).json({message:'Error al iniciar sesión con Google',error:error.message});
    }
}

//Con esta función un usuario que ya tiene la sesión iniciada (con email y contraseña) puede vincular su cuenta a Google
const vincularGoogle=async(req,res)=>{
    const {idToken}=req.body;
    try{
        if(!idToken){
            return res.status(400).json({message:'Por favor,proporcione el token de Google'});
        }
        const payload=await verificarTokenGoogle(idToken);
        const googleId=payload.sub;
        const cuentaVinculada=await prisma.usuarios.findUnique({where:{google_id:googleId}});
        if(cuentaVinculada && cuentaVinculada.id_usuario!==req.user.id){
            //Esta cuenta de Google ya pertenece a otro usuario de la plataforma,por lo tanto no se puede vincular de nuevo
            return res.status(400).json({message:'Esta cuenta de Google ya está vinculada a otro usuario'});
        }
        const user=await prisma.usuarios.update({
            where:{id_usuario:req.user.id},
            data:{google_id:googleId},
            select:{id_usuario:true,nombre:true,email:true,rol:true,perfil:true,google_id:true}
        });
        res.status(200).json({message:'Cuenta de Google vinculada exitosamente',user});
    }catch(error){
        res.status(401).json({message:'Error al vincular la cuenta de Google',error:error.message});
    }
}

//Con esta función el usuario puede desvincular su cuenta de Google,siempre que tenga una contraseña con la que poder seguir accediendo
const desvincularGoogle=async(req,res)=>{
    try{
        const usuarioActual=await prisma.usuarios.findUnique({where:{id_usuario:req.user.id}});
        if(!usuarioActual){
            return res.status(404).json({message:'Usuario no encontrado'});
        }
        if(!usuarioActual.contrasena){
            return res.status(400).json({message:'No puedes desvincular tu cuenta de Google porque no tienes una contraseña establecida. Actualiza tu perfil y crea una contraseña antes de desvincularla'});
        }
        const user=await prisma.usuarios.update({
            where:{id_usuario:req.user.id},
            data:{google_id:null},
            select:{id_usuario:true,nombre:true,email:true,rol:true,perfil:true,google_id:true}
        });
        res.status(200).json({message:'Cuenta de Google desvinculada exitosamente',user});
    }catch(error){
        res.status(500).json({message:'Error al desvincular la cuenta de Google',error:error.message});
    }
}
module.exports={registro,login,googleAuth,vincularGoogle,desvincularGoogle};//Exportamos las funciones de registro,login y las de Google,para poder usarlas en el archivo UsuariosRoutes.js,que es donde vamos a definir las rutas de registro de usuarios
