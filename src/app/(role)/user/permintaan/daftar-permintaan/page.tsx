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
    orderBy: {
      createdAt: "desc",
    },
  });

  let alasan: string = "";

  permintaanByUser.map((permintaan) => {
    alasan = permintaan.alasan ? permintaan.alasan : "";
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

      {permintaanByUser.length === 0 ? (
        <div className="text-center text-gray-500">
          Tidak ada daftar permintaan yang pending
        </div>
      ) : (
        <Table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
          <TableHeader className="bg-gray-200">
            <TableRow>
              <TableHead className="text-center font-bold p-2">No</TableHead>
              <TableHead className="text-center font-bold p-2">
                Jabatan
              </TableHead>
              <TableHead className="text-center font-bold p-2">
                Jumlah Permintaan
              </TableHead>
              {alasan && (
                <TableHead className="text-center font-bold p-2">
                  Catatan
                </TableHead>
              )}

              <TableHead className="text-center font-bold p-2">
                Status Permintaan
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {permintaanByUser.map((permintaan, index) => (
              <TableRow
                key={permintaan.id_permintaan}
                className="text-center hover:bg-gray-100"
              >
                <TableCell className="p-2">{index + 1}</TableCell>
                <TableCell className="p-2">
                  {permintaan.jabatan.nama_jabatan}
                </TableCell>

                <TableCell className="p-2">
                  {permintaan.jumlah_pegawai}
                </TableCell>
                {alasan && (
                  <TableCell className="p-2 text-justify w-2/6 font-mono text-xs">
                    {permintaan.alasan?.trim() !== ""
                      ? permintaan.alasan
                      : "Tidak ada catatan dari Direktur"}
                  </TableCell>
                )}

                <TableCell className="p-2">
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
