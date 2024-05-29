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
      id_jabatan: parseInt(id_jabatan),
      id_user: id_user as string,
    },
  });

  redirect("/user/permintaan/submitted");
}

export async function approvedPermintaan(formData: FormData) {
  try {
    const id_permintaan = parseInt(formData.get("id_permintaan") as string);

    const user = await getSession();

    if (!user || user.user.role?.toLocaleLowerCase() !== "direktur") {
      throw new Error("Not Unauthorized");
    }

    await prisma.permintaan.update({
      where: {
        id_permintaan: id_permintaan,
      },
      data: {
        approved: true,
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

    if (!user || user.user.role?.toLowerCase() !== "direktur") {
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
