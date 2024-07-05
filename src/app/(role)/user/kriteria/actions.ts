"use server";

import { createKriteriaSchema } from "@/lib/validation";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";
import { handleError } from "@/lib/utils";

async function hitungKepentingan() {
  const allKriteria = await prisma.kriteria.findMany({
    select: {
      id_kriteria: true,
      bobot: true,
    },
  });

  const pembagi = allKriteria.map((kriteria) => kriteria.bobot);
  const totalPembagi = pembagi.reduce((a: number, b: number) => a + b, 0);
  const kepentingan = pembagi.map((bobot) => bobot / totalPembagi);

  // const totalKepentingan = kepentingan.reduce(
  //   (a: number, b: number) => a + b,
  //   0,
  // );

  // console.log(totalKepentingan);

  // console.log(totalPembagi);

  kepentingan.map(async (kepentingan, index) => {
    await prisma.kriteria.update({
      where: {
        id_kriteria: allKriteria[index].id_kriteria,
      },
      data: {
        kepentingan: kepentingan,
      },
    });
  });
}

export async function createKriteria(formData: FormData) {
  try {
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
        bobot: parseFloat(bobot),
        jenis_kriteria: jenis_kriteria || "BENEFIT",
        id_user: user.id as string,
      },
    });

    await hitungKepentingan();

    if (!kriteria) {
      throw new Error("Failed to create kriteria");
    } else {
    }

    revalidatePath("/");

    return {
      message: `Berhasil Menambahkan Kriteria ${kriteria.nama_kriteria}`,
      code: 201,
      data: kriteria,
    };
  } catch (error) {
    return {
      error: handleError(error),
      code: 400,
    };
  }
}

export async function updateKriteria(formData: FormData, id_kriteria: number) {
  try {
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
        bobot: parseFloat(bobot),
        jenis_kriteria: jenis_kriteria || "BENEFIT",
      },
      where: {
        id_kriteria: id_kriteria,
      },
    });
    if (!kriteria) throw new Error("Failed to update kriteria");
    await hitungKepentingan();
    revalidatePath("/");

    return {
      message: `Berhasil Update Kriteria ${kriteria.nama_kriteria}`,
      code: 200,
    };
  } catch (error) {
    return {
      error: handleError(error),
    };
  }
}

export async function deleteKriteria(formData: FormData) {
  try {
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
      revalidatePath("/");
      await hitungKepentingan();
      return {
        message: `Berhasil Delete Kriteria ${kriteria.nama_kriteria}`,
        code: 200,
      };
    }
  } catch (error) {
    return {
      error: handleError(error),
      code: 400,
    };
  }
}
