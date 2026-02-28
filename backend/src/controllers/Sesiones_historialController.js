//Vamos a implementar el CRUD  de las sesiones_historial,es decir las funciones para.En este caso en especifico vamos a Registrar y Mostrar historial
const prisma=require('../db/db');//Traemos la base de datos,para poder hacer las operaciones CRUD
const { ActualizarGamificaciones }=require('./GamificacionesController');
//Tramos el controlador de las gamificaciones,ya que cada vez que se registre una sesión en el historial,tenemos que actualizar las gamificaciones
const RegistrarHistorial=async(req,res)=>{
    const CALORIAS_POR_CATEGORIA={
        'Cardio':10,
        'Manoplas':7,
        'Comba':9,
        'Saco':8,
        'Pera':6
    }
    try{
        const id_usuario=req.user?.id;//Obtenemos el id del usuario desde el token de autenticación
         const {id_rutina,calorias}=req.body;//Recibimos el id de la rutina y la fecha del entrenamiento
         if(!id_rutina){
            //Si no se encuentra ninguna rutina o no se introduce la fecha, devolvemos un error
            return res.status(400).json({message:'Faltan datos para registrar el historial,sí quieres registrar cosas en el historial,necesitas tener por lo menos una rutina'});

         }
         else{
              const rutina=await prisma.rutinas.findFirst({
                where:{id_rutina:parseInt(id_rutina),id_usuario:id_usuario},
                include:{rutinas_ejercicios:{
                    include:{ejercicios:true}
                }}


              })
              if(!rutina){
                //Si no se encuentra la rutina,le indicamos que el usuario no tiene esasrutinas
                 return res.status(404).json({message:'No se ha encontrado la rutina,asegúrate de introducir un caracter valido para la rutina'});

              
                }
            const CalcularCalorias=rutina.rutinas_ejercicios.reduce((total,re)=>{
                 const categoria=re.ejercicios.categoria;//La categoría también es imprtante,ya que para cada categoria se asigna unos minutos
                 const duracion=re.duracion_ejercicio;//Obtenemos la duracion de cada ejercicio
                 const calorias=CALORIAS_POR_CATEGORIA[categoria] || 0;//Si la categoría no se encuentra en el objeto CALORIAS_POR_CATEGORIA.le asignamos 0 por defect0
                 return total + (calorias * duracion);//Calculamos el total de calorias,teniendo en cuenta la duración * calorias
                 //Tenemos en cuenta que el total de calorias se va acumulando a medida
            },0)
            const nuevaSesion=await prisma.sesiones_historial.create({
                data:{
                    id_usuario,
                    id_rutinas:parseInt(id_rutina),
                    calorias:CalcularCalorias //Guardamos las calorias quemadas durante la sesión de entrenamiento


                },
                include:{
                    rutinas:true
                }
            })
             let gamificacionesTotales=null;//Por defecto será nulo
             //Vamos a recoger primeramente el id del usuario,para que se puedan actualizar las gamificaciones,teniendo en cuenta también las calorias perdidas
             const Fakereq={
                user:{
                    id:id_usuario
                }

             }
             //Ahora en los resultados,pillamos la respuesta de la función actualizar gamificaciones
             const Fakeres={
                  status:(code)=>{
                     return{
                        json:(data)=>{
                            gamificacionesTotales=data;
                        }
                     }
                  }
             }
             await ActualizarGamificaciones(Fakereq,Fakeres);//Con esto ya actualizamos las gamificaciones,teniendo en cuenta el id del usuario y las calorias perdidas
               res.status(201).json({message:'Sesión registrada exitosamente',nuevaSesion,ActualizarGamificaciones,calorias:CalcularCalorias});

         }

    }catch(error){
         res.status(500).json({message:'Error al registrar el historial',error:error.message});
    }
}
module.exports={RegistrarHistorial}