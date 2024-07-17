import { cache } from "react";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { Metadata } from "next";
import DetailJobPage from "@/components/DetailJobPage";
import getSession from "@/lib/getSession";
import ButtonLamar from "./ButtonLamar";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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
  const session = await getSession();
  const role = session?.user.role;
  let checkJabatanPending;
  const user = session?.user;
  if (!session) {
    checkJabatanPending = null;
  } else {
    checkJabatanPending = await prisma.user.findUnique({
      where: {
        id: user?.id as string,
      },
    });
  }

  const job = await getJobs(slug);

  const { applicationEmail, applicationUrl } = job;

  const applicationLink = applicationEmail
    ? `mailto:${applicationEmail}`
    : applicationUrl;

  if (!applicationLink) {
    console.error("Application Doesn't Exist");
    notFound();
  }

  const isExpired = new Date(job.tanggal_selesai) < new Date();

  return (
    <main className="max-w-5xl m-auto px-3 my-4 space-y-8 flex flex-col sm:flex-col justify-between items-center md:items-start">
      {role?.toLowerCase() === "hr" ||
      role?.toLowerCase() === "user" ||
      role?.toLowerCase() === "pelamar" ||
      !session ? (
        <>
          <Breadcrumb className="bg-gray-100 p-4 rounded-lg w-full">
            <BreadcrumbList className="flex space-x-2 text-gray-600">
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Detail Lowongan {job.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </>
      ) : null}

      <aside className="flex flex-col space-y-16">
        <DetailJobPage job={job} />
        {session && user?.role === "pelamar" ? (
          isExpired ? (
            <div className="w-full text-center">
              <Button>Lowongan sudah ditutup</Button>
            </div>
          ) : checkJabatanPending?.id_job === null ? (
            <div className="text-center">
              <ButtonLamar id_job={job.id} />
            </div>
          ) : (
            <div className="w-full text-center">
              <Button>Anda sudah melamar</Button>
            </div>
          )
        ) : null}
      </aside>
    </main>
  );
};

export default page;
