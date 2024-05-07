import JobFilterSidebar from "@/components/JobFilterSidebar";
import JobListItem from "@/components/JobListItem";
import prisma from "@/lib/prisma";

export default async function Home() {
  const jobList = await prisma.job.findMany({
    where: {
      approved: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="max-w-5xl m-auto px-3 my-10 space-y-10">
      <div className="space-y-5 text-center">
        <h2 className="text-2xl font-bold tracking-tighter xl:text-5xl space-y-4">
          Developer Jobs Here
        </h2>
        <p className="text-muted-foreground text-xl">Find your dream jobs 🔎</p>
      </div>
      <section className="flex flex-col md:flex-row gap-4">
        <JobFilterSidebar />
        <div className="space-y-4 grow">
          {jobList.map((job) => (
            <JobListItem job={job} key={job.id} />
          ))}
        </div>
      </section>
    </main>
  );
}
