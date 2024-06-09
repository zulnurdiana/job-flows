"use server";

import getSession from "@/lib/getSession";
import { createPersyaratanSchema } from "@/lib/validation";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function createPersyaratan(
  formData: FormData,
  id_permintaan: number,
) {
  const values = Object.fromEntries(formData.entries());
  const session = await getSession();
  const id_user = session?.user.id;
  if (!session) redirect("/");
  if (!id_user) {
    throw new Error("User ID is missing");
  }

  const { pengalaman_kerja, pendidikan, umur, status_pernikahan } =
    createPersyaratanSchema.parse(values);

  const persyaratan = await prisma.persyaratan.create({
    data: {
      pengalaman_kerja: pengalaman_kerja,
      pendidikan: pendidikan,
      umur: parseInt(umur),
      status_pernikahan: status_pernikahan,
      id_user: id_user,
      id_permintaan: id_permintaan,
    },
  });

  if (persyaratan) {
    await prisma.permintaan.update({
      where: {
        id_permintaan: id_permintaan,
      },
      data: {
        status_permintaan: true,
      },
    });
  }

  redirect("/user/persyaratan/submitted");
}
