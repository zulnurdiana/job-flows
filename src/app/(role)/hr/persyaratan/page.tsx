import getSession from "@/lib/getSession";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
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
    <div className="max-w-5xl mx-auto my-4 space-y-6 px-4 min-h-[400px]">
      <div className="max-w-5xl mx-auto">
        <Breadcrumb className="bg-gray-100 p-4 rounded-lg">
          <BreadcrumbList className="flex space-x-2 text-gray-600">
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Daftar Persyaratan</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="text-center">
        <H1 className="text-3xl font-extrabold text-gray-800">
          Daftar Persyaratan <br /> Calon Pegawai
        </H1>
      </div>

      {persyaratans.length === 0 ? (
        <div className="text-center">Tidak ada persyaratan</div>
      ) : (
        <Table className="w-full border-collapse">
          <TableHeader className="bg-gray-200">
            <TableRow>
              <TableHead className="text-center font-bold">No</TableHead>
              <TableHead className="text-center">Jabatan</TableHead>
              <TableHead className="text-center">Divisi</TableHead>
              <TableHead className="text-center">Kebutuhan</TableHead>
              {/* <TableHead className="text-center">Pendidikan</TableHead>
              <TableHead className="text-center">Pernikahan</TableHead>
              <TableHead className="text-center">Pengalaman</TableHead>
              <TableHead className="text-center">Umur</TableHead> */}

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
                <TableCell>
                  {persyaratan.permintaan?.jabatan.nama_jabatan}
                </TableCell>
                <TableCell>
                  {persyaratan.permintaan?.jabatan.divisi.nama_divisi}
                </TableCell>
                <TableCell>
                  {persyaratan.permintaan.jumlah_pegawai} Pegawai
                </TableCell>
                {/* <TableCell>{persyaratan.pendidikan}</TableCell>
                <TableCell>{persyaratan.status_pernikahan}</TableCell>
                <TableCell>{persyaratan.pengalaman_kerja}</TableCell>
                <TableCell>
                  {persyaratan.umur_min} - {persyaratan.umur_max} Tahun
                </TableCell> */}

                <TableCell>
                  <Button asChild>
                    <Link href={`/hr/job/new/${persyaratan.id_persyaratan}`}>
                      Lowongan
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
