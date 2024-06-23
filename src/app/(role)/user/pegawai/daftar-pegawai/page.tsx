import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import H1 from "@/components/ui/h1";
import { Button } from "@/components/ui/button";
import Link from "next/link";
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
  const user_id = session?.user.id;
  const user = await prisma.user.findUnique({
    where: {
      id: user_id,
    },
    include: {
      pegawai: {
        include: {
          jabatan: true,
        },
      },
    },
  });

  const id_divisi = user?.pegawai?.jabatan.id_divisi;
  const nama_divisi = await prisma.divisi.findUnique({
    where: {
      id_divisi: id_divisi,
    },
    select: {
      nama_divisi: true,
    },
  });
  const result = await prisma.jabatan.findMany({
    where: {
      id_divisi: id_divisi,
    },
    include: {
      divisi: true,
      pegawai: true,
    },
  });

  if (!session || session.user.role?.toLowerCase() !== "user") {
    redirect("/");
  }

  return (
    <div className="max-w-5xl min-h-[400px] m-auto my-4 space-y-6 px-4">
      <Breadcrumb className="bg-gray-100 p-4 rounded-lg">
        <BreadcrumbList className="flex space-x-2 text-gray-600">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              Daftar Pegawai Divisi {nama_divisi?.nama_divisi}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <H1 className="text-center text-3xl font-extrabold text-gray-800">
        Daftar Pegawai Untuk <br />
        Setiap Jabatan
      </H1>

      <div className="bg-white shadow overflow-hidden rounded-lg">
        <Table className="min-w-full bg-white">
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="text-center font-bold p-4">No</TableHead>
              <TableHead className="text-center p-4">Jabatan</TableHead>
              <TableHead className="text-center p-4">Divisi</TableHead>
              <TableHead className="text-center p-4">Jumlah Pegawai</TableHead>
              <TableHead className="text-center p-4">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {result.map((res, index) => (
              <TableRow
                key={res.id_jabatan}
                className="text-center even:bg-gray-50"
              >
                <TableCell className="font-bold p-4">{index + 1}</TableCell>
                <TableCell className="p-4">{res.nama_jabatan}</TableCell>
                <TableCell className="p-4">{res.divisi.nama_divisi}</TableCell>
                <TableCell className="p-4">
                  {res.pegawai.length} Pegawai
                </TableCell>
                <TableCell className="p-4">
                  <Button variant="outline" className="w-full">
                    <Link href={`/user/pegawai/${res.id_jabatan}`}>
                      Lihat Pegawai
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default page;
