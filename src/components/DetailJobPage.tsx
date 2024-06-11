import { Job } from "@prisma/client";
import Image from "next/image";
import { Banknote, Briefcase, Globe2, MapPin, Clock } from "lucide-react";
import { formatDateTime, formatMoney } from "@/lib/utils";
import Link from "next/link";
import Markdown from "./Markdown";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import getSession from "@/lib/getSession";

interface DetailJobPageProps {
  job: Job;
}

const DetailJobPage = async ({
  job: {
    title,
    type,
    locationType,
    companyName,
    companyLogoUrl,
    location,
    salary,
    description,
    applicationUrl,
    applicationEmail,
    tanggal_mulai,
    tanggal_selesai,
  },
}: DetailJobPageProps) => {
  const session = await getSession();
  const role = session?.user.role;
  const isExpired = new Date(tanggal_selesai) < new Date();

  return (
    <section className="w-full grow space-y-5 ">
      {session && role?.toLowerCase() === "direktur" && (
        <>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/direktur/job">
                  Daftar Lowongan
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </>
      )}

      <div className="flex items-center gap-3">
        {companyLogoUrl && (
          <Image
            src={companyLogoUrl}
            alt="company logo"
            width={100}
            height={100}
            className="rounded-lg"
          />
        )}
        <div>
          <h1 className="text-xl font-bold">{title}</h1>
          <p>
            {applicationUrl ? (
              <Link href={new URL(applicationUrl).origin}>{companyName}</Link>
            ) : (
              <span className="text-green-500">{companyName}</span>
            )}
          </p>
          <div className="flex-grow space-y-3">
            <div className="text-muted-foreground">
              <p className="flex items-center gap-1.5">
                <Briefcase className="shrink-0" size={16} /> {type}
              </p>
              <p className="flex items-center gap-1.5 ">
                <MapPin className="shrink-0" size={16} /> {locationType}
              </p>
              <p className="flex items-center gap-1.5 ">
                <Globe2 className="shrink-0" size={16} />{" "}
                {location || "Worldwide"}
              </p>
              <p className="flex items-center gap-1.5 ">
                <Banknote className="shrink-0" size={16} />{" "}
                {formatMoney(salary)}
              </p>
              <p className="flex items-center gap-1.5 ">
                <Clock className="shrink-0" size={16} />{" "}
                {formatDateTime(tanggal_selesai).dateOnly}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div>{description && <Markdown>{description}</Markdown>}</div>
    </section>
  );
};

export default DetailJobPage;
