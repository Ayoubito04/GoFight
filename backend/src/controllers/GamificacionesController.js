
//Vamos a empezar con el CRUD de las gamificaciones
const prisma=require('../db/db');//Treamos la base de datos,para poder hacer las operaciones CRUD

const ActualizarGamificaciones = async (req, res) => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const manana = new Date(hoy);
    manana.setDate(hoy.getDate() + 1);
    const ayer = new Date(hoy);
    ayer.setDate(hoy.getDate() - 1);

    try {
        const id_usuario = req.user?.id;
        //Primero de todo obtenemos el id del usuario desde el token de autenticación,ya que las gamificaciones depebnden del perfil del usuario,así que necesitamos el id para poder obtener las gamificaciones del usuario y actualizarlas
        // 1. Consultas a la base de datos
        const ultimaSesion = await prisma.sesiones_historial.findFirst({
            where: { id_usuario },
            orderBy: { fecha_entreno: 'desc' }
        });
        //Tenemos en cuenta la ultima sesión del usurio y lo ordenamos de manera descendente

        const sumCalorias = await prisma.sesiones_historial.aggregate({
            _sum: { calorias: true },
            where: { id_usuario, fecha_entreno: { gte: hoy, lt: manana } }
        });
        //Obtenemos la suma de las calorias quemadas en el día,para poder dar puntos de bonus al usuario,teniendo en cuenta las caloiras perdidas de hoy y mañanan,es decir el rango es de unas 24 horas,si no se registra ninguna rutina dentro de ese rango establecido pues no se tendrán en cuenta esas calorias

        const sesionesHoy = await prisma.sesiones_historial.findMany({
            where: { id_usuario, fecha_entreno: { gte: hoy, lt: manana } }
        });
        //Obtenemos las sesiones de hoy,con el mismo filtro que antes(es decir sesiones registradas dentro de un rango establecido de 24 horas)

        let gamificaciones = await prisma.gamificaciones.findFirst({
            where: { id_usuario }
        });
        //Obtenemos las gamificaciones del usuario,el usuario target es el mismo que el de las sesiones.En la carpeta de services/services.js se pulle más está funcionalidad,dónde tendrá que obtener el token antes de realizar acciones en la app en especifico

        if (!gamificaciones) {
            gamificaciones = await prisma.gamificaciones.create({
                data: { id_usuario, racha_dias: 0, puntos_ranking: 0 }
            });
        }
        //Si el usuario no tiene gamificaciones,se crearan unas gamificaciones de manera automatica,con una racha de días 0 y puntos 0
        //Decxlaramos variables para cada uno de los atributos de las gamificaciones,aparte de los mensajes que recibirá el usuario
        let racha_dias = gamificaciones.racha_dias;
        let puntos_ranking = gamificaciones.puntos_ranking;
        let mensajeResponse = ''; // Usamos un nombre claro
        const totalCaloriasQuemadas = sumCalorias._sum.calorias || 0;

        
        if (!ultimaSesion) {
            racha_dias = 0;
            mensajeResponse = '¡Bienvenido! Entrena hoy para activar tu racha.';
            //Si no hay sesiones registradas en las ultimas 24 horas,entonces las rachas==0
        } else {
            const fechaUltima = new Date(ultimaSesion.fecha_entreno);
            fechaUltima.setHours(0, 0, 0, 0);

            if (fechaUltima.getTime() === hoy.getTime()) {
                // Ya entrenó hoy: mantenemos racha pero actualizamos mensaje
                mensajeResponse = 'Dale duro, que seguro que superas a mi abuela.';
            } else if (fechaUltima.getTime() === ayer.getTime()) {
                //Si ayer sí que entreno y además su sesión está registrada dentro de ese intervalo de 24 horas,pues aumentaremos la gamificaciones,ya sean puntos ranking e incluso esto influye en el mensaje
                racha_dias += 1;
                puntos_ranking += 10;
                mensajeResponse = `¡Crack! Has mantenido tu racha de ${racha_dias} días.`;
            } else {
                // Si han pasado más de 2 días sin entrenar,se pierde esta racha,es decir,si no se registra ninguna sesión dentro de un rango establecido de 48 horas,entonces se pierde la racha,y además afecta a los puntos del ranking
                puntos_ranking = Math.max(0, puntos_ranking - 10);
                mensajeResponse = 'Has perdido tu racha por vago/a. Mi abuela pega más fuerte.';
            }
        }

       //Aquí definimos otra bonificaciones,dónde se recompensa por sesiones registradas dentro de un rango establecido de 24 horas
        if (totalCaloriasQuemadas >= 10) {
            puntos_ranking += 20;
            mensajeResponse += ` | +20 pts por quemar ${totalCaloriasQuemadas} kcal.`;
        }

        if (sesionesHoy.length >= 3) {
            puntos_ranking += 20;
            mensajeResponse += ` | +20 pts por completar 3 sesiones.`;
        }

        // Finalmente,actualizaremos las gamificaciones del usuario con los nuevos valores calculados,teniendo en cuenta la racha de días y los puntos del ranking,que se actualizan dependiendo de las sesiones registradas dentro de un rango establecido de 24 horas,así como la ultima sesión registrada dentro de ese mismo rango establecido de 24 horas
        const gamificacionesActualizadas = await prisma.gamificaciones.update({
            where: { id_gamificacion: gamificaciones.id_gamificacion },
            data: {
                racha_dias: racha_dias,
                puntos_ranking: puntos_ranking
            }
        });


        //Finalmente la respuyesta por parte del servidor,que incluye un mensaje claro para el usuario,así como las gamificaciones actualizadas y las calorias quemadas en el día,que también influyen en las bonificaciones de las gamificaciones
        res.status(200).json({
            message: mensajeResponse,
            gamificaciones: gamificacionesActualizadas,
            caloriasQuemadas: totalCaloriasQuemadas
        });

    } catch (error) {
        console.error("Error en gamificaciones:", error);
        res.status(500).json({ message: 'Error al actualizar', error: error.message });
    }
};
const VerGamificaciones=async(req,res)=>{
      const id_usuario=req.user?.id;
      console.log('ID del usuario desde VerGamificaciones:', id_usuario); // Agrega este console.log para verificar el ID del usuario
      try{
          const gamificaciones=await prisma.gamificaciones.findFirst({
                  where:{id_usuario:id_usuario}

          })
          if(!gamificaciones){
             return res.status(404).json({message:'No se han encontrado gamificaciones para este usuario'
                +gamificaciones
             });
          }
            res.status(200).json({message:'Gamificaciones obtenidas exitosamente',gamificaciones});
      }catch(error){
          res.status(500).json({message:'Error al obtener las gamificaciones',error:error.message});
      }
}
const getRanking=async(req,res)=>{
    try{
        const ranking=await prisma.gamificaciones.findMany({
            orderBy:{puntos_ranking:'desc'},
            include:{usuarios:{
                select:{nombre:true,perfil:true}
            }
            }
        })
        res.status(200).json({message:'Ranking obtenido exitosamente',ranking});

        }catch(error){
            res.status(500).json({message:'Error al obtener el ranking',error:error.message});
    }
}
module.exports={ActualizarGamificaciones, VerGamificaciones, getRanking}