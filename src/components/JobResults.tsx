import JobListItem from "@/components/JobListItem";
import prisma from "@/lib/prisma";
import { jobFilterValue } from "@/lib/validation";
import { Prisma } from "@prisma/client";

interface jobResultsProps {
  filterValues: jobFilterValue;
}

const JobResults = async ({
  filterValues: { q, type, location, remote },
}: jobResultsProps) => {
  // digunakan untuk mencari searchParams contoh nya aku  aku jadi aku & aku menghapus spasi yang tidak perlu jika banyak spasi
  const searchString = q
    ?.split(" ")
    .filter((word) => word.length > 1)
    .join(" & ");

  // query or make prisma untuk mencari semua field yg diinginkan

  const searchFilter: Prisma.JobWhereInput = searchString
    ? {
        OR: [
          {
            title: {
              search: searchString,
            },
          },
          {
            companyName: {
              search: searchString,
            },
          },
          {
            type: {
              search: searchString,
            },
          },
          {
            locationType: {
              search: searchString,
            },
          },
          {
            location: {
              search: searchString,
            },
          },
          {
            title: {
              search: searchString,
            },
          },
        ],
      }
    : {};

  const where: Prisma.JobWhereInput = {
    AND: [
      searchFilter,
      type ? { type } : {},
      location ? { location } : {},
      remote ? { locationType: "Remote" } : {},
      { approved: true },
    ],
  };

  const jobList = await prisma.job.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-4 grow">
      {jobList.map((job) => (
        <JobListItem job={job} key={job.id} />
      ))}

      {jobList.length === 0 && (
        <p className="text-center text-muted-foreground font-medium">
          Search result not found, please try again
        </p>
      )}
    </div>
  );
};

export default JobResults;
