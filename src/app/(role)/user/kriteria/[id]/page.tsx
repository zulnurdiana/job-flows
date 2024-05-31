import prisma from "@/lib/prisma";
import UpdateKriteriaForm from "./UpdateKriteriaForm";

interface PageProps {
  params: {
    id: string;
  };
}

const page = async ({ params: { id } }: PageProps) => {
  const singleKriteria = await prisma.kriteria.findUnique({
    where: {
      id_kriteria: parseInt(id),
    },
  });
  if (!singleKriteria) throw new Error("Kriteria not found");

  return <UpdateKriteriaForm kriteria={singleKriteria} />;
};

export default page;
