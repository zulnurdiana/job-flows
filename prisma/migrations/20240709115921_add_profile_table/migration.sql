/*
  Warnings:

  - You are about to drop the column `alamat` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `cv` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `jenis_kelamin` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `pendidikan` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `status_pernikahan` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `tanggal_lahir` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "alamat",
DROP COLUMN "cv",
DROP COLUMN "jenis_kelamin",
DROP COLUMN "pendidikan",
DROP COLUMN "status_pernikahan",
DROP COLUMN "tanggal_lahir";

-- CreateTable
CREATE TABLE "profile" (
    "id_profile" SERIAL NOT NULL,
    "nama_lengkap" TEXT,
    "tgl_lahir" TIMESTAMP(3) NOT NULL,
    "pendidikan" TEXT,
    "alamat" TEXT,
    "jenis_kelamin" TEXT,
    "status_pernikahan" TEXT,
    "cv" TEXT,
    "id_user" TEXT,

    CONSTRAINT "profile_pkey" PRIMARY KEY ("id_profile")
);

-- CreateIndex
CREATE UNIQUE INDEX "profile_id_user_key" ON "profile"("id_user");

-- AddForeignKey
ALTER TABLE "profile" ADD CONSTRAINT "profile_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
