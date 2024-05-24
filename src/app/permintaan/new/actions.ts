"use server";
import getSession from "@/lib/getSession";
import prisma from "@/lib/prisma";
import { createPermintaanSchema } from "@/lib/validation";
import { redirect } from "next/navigation";

export default async function createPermintaan(formData: FormData) {
  const values = Object.fromEntries(formData.entries());
  const session = await getSession();
  const id_user = session?.user.id;
  const { jumlah_pegawai, id_jabatan } = createPermintaanSchema.parse(values);

  await prisma.permintaan.create({
    data: {
      jumlah_pegawai: parseInt(jumlah_pegawai),
      // Tambahkan properti yang hilang
      tanggal_permintaan: new Date(), // Atau gunakan tanggal yang sesuai
      jabatan: { connect: { id_jabatan: parseInt(id_jabatan) } }, // Menghubungkan ke jabatan yang sesuai
      user: { connect: { id: id_user } }, // Menghubungkan ke user yang sesuai
    },
  });

  redirect("/");
}
