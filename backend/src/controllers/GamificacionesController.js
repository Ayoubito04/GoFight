
//Vamos a empezar con el CRUD de las gamificaciones
const prisma=require('../db/db');//Treamos la base de datos,para poder hacer las operaciones CRUD

const ActualizarGamificaciones=async(req,res)=>{
    //En vez de crear gamificaciones,solo ls vamos a actualizar,ya que la racha y el ranking son por defecto =0
    //Tenemos que tener el cuenta la fecha actual,ya que la racha se tiene que actualizar cada día
    const hoy=new Date();
    const manana=new Date(hoy);
    manana.setDate(hoy.getDate()+1);//Obtenemos la fecha de mañana sumando un día,esto es para que la app,tenga en cuenta cuantos días estan pasando verdaderamente
    hoy.setHours(0,0,0,0);//Establecemos la hora a 00:00:00 para comparar solo la fecha
    const ayer=new Date(hoy);
    ayer.setDate(hoy.getDate()-1);//Obtenemos la fecha de ayer restando un día,esto es para que la app,tenga en cuenta cuantos días estan pasando verdaderamente
    //La lógica es simple,si el usuario ha entrenado hoy,la racha se mantiene,incluso va incrementando poco a poco,si no mantiene varios días sin entrenar la tecnica,pues perderá toda esa racha
    try{
        const ultimaSesion=await prisma.sesiones_historial.findFirst({
            where:{id_usuario:req.user?.id,
                 
            },
            orderBy:{
                fecha_entreno:'desc'

            }
        })
                //La lógica Date tiene en cuenta la fecha y hora actual y este valor se resta a la fecha de ayer
        const  sumCalorias=await prisma.sesiones_historial.aggregate({
            _sum:{calorias:true},
            where:{
                id_usuario:req.user?.id,
                fecha_entreno:{
                    gte:hoy,
                    lt: manana
                }
            }
        })
        const totalCaloriasQuemadas=sumCalorias._sum.calorias || 0;
        //Aquí se calculan total de calorias quemadas hoy
        let gamificaciones=await prisma.gamificaciones.findFirst({
            where:{id_usuario:req.user?.id}
        });
        //Tenemos en cuenta que el usuario pierda la racha,una vez que se actualice
        if(!gamificaciones){
            gamificaciones=await prisma.gamificaciones.create({
                data:{
                    id_usuario:req.user?.id,
                    racha_dias:0,
                    puntos_ranking:0

                    
                }
                
            })
           


    }
    if(ultimaSesion){
        const fechaUltimaSesion=new Date(ultimaSesion.fecha_entreno);
        fechaUltimaSesion.setHours(0,0,0,0);//Establecemos la hora a 00:00:00 para comparar solo la fecha
        if(fechaUltimaSesion.getTime()===hoy.getTime() && gamificaciones.racha_dias>0){
            //Si el usuario ha entrenado hoy,la racha se mantiene,incluso va incrementando poco a poco
            return res.status(200).json({
                message:"Ya has actualizado la racha de hoy,no puedes actaulizarla hasta mañana,pero no te preocupes,que seguro que superas a mi abuela,que se note que eres un/a crack",
                gamificaciones,
                caloriasQuemadas:totalCaloriasQuemadas
            })
        }
    }

    //Sin el usuario no tiene gamificaciones,lo creamos con una racha de 0 días y 0 puntos
     let racha_dias=gamificaciones.racha_dias;
        let puntos_ranking=gamificaciones.puntos_ranking;
        let racha_perdida=false;
        let mensaje='';
        if(!ultimaSesion){
            racha_dias=0;
            racha_perdida=true;
            puntos_ranking=Math.max(0,puntos_ranking-10);//El usuario pierde 10 puntos de ranking,una vez que se actualize
            mensaje='No has entrenado hoy,has perdido tu racha de días consecutivos,como se nota que mi abuela pega más que tu,anda campeon/a,espabila....'
           

        }
        else{
              const fechaUltimaSesion=new Date(ultimaSesion.fecha_entreno);
              fechaUltimaSesion.setHours(0,0,0,0);//Establecemos la hora a 00:00:00
              if(fechaUltimaSesion.getTime()===hoy.getTime()){
                mensaje='Dale duro,que seguro que superas a mi abuela,por hoy has restablecido la racha'
                racha_dias+=1;
                puntos_ranking+=10;
                   

                

        }
        else if(fechaUltimaSesion.getTime()===ayer.getTime()){
            racha_dias+=1;
            puntos_ranking+=10;
            mensaje=`Muy bien,has mantenido tu racha de ${racha_dias} días consecutivos,que se note que eres un/a crack,mi abuela estaría orgullosa de ti`
            
        
}
else{
    racha_dias=0;
    racha_perdida=true;
    puntos_ranking=Math.max(0,puntos_ranking-10);
    mensaje='Has perdido tu racha de días consecutivos,como se nota que mi abuela pega más,eres un/a vago/a,anda campeon/a,espabila,que la vida son dos días...'
}
if(totalCaloriasQuemadas>=1000){
     puntos_ranking+=20;
     mensaje=`Enhorabuena,has quemado ${totalCaloriasQuemadas} calorías hoy,te has ganado 20 puntos de ranking,que se note que eres un/a crack,mi abuela estaría orgullosa de ti`
}
  //Ahora sí que lo actualizamos en la base de datos,con la nueva racha y puntos de ranking
     
}
 const gamificacionesActualizadas=await prisma.gamificaciones.update({
        where:{id_gamificacion:gamificaciones.id_gamificacion},
        data:{
            racha_dias:racha_dias,
            puntos_ranking:puntos_ranking
        }
        //Ahora toca avisar al usuario de su neuva racha

      });
      res.status(200).json({message:mensaje, gamificaciones:gamificacionesActualizadas,caloriasQuemadas:totalCaloriasQuemadas});
}catch(error){
    res.status(500).json({message:'Error al actualizar las gamificaciones',error:error.message});
}
}
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
module.exports={ActualizarGamificaciones, VerGamificaciones}