-- AlterTable
ALTER TABLE "permintaan" ALTER COLUMN "status_permintaan" DROP NOT NULL;

-- CreateTable
CREATE TABLE "persyarata" (
    "id_persyaratan" SERIAL NOT NULL,
    "pengalaman_kerja" INTEGER NOT NULL,
    "pendidikan" TEXT NOT NULL,
    "umur" INTEGER NOT NULL,
    "status_pernikahan" TEXT NOT NULL,
    "id_user" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "persyarata_pkey" PRIMARY KEY ("id_persyaratan")
);

-- AddForeignKey
ALTER TABLE "persyarata" ADD CONSTRAINT "persyarata_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
