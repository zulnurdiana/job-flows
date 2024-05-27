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

const page = async () => {
  const persyaratans = await prisma.persyaratan.findMany({
    include: {
      user: true,
      permintaan: {
        include: {
          jabatan: true,
        },
      },
    },
  });
  const session = await getSession();
  const user = session?.user;
  if (!session || user?.role?.toLowerCase() !== "hr") return redirect("/");
  return (
    <div className="max-w-5xl min-h-[400px] m-auto my-10 space-y-5">
      {persyaratans.length === 0 ? (
        <div className="text-center">Tidak ada persyaratan</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Pengalaman Kerja</TableHead>
              <TableHead>Pendidikan</TableHead>
              <TableHead>Minimal Umur</TableHead>
              <TableHead>Status Pernikahan</TableHead>
              <TableHead>Tanggal Permintaan</TableHead>
              <TableHead>Nama Kepala Divisi</TableHead>
              <TableHead>Jabatan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {persyaratans.map((persyaratan) => (
              <TableRow key={persyaratan.id_persyaratan}>
                <TableCell className="font-medium">
                  {persyaratan.pengalaman_kerja}
                </TableCell>
                <TableCell>{persyaratan.pendidikan}</TableCell>

                <TableCell>{persyaratan.umur}</TableCell>
                <TableCell>{persyaratan.status_pernikahan}</TableCell>
                <TableCell className="text-center">
                  {persyaratan.createdAt.toLocaleDateString()}
                </TableCell>
                <TableCell className="text-center">
                  {persyaratan.user.name}
                </TableCell>
                <TableCell className="text-center">
                  {persyaratan.permintaan?.jabatan.nama_jabatan}
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
