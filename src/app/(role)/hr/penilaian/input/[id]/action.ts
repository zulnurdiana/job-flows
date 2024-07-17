"use server";

import { createPenilaianSchema } from "@/lib/validation";
import prisma from "@/lib/prisma";
import { handleError } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function PenilaianPelamar(formData: FormData, id_pelamar: string) {
  try {
    const values = Object.fromEntries(formData.entries());

    let {
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
    let nilai_tulis = 0;
    let nilai_praktek = 0;
    let nilai_teknis = 0;
    let nilai_psikotes = 0;

    let tulis = parseInt(tes_tulis);
    let praktek = parseInt(tes_praktek);
    let teknis = parseInt(tes_teknis);
    let psikotes = parseInt(tes_psikotes);

    if (pendidikan === "SMA/SMK") {
      nilai_pendidikan = 1;
    } else if (pendidikan === "D1/D2/D3") {
      nilai_pendidikan = 3;
    } else if (pendidikan === "S1/D4") {
      nilai_pendidikan = 5;
    }

    if (tulis >= 0 && tulis <= 20) {
      nilai_tulis = 1;
    } else if (tulis >= 21 && tulis <= 40) {
      nilai_tulis = 2;
    } else if (tulis >= 41 && tulis <= 60) {
      nilai_tulis = 3;
    } else if (tulis >= 61 && tulis <= 80) {
      nilai_tulis = 4;
    } else if (tulis >= 81 && tulis <= 100) {
      nilai_tulis = 5;
    }

    if (praktek >= 0 && praktek <= 20) {
      nilai_praktek = 1;
    } else if (praktek >= 21 && praktek <= 40) {
      nilai_praktek = 2;
    } else if (praktek >= 41 && praktek <= 60) {
      nilai_praktek = 3;
    } else if (praktek >= 61 && praktek <= 80) {
      nilai_praktek = 4;
    } else if (praktek >= 81 && praktek <= 100) {
      nilai_praktek = 5;
    }

    if (teknis >= 0 && teknis <= 20) {
      nilai_teknis = 1;
    } else if (teknis >= 21 && teknis <= 40) {
      nilai_teknis = 2;
    } else if (teknis >= 41 && teknis <= 60) {
      nilai_teknis = 3;
    } else if (teknis >= 61 && teknis <= 80) {
      nilai_teknis = 4;
    } else if (teknis >= 81 && teknis <= 100) {
      nilai_teknis = 5;
    }

    if (psikotes >= 0 && psikotes <= 20) {
      nilai_psikotes = 1;
    } else if (psikotes >= 21 && psikotes <= 40) {
      nilai_psikotes = 2;
    } else if (psikotes >= 41 && psikotes <= 60) {
      nilai_psikotes = 3;
    } else if (psikotes >= 61 && psikotes <= 80) {
      nilai_psikotes = 4;
    } else if (psikotes >= 81 && psikotes <= 100) {
      nilai_psikotes = 5;
    }

    // Konversi tes_tulis dari string ke number

    // const tes_tulis_num = Number(tes_tulis);
    // const tes_praktek_num = Number(tes_praktek);
    // const tes_teknis_num = Number(tes_teknis);
    // const tes_psikotes_num = Number(tes_psikotes);
    const pengalaman_num = Number(pengalaman);
    const komunikasi_num = Number(komunikasi);
    const inisiatif_num = Number(inisiatif);
    const kerja_sama_num = Number(kerja_sama);
    const minat_num = Number(minat);
    const pengetahuan_organisasi_num = Number(pengetahuan_organisasi);
    const manajemen_waktu_num = Number(manajemen_waktu);

    // Hitung total nilai berdasarkan beberapa kriteria
    const total_nilai =
      nilai_tulis +
      nilai_praktek +
      nilai_teknis +
      nilai_psikotes +
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
            { id_kriteria: 1, nilai: nilai_tulis },
            { id_kriteria: 2, nilai: nilai_praktek },
            { id_kriteria: 3, nilai: nilai_teknis },
            { id_kriteria: 4, nilai: nilai_psikotes },
            { id_kriteria: 5, nilai: pengalaman_num },
            { id_kriteria: 6, nilai: nilai_pendidikan },
            { id_kriteria: 7, nilai: komunikasi_num },
            { id_kriteria: 8, nilai: minat_num },
            { id_kriteria: 9, nilai: pengetahuan_organisasi_num },
            { id_kriteria: 10, nilai: kerja_sama_num },
            { id_kriteria: 11, nilai: inisiatif_num },
            { id_kriteria: 12, nilai: manajemen_waktu_num },
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
    return {
      error: handleError(error),
    };
  }
}
