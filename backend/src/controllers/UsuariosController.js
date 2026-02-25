//Aquí vamos a definir las funciones crud de la base de datos
const prisma=require('../db/db');//Traemos la base de datos,que tenemos definiada en el archivo db.js,que es donde vamos a definir la conexión a la base de datos

const getUsuario=async(req,res)=>{
    try{
        const usuarios=await prisma.usuarios.findMany({
        where:{id_usuario:req.user.id_usuario},
        select:{id_usuario:true,nombre:true,email:true}//La contraseña no se selecciona por motivos obvios
    });//Buscamos a todos los usuarios en la base de datos
    if(usuarios.length===0){
        return res.status(404).json({message:'No se ha encontrado ningun usuario'});
        
    }
    res.status(200).json({message:'Usuario encontrado exitosamente',usuarios});//Si se encuentra el usuario,le indicamos que se ha encontrado exitosamente
    
    }catch(error){
        res.status(500).json({message:'Error al buscar el usuario',error:error.message});//Si hay un error al buscar el usuario,le indicamos que ha ocurrido un error
    }

}
const EliminarUsuario=async(req,res)=>{
    const id=req.user.id;
    try{
        const EliminarUsuario=await prisma.usuarios.delete({
            where:{id_usuario:id}//Ponemos la condición,es decir buscará al usuario por su id
        })
        if(!EliminarUsuario){
            return res.status(404).json({message:'Usuario no encontrado,compruebe que exista'});
        }
        res.status(200).json({message:'Usuario eliminado exitosamente',EliminarUsuario});

    }catch(error){
        res.status(500).json({message:'Error al eliminar el usuario',error:error.message});
    }

}
const ActualizarUsuario=async(req,res)=>{
    //Vamos con la función de actualizar usuarios
    try{
        const id=req.user.id
        const {name,email,password}=req.body;//Recibimos los datos que queremos actualizar desde el cliente
        const ActualizarUsuario=await prisma.usuarios.update({
            where:{id_usuario:id},//Ponemos la condición,es decir buscará al usuario por su id
            data:{
                nombre:name,
                email:email,
                contrasena:password
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
            const UserToAdmin=await prisma.usuarios.update({
                where:{id_usuario:id_usuario},
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
         const {id_usuario}=req.body;
         const DeleteUser=await prisma.usuarios.delete({
                where:{id_usuario:id_usuario}

         })
         res.status(200).json({message:'Usuario eliminado exitosamente',DeleteUser});

    }catch(error){
        res.status(500).json({message:'Error al eliminar el usuario',error:error.message});
    }
    }
}
module.exports={getUsuario,EliminarUsuario,ActualizarUsuario,EliminarTodosUsuarios,getAllUsuarios,MakeAdmin,DeleteUserById};//Exportamos las funciones de getUsuario,EliminarUsuario y ActualizarUsuario,para poder usarlas en el archivo UsuariosRoutes.js,que es donde vamos a definir las rutas de usuarios
