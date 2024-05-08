import JobFilterSidebar from "@/components/JobFilterSidebar";
import JobResults from "@/components/JobResults";
import H1 from "@/components/ui/h1";
import { jobFilterValue } from "@/lib/validation";
import { Metadata } from "next";

interface pageProps {
  searchParams: {
    // string semu kerena search params harus string
    q?: string;
    type?: string;
    location?: string;
    remote?: string;
  };
}

// Digunakan untuk mengenerate title
function generateTitle({ q, type, location, remote }: jobFilterValue) {
  const titlePrefix = q
    ? `${q} Jobs`
    : type
      ? `${type} Developer Jobs`
      : remote
        ? "Remote Developer Jobs"
        : "All Developer Jobs";
  const titleSuffix = location ? `in ${location}` : "";
  return `${titlePrefix} ${titleSuffix}`;
}

// Digunakan untuk mengenerate metadata
export function generateMetadata({
  searchParams: { q, type, location, remote },
}: pageProps): Metadata {
  return {
    title: `${generateTitle({ q, type, location, remote: remote === "true" })} | Job Flows`,
  };
}

export default async function Home({
  searchParams: { q, type, location, remote },
}: pageProps) {
  const filterValues: jobFilterValue = {
    q,
    type,
    location,
    remote: remote === "true",
  };
  return (
    <main className="max-w-5xl m-auto px-3 my-10 space-y-10">
      <div className="space-y-5 text-center">
        <H1>{generateTitle(filterValues)}</H1>
        <p className="text-muted-foreground text-xl">Find your dream jobs</p>
      </div>
      <section className="flex flex-col md:flex-row gap-4">
        <JobFilterSidebar defaultValues={filterValues} />
        <JobResults filterValues={filterValues} />
      </section>
    </main>
  );
}
