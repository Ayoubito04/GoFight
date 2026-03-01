//Vamos a implementar cada una de las ruta de Sesiones_historial
const express=require('express');
const router=express.Router();
const Sesiones_historialController=require('../controllers/Sesiones_historialController');//Importamos el controlador de las sesiones_historial,para poder usar la función de registrar historial,que es la función principal de esta ruta
const authMiddleware=require('../middlewares/AuthMiddleware');//Importamos el middleware de autenticación,para proteger las rutas de las sesiones_historial,ya que solo los usuarios autenticados pueden acceder a estas rutas

router.post('/registrar_historial',authMiddleware,Sesiones_historialController.RegistrarHistorial);//Definimos la ruta para registrar el historial,que es la función principal de esta ruta
router.get('/obtener_historial_de_sesiones',authMiddleware,Sesiones_historialController.MostrarHistorial);
router.get('/obtener_historial_de_sesiones/:id',authMiddleware,Sesiones_historialController.VerSesionesPorId);//Definimos la ruta para obtener el historial de sesiones por id,que es la función para mostrar el historial de sesiones por id,que es una función adicional,ya que la función principal es mostrar el historial de sesiones de un usuario,que es la ruta anterior
module.exports=router;//Exportamos el router para poder usarlo en el index.js,para que se puedan usar las rutas de las sesiones_historial en la aplicación