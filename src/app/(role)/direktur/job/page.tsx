import H1 from "@/components/ui/h1";
import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import JobListItem from "@/components/JobListItem";
import Link from "next/link";
import { Metadata } from "next";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export const metadata: Metadata = {
  title: "Halaman Admin",
};

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
    <div className="max-w-5xl m-auto my-4 space-y-5 min-h-[400px]">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Daftar Lowongan</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <H1 className="text-center text-lg font-bold">
        Daftar Pembukaan Lowongan
      </H1>

      {user?.role !== "direktur" ? (
        <p className="text-center">Anda bukan Direktur</p>
      ) : (
        <div className="space-y-5">
          {unapprovedJobs.map((job) => (
            <Link
              href={`/direktur/job/${job.slug}`}
              key={job.id}
              className="block"
            >
              <JobListItem job={job} />
            </Link>
          ))}
          {unapprovedJobs.length === 0 && (
            <p className="text-center mt-44">
              Tidak ada daftar lowongan yang pending
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default page;
