//Traemos el controlador de autenticación,dónde vamos a definir las rutas de registro de usuarios
const authController=require('../controllers/auth/AuthController');
const UsuariosController=require('../controllers/UsuariosController');//Traemos el controlador de usuarios,dónde vamos a definir las rutas de usuarios
const authMiddleware = require('../middlewares/AuthMiddleware');
const upload=require('../middlewares/uploads');//Traemos el middleware de uploads,para poder subir imagenes a la base de datos y a Cloudinary


const router=require('express').Router();
//Vale,una vez que traigamos el controlador de autenticación,definimos las rutas de registro
router.post('/registro',upload.single('perfil'),authController.registro);//Definimos la ruta de registro,que va a ser una ruta post,porque vamos a enviar datos al servidor
router.post('/login',authController.login);//Definimos la ruta de inicio de sesión,que va a ser una ruta post,porque vamos a enviar datos al servidor
router.put('/actualizar_perfil',authMiddleware,upload.single('perfil'),UsuariosController.ActualizarUsuario);//Definimos la ruta para actualizar el usuario
router.delete('/eliminar_todos',authMiddleware,UsuariosController.EliminarTodosUsuarios);//Definimos la función para borrar todos los usuarios,esta función es propia del administrador
router.get('/panel_usuarios',authMiddleware,UsuariosController.getAllUsuarios);//Solo el admin puede ver a todos los usuarios
router.put('/make_admin',authMiddleware,UsuariosController.MakeAdmin);//Solo el admin puede transformar a un usuario en admin
router.delete('/delete_user_by_id/:id',authMiddleware,UsuariosController.DeleteUserById);//Solo el admin puede eliminar a un usuario por su id,esta función es de emergencia,por ejemplo si un usuario está causando problemas en la plataforma,el admin podrá borrarlo sin necesidad de iniciar sesión
router.get('/ver_perfil_usuario',authMiddleware,UsuariosController.VerPerfilUsuario);//Definimos la ruta para ver el perfil de un usuario por su id,esta función es propia del administrador,ya que el admin puede ver el perfil de cualquier usuario,pero los usuarios normales solo pueden ver su propio perfil,que es la función siguiente
router.put('/actualizar_usuario_admin', authMiddleware, UsuariosController.ActualizarUsuarioAdmin);
module.exports=router;//Exportamos el router,para poder usarlo en el archivo index.js,que es el archivo principal de nuestro servidor
