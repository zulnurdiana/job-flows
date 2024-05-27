import DetailJobPage from "@/components/DetailJobPage";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import AdminSideBar from "./AdminSideBar";

interface PageProps {
  params: {
    slug: string;
  };
}

const page = async ({ params: { slug } }: PageProps) => {
  const job = await prisma.job.findUnique({
    where: {
      slug,
    },
  });

  if (!job) notFound();

  return (
    <main className="max-w-5xl m-auto my-10 space-y-10 flex flex-col items-center gap-5 md:flex-row md:items-start">
      <DetailJobPage job={job} />
      <AdminSideBar job={job} />
    </main>
  );
};

export default page;
