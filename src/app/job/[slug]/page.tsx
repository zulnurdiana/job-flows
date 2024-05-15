import { cache } from "react";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";

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
  return <div>{job?.title}</div>;
};

export default page;
