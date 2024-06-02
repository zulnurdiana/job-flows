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
            },
          },
        },
      },
    },
  });

  const jobIds = jobDetails.flatMap((jabatan) =>
    jabatan.permintaans.flatMap((permintaan) =>
      permintaan.persyaratan
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
    <div className="max-w-6xl min-h-[400px] m-auto my-10 space-y-6">
      <H1 className="text-center">
        Daftar Pelamar <br />
        Setiap Jabatan
      </H1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center font-bold">No</TableHead>
            <TableHead className="text-center">Jabatan</TableHead>
            <TableHead className="text-center">Divisi</TableHead>
            <TableHead className="text-center">Jumlah Pelamar</TableHead>
            <TableHead className="text-center">Jumlah Permintaan</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobDetails.map((res, index) => (
            <TableRow key={res.id_jabatan} className="text-center">
              <TableCell className="font-bold">{index + 1}</TableCell>
              <TableCell className="font-bold">{res.nama_jabatan}</TableCell>
              <TableCell className="font-bold">{res.nama_divisi}</TableCell>
              <TableCell className="font-bold">
                {res.jumlah_pelamar} Pelamar
              </TableCell>
              <TableCell className="font-bold">
                {res.jumlah_pegawai} Pegawai
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default page;
