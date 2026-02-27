//Aquí vamos a implementar el CRUD de las rutinas,es decir funciones para crear,leer,actualizar y eliminar rutinas
const prisma=require('../db/db');//Traemos la base de datos,para poder hacer el CRUD
const { connect } = require('../routes/RutinasRoutes');

const CrearRutina=async(req,res)=>{

     
      try{
          const {nombre_rutina,id_ejercicio}=req.body;//Recibimos el nombre de la rutina y el id del ejercicio
          //También hay definir el usuario,ya que cada rutina depende de un usuario y viciversa,es una relación 1:N
          const id_usuario=req.user?.id;//Obtenemos el id del usuario desde el token de autenticación
          if(!nombre_rutina || !id_ejercicio || !Array.isArray(id_ejercicio)){
            //Si no hay ejercicios,no hay rutinas,así de simple,entonces indicamos al usuario que debe introducir el nombre de la rutina,también que tiene contar con ejercicios y que estos tienen que estar en ala array
             return res.status(400).json({message:"El nombre de la rutina es obligatorio,la rutina debe contar con ejercicios y estos deben estar en un array"});

          }
          else{
                const nuevaRutina=await prisma.rutinas.create({
                    data:{
                        nombre_rutina:nombre_rutina,
                        id_usuario:id_usuario,
                        rutinas_ejercicios:{
                            create:id_ejercicio.map(id=>({ejercicios:{connect:{id_ejercicio:id}}})),
                            
                        }
                    },
                    include:{
                        rutinas_ejercicios:{
                            include:{
                                ejercicios:true
                            }
                        }
                        
                    }
                    
                });
                res.status(201).json({message:'Rutina creada exitosamente',nuevaRutina});
                //Indicamos que la rutina se haya creado exitosamente,mostrando un mensaje en pantalla

          }
      }catch(error){
             res.status(500).json({message:'Error al crear la rutina',error:error.message});
             
      }
}
const EliminarRutinas=async(req,res)=>{
    //Aquí vamos a eliminar una rutina,para eso obviamente necesitamos el id
      const id=parseInt(req.params.id);
      const rutinas=await prisma.rutinas.findUnique({
        where:{id_rutina:id}
      })
    
      try{
          await prisma.rutinas.delete({
                 where:({id_rutina:id})

          })
           if(!id || !rutinas){
            //Si no se encuentra la rutina,le indicamos al usuario que no se ha encontrado la rutina
             return res.status(404).json({message:'No se ha encontrado la rutina'});
            }
          res.status(200).json({message:'Rutina eliminada exitosamente'});
         
      }catch(error){
            res.status(500).json({message:'Error al eliminar la rutina',error:error.message});  
      }
}
const VerRutinas=async(req,res)=>{
    //Aquí el usuario podrá entrar a la biblioteca y ver sus rutinas,como si fuera un historial de rutinas
     const id_usuario=req.user?.id;//Importante obtener el id del usuario
     const rutinas=await prisma.rutinas.findMany({
        where:{id_usuario:id_usuario},
     });
      try{
           const rutinas=await prisma.rutinas.findMany({
                  where:{id_usuario:id_usuario},
                  select:{
                    id_rutina:true,
                    nombre_rutina:true,
                    rutinas_ejercicios:{
                        include:{
                            ejercicios:true
                        }
                    }
                  }
           })
            if(rutinas.length===0){
            //Si no se encuentra ninguna rutina,se lo indicamos al usuario
              return res.status(404).json({message:'No se han encontrado rutinas para este usuario'});
           }
           res.status(200).json({message:'Rutinas obtenidas exitosamente',rutinas});
          

      }catch(error){
       res.status(500).json({message:'Error al obtener las rutinas',error:error.message});
      }

}
const ActualizarRutina=async(req,res)=>{
    //Vamos a actualizar una rutina,ya sea actualizar nombre,ejercicios o ambos
    const id=parseInt(req.params.id);
    //Necesitamos el id de la rutina
    try{
        const {nombre_rutina,id_ejercicio}=req.body;
        if(!nombre_rutina  && !id_ejercicio){
            res.status(400).json({message:'Debe proporcionar al menos un campo para actualizar,ya sea el nombre de la rutina o los ejercicios'});
        }
        else{
             const rutinaActualizada=await prisma.rutinas.update({
                where:{id_rutina:id},
                data:{
                    nombre_rutina:nombre_rutina,
                    rutinas_ejercicios:{
                          deleteMany:{},//Primero eliminamos los ejercicios que ya tiene la rutina,para luego agregar los nuevos ejercicios,si es que se han proporcionado nuevos ejercicios
                          create:id_ejercicio?.map(id=>({ejercicios:{connect:{id_ejercicio:id}}}))//Luego agregamos los nuevos ejercicios,si es que se han proporcionado nuevos ejercicios,si no se han proporcionado nuevos ejercicios,entonces no se agregan nuevos ejercicios y la rutina queda sin ejercicios,lo cual no es un problema,ya que el usuario puede agregar ejercicios luego desde la ruta de actualizar rutina,que es esta misma ruta
                    }

                },
                include:{
                    rutinas_ejercicios:{
                        include:{
                            ejercicios:true
                        }
                    }
                }
             })
             res.status(200).json({message:'Rutina actualizada exitosamente',rutinaActualizada});
        }
    }catch(error){
        res.status(500).json({message:'Error al actualizar la rutina',error:error.message});
    }
}
module.exports={
    CrearRutina,
    EliminarRutinas,
    VerRutinas,
    ActualizarRutina}