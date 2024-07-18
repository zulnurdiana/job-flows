"use client";
import React from "react";
import {
  approvedPermintaan,
  deletePermintaan,
} from "../../user/permintaan/new/actions";
import { toast } from "@/components/ui/use-toast";
import FormSubmitButton from "@/components/FormSubmitButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Keputusan } from "@prisma/client";
import { accKeputusan, tolakKeputusan } from "./action";

interface PageButtonKeputusanProps {
  keputusan: Keputusan;
}

const ButtonKeputusan = ({ keputusan }: PageButtonKeputusanProps) => {
  return (
    <>
      <ApprovedKeputusan id_keputusan={keputusan.id_keputusan} />

      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full bg-red-500 text-white py-2 px-2 rounded hover:bg-red-600">
            Rejected
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Rejected Direktur</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin mereject permintaan ini?
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <form action={RejectKeputusan} className="space-y-4">
              <input
                hidden
                id="id_keputusan"
                name="id_keputusan"
                value={keputusan.id_keputusan}
              />

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="alasan" className="text-center">
                  Alasan
                </Label>
                <Textarea id="alasan" name="alasan" className="col-span-3" />
              </div>
              <DialogFooter>
                <FormSubmitButton className="mt-10 w-full bg-red-500 text-white py-2 px-2 rounded hover:bg-red-600">
                  Rejected
                </FormSubmitButton>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

interface KeputusanProps {
  id_keputusan: number;
}

async function RejectKeputusan(formData: FormData) {
  const result = await tolakKeputusan(formData);

  if (!result?.error) {
    toast({
      title: "Success",
      description: `${result?.message}`,
    });
  }
}

function ApprovedKeputusan({ id_keputusan }: KeputusanProps) {
  // Digunakan karena agar progressive enchanment ketika js dimatikan
  async function actionClient(formData: FormData) {
    const result = await accKeputusan(formData);

    if (!result?.error) {
      toast({
        title: "Success",
        description: `${result?.message}`,
      });
    }
  }

  return (
    <form action={actionClient} className="space-y-1">
      <input
        hidden
        id="id_keputusan"
        name="id_keputusan"
        value={id_keputusan}
      />
      <FormSubmitButton className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
        Approve
      </FormSubmitButton>
    </form>
  );
}

export default ButtonKeputusan;
