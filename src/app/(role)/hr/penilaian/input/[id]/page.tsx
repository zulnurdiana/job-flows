import prisma from "@/lib/prisma";
import NewPenilaianForm from "./NewPenilaianForm";

interface PageProps {
  params: {
    id: string;
  };
}

const page = async ({ params: { id } }: PageProps) => {
  const pelamar = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  const jabatan = await prisma.job.findUnique({
    where: {
      id: pelamar?.id_job || 0,
    },
  });

  const jabatanTitle = jabatan?.title || "";

  if (!pelamar) return null;

  return (
    <div>
      <NewPenilaianForm user={pelamar} jabatan={jabatanTitle} />
    </div>
  );
};

export default page;
