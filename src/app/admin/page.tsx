import H1 from "@/components/ui/h1";
import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import JobListItem from "@/components/JobListItem";
import Link from "next/link";

const page = async () => {
  const session = await getSession();
  const user = session?.user;

  if (!session) {
    redirect("/");
  }

  const unapprovedJobs = await prisma.job.findMany({
    where: {
      approved: false,
    },
  });

  return (
    <div className="max-w-5xl m-auto my-10 space-y-5">
      <H1 className="text-center text-xl font-bold">Halaman admin</H1>

      {user?.role !== "admin" ? (
        <p className="text-center">Anda bukan admin</p>
      ) : (
        <div className="space-y-5">
          {unapprovedJobs.map((job) => (
            <Link
              href={`/admin/job/${job.slug}`}
              key={job.id}
              className="block"
            >
              <JobListItem job={job} />
            </Link>
          ))}
          {unapprovedJobs.length === 0 && (
            <p className="text-center">Tidak ada job</p>
          )}
        </div>
      )}
    </div>
  );
};

export default page;
