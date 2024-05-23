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

  const jabatan = await getJabatan();

  return (
    <div className="m-auto max-w-5xl my-10">
      <NewPermintaanForm />
    </div>
  );
};

export default page;
