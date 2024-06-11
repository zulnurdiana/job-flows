import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";
import {
  Table,
  TableBody,
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
    <div className="max-w-5xl mx-auto my-4 space-y-6 min-h-[400px] px-4">
      <Breadcrumb className="bg-gray-100 p-4 rounded-lg">
        <BreadcrumbList className="flex space-x-2 text-gray-600">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Daftar Permintaan</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <H1 className="text-3xl font-extrabold text-center text-gray-800">
        Daftar Permintaan Pegawai
      </H1>

      {unapprovedPermintaan.length !== 0 ? (
        <Table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
          <TableHeader className="bg-gray-200">
            <TableRow>
              <TableHead className="text-center font-bold p-2">No</TableHead>
              <TableHead className="text-center font-bold p-2">
                Jabatan
              </TableHead>
              <TableHead className="text-center font-bold p-2">
                Divisi
              </TableHead>
              <TableHead className="text-center font-bold p-2">
                Jumlah Permintaan
              </TableHead>
              <TableHead className="text-center font-bold p-2">
                Tanggal Permintaan
              </TableHead>
              <TableHead className="text-center font-bold p-2">
                Nama Peminta
              </TableHead>
              <TableHead className="text-center font-bold p-2">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {unapprovedPermintaan.map((permintaan, index) => (
              <TableRow
                key={permintaan.id_permintaan}
                className="text-center hover:bg-gray-100"
              >
                <TableCell className="font-bold p-2">{index + 1}</TableCell>
                <TableCell className="p-2">
                  {permintaan.jabatan.nama_jabatan}
                </TableCell>
                <TableCell className="p-2">
                  {permintaan.jabatan.divisi.nama_divisi}
                </TableCell>
                <TableCell className="p-2">
                  {permintaan.jumlah_pegawai} Pegawai
                </TableCell>
                <TableCell className="p-2">
                  {new Date(permintaan.tanggal_permintaan).toLocaleDateString()}
                </TableCell>
                <TableCell className="p-2">{permintaan.user.name}</TableCell>
                <TableCell className="p-2">
                  <div className="flex justify-center gap-3 items-center">
                    <ButtonPermintaan permintaan={permintaan} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="text-center text-gray-500">
          Tidak ada permintaan yang pending
        </p>
      )}
    </div>
  );
};

export default page;
