import getSession from "@/lib/getSession";
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
import prisma from "@/lib/prisma";
import H1 from "@/components/ui/h1";
import ButtonPermintaan from "./ButtonPermintaan";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const page = async () => {
  const session = await getSession();
  const user = session?.user;

  if (!session || user?.role !== "direktur") {
    redirect("/");
  }

  const unapprovedPermintaan = await prisma.permintaan.findMany({
    where: {
      approved: false,
    },
    include: {
      jabatan: {
        include: {
          divisi: true,
        },
      },
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="max-w-5xl m-auto my-4 space-y-6 min-h-[400px]">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>Daftar Permintaan</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <H1 className="text-center">Daftar Permintaan Pegawai</H1>

      {unapprovedPermintaan.length !== 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center font-bold">No</TableHead>
              <TableHead className="text-center">Jabatan</TableHead>
              <TableHead className="text-center">Divisi</TableHead>
              <TableHead className="text-center">Jumlah Permintaan</TableHead>
              <TableHead className="text-center">Tanggal Permintaan</TableHead>
              <TableHead className="text-center">Nama Peminta</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {unapprovedPermintaan.map((permintaan, index) => (
              <TableRow key={permintaan.id_permintaan} className="text-center">
                <TableCell className="font-bold">{index + 1}</TableCell>
                <TableCell>{permintaan.jabatan.nama_jabatan}</TableCell>
                <TableCell>{permintaan.jabatan.divisi.nama_divisi}</TableCell>
                <TableCell>{permintaan.jumlah_pegawai} Pegawai</TableCell>

                <TableCell className="text-center">
                  {permintaan.tanggal_permintaan.toLocaleDateString()}
                </TableCell>

                <TableCell>{permintaan.user.name}</TableCell>
                <TableCell>
                  <div className="flex gap-3 items-center">
                    <ButtonPermintaan permintaan={permintaan} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="text-center">Tidak ada permintaan yang pending</p>
      )}
    </div>
  );
};

export default page;
