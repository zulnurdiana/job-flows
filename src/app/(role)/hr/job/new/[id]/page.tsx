import { Metadata } from "next";
import NewJobForm from "./NewJobForm";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Post a new job",
};

interface PageProps {
  params: {
    id: string;
  };
}
export default async function Page({ params: { id } }: PageProps) {
  const id_persyaratan = parseInt(id);
  const persyaratan = await prisma.persyaratan.findUnique({
    where: {
      id_persyaratan: id_persyaratan,
    },
    include: {
      permintaan: {
        include: {
          jabatan: true,
        },
      },
    },
  });

  if (!persyaratan) {
    throw new Error("Persyaratan not found");
  }

  return <NewJobForm persyaratan={persyaratan} />;
}
