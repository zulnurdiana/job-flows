"use client";
import FormSubmitButton from "@/components/FormSubmitButton";
import { deleteKriteria } from "../actions";
import { toast } from "@/components/ui/use-toast";

interface FormProps {
  id: number;
}

const FormKriteria = ({ id }: FormProps) => {
  async function clientAction(formData: FormData) {
    const result = await deleteKriteria(formData);
    if (!result?.error) {
      toast({
        title: "Sukses",
        description: `${result?.message}`,
      });
    }
  }
  return (
    <form action={clientAction}>
      <input hidden id="id_kriteria" name="id_kriteria" value={id} />
      <FormSubmitButton className="w-full bg-white border-2 font-bold text-red-500 hover:text-white">
        Delete
      </FormSubmitButton>
    </form>
  );
};

export default FormKriteria;
