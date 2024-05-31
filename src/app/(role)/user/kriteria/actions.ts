"use server";

import { createKriteriaSchema } from "@/lib/validation";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";

export async function createKriteria(formData: FormData) {
  const values = Object.fromEntries(formData.entries());

  const session = await getSession();
  const user = session?.user;
  if (!user) throw new Error("User not found");

  const { nama_kriteria, deskripsi_kriteria, bobot, jenis_kriteria } =
    createKriteriaSchema.parse(values);

  const kriteria = await prisma.kriteria.create({
    data: {
      nama_kriteria,
      deskripsi_kriteria,
      bobot: parseInt(bobot),
      jenis_kriteria: jenis_kriteria || "BENEFIT",
      id_user: user.id as string,
    },
  });

  if (!kriteria) throw new Error("Failed to create kriteria");

  redirect("/user/kriteria/submitted");
}

export async function updateKriteria(formData: FormData, id_kriteria: number) {
  const values = Object.fromEntries(formData.entries());
  const session = await getSession();
  const user = session?.user;
  if (!user) throw new Error("User not found");

  const { nama_kriteria, deskripsi_kriteria, bobot, jenis_kriteria } =
    createKriteriaSchema.parse(values);

  const kriteria = await prisma.kriteria.update({
    data: {
      nama_kriteria,
      deskripsi_kriteria,
      bobot: parseInt(bobot),
      jenis_kriteria: jenis_kriteria || "BENEFIT",
    },
    where: {
      id_kriteria: id_kriteria,
    },
  });
  if (!kriteria) throw new Error("Failed to update kriteria");
  revalidatePath("/");
  redirect("/user/kriteria/daftar-kriteria");
}

export async function deleteKriteria(formData: FormData) {
  const id_kriteria = parseInt(formData.get("id_kriteria") as string);
  const session = await getSession();
  const role = session?.user.role;
  if (!session || role?.toLowerCase() !== "user") redirect("/");

  const kriteria = await prisma.kriteria.delete({
    where: {
      id_kriteria: id_kriteria,
    },
  });
  if (kriteria) {
    redirect("/user/kriteria/daftar-kriteria");
  }
}
