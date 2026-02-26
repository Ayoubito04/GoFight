//Aquí vamos a configuración de Cloudinary
const multer=require('multer');
const {CloudinaryStorage}=require('multer-storage-cloudinary');
const cloudinary=require('cloudinary').v2;

cloudinary.config({
    cloud_name:process.env.Cloudinary_cloud_name,
    api_key:process.env.Cloudinary_api_key,
    api_secret:process.env.Cloudinary_api_secret
})
const storage=new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:'GoFight_App',
        allowed_formats:['jpg','png','jpeg'],
        transformation:[{width:500,height:500,crop:'limit'}]
    }
})
const upload=multer({storage:storage});//Aquí le indicamos a multer que use la configuración de CloudinaryStorage,que es donde se va a guardar la imagen en Cloudinary
module.exports=upload;//Exportamos la configuración de multer 