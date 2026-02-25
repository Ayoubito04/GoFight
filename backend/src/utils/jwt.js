//Aquí vamos a definir el jwt,que es el token que se va a generar
const jwt=require('jsonwebtoken');//Traemos jsonwebtoken,que es una librería para generar y verificar tokens de autenticación

const generarToken=(
    id,email
)=>{
    return jwt.sign({id,email},process.env.JWT_SECRET,{expiresIn:'24h'});//Generamos el token basado en id de usuario y el email y este tiene su utilidad hasta las 24 horas
}
module.exports=generarToken;//Exportamos la función de generar token,para poder usarla en el archivo AuthController.js,que es donde vamos a definir las funciones de registro e inicio de sesión
