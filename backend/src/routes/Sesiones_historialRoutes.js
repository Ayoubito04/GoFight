//Vamos a implementar cada una de las ruta de Sesiones_historial
const express=require('express');
const router=express.Router();
const Sesiones_historialController=require('../controllers/Sesiones_historialController');//Importamos el controlador de las sesiones_historial,para poder usar la función de registrar historial,que es la función principal de esta ruta
const authMiddleware=require('../middlewares/AuthMiddleware');//Importamos el middleware de autenticación,para proteger las rutas de las sesiones_historial,ya que solo los usuarios autenticados pueden acceder a estas rutas

router.post('/registrar_historial',authMiddleware,Sesiones_historialController.RegistrarHistorial);//Definimos la ruta para registrar el historial,que es la función principal de esta ruta

module.exports=router;//Exportamos el router para poder usarlo en el index.js,para que se puedan usar las rutas de las sesiones_historial en la aplicación