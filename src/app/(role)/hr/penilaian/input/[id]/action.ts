"use server";

import { createPenilaianSchema } from "@/lib/validation";
import prisma from "@/lib/prisma";
import { handleError } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function PenilaianPelamar(formData: FormData, id_pelamar: string) {
  try {
    const values = Object.fromEntries(formData.entries());

    const {
      tes_tulis,
      tes_praktek,
      tes_teknis,
      tes_psikotes,
      pengalaman,
      komunikasi,
      inisiatif,
      kerja_sama,
      pendidikan,
      minat,
      nama_pelamar,
      manajemen_waktu,
      pengetahuan_organisasi,
    } = createPenilaianSchema.parse(values);

    let nilai_pendidikan = 0;

    if (pendidikan === "SMA/SMK") {
      nilai_pendidikan = 1;
    } else if (pendidikan === "D1/D2/D3") {
      nilai_pendidikan = 3;
    } else if (pendidikan === "S1/D4") {
      nilai_pendidikan = 5;
    }

    // Konversi nilai dari string ke number

    const tes_tulis_num = Number(tes_tulis);
    const tes_praktek_num = Number(tes_praktek);
    const tes_teknis_num = Number(tes_teknis);
    const tes_psikotes_num = Number(tes_psikotes);
    const pengalaman_num = Number(pengalaman);
    const komunikasi_num = Number(komunikasi);
    const inisiatif_num = Number(inisiatif);
    const kerja_sama_num = Number(kerja_sama);
    const minat_num = Number(minat);
    const pengetahuan_organisasi_num = Number(pengetahuan_organisasi);
    const manajemen_waktu_num = Number(manajemen_waktu);

    // Hitung total nilai berdasarkan beberapa kriteria
    const total_nilai =
      tes_tulis_num +
      tes_praktek_num +
      tes_teknis_num +
      tes_psikotes_num +
      pengalaman_num +
      komunikasi_num +
      inisiatif_num +
      kerja_sama_num +
      minat_num +
      nilai_pendidikan +
      pengetahuan_organisasi_num +
      manajemen_waktu_num;

    // Buat data penilaian baru
    const penilaian = await prisma.penilaian.create({
      data: {
        id_user: id_pelamar,
        total_nilai,
        detail_penilaian: {
          create: [
            { id_kriteria: 20, nilai: tes_tulis_num },
            { id_kriteria: 21, nilai: tes_praktek_num },
            { id_kriteria: 22, nilai: tes_teknis_num },
            { id_kriteria: 23, nilai: tes_psikotes_num },
            { id_kriteria: 24, nilai: pengalaman_num },
            { id_kriteria: 25, nilai: nilai_pendidikan },
            { id_kriteria: 26, nilai: komunikasi_num },
            { id_kriteria: 27, nilai: minat_num },
            { id_kriteria: 28, nilai: pengetahuan_organisasi_num },
            { id_kriteria: 29, nilai: kerja_sama_num },
            { id_kriteria: 30, nilai: inisiatif_num },
            { id_kriteria: 31, nilai: manajemen_waktu_num },
          ],
        },
      },
    });

    revalidatePath("/");

    if (penilaian) {
      return {
        message: `Berhasil Menilai Pelamar ${nama_pelamar}`,
        penilaian,
      };
    }
  } catch (error) {
    handleError({
      error: error,
    });
  }
}
