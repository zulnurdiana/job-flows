import JobListItem from "@/components/JobListItem";
import prisma from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { JobFilterValues } from "@/lib/validation";
import { Prisma } from "@prisma/client";
import Link from "next/link";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface jobResultsProps {
  filterValues: JobFilterValues;
  page?: number;
}

const JobResults = async ({ filterValues, page = 1 }: jobResultsProps) => {
  const { q, type, location, remote } = filterValues;

  const jobsPerPage = 6;
  const skip = (page - 1) * jobsPerPage;

  const searchString = q
    ?.split(" ")
    .filter((word) => word.length > 1)
    .join(" & ");

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

  const jobPromise = prisma.job.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
    take: jobsPerPage,
    skip,
  });

  const countPromise = prisma.job.count({ where });

  const [jobs, totalResults] = await Promise.all([jobPromise, countPromise]);

  return (
    <div className="space-y-4 grow">
      {jobs.map((job) => (
        <Link key={job.id} href={`/job/${job.slug}`} className="block">
          <JobListItem job={job} />
        </Link>
      ))}

      {jobs.length === 0 && (
        <p className="text-center text-muted-foreground font-medium">
          Search result not found, please try again
        </p>
      )}

      {jobs.length > 0 && (
        <CustomPagination
          currentPage={page}
          totalPages={Math.ceil(totalResults / jobsPerPage)}
          filterValues={filterValues}
        />
      )}
    </div>
  );
};

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  filterValues: JobFilterValues;
}

function CustomPagination({
  currentPage,
  totalPages,
  filterValues: { q, type, location, remote },
}: PaginationProps) {
  function generatePageLink(page: number) {
    const searchParams = new URLSearchParams({
      ...(q && { q }),
      ...(type && { type }),
      ...(location && { location }),
      ...(remote && { remote: "true" }),
      page: page.toString(),
    });

    return `/?${searchParams.toString()}`;
  }

  const pageLinks = [];
  for (let i = 1; i <= totalPages; i++) {
    pageLinks.push(
      <PaginationItem key={i}>
        <PaginationLink href={generatePageLink(i)} isActive={i === currentPage}>
          {i}
        </PaginationLink>
      </PaginationItem>,
    );
  }

  return (
    <Pagination>
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious href={generatePageLink(currentPage - 1)} />
          </PaginationItem>
        )}
        {pageLinks}
        {currentPage < totalPages && (
          <>
            {currentPage < totalPages - 1 && <PaginationEllipsis />}
            <PaginationItem>
              <PaginationNext href={generatePageLink(currentPage + 1)} />
            </PaginationItem>
          </>
        )}
      </PaginationContent>
    </Pagination>
  );
}

export default JobResults;
