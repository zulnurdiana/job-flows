import H1 from "@/components/ui/h1";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
import ButtonKeputusan from "./ButtonKeputusan";

const page = async () => {
  const session = await getSession();
  const user = session?.user;
  if (!session || !user) redirect("/");

  const pelamar = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    include: {
      penilaian: {
        include: {
          detail_penilaian: true,
        },
      },
    },
  });

  const keputusan = await prisma.keputusan.findUnique({
    where: {
      id_user: pelamar?.id,
    },
  });

  const lowongan = await prisma.job.findUnique({
    where: {
      id: pelamar?.id_job || 0,
    },
  });

  const persyaratan = await prisma.persyaratan.findFirst({
    where: {
      id_job: lowongan?.id,
    },
    include: {
      permintaan: true,
    },
  });

  console.log(persyaratan?.permintaan.id_permintaan);

  const pegawai = await prisma.pegawai.findMany({
    where: {
      id_permintaan: persyaratan?.permintaan.id_permintaan,
    },
  });

  return (
    <div className="max-w-5xl mx-auto my-4 space-y-4 rounded-lg min-h-[400px] px-4">
      <Breadcrumb className="bg-gray-100 p-4 rounded-lg">
        <BreadcrumbList className="flex space-x-2 text-gray-600">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>Hasil Keputusan</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <H1 className="text-start">Hasil Penerimaan Pegawai</H1>
      <span>
        Berikut adalah hasil nilai dan keputusan yang sudah dinilai oleh pihak
        HR Recruitment
      </span>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Jabatan</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>
              {keputusan?.status === "Onboarding" ||
              keputusan?.status === "Rejected" ||
              keputusan?.status === "Offering"
                ? "Pesan"
                : "Action"}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>{lowongan?.title}</TableCell>
            <TableCell>{keputusan?.status}</TableCell>
            <TableCell className="flex items-center gap-3 w-2/4">
              {keputusan?.status === "Onboarding" && (
                <div className="text-green-500">{`Selamat ${pelamar?.name} Anda telah diterima oleh pihak HR`}</div>
              )}
              {keputusan?.status === "Offering" && (
                <ButtonKeputusan keputusan={keputusan} />
              )}
              {keputusan?.status === "Rejected" && (
                <div className="text-red-500">{`Mohon maaf ${pelamar?.name} Anda tidak diterima tetap semangat ya.`}</div>
              )}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default page;
