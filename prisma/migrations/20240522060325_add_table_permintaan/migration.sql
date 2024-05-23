-- CreateTable
CREATE TABLE "permintaan" (
    "id_permintaan" SERIAL NOT NULL,
    "jumlah_pegawai" INTEGER NOT NULL,
    "status_permintaan" BOOLEAN NOT NULL DEFAULT false,
    "tanggal_permintaan" TIMESTAMP(3) NOT NULL,
    "id_jabatan" INTEGER NOT NULL,
    "id_user" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "permintaan_pkey" PRIMARY KEY ("id_permintaan")
);

-- AddForeignKey
ALTER TABLE "permintaan" ADD CONSTRAINT "permintaan_id_jabatan_fkey" FOREIGN KEY ("id_jabatan") REFERENCES "jabatan"("id_jabatan") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permintaan" ADD CONSTRAINT "permintaan_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
