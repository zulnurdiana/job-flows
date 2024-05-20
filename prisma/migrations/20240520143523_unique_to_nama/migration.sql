/*
  Warnings:

  - A unique constraint covering the columns `[nama_divisi]` on the table `divisi` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "divisi_id_divisi_key";

-- CreateIndex
CREATE UNIQUE INDEX "divisi_nama_divisi_key" ON "divisi"("nama_divisi");
