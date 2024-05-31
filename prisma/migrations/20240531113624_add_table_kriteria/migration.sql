-- CreateEnum
CREATE TYPE "JenisKriteria" AS ENUM ('COST', 'BENEFIT');

-- AlterTable
ALTER TABLE "permintaan" ADD COLUMN     "approved" BOOLEAN DEFAULT false;

-- CreateTable
CREATE TABLE "kriteria" (
    "id_kriteria" SERIAL NOT NULL,
    "deskripsi_kriteria" TEXT NOT NULL,
    "nama_kriteria" TEXT NOT NULL,
    "bobot" INTEGER NOT NULL DEFAULT 0,
    "kepentingan" DOUBLE PRECISION,
    "jenis_kriteria" "JenisKriteria" NOT NULL,
    "id_user" TEXT NOT NULL,

    CONSTRAINT "kriteria_pkey" PRIMARY KEY ("id_kriteria")
);

-- AddForeignKey
ALTER TABLE "kriteria" ADD CONSTRAINT "kriteria_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
