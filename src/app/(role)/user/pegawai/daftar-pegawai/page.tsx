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

const ITEM_PER_PAGE = 5;

const page = async ({ searchParams }: any) => {
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

  if (!session || session.user.role?.toLowerCase() !== "user") {
    redirect("/");
  }

  const currentPage = parseInt(searchParams.page || "1");

  const id_divisi = user?.pegawai?.jabatan.id_divisi;
  const nama_divisi = await prisma.divisi.findUnique({
    where: {
      id_divisi: id_divisi,
    },
    select: {
      nama_divisi: true,
    },
  });

  const totalItems = await prisma.jabatan.count({
    where: {
      id_divisi: id_divisi,
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
    skip: (currentPage - 1) * ITEM_PER_PAGE,
    take: ITEM_PER_PAGE,
  });

  const totalPages = Math.ceil(totalItems / ITEM_PER_PAGE);

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
        Daftar Pegawai Untuk Divisi <br />
        {nama_divisi?.nama_divisi}
      </H1>

      <div className="bg-white shadow overflow-hidden rounded-lg">
        <Table className="min-w-full bg-white">
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="text-center font-bold p-4">No</TableHead>
              <TableHead className="text-center p-4">Jabatan</TableHead>
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
                <TableCell className="font-bold p-4">
                  {(currentPage - 1) * ITEM_PER_PAGE + index + 1}
                </TableCell>
                <TableCell className="p-4">{res.nama_jabatan}</TableCell>
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
