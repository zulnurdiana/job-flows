import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import H1 from "@/components/ui/h1";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { CircleChevronDown, CircleX, Crown, Eye, Plane } from "lucide-react";

interface PageProps {
  params: {
    id: string;
  };
}

interface NilaiPelamar {
  id_pelamar: any;
  nama_pelamar: any;
  [key: string]: any;
  nilai_c1: number;
  nilai_c2: number;
  nilai_c3: number;
  nilai_c4: number;
  nilai_c5: number;
  nilai_c6: number;
  nilai_c7: number;
  nilai_c8: number;
  nilai_c9: number;
  nilai_c10: number;
  nilai_c11: number;
  nilai_c12: number;
}

const page = async ({ params: { id } }: PageProps) => {
  const session = await getSession();
  const user = session?.user;
  if (!session) redirect("/");
  if (user?.role?.toLowerCase() !== "hr") redirect("/");

  // Mendapatkan Pelamar untuk setiap jabatan
  const getPelamarPerJabatan = await prisma.user.findMany({
    include: {
      job: true,
      penilaian: {
        include: {
          detail_penilaian: {
            orderBy: {
              id_kriteria: "asc",
            },
            include: {
              kriteria: true,
            },
          },
        },
      },
      keputusan: true,
      profile: true,
    },
    where: {
      id_job: parseInt(id),
      screening_approved: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // Mendapatkan Persyaratan
  const persyaratan_permintaan = await prisma.persyaratan.findFirst({
    where: {
      id_job: parseInt(id),
    },
    include: {
      permintaan: true,
    },
  });

  // Mendapatkan jumlah permintaan untuk lowongan yg dipilih
  let jumlah_permintaan = persyaratan_permintaan?.permintaan.jumlah_pegawai;

  // Mendapatkan pelamar untuk jabatan tertentu
  const id_pelamar = getPelamarPerJabatan.map((pelamar) => pelamar.id);

  // Mendapatkan nilai max dari setiap pelamar untuk setiap kriteria
  const nilaiMax = await Promise.all(
    Array.from({ length: 12 }, (_, index) =>
      prisma.detail_Penilaian.findFirstOrThrow({
        where: {
          id_kriteria: index + 1,
          penilaian: {
            id_user: {
              in: id_pelamar,
            },
          },
        },
        orderBy: {
          nilai: "desc",
        },
        select: {
          nilai: true,
        },
      }),
    ),
  );

  // Menormalisasi Nilai Pelamar
  const nilaiPelamar: NilaiPelamar[] = getPelamarPerJabatan.map((pelamar) => {
    const normalizedValues: Partial<NilaiPelamar> = {};

    pelamar.penilaian[0]?.detail_penilaian.forEach((detail) => {
      if (detail.nilai !== null && detail.id_kriteria !== null) {
        const maxNilai = nilaiMax[detail.id_kriteria - 1]?.nilai || 1;
        const key =
          `nilai_c${detail.id_kriteria}` as keyof Partial<NilaiPelamar>;

        normalizedValues[`nilai_asli_c${detail.id_kriteria}`] = detail.nilai;
        normalizedValues[`max_c${detail.id_kriteria}`] = maxNilai;

        const jenisKriteria = detail.kriteria?.jenis_kriteria || "";

        if (jenisKriteria.toUpperCase() === "BENEFIT") {
          normalizedValues[key] = Number((detail.nilai / maxNilai).toFixed(5));
        } else if (jenisKriteria.toUpperCase() === "COST") {
          normalizedValues[key] = Number((maxNilai / detail.nilai).toFixed(5));
        }
      }
    });

    return {
      id_pelamar: pelamar.id,
      nama_pelamar: pelamar.name,
      ...normalizedValues,
    } as NilaiPelamar;
  });

  // Mendapatkan kepentingan Kriteria
  const kriteriaPromises = Array.from({ length: 12 }, (_, index) =>
    prisma.kriteria.findUnique({
      where: {
        id_kriteria: index + 1,
      },
      select: {
        kepentingan: true,
      },
    }),
  );

  const [C1, C2, C3, C4, C5, C6, C7, C8, C9, C10, C11, C12] =
    await Promise.all(kriteriaPromises);

  // Kalikan nilai normalisasi dengan setiap kepentingan kriteria
  const nilaiPelamarWithWeights: NilaiPelamar[] = nilaiPelamar.map((nilai) => {
    const nilaiWithWeights: Partial<NilaiPelamar> = {
      id_pelamar: nilai.id_pelamar,
      nama_pelamar: nilai.nama_pelamar,
    };

    for (let i = 1; i <= 12; i++) {
      const key = `nilai_c${i}` as keyof NilaiPelamar;
      const kepentingan = eval(`C${i}`)?.kepentingan || 0;

      const normalizedValue = nilai[key];
      const weightedValue = normalizedValue ? normalizedValue * kepentingan : 0;

      nilaiWithWeights[key] = weightedValue;
      nilaiWithWeights[`normalized_${key}`] = normalizedValue; // Menyimpan nilai yang sudah dinormalisasi
    }

    return nilaiWithWeights as NilaiPelamar;
  });

  // Menjumlahkan nilai yang sudah dinormalisasi
  const nilaiPelamarWithTotal: {
    nama_pelamar: string;
    total_nilai: number;
    id_pelamar: any;
    keputusan: any;
  }[] = nilaiPelamarWithWeights.map((nilai) => {
    const totalNilai = Array.from({ length: 12 }, (_, i) => {
      const key = `nilai_c${i + 1}` as keyof NilaiPelamar;
      return nilai[key] || 0;
    }).reduce((sum, value) => sum + value, 0);

    return {
      id_pelamar: nilai.id_pelamar,
      nama_pelamar: nilai.nama_pelamar || "",
      total_nilai: totalNilai,
      keputusan: "",
    };
  });

  const filteredNilaiPelamar = nilaiPelamarWithTotal.filter(
    (pelamar) => pelamar.keputusan !== "Menolak",
  );

  filteredNilaiPelamar.sort((a, b) => b.total_nilai - a.total_nilai);

  // Urutkan pelamar yang difilter berdasarkan total nilai

  console.log(filteredNilaiPelamar);

  // Mendapatkan calon pegawai yang memenuhi syarat
  const highScore = filteredNilaiPelamar.slice(0, jumlah_permintaan);

  console.log(highScore);

  // mendapatkan id tiap pelamar yang paling tinggi
  const id_pelamar_high = highScore.map((high) => high.id_pelamar);

  // mengupdate status keputusan pada setiap pelamar
  for (const pelamar of nilaiPelamarWithTotal) {
    const isHighScore = id_pelamar_high.includes(pelamar.id_pelamar);
    const existingKeputusan = await prisma.keputusan.findUnique({
      where: {
        id_user: pelamar.id_pelamar,
      },
    });

    if (!existingKeputusan) {
      await prisma.keputusan.create({
        data: {
          id_user: pelamar.id_pelamar,
          status: isHighScore ? "Offering" : "Rejected",
          score_akhir: pelamar.total_nilai,
        },
      });
      pelamar.keputusan = isHighScore ? "Offering" : "Rejected";
    } else {
      if (
        // Ngecek jika ada penambahan permintaan
        existingKeputusan.status === "Rejected" &&
        id_pelamar_high.includes(pelamar.id_pelamar)
      ) {
        await prisma.keputusan.update({
          where: {
            id_user: pelamar.id_pelamar,
          },
          data: {
            status: "Offering",
            score_akhir: pelamar.total_nilai,
          },
        });
        pelamar.keputusan = "Offering";
      }
    }
  }

  //  mengupdate status keputusan pada setiap pelamar
  const updateKeputusanPromises = nilaiPelamarWithTotal.map(async (pelamar) => {
    if (id_pelamar_high.includes(pelamar.id_pelamar)) {
      const keputusan = await prisma.keputusan.findUnique({
        where: {
          id_user: pelamar.id_pelamar,
        },
      });
      pelamar.keputusan = keputusan?.status || "Offering";
    } else {
      const keputusan = await prisma.keputusan.findUnique({
        where: {
          id_user: pelamar.id_pelamar,
        },
      });
      if (keputusan?.status === "Menolak") {
        await prisma.keputusan.update({
          where: {
            id_user: pelamar.id_pelamar,
          },
          data: {
            status: "Menolak",
          },
        });
        pelamar.keputusan = "Menolak";
      } else {
        await prisma.keputusan.update({
          where: {
            id_user: pelamar.id_pelamar,
          },
          data: {
            status: "Rejected",
          },
        });
        pelamar.keputusan = "Rejected";
      }
    }
  });

  await Promise.all(updateKeputusanPromises);

  return (
    <div className="max-w-6xl mx-auto my-8 p-6 bg-white shadow-md rounded-lg">
      <div className="max-w-6xl mx-auto mb-6">
        <Breadcrumb className="bg-gray-100 p-4 rounded-lg">
          <BreadcrumbList className="flex space-x-2 text-gray-600">
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/hr/penilaian">
                Penilaian Pelamar
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {getPelamarPerJabatan.length > 0
                  ? getPelamarPerJabatan[0].job?.title
                  : ""}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="text-center mb-6">
        <H1 className="text-3xl font-extrabold text-gray-800">
          Keputusan Pelamar <br />
          Jabatan{" "}
          {getPelamarPerJabatan.length > 0
            ? getPelamarPerJabatan[0].job?.title
            : ""}
        </H1>
      </div>

      {getPelamarPerJabatan.length > 0 ? (
        <>
          {/* NILAI SETIAP PELAMAR */}
          <Table className="w-full border border-gray-300">
            <TableHeader className="bg-gray-200">
              <TableRow>
                <TableHead className="font-bold text-center">No</TableHead>
                <TableHead className="">Nama Pelamar</TableHead>
                {Array.from({ length: 12 }, (_, index) => (
                  <TableHead className="text-center" key={index}>
                    C{index + 1}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {getPelamarPerJabatan.map((pelamar, index) => (
                <TableRow key={pelamar.id}>
                  <TableCell className="text-center">{index + 1}</TableCell>
                  <TableCell className="">{pelamar.name}</TableCell>
                  {Array.from({ length: 12 }, (_, index) => {
                    const nilai =
                      pelamar.penilaian[0]?.detail_penilaian.find(
                        (detail) => detail.id_kriteria === index + 1,
                      )?.nilai || "-";
                    return (
                      <TableCell className="text-center" key={index}>
                        {nilai}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* DETAIL PENILAIAN */}
          <Collapsible className="w-full my-5">
            <CollapsibleTrigger className="bg-gray-400 w-full p-1 rounded-md flex justify-center items-center hover:bg-gray-500">
              <CircleChevronDown
                className="text-white"
                width={20}
                height={20}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="my-2">
              {/* PERHITUNGAN NORMALISASI */}
              <Table className="w-full border border-gray-300 mb-6">
                <TableHeader className="bg-gray-200">
                  <TableRow>
                    <TableHead className="font-bold text-center ">No</TableHead>
                    <TableHead className="">Nama Pelamar</TableHead>
                    {Array.from({ length: 12 }, (_, index) => (
                      <TableHead className="text-center" key={index}>
                        C{index + 1}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {nilaiPelamar.map((pelamar, index) => (
                    <TableRow key={pelamar.id_pelamar}>
                      <TableCell className="font-bold text-center">
                        {index + 1}
                      </TableCell>
                      <TableCell className="">{pelamar.nama_pelamar}</TableCell>
                      {Array.from({ length: 12 }, (_, idx) => (
                        <TableCell className="text-center" key={idx}>
                          {pelamar[`nilai_asli_c${idx + 1}`]} /{" "}
                          {pelamar[`max_c${idx + 1}`]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* NILAI NORMALISASI */}
              <Table className="w-full border border-gray-300 mb-6">
                <TableHeader className="bg-gray-200">
                  <TableRow>
                    <TableHead className="font-bold text-center">No</TableHead>
                    <TableHead className="">Nama Pelamar</TableHead>
                    {Array.from({ length: 12 }, (_, index) => (
                      <TableHead className="text-center" key={index}>
                        C{index + 1}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {nilaiPelamar.map((pelamar, index) => (
                    <TableRow key={pelamar.id_pelamar}>
                      <TableCell className="font-bold text-center">
                        {index + 1}
                      </TableCell>
                      <TableCell className="">{pelamar.nama_pelamar}</TableCell>
                      {Array.from({ length: 12 }, (_, idx) => (
                        <TableCell className="text-center" key={idx}>
                          {pelamar[`nilai_c${idx + 1}`].toFixed(3)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Proses Perhitungan Akhir */}
              <Table className="w-full border border-gray-300 mb-6">
                <TableHeader className="bg-gray-200">
                  <TableRow>
                    <TableHead className="font-bold text-center">
                      Nama
                    </TableHead>
                    <TableHead className="text-center">
                      Proses Perhitungan
                    </TableHead>
                    <TableHead className="text-center">Hasil Akhir</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {nilaiPelamarWithWeights.map((pelamar, index) => (
                    <TableRow key={pelamar.id_pelamar}>
                      <TableCell className="text-center">
                        {pelamar.nama_pelamar}
                      </TableCell>
                      <TableCell className="text-sm text-center w-[70%]">
                        {Array.from({ length: 12 }, (_, i) => {
                          const key = `nilai_c${i + 1}` as keyof NilaiPelamar;
                          const normalizedKey =
                            `normalized_nilai_c${i + 1}` as keyof NilaiPelamar;
                          const nilai = pelamar[key] || 0;
                          const normalizedValue = pelamar[normalizedKey] || 0;
                          const kepentingan =
                            eval(`C${i + 1}`)?.kepentingan || 0;
                          return (
                            <span key={i}>
                              {i > 0 && " + "}({normalizedValue.toFixed(3)} x{" "}
                              {kepentingan.toFixed(3)})
                            </span>
                          );
                        })}
                      </TableCell>
                      <TableCell className="text-center">
                        {nilaiPelamarWithTotal
                          .find((n) => n.id_pelamar === pelamar.id_pelamar)
                          ?.total_nilai.toFixed(5)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CollapsibleContent>
          </Collapsible>

          {/* HASIL SAW */}
          {nilaiPelamarWithTotal.length > 0 ? (
            <Table className="w-full border border-gray-300">
              <TableHeader className="bg-gray-200">
                <TableRow>
                  <TableHead className="text-center">Code</TableHead>
                  <TableHead className="text-center">Pelamar</TableHead>
                  <TableHead className="text-center">Total Nilai</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Ranking</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {nilaiPelamarWithTotal.map((pelamar, index) => (
                  <TableRow
                    key={index}
                    className={
                      pelamar.keputusan === "Offering"
                        ? "bg-green-100"
                        : pelamar.keputusan === "Onboarding"
                          ? "bg-blue-100"
                          : pelamar.keputusan === "Menolak"
                            ? "bg-red-100"
                            : ""
                    }
                  >
                    <TableCell className="font-bold text-center">
                      C{index + 1}
                    </TableCell>
                    <TableCell className="flex gap-1">
                      {pelamar.nama_pelamar}{" "}
                      {pelamar.keputusan === "Offering" ? (
                        <span>
                          <Crown width={18} height={18} />
                        </span>
                      ) : pelamar.keputusan === "Onboarding" ? (
                        <span>
                          <Plane width={18} height={18} />
                        </span>
                      ) : pelamar.keputusan === "Menolak" ? (
                        <CircleX width={18} height={18} />
                      ) : null}
                    </TableCell>
                    <TableCell className="text-center">
                      {pelamar.total_nilai.toFixed(5)}
                    </TableCell>
                    <TableCell
                      className={`text-center ${
                        pelamar.keputusan === "Offering"
                          ? "text-green-500 italic"
                          : pelamar.keputusan === "Onboarding"
                            ? "text-blue-500 italic"
                            : "text-red-500 italic"
                      }`}
                    >
                      {pelamar.keputusan}
                    </TableCell>
                    <TableCell className="text-center">{index + 1}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex items-center justify-center my-10">
              <h2>Belum Ada Pelamar Pada Jabatan Ini</h2>
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center justify-center my-10">
          <h2>Belum Ada Pelamar Pada Jabatan Ini</h2>
        </div>
      )}
    </div>
  );
};

export default page;
