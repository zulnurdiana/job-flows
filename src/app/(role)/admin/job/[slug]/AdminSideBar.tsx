"use client";
import FormSubmitButton from "@/components/FormSubmitButton";
import { Job } from "@prisma/client";
import { approvedSubmission, deleteJob } from "./actions";

interface AdminSideBarProps {
  job: Job;
}
const AdminSideBar = ({ job }: AdminSideBarProps) => {
  return (
    <aside className="flex w-[200px] flex-none flex-row md:flex-col items-center gap-2 md:items-stretch">
      {job.approved ? (
        <span className="text-green-500 text-lg font-bold">Approved</span>
      ) : (
        <ApproveSubmissionButton jobId={job.id} />
      )}
      <DeletedJobButton jobId={job.id} />
    </aside>
  );
};

interface adminButtonProps {
  jobId: number;
}

function ApproveSubmissionButton({ jobId }: adminButtonProps) {
  // Digunakan karena agar progressive enchanment ketika js dimatikan
  return (
    <form action={approvedSubmission} className="space-y-1">
      <input hidden id="jobId" name="jobId" value={jobId} />
      <FormSubmitButton className="w-full text-green-500 hover:text-green-600">
        Approve
      </FormSubmitButton>
    </form>
  );
}

function DeletedJobButton({ jobId }: adminButtonProps) {
  // Digunakan karena agar progressive enchanment ketika js dimatikan

  return (
    <form action={deleteJob} className="space-y-1">
      <input hidden id="jobId" name="jobId" value={jobId} />
      <FormSubmitButton className="w-full text-red-500 hover:text-red-600">
        Deleted
      </FormSubmitButton>
    </form>
  );
}

export default AdminSideBar;
