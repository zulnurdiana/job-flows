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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface PageProps {
  params: {
    id: string;
  };
}
const page = async ({ params: { id } }: PageProps) => {
  const pegawaiPerJabatan = await prisma.pegawai.findMany({
    where: {
      id_jabatan: parseInt(id),
    },
    include: {
      jabatan: true,
    },
    orderBy: {
      nama_pegawai: "asc",
    },
  });

  pegawaiPerJabatan.map(async (pegawai) => {
    if (
      pegawai?.tgl_bergabung &&
      pegawai?.tgl_berakhir &&
      new Date() > pegawai.tgl_berakhir
    ) {
      await prisma.pegawai.update({
        data: {
          status_pegawai: "Nonaktif",
        },
        where: {
          id_pegawai: pegawai.id_pegawai,
        },
      });
    } else {
      await prisma.pegawai.update({
        data: {
          status_pegawai: "Aktif",
        },
        where: {
          id_pegawai: pegawai.id_pegawai,
        },
      });
    }

    if (pegawai?.tgl_bergabung && pegawai?.tgl_berakhir) {
      const currentDate = new Date();
      const tglBerakhir = new Date(pegawai.tgl_berakhir);
      const oneMonthBeforeEnd = new Date(tglBerakhir);
      oneMonthBeforeEnd.setMonth(tglBerakhir.getMonth() - 1);

      if (currentDate >= oneMonthBeforeEnd && currentDate < tglBerakhir) {
        await prisma.pegawai.update({
          data: {
            status_pegawai: `Kontrak selesai ${pegawai.tgl_berakhir.toLocaleDateString()}`,
          },
          where: {
            id_pegawai: pegawai.id_pegawai,
          },
        });
      }
    }
  });

  return (
    <div className="max-w-5xl mx-auto my-4 space-y-6">
      <Breadcrumb className="bg-gray-100 p-4 rounded-lg">
        <BreadcrumbList className="flex space-x-2 text-gray-600">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/direktur/pegawai/daftar-pegawai">
              Daftar Pegawai
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {pegawaiPerJabatan[0].jabatan?.nama_jabatan}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <H1 className="text-center">
        Daftar Pegawai Untuk <br />
        Jabatan {pegawaiPerJabatan[0].jabatan?.nama_jabatan}
      </H1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center font-bold">No</TableHead>
            <TableHead className="text-center">Nama Pegawai</TableHead>
            <TableHead className="text-center">Email</TableHead>

            <TableHead className="text-center">Tanggal Bergabung</TableHead>
            <TableHead className="text-center">Tanggal Berakhir</TableHead>
            <TableHead className="text-center">Status Pegawai</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pegawaiPerJabatan.map((pegawai, index) => (
            <TableRow key={pegawai.id_pegawai} className="text-center">
              <TableCell className="font-bold">{index + 1}</TableCell>
              <TableCell>{pegawai.nama_pegawai}</TableCell>
              <TableCell>{pegawai.email}</TableCell>
              <TableCell>
                {pegawai.tgl_bergabung?.toLocaleDateString()}
              </TableCell>
              <TableCell>
                {pegawai.tgl_berakhir?.toLocaleDateString()}
              </TableCell>
              <TableCell>{pegawai.status_pegawai}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default page;
