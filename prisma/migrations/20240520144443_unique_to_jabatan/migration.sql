/*
  Warnings:

  - A unique constraint covering the columns `[nama_jabatan]` on the table `jabatan` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "jabatan_nama_jabatan_key" ON "jabatan"("nama_jabatan");
