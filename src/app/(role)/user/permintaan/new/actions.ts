"use server";
import getSession from "@/lib/getSession";
import prisma from "@/lib/prisma";
import { handleError } from "@/lib/utils";
import { createPermintaanSchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function createPermintaan(
  formData: FormData,
  penggantiPegawai: number[] = [],
) {
  const values = Object.fromEntries(formData.entries());
  const session = await getSession();
  const id_user = session?.user.id;
  const { jumlah_pegawai, id_jabatan } = createPermintaanSchema.parse(values);

  // Validasi jika jumlah pengganti pegawai tidak sama dengan jumlah pegawai yang diminta
  if (penggantiPegawai.length !== parseInt(jumlah_pegawai)) {
    throw new Error(
      "Jumlah pegawai yang dipilih tidak sesuai dengan jumlah yang diminta.",
    );
  }

  // Memastikan semua pengganti pegawai ada di database
  const existingPegawai = await prisma.pegawai.findMany({
    where: {
      id_pegawai: {
        in: penggantiPegawai,
      },
    },
  });

  if (existingPegawai.length !== penggantiPegawai.length) {
    throw new Error("Beberapa pegawai yang dipilih tidak ditemukan.");
  }

  // Membuat entri baru di tabel permintaan
  await prisma.permintaan.create({
    data: {
      jumlah_pegawai: parseInt(jumlah_pegawai),
      tanggal_permintaan: new Date(),
      id_jabatan: parseInt(id_jabatan),
      id_user: id_user as string,
      pegawai: { connect: penggantiPegawai.map((id) => ({ id_pegawai: id })) }, // Menghubungkan dengan pegawai yang dipilih
    },
  });

  // Mengarahkan ke halaman setelah permintaan berhasil dibuat
  redirect("/user/permintaan/submitted");
}

export async function approvedPermintaan(formData: FormData) {
  try {
    const user = await getSession();

    if (!user || user.user.role?.toLocaleLowerCase() !== "direktur") {
      throw new Error("Not Unauthorized");
    }

    const id_permintaan = parseInt(formData.get("id_permintaan") as string);
    const jumlah = parseInt(formData.get("jumlah") as string);
    const alasan = formData.get("alasan") as string;

    if (alasan !== null) {
      const permintaans = await prisma.permintaan.findUnique({
        where: {
          id_permintaan: id_permintaan,
        },
        include: {
          pegawai: true,
        },
      });

      const tolak_pegawai = permintaans?.pegawai.slice(0, jumlah);

      console.log(tolak_pegawai);

      const permintaan = await prisma.permintaan.update({
        where: {
          id_permintaan: id_permintaan,
        },
        include: {
          jabatan: true,
          pegawai: true,
        },
        data: {
          approved: true,
          jumlah_pegawai: jumlah,
          alasan: alasan ? alasan : "",
          pegawai: {
            connect: tolak_pegawai?.map((id) => ({
              id_pegawai: id.id_pegawai,
            })),
            disconnect: permintaans?.pegawai
              .filter(
                (pegawai) =>
                  !tolak_pegawai
                    ?.map((p) => p.id_pegawai)
                    .includes(pegawai.id_pegawai),
              )
              .map((pegawai) => ({ id_pegawai: pegawai.id_pegawai })),
          },
        },
      });

      revalidatePath("/");
      if (permintaan) {
        return {
          code: 200,
          message: `Berhasil Approve Permintaan Untuk Jabatan ${permintaan.jabatan.nama_jabatan}`,
        };
      }
    }
  } catch (error) {
    return {
      error: handleError(error),
    };
  }
}

export async function deletePermintaan(formData: FormData) {
  try {
    const user = await getSession();

    if (!user || user.user.role?.toLowerCase() !== "direktur") {
      throw new Error("Not Unauthorized");
    }
    const id_permintaan = parseInt(formData.get("id_permintaan") as string);
    const alasan = formData.get("alasan") as string;

    if (alasan) {
      const permintaan = await prisma.permintaan.delete({
        where: {
          id_permintaan: id_permintaan,
        },
        include: {
          jabatan: true,
        },
      });
      revalidatePath("/");
      if (permintaan) {
        return {
          code: 200,
          message: `Berhasil Rejected Permintaan Untuk Jabatan ${permintaan.jabatan.nama_jabatan}`,
        };
      }
    }
  } catch (error) {
    return {
      error: handleError(error),
    };
  }
}
