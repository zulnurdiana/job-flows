"use server";
import getSession from "@/lib/getSession";
import prisma from "@/lib/prisma";
import { createPermintaanSchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";
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

export async function approvedPermintaan(formData: FormData) {
  try {
    const id_permintaan = parseInt(formData.get("id_permintaan") as string);

    const user = await getSession();

    if (!user || user.user.role !== "direktur") {
      throw new Error("Not Unauthorized");
    }

    await prisma.permintaan.update({
      where: {
        id_permintaan: id_permintaan,
      },
      data: {
        status_permintaan: true,
      },
    });

    revalidatePath("/");
  } catch (error) {
    console.log(error);
  }
}

export async function deletePermintaan(formData: FormData) {
  try {
    const id_permintaan = parseInt(formData.get("id_permintaan") as string);
    const user = await getSession();

    if (!user || user.user.role !== "direktur") {
      throw new Error("Not Unauthorized");
    }

    await prisma.permintaan.delete({
      where: {
        id_permintaan: id_permintaan,
      },
    });
    revalidatePath("/");
  } catch (error) {
    console.log(error);
  }
}
