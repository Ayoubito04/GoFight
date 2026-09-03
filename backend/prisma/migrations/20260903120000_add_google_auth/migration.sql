-- AlterTable
ALTER TABLE "usuarios" ALTER COLUMN "contrasena" DROP NOT NULL;
ALTER TABLE "usuarios" ADD COLUMN "google_id" VARCHAR(255);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_google_id_key" ON "usuarios"("google_id");
