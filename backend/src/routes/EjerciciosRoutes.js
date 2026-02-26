//Aquí vamos a definir lasa rutas de los ejercicios

const EjerciciosController=require('../controllers/EjerciciosController');//Traemos el controlador de ejercicios,para poder definir cada una de las rutas
const authMiddleware = require('../middlewares/AuthMiddleware');//Traemos el middleware de autenticación,para proteger las rutas de ejercicios
const upload=require('../middlewares/uploads');//Traemos el middleware de uploads,para poder subir imagenes a la base de datos y a Cloudinary
const router=require('express').Router();
//Toca definir las rutas de ejercicios
router.post('/crear',authMiddleware,upload.single('video'),EjerciciosController.CrearEjercicio);
router.get('/obtener',authMiddleware,EjerciciosController.ObtenerEjercicios);
router.get('/obtener/:id',authMiddleware,EjerciciosController.ObtenerEjercicioPorId);
router.put('/actualizar/:id',authMiddleware,upload.single('video'),EjerciciosController.ActualizarEjercicio);
router.delete('/eliminar/:id',authMiddleware,EjerciciosController.EliminarEjercicio);

module.exports=router;//Exportamos el router,para poder usarlo en el archivo index.js,que es el archivo principal de nuestro servidor

