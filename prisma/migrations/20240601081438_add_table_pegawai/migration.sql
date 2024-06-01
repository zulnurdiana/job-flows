/*
  Warnings:

  - Added the required column `updatedAt` to the `kriteria` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "kriteria" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Pegawai" (
    "id_pegawai" SERIAL NOT NULL,
    "nama_pegawai" TEXT NOT NULL,
    "status_pegawai" TEXT NOT NULL,
    "id_jabatan" INTEGER NOT NULL,

    CONSTRAINT "Pegawai_pkey" PRIMARY KEY ("id_pegawai")
);

-- AddForeignKey
ALTER TABLE "Pegawai" ADD CONSTRAINT "Pegawai_id_jabatan_fkey" FOREIGN KEY ("id_jabatan") REFERENCES "jabatan"("id_jabatan") ON DELETE RESTRICT ON UPDATE CASCADE;
