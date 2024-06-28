/*
  Warnings:

  - A unique constraint covering the columns `[id_pegawai]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "id_pegawai" INTEGER,
ALTER COLUMN "screening_approved" DROP DEFAULT;

-- AlterTable
ALTER TABLE "persyaratan" ADD COLUMN     "description" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_id_pegawai_key" ON "User"("id_pegawai");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_id_pegawai_fkey" FOREIGN KEY ("id_pegawai") REFERENCES "Pegawai"("id_pegawai") ON DELETE SET NULL ON UPDATE CASCADE;
