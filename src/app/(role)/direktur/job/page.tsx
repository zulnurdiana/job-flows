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
    <div className="max-w-5xl m-auto my-4 px-4 space-y-5 min-h-[400px]">
      <Breadcrumb className="bg-gray-100 p-4 rounded-lg">
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

      <div className="text-center">
        <H1>Daftar Pembukaan Lowongan</H1>
      </div>

      {user?.role === "direktur" ? (
        <div className="space-y-5">
          {unapprovedJobs.length > 0 ? (
            unapprovedJobs.map((job) => (
              <Link
                href={`/direktur/job/${job.slug}`}
                key={job.id}
                className="block"
              >
                <JobListItem job={job} />
              </Link>
            ))
          ) : (
            <p className="text-center">
              Tidak ada daftar lowongan yang pending
            </p>
          )}
        </div>
      ) : (
        <p className="text-center">Anda bukan Direktur</p>
      )}
    </div>
  );
};

export default page;
