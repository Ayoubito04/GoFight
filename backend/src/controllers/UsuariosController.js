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
    try{
        const EliminarUsuario=await prisma.usuarios.delete({
            where:{id_usuario:req.user.id_usuario}//Ponemos la condición,es decir buscará al usuario por su id
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
        const ActualizarUsuario=await prisma.usuarios.update({
            where:{id_usuario:req.user.id_usuario},//Ponemos la condición,es decir buscará al usuario por su id
            data:{...req.body}//Actualizamos los datos del usuario,con los datos que recibimos desde el cliente
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
}
const getAllUsuarios=async(req,res)=>{
    //Esta función es propia del administrador,porque al igual que la función de eliminar,etsa también se encarga de gestionar los usuarios
}
module.exports={getUsuario,EliminarUsuario,ActualizarUsuario,EliminarTodosUsuarios,getAllUsuarios};//Exportamos las funciones de getUsuario,EliminarUsuario y ActualizarUsuario,para poder usarlas en el archivo UsuariosRoutes.js,que es donde vamos a definir las rutas de usuarios