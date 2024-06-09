import NewPersyaratanForm from "./NewPersyaratanForm";
import prisma from "@/lib/prisma";

interface PageProps {
  params: {
    id_permintaan: string;
  };
}

const page = async ({ params: { id_permintaan } }: PageProps) => {
  const permintaanId = parseInt(id_permintaan);
  const permintaan = await prisma.permintaan.findUnique({
    where: {
      id_permintaan: permintaanId,
    },
    include: {
      jabatan: true,
    },
  });
  if (!permintaan) {
    throw new Error("Permintaan not found");
  }
  return (
    <div>
      <NewPersyaratanForm permintaan={permintaan} />
    </div>
  );
};

export default page;
