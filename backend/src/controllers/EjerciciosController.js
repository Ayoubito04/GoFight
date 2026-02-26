//Aquí vamos a implementar el CRUD de los ejercicios,es decir funciones para crear,leer,actualizar y eliminar
const prisma=require('../db/db');//Traemos la base de datos,para poder hacer el CRUD

const CrearEjercicio=async(req,res)=>{
    //Primeramente para poder crear un ejercicio,necesitas ser el administrador,ya que los usuarios no pueden modificar la interfaz de los ejercicios y los únicos que lo pueden hacer son los propios administradores
    if(req.user.rol!=='admin'){
         return res.status(403).json({message:'Acceso denegado,solo los administradores pueden crear ejercicios'});
}
else{
       try{
        const {nombre,categoria,video}=req.body;//Recibimos el nombre,la descripción y el video de cada de los ejercicios
        const videoFinal=req.file?req.file.path:video;

        const NuevoEjercicio=await prisma.ejercicios.create({
            data:{
                 nombre:nombre,
                 categoria:categoria,
                 url_video:videoFinal

            }
        })
        res.status(201).json({message:'Ejercicio creado exitosamente',NuevoEjercicio});
    }catch(error){
        res.status(500).json({message:'Error al crear el ejercicio',error:error.message});
    }
}
}
const ObtenerEjercicios=async(req,res)=>{
    try{
        const ejercicios=await prisma.ejercicios.findMany();//Buscamos todos los ejercicios en la base de datos
        if(ejercicios.length===0){
             return res.status(404).json({message:'No se han encontrado ejercicios'});
             //Si no se encuentran los ejercicios,le indicamos al usuario que no se han encontrado ejercicios

        }
        else{
              res.status(200).json({message:'Ejercicios encontrados exitosamente',ejercicios});
              //Si se encuentran los ejercicios,le indicamos al usuario que se han encontrado exitosamente

        }
    }catch(error){
        res.status(500).json({message:'Error al obtener los ejercicios',error:error.message});
    }
}
const ActualizarEjercicio=async(req,res)=>{
      if(req.user.rol!=='admin'){
          return res.status(403).json({message:'Acceso denegado,solo los administradores pueden actualizar los ejercicios'});

      }
      else{
          try{
            const id=req.params.id;
            const {nombre,categoria,video}=req.body;
            const EejercicioActualizado=await prisma.ejercicios.update({
                where:{id_ejercicio:id},
                data:{
                    nombre:nombre,
                    categoria:categoria,
                    url_video:video
                }
            })
            res.status(200).json({message:'Ejercicio actualizado exitosamente',EejercicioActualizado});
          }catch(error){
              res.status(500).json({message:'Error al actualizar el ejercicio',error:error.message});
          }
      }
    }
const EliminarEjercicio=async(req,res)=>{
    if(req.user.rol!=='admin'){
        return res.status(403).json({message:'Acceso denegado,solo los administradores pueden eliminar los ejercicios'});

}
else{
    try{
        const id=req.params.id;
        const EjercicioEliminado=await prisma.ejercicios.delete({
            where:{id_ejercicio:id}

        });
        res.status(200).json({message:'Ejercicio eliminado exitosamente',EjercicioEliminado});
    }catch(error){
        res.status(500).json({message:'Error al eliminar el ejercicio',error:error.message});
    }
}
}
const ObtenerEjercicioPorId=async(req,res)=>{
       try{
           const id=req.params.id;
           const ejercicio=await prisma.ejercicios.findUnique({
            where:{id_ejercicio:id},
            select:{
                id_ejercicio:true,
                nombre:true,
                categoria:true,
                url_video:true
            }
            
           })
           res.status(200).json({message:'Ejercicio encontrado exitosamente',ejercicio});
           if(!ejercicio || ejercicio.length===0){
                return res.status(404).json({message:'Ejercicio no encontrado,compruebe que exista'});
           }

       }catch(error){
              res.status(500).json({message:'Error al obtener el ejercicio',error:error.message});
       }
}
module.exports={CrearEjercicio,ObtenerEjercicios,ActualizarEjercicio,EliminarEjercicio,ObtenerEjercicioPorId};//Exportamos las funciones del CRUD de los ejercicios,para poder usarlas en el archivo EjerciciosRoutes.js,que es donde vamos a definir las rutas de los ejercicios