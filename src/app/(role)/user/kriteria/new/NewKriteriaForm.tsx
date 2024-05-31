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
import { Button } from "@/components/ui/button";
import LoadingButton from "@/components/LoadingButton";
import { createKriteria } from "../actions";

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
      await createKriteria(formData);
    } catch (error) {
      alert("Something went wrong");
    }
  }

  return (
    <div className="max-w-5xl m-auto my-10 space-y-6">
      <H1 className="text-center">
        Formulir Tambah <br /> Kriteria Penilaian
      </H1>
      <Form {...form}>
        <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
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
                      Jenis Kriteria
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
            className="w-full"
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
