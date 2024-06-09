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

  return (
    <main className="max-w-5xl m-auto px-3 my-4 space-y-5 flex flex-col sm:flex-row justify-between items-center gap-5 md:items-start">
      <div className="flex flex-col gap-5">
        {role?.toLowerCase() === "hr" ||
        role?.toLowerCase() === "user" ||
        role?.toLowerCase() === "pelamar" ||
        !session ? (
          <>
            <Breadcrumb>
              <BreadcrumbList>
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
        <DetailJobPage job={job} />
      </div>

      <aside>
        {session && user?.role === "pelamar" ? (
          checkJabatanPending?.id_job === null ? (
            <ButtonLamar id_job={job.id} />
          ) : (
            <Button>Anda sudah melamar</Button>
          )
        ) : null}
      </aside>
    </main>
  );
};

export default page;
