"use client";
import React from "react";
import { approvedScreening, rejectedScreening } from "./action";
import { toast } from "@/components/ui/use-toast";
import FormSubmitButton from "@/components/FormSubmitButton";
import { User } from "@prisma/client";

interface PageButtonScreeningProps {
  user: User;
}

const ButtonScreening = ({ user }: PageButtonScreeningProps) => {
  return (
    <div className="flex items-center gap-2">
      <AccScreening id_user={user.id} />
      <RejectScreening id_user={user.id} />
    </div>
  );
};

interface ScreeningProps {
  id_user: string;
}

function AccScreening({ id_user }: ScreeningProps) {
  async function actionClient(formData: FormData) {
    const result = await approvedScreening(formData);
    if (!result?.error) {
      toast({
        title: "Success",
        description: `${result?.message}`,
      });
    }
  }
  return (
    <form action={actionClient}>
      <input type="hidden" name="id_user" id="id_user" value={id_user} />
      <FormSubmitButton className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600">
        Approved
      </FormSubmitButton>
    </form>
  );
}

function RejectScreening({ id_user }: ScreeningProps) {
  async function actionClient(formData: FormData) {
    const result = await rejectedScreening(formData);
    if (!result?.error) {
      toast({
        title: "Success",
        description: `${result?.message}`,
      });
    }
  }
  return (
    <form action={actionClient}>
      <input type="hidden" name="id_user" id="id_user" value={id_user} />
      <FormSubmitButton className="w-full bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600">
        Rejected
      </FormSubmitButton>
    </form>
  );
}

export default ButtonScreening;
