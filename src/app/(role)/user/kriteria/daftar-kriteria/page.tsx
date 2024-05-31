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
import H1 from "@/components/ui/h1";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { deleteKriteria } from "../actions";
import FormSubmitButton from "@/components/FormSubmitButton";

const page = async () => {
  const session = await getSession();
  const user = session?.user;
  if (!session) redirect("/");
  if (user?.role?.toLowerCase() !== "user") redirect("/");

  const kriteriaList = await prisma.kriteria.findMany({
    orderBy: [{ updatedAt: "desc" }],
  });

  return (
    <div className="max-w-5xl m-auto my-10 space-y-5 min-h-[400px]">
      <H1 className="text-center">Daftar Kriteria Penilaian</H1>
      <Button asChild>
        <Link href={"/user/kriteria/new"}>Tambah Kriteria</Link>
      </Button>
      {kriteriaList.length === 0 ? (
        <div className="text-center">Tidak ada daftar kriteria</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center font-bold">No</TableHead>
              <TableHead className="text-center">Nama Kriteria</TableHead>
              <TableHead className="text-center">Deskripsi Kriteria</TableHead>
              <TableHead className="text-center">Bobot</TableHead>
              <TableHead className="text-center">Jenis Kriteria</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {kriteriaList.map((kriteria, index) => (
              <TableRow key={kriteria.id_kriteria} className="text-center">
                <TableCell>{index + 1}</TableCell>
                <TableCell>{kriteria.nama_kriteria}</TableCell>
                <TableCell>{kriteria.deskripsi_kriteria}</TableCell>
                <TableCell>{kriteria.bobot}</TableCell>
                <TableCell>{kriteria.jenis_kriteria}</TableCell>
                <TableCell className="flex items-center gap-3 justify-center">
                  <Button asChild>
                    <Link href={`/user/kriteria/${kriteria.id_kriteria}`}>
                      Update
                    </Link>
                  </Button>
                  <form action={deleteKriteria}>
                    <input
                      hidden
                      id="id_kriteria"
                      name="id_kriteria"
                      value={kriteria.id_kriteria}
                    />
                    <FormSubmitButton className="w-full bg-white border-2 font-bold text-red-500 hover:text-white">
                      Delete
                    </FormSubmitButton>
                  </form>
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
