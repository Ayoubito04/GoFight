//Definimos las rutas de las gamificaciones
const express=require('express');
const router=express.Router();
const {ActualizarGamificaciones}=require('../controllers/GamificacionesController');//Importamos el controlador de las gamificaciones,para poder usar la función de actualizar gamificaciones,ya que cada vez que se registre una sesión en el historial,tenemos que actualizar las gamificaciones
const authMiddleware=require('../middlewares/AuthMiddleware');//Importamos el middleware de autenticación,para proteger las rutas de las gamificaciones,ya que solo los usuarios autenticados pueden acceder a estas rutas

router.put('/gamificaciones',authMiddleware,ActualizarGamificaciones);//Actualizamos las gamificaciones,teniendo en cuenta la fecha actual y la fecha de la ultima sesión

module.exports=router;//Exportamos el router para poder usarlo en el index.js,para que se puedan usar las rutas de las gamificaciones en la aplicación