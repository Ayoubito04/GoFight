//Aquí vamos a definir el middleware de autenciación
const jwt=require('jsonwebtoken');//Traemos jsonwebtoken,que es una librería para generar y verificar tokens de autenticación

const authMiddleware=async(req,res,next)=>{
    //Aquí vamos a generar el token de autenticación,que se enviará al usuario una vez que haya inciado sesión
    const authHeader=req.headers['authorization'];//Obtenemos el token de autenticación desde el header de la petición
    const token=authHeader && authHeader.split(' ')[1];//Obtenemos el token de autenticación,que se encuentra después de la palabra "Bearer" en el header de la petición
    if(!token){
        return res.status(401).json({message:'Token de autenticación no proporcionado'});
        //Le indicamos al usuario que no se ha podido porporcionar el token,en el caso de que no exista

    }
    //Ahora tenemos que verificar si el token es valido o no 
    try{
    const TokenValido=jwt.verify(token,process.env.JWT_SECRET);
    req.user=TokenValido;
    next();


    }catch(error){
        return res.status(500).json({message:'Error al verificar el token de autenticación',error:error.message});
    }

}
module.exports=authMiddleware;//Exportamos el middleware de autenticación,para aplicarlo dentro del login