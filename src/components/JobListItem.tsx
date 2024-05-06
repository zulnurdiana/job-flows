import { Job } from "@prisma/client";
import Image from "next/image";
import companyLogoPlaceHolder from "@/assets/company-logo-placeholder.png";
import { Banknote, Briefcase, Clock, Globe2, MapPin } from "lucide-react";
import { formatMoney, relativeDate } from "@/lib/utils";
import Badge from "./Badge";

interface JobListProps {
  job: Job;
}

const JobListItem = ({
  job: {
    title,
    type,
    locationType,
    companyName,
    companyLogoUrl,
    salary,
    location,
    createdAt,
  },
}: JobListProps) => {
  return (
    <article className="flex cursor-pointer gap-3 border p-5 rounded-lg hover:bg-muted/60">
      <Image
        src={companyLogoUrl || companyLogoPlaceHolder}
        alt={`${companyName} logo`}
        width={100}
        height={100}
        className="rounded-lg self-center"
      />
      <div className="flex-grow space-y-3 ">
        <div>
          <h2 className="text-xl font-medium">{title}</h2>
          <p className="text-muted-foreground">{companyName}</p>
        </div>
        <div className="text-muted-foreground">
          <p className="flex items-center gap-1.5 sm:hidden">
            <Briefcase className="shrink-0" size={16} /> {type}
          </p>
          <p className="flex items-center gap-1.5 ">
            <MapPin className="shrink-0" size={16} /> {locationType}
          </p>
          <p className="flex items-center gap-1.5 ">
            <Globe2 className="shrink-0" size={16} /> {location || "Worldwide"}
          </p>
          <p className="flex items-center gap-1.5 ">
            <Banknote className="shrink-0" size={16} /> {formatMoney(salary)}
          </p>
          <p className="flex items-center gap-1.5 sm:hidden">
            <Clock className="shrink-0" size={16} /> {relativeDate(createdAt)}
          </p>
        </div>
      </div>
      <div className="hidden sm:flex flex-col shrink-0 items-end justify-between">
        <Badge>{type}</Badge>
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <Clock size={16} />
          {relativeDate(createdAt)}
        </span>
      </div>
    </article>
  );
};

export default JobListItem;
