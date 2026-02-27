//Vamos a definir las rutas para las rutinas,que es el CRUD  de las rutinas
const authMiddleware=require('../middlewares/AuthMiddleware');//Importamos el middleware de autenticación para proteger las rutas de las rutinas
const RutinasController=require('../controllers/RutinasController');//Importamos el controlador de las rutinas para poder usar las funciones del CRUD de las rutinas
const router=require('express').Router();

router.post('/crear_rutina',authMiddleware,RutinasController.CrearRutina);//Definimos la ruta para crear una rutina
router.delete('/eliminar_rutina/:id',authMiddleware,RutinasController.EliminarRutinas);//Definimos la ruta para eliminar rutinas
router.get('/ver_rutinas',authMiddleware,RutinasController.VerRutinas);//Definimos la ruta para ver rutinas
router.put('/actualizar_rutina/:id',authMiddleware,RutinasController.ActualizarRutina);//Definimos la ruta para actualizar las rutinas
module.exports=router;
