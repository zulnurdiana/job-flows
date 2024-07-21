"use server";

import { handleError } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function accKeputusan(formData: FormData) {
  try {
    const id_keputusan = parseInt(formData.get("id_keputusan") as string);
    const keputusan = await prisma?.keputusan.findUnique({
      where: {
        id_keputusan: id_keputusan,
      },
    });

    const pelamar = await prisma.user.findUnique({
      where: {
        id: keputusan?.id_user || "",
      },
    });

    const lowongan = await prisma.job.findUnique({
      where: {
        id: pelamar?.id_job || 0,
      },
    });

    const persyaratan = await prisma.persyaratan.findFirst({
      where: {
        id_job: lowongan?.id,
      },
      include: {
        permintaan: true,
      },
    });

    const pegawai = await prisma.pegawai.findMany({
      where: {
        id_permintaan: persyaratan?.permintaan.id_permintaan,
      },
    });

    if (pegawai.length > 0) {
      await prisma.user.deleteMany({
        where: {
          id_pegawai: pegawai[0].id_pegawai,
          id: { not: pelamar?.id || "" },
        },
      });
    }

    const tgl_bergabung = new Date();
    // Mengatur tgl_berakhir menjadi satu tahun setelah tgl_bergabung
    const tgl_berakhir = new Date(tgl_bergabung);
    tgl_berakhir.setFullYear(tgl_berakhir.getFullYear() + 1);

    const newPegawai = await prisma.pegawai.update({
      where: {
        id_pegawai: pegawai[0].id_pegawai,
      },
      data: {
        nama_pegawai: pelamar?.name || "",
        status_pegawai: "Aktif",
        id_permintaan: null,
        email: pelamar?.email || "",
        id_jabatan: persyaratan?.permintaan.id_jabatan || 0,
        tgl_bergabung: tgl_bergabung,
        tgl_berakhir: tgl_berakhir,
      },
    });

    if (newPegawai) {
      await prisma.user.update({
        where: {
          id: pelamar?.id || "",
        },
        data: {
          id_pegawai: newPegawai.id_pegawai,
          keputusan: {
            update: {
              where: {
                id_keputusan: id_keputusan,
              },
              data: {
                status: "Onboarding",
              },
            },
          },
        },
        include: {
          keputusan: true,
        },
      });

      revalidatePath("/");

      return {
        code: 200,
        message: `Selamat ${pelamar?.name}! Anda telah ditetapkan sebagai pegawai pada jabatan ${lowongan?.title}`,
      };
    }
  } catch (error) {
    return {
      error: handleError(error),
    };
  }
}

export async function tolakKeputusan(formData: FormData) {
  try {
    const id_keputusan = parseInt(formData.get("id_keputusan") as string);
    const alasan = formData.get("alasan") as string;

    const keputusan_pelamar = await prisma.keputusan.findUnique({
      where: {
        id_keputusan: id_keputusan,
      },
      include: {
        user: {
          include: {
            job: true,
          },
        },
      },
    });

    if (alasan) {
      const keputusan = await prisma.keputusan.update({
        where: {
          id_keputusan: id_keputusan,
        },
        data: {
          status: "Menolak",
          alasan: alasan ? alasan : "",
        },
      });
      revalidatePath("/");
      if (keputusan) {
        return {
          code: 200,
          message: `Anda telah menolak tawaran kerja untuk jabatan ${keputusan_pelamar?.user?.job?.title} `,
        };
      }
    }
  } catch (error) {
    return {
      error: handleError(error),
    };
  }
}
