-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'user');

-- CreateEnum
CREATE TYPE "categoria" AS ENUM ('Saco', 'Pera', 'Manoplas', 'Cardio', 'Comba');

-- CreateEnum
CREATE TYPE "dificultad" AS ENUM ('Fácil', 'Intermedio', 'Avanzado');

-- CreateTable
CREATE TABLE "ejercicios" (
    "id_ejercicio" SERIAL NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "categoria" "categoria",
    "url_video" TEXT,

    CONSTRAINT "ejercicios_pkey" PRIMARY KEY ("id_ejercicio")
);

-- CreateTable
CREATE TABLE "gamificaciones" (
    "id_gamificacion" SERIAL NOT NULL,
    "id_usuario" INTEGER,
    "racha_dias" INTEGER DEFAULT 0,
    "puntos_ranking" INTEGER DEFAULT 0,

    CONSTRAINT "gamificaciones_pkey" PRIMARY KEY ("id_gamificacion")
);

-- CreateTable
CREATE TABLE "rutinas" (
    "id_rutina" SERIAL NOT NULL,
    "id_usuario" INTEGER,
    "nombre_rutina" VARCHAR(150) NOT NULL,
    "dificultad" "dificultad",

    CONSTRAINT "rutinas_pkey" PRIMARY KEY ("id_rutina")
);

-- CreateTable
CREATE TABLE "rutinas_ejercicios" (
    "id_rutina_ejercicio" SERIAL NOT NULL,
    "id_rutina" INTEGER,
    "id_ejercicios" INTEGER,
    "duracion_ejercicio" INTEGER,
    "duracion_descanso" INTEGER,
    "orden" INTEGER,

    CONSTRAINT "rutinas_ejercicios_pkey" PRIMARY KEY ("id_rutina_ejercicio")
);

-- CreateTable
CREATE TABLE "sesiones_historial" (
    "id_sesion_historial" SERIAL NOT NULL,
    "id_usuario" INTEGER,
    "id_rutinas" INTEGER,
    "fecha_entreno" DATE DEFAULT CURRENT_DATE,
    "calorias" DECIMAL(8,2),

    CONSTRAINT "sesiones_historial_pkey" PRIMARY KEY ("id_sesion_historial")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id_usuario" SERIAL NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "email" VARCHAR(200) NOT NULL,
    "contrasena" VARCHAR(255) NOT NULL,
    "rol" "Role" NOT NULL DEFAULT 'user',
    "perfil" TEXT,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- AddForeignKey
ALTER TABLE "gamificaciones" ADD CONSTRAINT "gamificaciones_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "rutinas" ADD CONSTRAINT "rutinas_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "rutinas_ejercicios" ADD CONSTRAINT "rutinas_ejercicios_id_ejercicios_fkey" FOREIGN KEY ("id_ejercicios") REFERENCES "ejercicios"("id_ejercicio") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "rutinas_ejercicios" ADD CONSTRAINT "rutinas_ejercicios_id_rutina_fkey" FOREIGN KEY ("id_rutina") REFERENCES "rutinas"("id_rutina") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sesiones_historial" ADD CONSTRAINT "sesiones_historial_id_rutinas_fkey" FOREIGN KEY ("id_rutinas") REFERENCES "rutinas"("id_rutina") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sesiones_historial" ADD CONSTRAINT "sesiones_historial_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE CASCADE ON UPDATE NO ACTION;
