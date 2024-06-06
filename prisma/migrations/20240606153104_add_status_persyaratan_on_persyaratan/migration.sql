/*
  Warnings:

  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Pegawai" ADD COLUMN     "email" TEXT,
ADD COLUMN     "tanggal_gabung" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "id_job" INTEGER,
ADD COLUMN     "password" TEXT;

-- AlterTable
ALTER TABLE "kriteria" ALTER COLUMN "bobot" SET DEFAULT 0.0,
ALTER COLUMN "bobot" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "persyaratan" ADD COLUMN     "id_job" INTEGER,
ADD COLUMN     "status_persyaratan" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "VerificationToken";

-- AddForeignKey
ALTER TABLE "persyaratan" ADD CONSTRAINT "persyaratan_id_job_fkey" FOREIGN KEY ("id_job") REFERENCES "jobs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_id_job_fkey" FOREIGN KEY ("id_job") REFERENCES "jobs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
