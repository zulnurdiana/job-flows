import prisma from "@/lib/prisma";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import H1 from "@/components/ui/h1";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const page = async () => {
  const daftarPegawaiPerjabatan = await prisma.jabatan.findMany({
    include: {
      divisi: true,
      pegawai: true,
    },
    orderBy: {
      divisi: {
        nama_divisi: "asc",
      },
    },
  });

  const result = daftarPegawaiPerjabatan.map((jabatan) => ({
    id_jabatan: jabatan.id_jabatan,
    nama_jabatan: jabatan.nama_jabatan,
    nama_divisi: jabatan.divisi.nama_divisi,
    jumlah_pegawai: jabatan.pegawai.length,
  }));

  return (
    <div className="max-w-6xl min-h-[400px] m-auto my-10 space-y-6">
      <H1 className="text-center">
        Daftar Pegawai Untuk <br />
        Setiap Jabatan
      </H1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center font-bold">No</TableHead>
            <TableHead className="text-center">Jabatan</TableHead>
            <TableHead className="text-center">Divisi</TableHead>
            <TableHead className="text-center">Jumlah Pegawai</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {result.map((res, index) => (
            <TableRow key={res.id_jabatan} className="text-center">
              <TableCell className="font-bold">{index + 1}</TableCell>
              <TableCell>{res.nama_jabatan}</TableCell>
              <TableCell>{res.nama_divisi}</TableCell>
              <TableCell>{res.jumlah_pegawai} Pegawai</TableCell>

              <TableCell>
                <Button asChild>
                  <Link href={`/direktur/pegawai/${res.id_jabatan}`}>
                    Lihat Pegawai
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
