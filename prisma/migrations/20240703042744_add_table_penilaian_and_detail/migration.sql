/*
  Warnings:

  - You are about to drop the column `umur` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `umur` on the `persyaratan` table. All the data in the column will be lost.
  - Added the required column `umur_max` to the `persyaratan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `umur_min` to the `persyaratan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pegawai" ADD COLUMN     "id_permintaan" INTEGER;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "umur",
ADD COLUMN     "tanggal_lahir" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "persyaratan" DROP COLUMN "umur",
ADD COLUMN     "jenis_kelamin" TEXT,
ADD COLUMN     "umur_max" INTEGER NOT NULL,
ADD COLUMN     "umur_min" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Penilaian" (
    "id_penilaian" SERIAL NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total_nilai" DOUBLE PRECISION NOT NULL,
    "id_user" TEXT,

    CONSTRAINT "Penilaian_pkey" PRIMARY KEY ("id_penilaian")
);

-- CreateTable
CREATE TABLE "Detail_Penilaian" (
    "id_detail_penilaian" SERIAL NOT NULL,
    "nilai" INTEGER NOT NULL,
    "id_penilaian" INTEGER,
    "id_kriteria" INTEGER,

    CONSTRAINT "Detail_Penilaian_pkey" PRIMARY KEY ("id_detail_penilaian")
);

-- AddForeignKey
ALTER TABLE "Pegawai" ADD CONSTRAINT "Pegawai_id_permintaan_fkey" FOREIGN KEY ("id_permintaan") REFERENCES "permintaan"("id_permintaan") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Penilaian" ADD CONSTRAINT "Penilaian_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Detail_Penilaian" ADD CONSTRAINT "Detail_Penilaian_id_penilaian_fkey" FOREIGN KEY ("id_penilaian") REFERENCES "Penilaian"("id_penilaian") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Detail_Penilaian" ADD CONSTRAINT "Detail_Penilaian_id_kriteria_fkey" FOREIGN KEY ("id_kriteria") REFERENCES "kriteria"("id_kriteria") ON DELETE SET NULL ON UPDATE CASCADE;
