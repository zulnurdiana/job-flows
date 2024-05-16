
import JobListItem from "@/components/JobListItem";
import H1 from "@/components/ui/h1";
import prisma from "@/lib/prisma";
import Link from "next/link";

const AdminPage = async () => {
  const unapprovedJobs = await prisma.job.findMany({
    where: {
      approved: false,
    },
  });

  return (
    <main className="max-w-5xl m-auto my-10 space-y-10 px-3">
      <H1 className="text-center">Admin Dashboard</H1>
      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-bold mb-3">Unapproved Jobs : </h2>
        {unapprovedJobs.map((job) => (
          <Link key={job.id} href={`/admin/job/${job.slug}`} className="block">
            <JobListItem job={job} />
          </Link>
        ))}
      </section>
      {unapprovedJobs.length === 0 && (
        <p className="text-center font-bold">No unapproved jobs found</p>
      )}
    </main>
  );
};

export default AdminPage;
