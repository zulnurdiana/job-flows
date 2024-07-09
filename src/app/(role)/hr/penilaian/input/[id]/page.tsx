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

  const pendidikan = await prisma.profile.findUnique({
    where: {
      id_user: pelamar?.id,
    },
    select: {
      pendidikan: true,
    },
  });

  const jabatanTitle = jabatan?.title || "";
  const pendidikanTitle = pendidikan?.pendidikan || "";

  if (!pelamar) return null;

  return (
    <div>
      <NewPenilaianForm
        user={pelamar}
        jabatan={jabatanTitle}
        pendidikan={pendidikanTitle}
      />
    </div>
  );
};

export default page;
