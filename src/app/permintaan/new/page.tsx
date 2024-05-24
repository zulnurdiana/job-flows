import getSession from "@/lib/getSession";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import NewPermintaanForm from "./NewPermintaanForm";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Buat Permintaan",
};

const page = async () => {
  const session = await getSession();
  if (!session) {
    redirect("/");
  }

  const jabatan = await prisma.jabatan.findMany({});
  const unapprovedPermintaan = await prisma.permintaan.findMany({
    where: {
      status_permintaan: false,
    },
  });

  return (
    <div>
      <NewPermintaanForm jabatan={jabatan} />
      {unapprovedPermintaan.map((permintaan) => (
        <div key={permintaan.id_permintaan}>{permintaan.jumlah_pegawai}</div>
      ))}
    </div>
  );
};

export default page;
