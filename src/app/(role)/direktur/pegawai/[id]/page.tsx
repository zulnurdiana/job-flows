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

  return (
    <div className="max-w-5xl min-h-[400px] m-auto my-4 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
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
            <TableHead className="text-center">Status Pegawai</TableHead>
            <TableHead className="text-center">Tanggal Bergabung</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pegawaiPerJabatan.map((pegawai, index) => (
            <TableRow key={pegawai.id_pegawai} className="text-center">
              <TableCell className="font-bold">{index + 1}</TableCell>
              <TableCell>{pegawai.nama_pegawai}</TableCell>
              <TableCell>{pegawai.email}</TableCell>
              <TableCell>{pegawai.status_pegawai}</TableCell>
              <TableCell>
                {pegawai.tanggal_gabung?.toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default page;
