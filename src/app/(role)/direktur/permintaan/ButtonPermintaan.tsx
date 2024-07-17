"use client";
import React from "react";
import {
  approvedPermintaan,
  deletePermintaan,
} from "../../user/permintaan/new/actions";
import { toast } from "@/components/ui/use-toast";
import { Permintaan } from "@prisma/client";
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

interface PageButtonPermintaanProps {
  permintaan: Permintaan;
}

const ButtonPermintaan = ({ permintaan }: PageButtonPermintaanProps) => {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full bg-green-500 text-white py-2 px-2 rounded hover:bg-green-600">
            Approved
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Approved Direktur</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menyetujui permintaan ini?
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <form action={AccPermintaan} className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <input
                  hidden
                  id="id_permintaan"
                  name="id_permintaan"
                  value={permintaan.id_permintaan}
                />
                <Label htmlFor="jumlah" className="text-center">
                  Jumlah
                </Label>
                <Input
                  id="jumlah"
                  name="jumlah"
                  defaultValue={permintaan.jumlah_pegawai}
                  className="col-span-3"
                  type="number"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="alasan" className="text-center">
                  Alasan
                </Label>
                <Textarea id="alasan" name="alasan" className="col-span-3" />
              </div>
              <DialogFooter>
                <FormSubmitButton className="mt-10 w-full bg-green-500 text-white py-2 px-2 rounded hover:bg-green-600">
                  Approved
                </FormSubmitButton>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </Dialog>

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
            <form action={RejectPermintaan} className="space-y-4">
              <input
                hidden
                id="id_permintaan"
                name="id_permintaan"
                value={permintaan.id_permintaan}
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

interface PermintaanProps {
  id_permintaan: number;
}

async function AccPermintaan(formData: FormData) {
  const result = await approvedPermintaan(formData);

  if (!result?.error) {
    toast({
      title: "Success",
      description: `${result?.message}`,
    });
  }
}
async function RejectPermintaan(formData: FormData) {
  const result = await deletePermintaan(formData);

  if (!result?.error) {
    toast({
      title: "Success",
      description: `${result?.message}`,
    });
  }
}

export default ButtonPermintaan;
