import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import prisma from "@/lib/prisma";
import FormSubmitButton from "@/components/FormSubmitButton";
import {
  approvedPermintaan,
  deletePermintaan,
} from "../../user/permintaan/new/actions";
import H1 from "@/components/ui/h1";

const page = async () => {
  const session = await getSession();
  const user = session?.user;

  if (!session || user?.role !== "direktur") {
    redirect("/");
  }

  const unapprovedPermintaan = await prisma.permintaan.findMany({
    where: {
      approved: false,
    },
    include: {
      jabatan: {
        include: {
          divisi: true,
        },
      },
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const appPermintaan = await prisma.permintaan.findMany({
    where: {
      approved: true,
    },
  });

  return (
    <div className="max-w-5xl m-auto my-10 space-y-6 min-h-[400px]">
      <H1 className="text-center">Daftar Permintaan Pegawai</H1>

      {unapprovedPermintaan.length !== 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center font-bold">No</TableHead>
              <TableHead className="text-center">Jabatan</TableHead>
              <TableHead className="text-center">Divisi</TableHead>
              <TableHead className="text-center">Jumlah Permintaan</TableHead>
              <TableHead className="text-center">Tanggal Permintaan</TableHead>
              <TableHead className="text-center">Nama Peminta</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {unapprovedPermintaan.map((permintaan, index) => (
              <TableRow key={permintaan.id_permintaan} className="text-center">
                <TableCell className="font-bold">{index + 1}</TableCell>
                <TableCell>{permintaan.jabatan.nama_jabatan}</TableCell>
                <TableCell>{permintaan.jabatan.divisi.nama_divisi}</TableCell>
                <TableCell>{permintaan.jumlah_pegawai} Pegawai</TableCell>

                <TableCell className="text-center">
                  {permintaan.tanggal_permintaan.toLocaleDateString()}
                </TableCell>

                <TableCell>{permintaan.user.name}</TableCell>
                <TableCell>
                  <div className="flex gap-3 items-center">
                    <form action={approvedPermintaan}>
                      <input
                        hidden
                        id="id_permintaan"
                        name="id_permintaan"
                        value={permintaan.id_permintaan}
                      />
                      <FormSubmitButton className="w-full bg-white border-2 text-green-500 hover:text-white font-bold">
                        Approved
                      </FormSubmitButton>
                    </form>
                    <form action={deletePermintaan}>
                      <input
                        hidden
                        id="id_permintaan"
                        name="id_permintaan"
                        value={permintaan.id_permintaan}
                      />
                      <FormSubmitButton className="w-full bg-white border-2 font-bold text-red-500 hover:text-white">
                        Rejected
                      </FormSubmitButton>
                    </form>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="text-center">Tidak ada permintaan yang pending</p>
      )}
    </div>
  );
};

export default page;
