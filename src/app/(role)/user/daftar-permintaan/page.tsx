import {
  Table,
  TableBody,
  TableCaption,
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

const page = async () => {
  const session = await getSession();
  const user = session?.user;
  if (!session) redirect("/");
  if (user?.role?.toLowerCase() !== "user") redirect("/");

  const permintaanByUser = await prisma.permintaan.findMany({
    where: {
      id_user: user?.id,
      status_permintaan: false,
    },
    include: {
      user: true,
      jabatan: true,
    },
  });

  return (
    <div className="max-w-5xl m-auto my-10 space-y-5 min-h-[400px]">
      <H1 className="text-center">Daftar Permintaan</H1>
      {permintaanByUser.length === 0 ? (
        <div className="text-center">
          Tidak ada daftar permintaan yang pending
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Jabatan</TableHead>
              <TableHead>Jumlah Permintaan</TableHead>
              <TableHead>Status Permintaan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {permintaanByUser.map((permintaan) => (
              <TableRow key={permintaan.id_permintaan}>
                <TableCell>{permintaan.jabatan.nama_jabatan}</TableCell>
                <TableCell>{permintaan.jumlah_pegawai}</TableCell>
                <TableCell>
                  {permintaan.approved === false ? (
                    "Pending"
                  ) : (
                    <Button asChild>
                      <Link
                        href={`/user/persyaratan/new/${permintaan.id_permintaan}`}
                      >
                        Buat Persyaratan
                      </Link>
                    </Button>
                  )}
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
