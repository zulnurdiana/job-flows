"use client";
import React from "react";
import {
  approvedPermintaan,
  deletePermintaan,
} from "../../user/permintaan/new/actions";
import { toast } from "@/components/ui/use-toast";
import { Permintaan } from "@prisma/client";
import FormSubmitButton from "@/components/FormSubmitButton";

interface PageButtonPermintaanProps {
  permintaan: Permintaan;
}

const ButtonPermintaan = ({ permintaan }: PageButtonPermintaanProps) => {
  return (
    <>
      <AccPermintaan id_permintaan={permintaan.id_permintaan} />
      <RejectPermintaan id_permintaan={permintaan.id_permintaan} />
    </>
  );
};

interface PermintaanProps {
  id_permintaan: number;
}

function AccPermintaan({ id_permintaan }: PermintaanProps) {
  async function actionClient(formData: FormData) {
    // Prevents default form submission

    const result = await approvedPermintaan(formData);

    if (!result?.error) {
      toast({
        title: "Success",
        description: `${result?.message}`,
      });
    }
  }

  return (
    <form action={actionClient}>
      <input
        type="hidden"
        id="id_permintaan"
        name="id_permintaan"
        value={id_permintaan}
      />
      <FormSubmitButton className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600">
        Approved
      </FormSubmitButton>
    </form>
  );
}

function RejectPermintaan({ id_permintaan }: PermintaanProps) {
  async function clientAction(formData: FormData) {
    const result = await deletePermintaan(formData);
    if (!result?.error) {
      toast({
        title: "Success",
        description: result?.message,
      });
    }
  }
  return (
    <form action={clientAction}>
      <input
        hidden
        id="id_permintaan"
        name="id_permintaan"
        value={id_permintaan}
      />
      <FormSubmitButton className="w-full bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600">
        Rejected
      </FormSubmitButton>
    </form>
  );
}

export default ButtonPermintaan;
