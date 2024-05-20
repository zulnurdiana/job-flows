import { cache } from "react";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import DetailJobPage from "@/components/DetailJobPage";
import { Button } from "@/components/ui/button";
import getSession from "@/lib/getSession";

interface PageProps {
  params: {
    slug: string;
  };
}

const getJobs = cache(async (slug: string) => {
  const job = await prisma.job.findUnique({
    where: {
      slug,
    },
  });

  if (!job) return notFound();

  return job;
});

// Untuk membuat halaman dynamic jadi statis agar cepat loading nya
export async function generateStaticParams() {
  const jobs = await prisma.job.findMany({
    where: {
      approved: true,
    },
    select: {
      slug: true,
    },
  });

  return jobs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params: { slug },
}: PageProps): Promise<Metadata> {
  const job = await getJobs(slug);
  return {
    title: job.title,
  };
}

const page = async ({ params: { slug } }: PageProps) => {
  const job = await getJobs(slug);

  const { applicationEmail, applicationUrl } = job;

  const applicationLink = applicationEmail
    ? `mailto:${applicationEmail}`
    : applicationUrl;

  if (!applicationLink) {
    console.error("Application Doesn't Exist");
    notFound();
  }

  const session = await getSession();
  const user = session?.user;

  return (
    <main className="max-w-5xl m-auto px-3 my-10 flex flex-col sm:flex-row items-center gap-5 md:items-start">
      <DetailJobPage job={job} />
      <aside>
        {user?.role === "pelamar" && (
          <Button asChild>
            <a href={`${applicationLink}`} className="w-40 md:w-fit">
              Apply Now
            </a>
          </Button>
        )}
      </aside>
    </main>
  );
};

export default page;
