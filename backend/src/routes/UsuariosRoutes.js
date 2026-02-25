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
router.delete('/eliminar_todos',authMiddleware,UsuariosController.EliminarTodosUsuarios);//Definimos la función para borrar todos los usuarios,esta función es propia del administrador
router.get('/panel_usuarios',authMiddleware,UsuariosController.getAllUsuarios);//Solo el admin puede ver a todos los usuarios
router.put('/make_admin',authMiddleware,UsuariosController.MakeAdmin);//Solo el admin puede transformar a un usuario en admin
router.delete('/delete_user_by_id',authMiddleware,UsuariosController.DeleteUserById);//Solo el admin puede eliminar a un usuario por su id,esta función es de emergencia,por ejemplo si un usuario está causando problemas en la plataforma,el admin podrá borrarlo sin necesidad de iniciar sesión
module.exports=router;//Exportamos el router,para poder usarlo en el archivo index.js,que es el archivo principal de nuestro servidor
