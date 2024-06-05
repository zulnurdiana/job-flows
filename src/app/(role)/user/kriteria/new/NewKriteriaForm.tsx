"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createKriteriaSchema, createKriteriaValues } from "@/lib/validation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import H1 from "@/components/ui/h1";
import { Textarea } from "@/components/ui/textarea";
import Select from "@/components/ui/select";
import LoadingButton from "@/components/LoadingButton";
import { createKriteria } from "../actions";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

const NewKriteriaForm = () => {
  const form = useForm<createKriteriaValues>({
    resolver: zodResolver(createKriteriaSchema),
    defaultValues: {
      nama_kriteria: "",
      deskripsi_kriteria: "",
      bobot: "0",
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form;

  async function onSubmit(values: createKriteriaValues) {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value);
      }
    });
    try {
      const result = await createKriteria(formData);
      if (result) {
        toast({
          className: cn(""),
          title: "Sukses",
          description: `${result?.message}`,
        });
        reset();
      }
    } catch (error) {
      alert("Terjadi kesalahan");
    }
  }

  return (
    <div className="max-w-4xl mx-auto my-10 p-6 bg-white shadow-md rounded-lg">
      <H1 className="text-center text-2xl font-bold mb-6">
        Formulir Tambah <br /> Kriteria Penilaian
      </H1>
      <Form {...form}>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="nama_kriteria"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Kriteria</FormLabel>
                <FormControl>
                  <Input placeholder="Isi Nama Kriteria" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="deskripsi_kriteria"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deskripsi Kriteria</FormLabel>
                <FormControl>
                  <Textarea placeholder="Isi Deskripsi Kriteria" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bobot"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bobot</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Tentukan Nilai Bobot"
                    {...field}
                    type="number"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="jenis_kriteria"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jenis Kriteria</FormLabel>
                <FormControl>
                  <Select {...field} defaultValue={""}>
                    <option value="" hidden>
                      Pilih Jenis Kriteria
                    </option>
                    <option value="BENEFIT">Benefit</option>
                    <option value="COST">Cost</option>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <LoadingButton
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
            loading={isSubmitting}
          >
            Submit
          </LoadingButton>
        </form>
      </Form>
    </div>
  );
};

export default NewKriteriaForm;
