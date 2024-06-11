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
import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ButtonDeleteKriteria from "./ButtonDeleteKriteria";

const ITEMS_PER_PAGE = 5; // Ubah jumlah item per halaman menjadi 5

const page = async ({ searchParams }: any) => {
  const session = await getSession();
  if (!session || session.user.role?.toLowerCase() !== "user") redirect("/");

  const page = parseInt(searchParams.page || "1");

  const kriteriaList = await prisma.kriteria.findMany({
    orderBy: { updatedAt: "desc" },
    skip: (page - 1) * ITEMS_PER_PAGE,
    take: ITEMS_PER_PAGE,
  });

  const totalItems = await prisma.kriteria.count();

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  return (
    <div className="max-w-5xl min-h-[400px] m-auto my-4 space-y-6 px-4">
      <Breadcrumb className="bg-gray-100 p-4 rounded-lg">
        <BreadcrumbList className="flex space-x-2 text-gray-600">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Daftar Kriteria</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <H1 className="text-center text-3xl font-extrabold text-gray-800">
        Daftar Kriteria Penilaian
      </H1>

      <Button asChild>
        <Link href={"/user/kriteria/new"}>Tambah Kriteria</Link>
      </Button>

      {kriteriaList.length === 0 ? (
        <div className="text-center text-gray-500">
          Tidak ada daftar kriteria
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <Table className="min-w-full bg-white">
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="text-center font-bold p-4">No</TableHead>
                <TableHead className="text-center p-4">Nama Kriteria</TableHead>
                <TableHead className="text-center p-4">
                  Deskripsi Kriteria
                </TableHead>
                <TableHead className="text-center p-4">Bobot</TableHead>
                <TableHead className="text-center p-4">
                  Jenis Kriteria
                </TableHead>
                <TableHead className="text-center p-4">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {kriteriaList.map((kriteria, index) => (
                <TableRow
                  key={kriteria.id_kriteria}
                  className="text-center even:bg-gray-50"
                >
                  <TableCell className="font-bold p-4">
                    {(page - 1) * ITEMS_PER_PAGE + index + 1}
                  </TableCell>
                  <TableCell className="p-4">
                    {kriteria.nama_kriteria}
                  </TableCell>
                  <TableCell className="p-4">
                    {kriteria.deskripsi_kriteria}
                  </TableCell>
                  <TableCell className="p-4">{kriteria.bobot}</TableCell>
                  <TableCell className="p-4">
                    {kriteria.jenis_kriteria}
                  </TableCell>
                  <TableCell className="p-4 flex items-center justify-center gap-3">
                    <Button asChild>
                      <Link href={`/user/kriteria/${kriteria.id_kriteria}`}>
                        Update
                      </Link>
                    </Button>
                    <ButtonDeleteKriteria id={kriteria.id_kriteria} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="flex justify-center space-x-4 mt-4">
        {page > 1 && (
          <Button asChild variant="outline">
            <Link href={`?page=${page - 1}`}>Previous</Link>
          </Button>
        )}
        {page < totalPages && (
          <Button asChild variant="outline">
            <Link href={`?page=${page + 1}`}>Next</Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default page;
