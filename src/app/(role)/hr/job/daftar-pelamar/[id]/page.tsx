import {
  Table,
  TableBody,
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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ButtonScreening from "./ButtonScreening";

interface PageProps {
  params: {
    id: string;
  };
}

function hitungUmur(tanggalLahir: any) {
  const lahir = new Date(tanggalLahir);
  const hariIni = new Date();
  let umur = hariIni.getFullYear() - lahir.getFullYear();
  const bulan = hariIni.getMonth() - lahir.getMonth();
  if (bulan < 0 || (bulan === 0 && hariIni.getDate() < lahir.getDate())) {
    umur--;
  }
  return umur;
}

const page = async ({ params: { id } }: PageProps) => {
  const session = await getSession();
  const user = session?.user;
  if (!session) redirect("/");
  if (user?.role?.toLowerCase() !== "hr") redirect("/");

  const getPelamarPerJabatan = await prisma.user.findMany({
    include: {
      job: true,
      profile: true,
    },
    where: {
      id_job: parseInt(id),
    },
  });

  const getPersyaratan = await prisma.persyaratan.findFirst({
    where: {
      id_job: parseInt(id),
    },
  });

  return (
    <div className="max-w-5xl mx-auto my-4 space-y-6 px-4 rounded-lg min-h-[400px]">
      <div className="max-w-5xl mx-auto">
        <Breadcrumb className="bg-gray-100 p-4 rounded-lg">
          <BreadcrumbList className="flex space-x-2 text-gray-600">
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/hr/job/daftar-pelamar">
                Screening Daftar Pelamar
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {getPelamarPerJabatan.length > 0
                  ? getPelamarPerJabatan[0].job?.title
                  : ""}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="text-center">
        <H1 className="text-3xl font-extrabold text-gray-800">
          Screening Pelamar <br />
          Jabatan{" "}
          {getPelamarPerJabatan.length > 0
            ? getPelamarPerJabatan[0].job?.title
            : ""}
        </H1>
      </div>

      <Table className="w-full border-collapse">
        <TableHeader className="bg-gray-200">
          <TableRow>
            <TableHead className="text-center">Umur</TableHead>
            <TableHead className="text-center">Pendidikan</TableHead>
            <TableHead className="text-center">Pengalaman Kerja</TableHead>

            <TableHead className="text-center">Status Pernikahan</TableHead>
            <TableHead className="text-center">Jenis Kelamin</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="text-center">
            <TableCell>
              {getPersyaratan?.umur_min} - {getPersyaratan?.umur_max} Tahun
            </TableCell>
            <TableCell>{getPersyaratan?.pendidikan}</TableCell>

            <TableCell>{getPersyaratan?.pengalaman_kerja}</TableCell>

            <TableCell>{getPersyaratan?.status_pernikahan}</TableCell>
            <TableCell>{getPersyaratan?.jenis_kelamin}</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {getPelamarPerJabatan.length > 0 ? (
        <Table className="w-full border-collapse">
          <TableHeader className="bg-gray-200">
            <TableRow>
              <TableHead className="text-center font-bold">No</TableHead>
              <TableHead className="text-center">Nama Pelamar</TableHead>
              <TableHead className="text-center">Umur</TableHead>
              <TableHead className="text-center">Pendidikan</TableHead>
              <TableHead className="text-center">Status Pernikahan</TableHead>
              <TableHead className="text-center">Jenis Kelamin</TableHead>
              <TableHead className="text-center">Curriculum Vitae</TableHead>
              <TableHead className="text-center">Screening</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {getPelamarPerJabatan?.map((pelamar, index) => (
              <TableRow key={pelamar.id} className="text-center">
                <TableCell className="font-bold">{index + 1}</TableCell>
                <TableCell>{pelamar.name}</TableCell>
                <TableCell>
                  {hitungUmur(pelamar.profile?.tgl_lahir)} Tahun
                </TableCell>
                <TableCell>{pelamar.profile?.pendidikan}</TableCell>
                <TableCell>{pelamar.profile?.status_pernikahan}</TableCell>
                <TableCell>{pelamar.profile?.jenis_kelamin}</TableCell>
                <TableCell className="underline">
                  {pelamar.profile?.cv && (
                    <Link href={pelamar.profile?.cv}>Lihat CV</Link>
                  )}
                </TableCell>

                <TableCell>
                  {pelamar.screening_approved === true ? (
                    <span className="text-green-500">Lolos</span>
                  ) : pelamar.screening_approved === false ? (
                    <span className="text-red-500">Tidak Lolos</span>
                  ) : (
                    <ButtonScreening user={pelamar} />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="flex items-center justify-center my-10">
          <h2>Belum Ada Pelamar Pada Jabatan Ini</h2>
        </div>
      )}
    </div>
  );
};

export default page;
