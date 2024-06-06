import getSession from "@/lib/getSession";
import prisma from "@/lib/prisma";
import { Span } from "next/dist/trace";
import { redirect } from "next/navigation";
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
  const persyaratans = await prisma.persyaratan.findMany({
    include: {
      user: true,
      permintaan: {
        include: {
          jabatan: {
            include: {
              divisi: true,
            },
          },
        },
      },
    },
    where: {
      status_persyaratan: false,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const session = await getSession();
  const user = session?.user;
  if (!session || user?.role?.toLowerCase() !== "hr") return redirect("/");

  return (
    <div className="max-w-6xl min-h-[400px] m-auto my-10 space-y-6">
      <H1 className="text-center">
        Daftar Persyaratan <br /> Calon Pegawai
      </H1>
      {persyaratans.length === 0 ? (
        <div className="text-center">Tidak ada persyaratan</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center font-bold">No</TableHead>
              <TableHead className="text-center">Pendidikan</TableHead>
              <TableHead className="text-center">Status Pernikahan</TableHead>
              <TableHead className="text-center">Pengalaman</TableHead>
              <TableHead className="text-center">Minimal Umur</TableHead>
              <TableHead className="text-center">Tanggal Permintaan</TableHead>
              <TableHead className="text-center">Jumlah Kebutuhan</TableHead>
              <TableHead className="text-center">Jabatan</TableHead>
              <TableHead className="text-center">Divisi</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {persyaratans.map((persyaratan, index) => (
              <TableRow
                key={persyaratan.id_persyaratan}
                className="text-center"
              >
                <TableCell className="font-bold">{index + 1}</TableCell>
                <TableCell>{persyaratan.pendidikan}</TableCell>
                <TableCell>{persyaratan.status_pernikahan}</TableCell>
                <TableCell>{persyaratan.pengalaman_kerja} Tahun</TableCell>

                <TableCell>{persyaratan.umur} Tahun</TableCell>

                <TableCell>
                  {persyaratan.createdAt.toLocaleDateString()}
                </TableCell>

                <TableCell>
                  {persyaratan.permintaan.jumlah_pegawai} Pegawai
                </TableCell>
                <TableCell>
                  {persyaratan.permintaan?.jabatan.nama_jabatan}
                </TableCell>
                <TableCell>
                  {persyaratan.permintaan?.jabatan.divisi.nama_divisi}
                </TableCell>
                <TableCell>
                  <Button asChild>
                    <Link href={`/hr/job/new/${persyaratan.id_persyaratan}`}>
                      Buka Lowongan
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default page;
