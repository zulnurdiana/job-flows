/*
  Warnings:

  - You are about to drop the `persyarata` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "persyarata" DROP CONSTRAINT "persyarata_id_user_fkey";

-- DropTable
DROP TABLE "persyarata";

-- CreateTable
CREATE TABLE "persyaratan" (
    "id_persyaratan" SERIAL NOT NULL,
    "pengalaman_kerja" INTEGER NOT NULL,
    "pendidikan" TEXT NOT NULL,
    "umur" INTEGER NOT NULL,
    "status_pernikahan" TEXT NOT NULL,
    "id_user" TEXT NOT NULL,
    "id_permintaan" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "persyaratan_pkey" PRIMARY KEY ("id_persyaratan")
);

-- AddForeignKey
ALTER TABLE "persyaratan" ADD CONSTRAINT "persyaratan_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "persyaratan" ADD CONSTRAINT "persyaratan_id_permintaan_fkey" FOREIGN KEY ("id_permintaan") REFERENCES "permintaan"("id_permintaan") ON DELETE RESTRICT ON UPDATE CASCADE;
