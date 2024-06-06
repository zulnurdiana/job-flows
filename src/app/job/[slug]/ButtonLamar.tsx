"use client";
import FormSubmitButton from "@/components/FormSubmitButton";
import { lamarLowongan } from "./action";
import { toast } from "@/components/ui/use-toast";

interface ButtonLamarProps {
  id_job: number;
}

const ButtonLamar = ({ id_job }: ButtonLamarProps) => {
  async function actionClient(formData: FormData) {
    const result = await lamarLowongan(formData);
    if (!result?.error) {
      toast({
        title: "Sukses",
        description: `${result?.message}`,
      });
    }
  }
  return (
    <form action={actionClient}>
      <input hidden id="id_job" name="id_job" value={id_job} />
      <FormSubmitButton className="w-full hover:text-white font-bold">
        Lamar Sekarang
      </FormSubmitButton>
    </form>
  );
};

export default ButtonLamar;
