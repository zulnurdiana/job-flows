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

  return (
    <div className="min-h-[400px]">
      <NewPermintaanForm jabatan={jabatan} />
    </div>
  );
};

export default page;
