/*
  Warnings:

  - A unique constraint covering the columns `[id_divisi]` on the table `divisi` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "divisi_id_divisi_key" ON "divisi"("id_divisi");
