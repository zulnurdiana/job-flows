/*
  Warnings:

  - A unique constraint covering the columns `[nama_kriteria]` on the table `kriteria` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "kriteria" DROP CONSTRAINT "kriteria_id_user_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "alamat" TEXT,
ADD COLUMN     "cv" TEXT,
ADD COLUMN     "jenis_kelamin" TEXT,
ADD COLUMN     "pendidikan" TEXT,
ADD COLUMN     "screening_approved" BOOLEAN DEFAULT false,
ADD COLUMN     "status_pernikahan" TEXT,
ADD COLUMN     "umur" INTEGER;

-- AlterTable
ALTER TABLE "kriteria" ALTER COLUMN "id_user" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "kriteria_nama_kriteria_key" ON "kriteria"("nama_kriteria");

-- AddForeignKey
ALTER TABLE "kriteria" ADD CONSTRAINT "kriteria_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
