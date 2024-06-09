"use client";
import FormSubmitButton from "@/components/FormSubmitButton";
import { Job } from "@prisma/client";
import { approvedSubmission, deleteJob } from "./actions";
import { toast } from "@/components/ui/use-toast";

interface AdminSideBarProps {
  job: Job;
}
const AdminSideBar = ({ job }: AdminSideBarProps) => {
  return (
    <aside className="flex w-[200px] flex-none flex-row md:flex-col items-center gap-2 md:items-stretch">
      <ApproveSubmissionButton jobId={job.id} />

      <DeletedJobButton jobId={job.id} />
    </aside>
  );
};

interface adminButtonProps {
  jobId: number;
}

function ApproveSubmissionButton({ jobId }: adminButtonProps) {
  // Digunakan karena agar progressive enchanment ketika js dimatikan
  async function actionClient(formData: FormData) {
    const result = await approvedSubmission(formData);

    if (result) {
      toast({
        title: "Berhasil",
        description: result?.message,
      });
    }
  }
  return (
    <form action={actionClient} className="space-y-1">
      <input hidden id="jobId" name="jobId" value={jobId} />
      <FormSubmitButton className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600">
        Approve
      </FormSubmitButton>
    </form>
  );
}

function DeletedJobButton({ jobId }: adminButtonProps) {
  // Digunakan karena agar progressive enchanment ketika js dimatikan
  async function actionClient(formData: FormData) {
    const result = await deleteJob(formData);

    if (result) {
      toast({
        title: "Berhasil",
        description: result?.message,
      });
    }
  }

  return (
    <form action={actionClient} className="space-y-1">
      <input hidden id="jobId" name="jobId" value={jobId} />
      <FormSubmitButton className="w-full bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600">
        Delete
      </FormSubmitButton>
    </form>
  );
}

export default AdminSideBar;
