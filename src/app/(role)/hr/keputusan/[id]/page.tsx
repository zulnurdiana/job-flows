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
import { Button } from "@/components/ui/button";
import Link from "next/link";
import H1 from "@/components/ui/h1";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface PageProps {
  params: {
    id: string;
  };
}

interface NilaiPelamar {
  id_pelamar: any;
  nama_pelamar: any;
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

  // Dapatkan data pelamar dengan kriteria penilaian
  const getPelamarPerJabatan = await prisma.user.findMany({
    include: {
      job: true,
      penilaian: {
        include: {
          detail_penilaian: {
            orderBy: {
              id_kriteria: "asc", // Urutkan berdasarkan ID kriteria
            },
            include: {
              kriteria: true,
            },
          },
        },
      },
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

  // Mendapatkan nilai Max setiap Kriteria
  const nilaiMax = await Promise.all(
    Array.from({ length: 12 }, (_, index) =>
      prisma.detail_Penilaian.findFirst({
        where: {
          id_kriteria: index + 1, // Kriteria ID dimulai dari 1 hingga 12
        },
        orderBy: {
          nilai: "desc", // Ambil nilai terbesar
        },
        select: {
          nilai: true,
        },
      }),
    ),
  );

  // Proses untuk menyimpan nilai C1-C12 untuk setiap pelamar dan membaginya dengan nilai maksimum
  const nilaiPelamar: NilaiPelamar[] = getPelamarPerJabatan.map((pelamar) => {
    const normalizedValues: Partial<NilaiPelamar> = {};

    pelamar.penilaian[0]?.detail_penilaian.forEach((detail) => {
      if (detail.nilai !== null && detail.id_kriteria !== null) {
        const maxNilai = nilaiMax[detail.id_kriteria - 1]?.nilai || 1; // Ambil nilai maksimum, default 1 untuk menghindari pembagian dengan nol
        const key =
          `nilai_c${detail.id_kriteria}` as keyof Partial<NilaiPelamar>;

        // Tentukan jenis kriteria (benefit atau cost)
        const jenisKriteria = detail.kriteria?.jenis_kriteria || ""; // Ambil jenis_kriteria dari objek kriteria terkait

        if (jenisKriteria === "BENEFIT") {
          normalizedValues[key] = Number((detail.nilai / maxNilai).toFixed(5)); // Pembagian nilai jika benefit
        } else if (jenisKriteria === "COST") {
          normalizedValues[key] = Number((maxNilai / detail.nilai).toFixed(5)); // Pembagian nilai jika cost
        }
      }
    });

    return {
      id_pelamar: pelamar.id,
      nama_pelamar: pelamar.name,
      ...normalizedValues,
    } as NilaiPelamar;
  });

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

  // Nilai yang sudah dinormalisasi
  const nilaiPelamarWithWeights: NilaiPelamar[] = nilaiPelamar.map((nilai) => {
    const nilaiWithWeights: Partial<NilaiPelamar> = {
      id_pelamar: nilai.id_pelamar,
      nama_pelamar: nilai.nama_pelamar,
    };

    nilaiWithWeights.nilai_c1 = nilai.nilai_c1
      ? nilai.nilai_c1 * (C1?.kepentingan ?? 0)
      : 0;
    nilaiWithWeights.nilai_c2 = nilai.nilai_c2
      ? nilai.nilai_c2 * (C2?.kepentingan ?? 0)
      : 0;
    nilaiWithWeights.nilai_c3 = nilai.nilai_c3
      ? nilai.nilai_c3 * (C3?.kepentingan ?? 0)
      : 0;
    nilaiWithWeights.nilai_c4 = nilai.nilai_c4
      ? nilai.nilai_c4 * (C4?.kepentingan ?? 0)
      : 0;
    nilaiWithWeights.nilai_c5 = nilai.nilai_c5
      ? nilai.nilai_c5 * (C5?.kepentingan ?? 0)
      : 0;
    nilaiWithWeights.nilai_c6 = nilai.nilai_c6
      ? nilai.nilai_c6 * (C6?.kepentingan ?? 0)
      : 0;
    nilaiWithWeights.nilai_c7 = nilai.nilai_c7
      ? nilai.nilai_c7 * (C7?.kepentingan ?? 0)
      : 0;
    nilaiWithWeights.nilai_c8 = nilai.nilai_c8
      ? nilai.nilai_c8 * (C8?.kepentingan ?? 0)
      : 0;
    nilaiWithWeights.nilai_c9 = nilai.nilai_c9
      ? nilai.nilai_c9 * (C9?.kepentingan ?? 0)
      : 0;
    nilaiWithWeights.nilai_c10 = nilai.nilai_c10
      ? nilai.nilai_c10 * (C10?.kepentingan ?? 0)
      : 0;
    nilaiWithWeights.nilai_c11 = nilai.nilai_c11
      ? nilai.nilai_c11 * (C11?.kepentingan ?? 0)
      : 0;
    nilaiWithWeights.nilai_c12 = nilai.nilai_c12
      ? nilai.nilai_c12 * (C12?.kepentingan ?? 0)
      : 0;

    return nilaiWithWeights as NilaiPelamar;
  });

  const nilaiPelamarWithTotal: { nama_pelamar: string; total_nilai: number }[] =
    nilaiPelamarWithWeights.map((nilai) => {
      const totalNilai =
        (nilai.nilai_c1 || 0) +
        (nilai.nilai_c2 || 0) +
        (nilai.nilai_c3 || 0) +
        (nilai.nilai_c4 || 0) +
        (nilai.nilai_c5 || 0) +
        (nilai.nilai_c6 || 0) +
        (nilai.nilai_c7 || 0) +
        (nilai.nilai_c8 || 0) +
        (nilai.nilai_c9 || 0) +
        (nilai.nilai_c10 || 0) +
        (nilai.nilai_c11 || 0) +
        (nilai.nilai_c12 || 0);

      return {
        nama_pelamar: nilai.nama_pelamar || "",
        total_nilai: totalNilai,
      };
    });

  // Urutkan berdasarkan nilai total dari yang terbesar ke terkecil
  nilaiPelamarWithTotal.sort((a, b) => b.total_nilai - a.total_nilai);
  // console.log(nilaiPelamar);
  // console.log(nilaiPelamarWithWeights);
  // console.log(nilaiPelamarWithTotal);

  return (
    <div className="max-w-5xl mx-auto my-4 space-y-6 px-4 rounded-lg min-h-[400px]">
      <div className="max-w-5xl mx-auto">
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

      <div className="text-center">
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
          <Table className="w-full border-collapse">
            <TableHeader className="bg-gray-200">
              <TableRow>
                <TableHead className="text-center font-bold">No</TableHead>
                <TableHead className="text-center">Nama Pelamar</TableHead>
                {Array.from({ length: 12 }, (_, index) => (
                  <TableHead className="text-center" key={index}>
                    C{index + 1}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {getPelamarPerJabatan.map((pelamar, index) => (
                <TableRow key={pelamar.id} className="text-center">
                  <TableCell className="font-bold">{index + 1}</TableCell>
                  <TableCell>{pelamar.name}</TableCell>
                  {Array.from({ length: 12 }, (_, index) => {
                    const nilai =
                      pelamar.penilaian[0]?.detail_penilaian.find(
                        (detail) => detail.id_kriteria === index + 1,
                      )?.nilai || "-";
                    return <TableCell key={index}>{nilai}</TableCell>;
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Table className="w-full border-collapse">
            <TableHeader className="bg-gray-200">
              <TableRow>
                <TableHead className="text-center font-bold">No</TableHead>
                <TableHead className="text-center">Nama Pelamar</TableHead>
                {Array.from({ length: 12 }, (_, index) => (
                  <TableHead className="text-center" key={index}>
                    C{index + 1}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {nilaiPelamar.map((pelamar, index) => (
                <TableRow key={pelamar.id_pelamar} className="text-center">
                  <TableCell className="font-bold">{index + 1}</TableCell>
                  <TableCell>{pelamar.nama_pelamar}</TableCell>
                  <TableCell>{pelamar.nilai_c1}</TableCell>
                  <TableCell>{pelamar.nilai_c2}</TableCell>
                  <TableCell>{pelamar.nilai_c3}</TableCell>
                  <TableCell>{pelamar.nilai_c4}</TableCell>
                  <TableCell>{pelamar.nilai_c5}</TableCell>
                  <TableCell>{pelamar.nilai_c6}</TableCell>
                  <TableCell>{pelamar.nilai_c7}</TableCell>
                  <TableCell>{pelamar.nilai_c8}</TableCell>
                  <TableCell>{pelamar.nilai_c9}</TableCell>
                  <TableCell>{pelamar.nilai_c10}</TableCell>
                  <TableCell>{pelamar.nilai_c11}</TableCell>
                  <TableCell>{pelamar.nilai_c12}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {nilaiPelamarWithTotal.length > 0 ? (
            <Table className="w-1/3 border-collapse">
              <TableHeader className="bg-gray-200">
                <TableRow>
                  <TableHead className="text-center font-bold">
                    Ranking
                  </TableHead>
                  <TableHead className="text-center">Nama Pelamar</TableHead>
                  <TableHead className="text-center">Total Nilai</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {nilaiPelamarWithTotal.map((nilai, index) => (
                  <TableRow key={index} className="text-center">
                    <TableCell className="font-bold">{index + 1}</TableCell>
                    <TableCell>{nilai.nama_pelamar}</TableCell>
                    <TableCell>{nilai.total_nilai.toFixed(5)}</TableCell>
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
