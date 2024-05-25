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

const page = async () => {
  const session = await getSession();
  const user = session?.user;

  if (!session) {
    redirect("/");
  }

  const unapprovedPermintaan = await prisma.permintaan.findMany({
    where: {
      status_permintaan: false,
    },
    include: {
      jabatan: true,
      user: true,
    },
  });

  return (
    <div className="max-w-5xl m-auto my-10 space-y-5">
      {user?.role?.toLocaleLowerCase() !== "direktur" ? (
        <span className="text-center">
          Anda tidak diizinkan mengakses halaman ini
        </span>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Jumlah Pegawai</TableHead>
              <TableHead>Jabatan</TableHead>
              <TableHead>Tanggal Permintaan</TableHead>
              <TableHead>Nama Peminta</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {unapprovedPermintaan.map((permintaan) => (
              <TableRow key={permintaan.id_permintaan}>
                <TableCell className="font-medium">
                  {permintaan.jumlah_pegawai}
                </TableCell>
                <TableCell>{permintaan.jabatan.nama_jabatan}</TableCell>
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
                      <FormSubmitButton className="w-full text-green-500 hover:text-green-600">
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
                      <FormSubmitButton className="w-full text-red-500 hover:text-red-600">
                        Deleted
                      </FormSubmitButton>
                    </form>
                  </div>
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
