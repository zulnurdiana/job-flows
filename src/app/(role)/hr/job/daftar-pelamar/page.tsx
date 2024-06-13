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

const getJobDetails = async () => {
  const jobDetails = await prisma.jabatan.findMany({
    select: {
      id_jabatan: true,
      nama_jabatan: true,
      divisi: {
        select: {
          nama_divisi: true,
        },
      },
      permintaans: {
        select: {
          jumlah_pegawai: true,
          persyaratan: {
            select: {
              id_job: true,
              job: {
                select: {
                  approved: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const jobIds = jobDetails.flatMap((jabatan) =>
    jabatan.permintaans.flatMap((permintaan) =>
      permintaan.persyaratan
        .filter((persyaratan) => persyaratan.job?.approved === true)
        .map((persyaratan) => persyaratan.id_job)
        .filter((id): id is number => id !== null),
    ),
  );

  const pelamarCounts = await prisma.user.groupBy({
    by: ["id_job"],
    where: {
      id_job: {
        in: jobIds,
      },
    },
    _count: {
      id: true,
    },
  });

  const pelamarMap: Record<number, number> = pelamarCounts.reduce(
    (acc: Record<number, number>, item) => {
      if (item.id_job !== null) {
        acc[item.id_job] = item._count.id;
      }
      return acc;
    },
    {} as Record<number, number>,
  );

  const formattedResult = jobDetails.map((jabatan) => {
    const jobIdsForJabatan = jabatan.permintaans.flatMap((permintaan) =>
      permintaan.persyaratan
        .filter((persyaratan) => persyaratan.job?.approved === true)
        .map((persyaratan) => persyaratan.id_job)
        .filter((id): id is number => id !== null),
    );

    const jumlah_pelamar = jobIdsForJabatan.reduce(
      (acc: number, id_job: number) => acc + (pelamarMap[id_job] || 0),
      0,
    );

    return {
      id_jabatan: jabatan.id_jabatan,
      nama_jabatan: jabatan.nama_jabatan,
      nama_divisi: jabatan.divisi.nama_divisi,
      jumlah_pegawai: jabatan.permintaans.reduce(
        (acc: number, permintaan: { jumlah_pegawai: number }) =>
          acc + permintaan.jumlah_pegawai,
        0,
      ),
      jumlah_pelamar: jumlah_pelamar,
      id_jobs: jobIdsForJabatan, // Tambahkan id_job ke hasil
    };
  });

  // Filter jabatan yang memiliki pegawai
  return formattedResult.filter((jabatan) => jabatan.jumlah_pegawai > 0);
};

const page = async () => {
  const session = await getSession();
  const user = session?.user;
  if (!session) redirect("/");
  if (user?.role?.toLowerCase() !== "hr") redirect("/");

  const jobDetails = await getJobDetails();

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
              <BreadcrumbPage>Daftar Pelamar</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="text-center">
        <H1 className="text-3xl font-extrabold text-gray-800">
          Daftar Pelamar <br /> Setiap Jabatan
        </H1>
      </div>

      <Table className="w-full border-collapse">
        <TableHeader className="bg-gray-200">
          <TableRow>
            <TableHead className="text-center font-bold">No</TableHead>
            <TableHead className="text-center">Jabatan</TableHead>
            <TableHead className="text-center">Divisi</TableHead>
            <TableHead className="text-center">Jumlah Pelamar</TableHead>
            <TableHead className="text-center">Jumlah Permintaan</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobDetails
            .filter((res) => res.id_jobs.length > 0) // Filter untuk memastikan id_jobs ada
            .map((res, index) => (
              <TableRow key={res.id_jabatan} className="text-center">
                <TableCell className="font-bold">{index + 1}</TableCell>
                <TableCell>{res.nama_jabatan}</TableCell>
                <TableCell>{res.nama_divisi}</TableCell>
                <TableCell>{res.jumlah_pelamar} Pelamar</TableCell>
                <TableCell>{res.jumlah_pegawai} Pegawai</TableCell>
                <TableCell>
                  <Button asChild>
                    <Link href={`/hr/job/daftar-pelamar/${res.id_jobs}`}>
                      Lihat Pelamar
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default page;
