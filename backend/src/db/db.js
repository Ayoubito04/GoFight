//Aquí vamos a definir la conexión con la base de datos,vamos a usar prismaClient y también el adapter,ya que estamos usando pgadmin como base de datos local
const {PrismaClient}=require('../generated/prisma/client');
const {PrismaPg}=require('@prisma/adapter-pg');
const {Pool}=require('pg');
require('dotenv').config();//Para poder usar las variables de entorno

const pool=new Pool({
    connectionString:process.env.DATABASE_URL
});
const adapter=new PrismaPg(pool);

const prisma=new PrismaClient({
    adapter

})
module.exports=prisma;