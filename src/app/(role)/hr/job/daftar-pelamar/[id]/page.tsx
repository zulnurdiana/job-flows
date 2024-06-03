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

interface PageProps {
  params: {
    id: string;
  };
}

const page = async ({ params: { id } }: PageProps) => {
  const session = await getSession();
  const user = session?.user;
  if (!session) redirect("/");
  if (user?.role?.toLowerCase() !== "hr") redirect("/");

  const getPelamarPerJabatan = await prisma.user.findMany({
    include: {
      job: true,
    },
    where: {
      id_job: parseInt(id),
    },
  });

  return (
    <div className="max-w-6xl min-h-[400px] m-auto my-10 space-y-6">
      <H1 className="text-center">
        Daftar Pelamar <br />
        Jabatan {getPelamarPerJabatan[0].job?.title}
      </H1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center font-bold">No</TableHead>
            <TableHead className="text-center">Nama Pelamar</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {getPelamarPerJabatan?.map((pelamar, index) => (
            <TableRow key={pelamar.id} className="text-center">
              <TableCell className="font-bold">{index + 1}</TableCell>
              <TableCell>{pelamar.name}</TableCell>
              <TableCell>
                <Button asChild>
                  <Link href={`/hr/nilai/${pelamar.id}`}>Nilai Pelamar</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default page;
