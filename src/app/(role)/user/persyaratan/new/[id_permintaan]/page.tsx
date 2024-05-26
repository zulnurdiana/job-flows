import NewPersyaratanForm from "../NewPersyaratanForm";

interface PageProps {
  params: {
    id_permintaan: string;
  };
}

const page = ({ params: { id_permintaan } }: PageProps) => {
  const permintaanId = parseInt(id_permintaan);
  return (
    <div>
      <NewPersyaratanForm id_permintaan={permintaanId} />
    </div>
  );
};

export default page;
