//Traemos el controlador de autenticación,dónde vamos a definir las rutas de registro de usuarios
const authController=require('../controllers/auth/AuthController');
const UsuariosController=require('../controllers/UsuariosController');//Traemos el controlador de usuarios,dónde vamos a definir las rutas de usuarios
const authMiddleware = require('../middlewares/AuthMiddleware');

const router=require('express').Router();
//Vale,una vez que traigamos el controlador de autenticación,definimos las rutas de registro
router.post('/registro',authController.registro);//Definimos la ruta de registro,que va a ser una ruta post,porque vamos a enviar datos al servidor
router.post('/login',authController.login);//Definimos la ruta de inicio de sesión,que va a ser una ruta post,porque vamos a enviar datos al servidor
router.get('/perfil',authMiddleware,UsuariosController.getUsuario);//Definimos la ruta perfil,ya que en esta el usuario podrá ver su nombre y su email
router.delete('/eliminar',authMiddleware,UsuariosController.EliminarUsuario);//Definimos la ruta para eliminar el usuario deseado
router.put('/actualizar_perfil',authMiddleware,UsuariosController.ActualizarUsuario);//Definimos la ruta para actualizar el usuario
module.exports=router;//Exportamos el router,para poder usarlo en el archivo index.js,que es el archivo principal de nuestro servidor
