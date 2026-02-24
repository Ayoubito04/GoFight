//Traemos el controlador de autenticación,dónde vamos a definir las rutas de registro de usuarios
const authController=require('../controllers/auth/AuthController');

const router=require('express').Router();
//Vale,una vez que traigamos el controlador de autenticación,definimos las rutas de registro
router.post('/registro',authController.registro);//Definimos la ruta de registro,que va a ser una ruta post,porque vamos a enviar datos al servidor

module.exports=router;//Exportamos el router,para poder usarlo en el archivo index.js,que es el archivo principal de nuestro servidor
