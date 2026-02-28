
//Vamos a empezar con el CRUD de las gamificaciones
const prisma=require('../db/db');//Treamos la base de datos,para poder hacer las operaciones CRUD

const ActualizarGamificaciones=async(req,res)=>{
    //En vez de crear gamificaciones,solo ls vamos a actualizar,ya que la racha y el ranking son por defecto =0
    //Tenemos que tener el cuenta la fecha actual,ya que la racha se tiene que actualizar cada día
    const hoy=new Date();
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
    //Sin el usuario no tiene gamificaciones,lo creamos con una racha de 0 días y 0 puntos
     let racha_dias=gamificaciones.racha_dias;
        let puntos_ranking=gamificaciones.puntos_ranking;
        let racha_perdida=false;
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
      res.status(200).json({message:mensaje, gamificaciones:gamificacionesActualizadas});
}catch(error){
    res.status(500).json({message:'Error al actualizar las gamificaciones',error:error.message});
}
}
module.exports={ActualizarGamificaciones}