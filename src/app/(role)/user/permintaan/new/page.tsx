import getSession from "@/lib/getSession";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import NewPermintaanForm from "./NewPermintaanForm";
import prisma from "@/lib/prisma";
import { Divisi } from "@prisma/client";

export const metadata: Metadata = {
  title: "Buat Permintaan",
};

const page = async () => {
  const session = await getSession();
  if (!session) {
    redirect("/");
  }

  const jabatan = await prisma.jabatan.findMany({
    include: {
      divisi: true,
    },
  });

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      pegawai: {
        include: {
          jabatan: {
            include: {
              divisi: true,
            },
          },
        },
      },
    },
  });

  const pegawai = await prisma.pegawai.findMany({
    include: {
      jabatan: {
        include: {
          divisi: true,
        },
      },
    },
  });

  if (!pegawai) {
    return new Error("Pegawai not found");
  }

  if (!user) {
    redirect("/");
  }

  // Hilangkan duplikat divisi
  const divisiMap = new Map<number, Divisi>();
  jabatan.forEach((jab) => {
    divisiMap.set(jab.divisi.id_divisi, jab.divisi);
  });
  const divisi = Array.from(divisiMap.values());

  return (
    <div className="min-h-[400px]">
      <NewPermintaanForm
        jabatan={jabatan}
        divisi={divisi}
        user={user}
        pegawai={pegawai}
      />
    </div>
  );
};

export default page;
