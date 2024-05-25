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

const page = async () => {
  const session = await getSession();
  const user = session?.user;
  if (!session) redirect("/");
  const permintaanByUser = await prisma.permintaan.findMany({
    where: {
      id_user: user?.id,
    },
    include: {
      user: true,
      jabatan: true,
    },
  });
  if (user?.role?.toLowerCase() !== "user") redirect("/");

  return (
    <div className="max-w-5xl m-auto my-10 space-y-5">
      {user.role.toLocaleLowerCase() !== "user" ? (
        <div className="text-center  text-xl font-bold">
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
                  {permintaan.status_permintaan === false ? (
                    "Pending"
                  ) : (
                    <Button asChild>
                      <Link href={"/user/persyaratan"}>Buat Persyaratan</Link>
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
