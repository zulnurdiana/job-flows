"use client";
import FormSubmitButton from "@/components/FormSubmitButton";
import { Job } from "@prisma/client";
import { approvedSubmission, deleteJob } from "./actions";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface AdminSideBarProps {
  job: Job;
}
const AdminSideBar = ({ job }: AdminSideBarProps) => {
  return (
    <>
      <aside className="flex w-[200px] flex-none flex-row md:flex-col items-center gap-2 md:items-stretch">
        <ApproveSubmissionButton jobId={job.id} />

        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full bg-red-500 text-white py-2 px-2 rounded hover:bg-red-600">
              Rejected
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rejected Submission</DialogTitle>
              <DialogDescription>
                Apakah Anda yakin ingin mereject lowongan ini?
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <form action={RejectSubmission} className="space-y-4">
                <input hidden id="jobId" name="jobId" value={job.id} />

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="alasan" className="text-center">
                    Alasan
                  </Label>
                  <Textarea id="alasan" name="alasan" className="col-span-3" />
                </div>
                <DialogFooter>
                  <FormSubmitButton className="mt-5 w-full bg-red-500 text-white py-2 px-2 rounded hover:bg-red-600">
                    Rejected
                  </FormSubmitButton>
                </DialogFooter>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      </aside>
    </>
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
      <FormSubmitButton className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
        Approve
      </FormSubmitButton>
    </form>
  );
}

async function RejectSubmission(formData: FormData) {
  const result = await deleteJob(formData);

  if (result) {
    toast({
      title: "Berhasil",
      description: result?.message,
    });
  }
}

export default AdminSideBar;
