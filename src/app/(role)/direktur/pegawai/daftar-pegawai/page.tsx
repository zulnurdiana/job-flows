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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 6;

const page = async ({ searchParams }: any) => {
  const session = await getSession();
  if (!session || session.user.role?.toLowerCase() !== "direktur")
    redirect("/");

  const currentPage = parseInt(searchParams.page || "1");

  const daftarPegawaiPerjabatan = await prisma.jabatan.findMany({
    include: {
      divisi: true,
      pegawai: true,
    },
    orderBy: {
      divisi: {
        nama_divisi: "asc",
      },
    },
    skip: (currentPage - 1) * ITEMS_PER_PAGE,
    take: ITEMS_PER_PAGE,
  });

  const totalItems = await prisma.jabatan.count();

  const result = daftarPegawaiPerjabatan.map((jabatan, index) => ({
    id_jabatan: jabatan.id_jabatan,
    nama_jabatan: jabatan.nama_jabatan,
    nama_divisi: jabatan.divisi.nama_divisi,
    jumlah_pegawai: jabatan.pegawai.length,
    index: (currentPage - 1) * ITEMS_PER_PAGE + index + 1, // Calculate the correct index
  }));

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
            <BreadcrumbPage>Daftar Pegawai</BreadcrumbPage>
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
            {result.map((res) => (
              <TableRow
                key={res.id_jabatan}
                className="text-center even:bg-gray-50"
              >
                <TableCell className="font-bold p-4">{res.index}</TableCell>
                <TableCell className="p-4">{res.nama_jabatan}</TableCell>
                <TableCell className="p-4">{res.nama_divisi}</TableCell>
                <TableCell className="p-4">
                  {res.jumlah_pegawai} Pegawai
                </TableCell>
                <TableCell className="p-4">
                  <Button variant="outline" className="w-full">
                    <Link href={`/direktur/pegawai/${res.id_jabatan}`}>
                      Lihat Pegawai
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-center space-x-4 mt-4">
        <Pagination>
          <PaginationContent>
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious href={`?page=${currentPage - 1}`} />
              </PaginationItem>
            )}
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i + 1}>
                <PaginationLink
                  href={`?page=${i + 1}`}
                  isActive={currentPage === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationNext href={`?page=${currentPage + 1}`} />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default page;
