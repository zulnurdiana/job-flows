-- CreateTable
CREATE TABLE "divisi" (
    "id_divisi" SERIAL NOT NULL,
    "nama_divisi" TEXT NOT NULL,
    "deskripsi_divisi" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "divisi_pkey" PRIMARY KEY ("id_divisi")
);

-- CreateTable
CREATE TABLE "jabatan" (
    "id_jabatan" SERIAL NOT NULL,
    "id_divisi" INTEGER NOT NULL,
    "nama_jabatan" TEXT NOT NULL,
    "deskripsi_jabatan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jabatan_pkey" PRIMARY KEY ("id_jabatan")
);

-- AddForeignKey
ALTER TABLE "jabatan" ADD CONSTRAINT "jabatan_id_divisi_fkey" FOREIGN KEY ("id_divisi") REFERENCES "divisi"("id_divisi") ON DELETE CASCADE ON UPDATE CASCADE;
