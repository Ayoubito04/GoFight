//Aquí vamos a definir las funciones crud de la base de datos
const prisma=require('../db/db');//Traemos la base de datos,que tenemos definiada en el archivo db.js,que es donde vamos a definir la conexión a la base de datos
const bcrypt=require('bcrypt');//Traemos bcryptjs,que es una librería que nos permite encriptar las contraseñas de los usuarios,para que no se guarden en texto plano en la base de datos,lo cual es un gran riesgo de seguridad

const ActualizarUsuario=async(req,res)=>{
    //Vamos con la función de actualizar usuarios
    try{
        const id=req.user.id
        const {name,email,password}=req.body;//Recibimos los datos que queremos actualizar desde el cliente
        if(!name || !email || !password){
            return res.status(400).json({message:'Todos los campos son obligatorios'});
        }
        const UsuarioExistente=await prisma.usuarios.findUnique({
            where:{id_usuario:id}

        })
        if(!UsuarioExistente){
            return res.status(404).json({message:'Usuario no encontrado,compruebe que exista'});
        }
        let contraseñaEncriptada=UsuarioExistente.contrasena;//Si el usuario no quiere actualizar su contraseña,entonces mantenemos la contraseña actual,que ya está encriptada
        if(password){
           
           const salt=await bcrypt.genSalt(10);
           contraseñaEncriptada=await bcrypt.hash(password,salt);

        }
        const ActualizarUsuario=await prisma.usuarios.update({
            where:{id_usuario:id},//Ponemos la condición,es decir buscará al usuario por su id
            data:{
                nombre:name,
                email:email,
                contrasena:contraseñaEncriptada
            }//Actualizamos los datos del usuario,con los datos que recibimos desde el cliente
        })
        res.status(200).json({message:'Usuario actualizado exitosamente',ActualizarUsuario});
        if(!ActualizarUsuario){
            return res.status(404).json({message:'Usuario no encontrado,compruebe que exista'});

        }
    }catch(error){
        res.status(500).json({message:'Error al actualizar el usuario',error:error.message});
    }

}
const EliminarTodosUsuarios=async(req,res)=>{
    //Esta función es propia del administrador,porque funciona como un panel de control
    //Ya que hemos creado el administrador en el seeds,es hora de implementar esta función
      if(req.user.rol!=='admin'){
           return res.status(403).json({message:'No tienes permisos para realizar esta acción'});

      }
      else{
           try{
              const EliminarTodosUsuarios=await prisma.usuarios.deleteMany({});//No hace falta una condición,ya que queremos eliminar a todos los usuarios,así que dejamos el objeto vació
               res.status(200).json({message:'Todos los usuarios han sido eliminados exitosamente',EliminarTodosUsuarios});
           }catch(error){
              res.status(500).json({message:'Error al eliminar todos los usuarios',error:error.message});
           }
      }
}
const getAllUsuarios=async(req,res)=>{
    //Esta función es propia del administrador,porque al igual que la función de eliminar,etsa también se encarga de gestionar los usuarios
    //Vale,una vez tenemos el administrador creado en el seeds,es hora de implementar esta función
      if(req.user.rol!=='admin'){
          return res.status(403).json({message:'No tienes permisos para realizar esta acción'});
          
      }
      else{
        try{
            const getAllUsuarios=await prisma.usuarios.findMany({
                select:{id_usuario:true,nombre:true,email:true,rol:true}
                //En esta función,seleccionamos el id,nombre,email y rol de todos los usuarios
            })
            res.status(200).json({message:'Usuarios obtenidos exitosamente',getAllUsuarios});
        }catch(error){
            res.status(500).json({message:'Error al obtener todos los usuarios',error:error.message});
        }
      }
}
const MakeAdmin=async(req,res)=>{
    //Esta función es propia del administrador
    if(req.user.rol!=='admin'){
        return res.status(403).json({message:'No tienes permisos para realizar esta acción'});

    }
    else{
        try{
            const {id_usuario}=req.body;
            const id=parseInt(id_usuario);
            const UserToAdmin=await prisma.usuarios.update({
                where:{id_usuario:id},
                 data:{rol:'admin'},
                 select:{id_usuario:true,nombre:true,email:true,rol:true}
            })
            res.status(200).json({message:'Usuario transformado a admin  exitosamente',UserToAdmin});

        }catch(error){
            res.status(500).json({message:'Error al transformar el usuario a admin',error:error.message});
        }
    }

}
const DeleteUserById=async(req,res)=>{
    //Esta función nos permittirá borrar un usuario en especifico sin ningun tipo de autorización,ya que es una función propia del administrador,pero no es necesario que el admin tenga que iniciar sesión para poder usarla,ya que es una función de emergencia,por ejemplo si un usuario está causando problemas en la plataforma,el admin podrá borrarlo sin necesidad de iniciar sesión
    if(req.user.rol!=='admin'){
        return res.status(403).json({message:'No tienes permisos para realizar esta acción'});

    }
    else{
        try{
         const id=parseInt(req.params.id);//Esto nos permite obtener el token del usuario,en vez del id númerico,lo cual es una ventaja de seguridad
         const DeleteUser=await prisma.usuarios.delete({
                where:{id_usuario:id}

         })
         res.status(200).json({message:'Usuario eliminado exitosamente',DeleteUser});

    }catch(error){
        res.status(500).json({message:'Error al eliminar el usuario',error:error.message});
    }
    }
}
const VerPerfilUsuario=async(req,res)=>{
    //Aquó podremos ver el perfil del usuario es decir nombre,email,rol y su imagen de perfil
    const id_usuario=req.user?.id;
    try{
            const perfilUsuario=await prisma.usuarios.findUnique({
                where:{id_usuario:id_usuario},
                select:{id_usuario:true,nombre:true,email:true,rol:true,perfil:true}
             })
                if(!perfilUsuario){
                    return res.status(404).json({message:'Usuario no encontrado,compruebe que exista'});
                }
                res.status(200).json({message:'Perfil del usuario obtenido exitosamente',perfilUsuario});
    }catch(error){
        res.status(500).json({message:'Error al obtener el perfil del usuario',error:error.message});
    }
}
const ActualizarUsuarioAdmin=async(req,res)=>{
    //Edsta función es para que el admin pueda actualizar el usuario de culquier usuario,es decir,el admin puede actualizar el nombre,email,contraseña y rol de cualquier usuario,ya que es una función propia del administrador
    try{
        if(req.user.rol!=='admin'){
            return res.status(403).json({message:'No tienes permisos para realizar esta acción'});
           
    }
     const {id_usuario,name,email,password,rol}=req.body;//Recibimos los datos que queremos actualizar desde el cliente
     let contraseña;
     if(password){
        const salt=await bcrypt.genSalt(10);
        contraseña=await bcrypt.hash(password,salt);
        //Con esto encriptamos la contraseña,para que no se guarde en texto plano en la base de datos,lo cual es un gran riesgo de seguridad
     }
            const usuario=await prisma.usuarios.update({
                where:{id_usuario:parseInt(id_usuario)},//Ponemos la condición,es decir buscará al usuario por su id
                data:{nombre:name,email:email,contrasena:contraseña || undefined,rol:rol},
                select:{id_usuario:true,nombre:true,email:true,rol:true}
            })
            res.status(200).json({message:'Usuario actualizado exitosamente por el admin',usuario});

    }catch(error){
        res.status(500).json({message:'Error al actualizar el usuario',error:error.message});
    }
}

module.exports={ActualizarUsuario,EliminarTodosUsuarios,getAllUsuarios,MakeAdmin,DeleteUserById,VerPerfilUsuario,ActualizarUsuarioAdmin};//Exportamos las funciones de getUsuario,EliminarUsuario y ActualizarUsuario,para poder usarlas en el archivo UsuariosRoutes.js,que es donde vamos a definir las rutas de usuarios
