"use client";
import H1 from "@/components/ui/h1";
import {
  createPermintaanSchema,
  createPermintaanValues,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Select from "@/components/ui/select";
import { Jabatan } from "@prisma/client";
import LoadingButton from "@/components/LoadingButton";
import createPermintaan from "./actions";

interface NewPermintaanFormProps {
  jabatan: Jabatan[];
}

const NewPermintaanForm = ({ jabatan }: NewPermintaanFormProps) => {
  const form = useForm<createPermintaanValues>({
    resolver: zodResolver(createPermintaanSchema),
    defaultValues: {
      jumlah_pegawai: "0",
    },
  });

  const {
    handleSubmit,
    watch,
    trigger,
    control,
    setValue,
    setFocus,
    formState: { isSubmitting },
  } = form;

  async function onSubmit(values: createPermintaanValues) {
    const formData = new FormData();
    // Mengisi FormData dengan nilai dari createPermintaanValues
    Object.entries(values).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (typeof value === "object" && value instanceof Date) {
          formData.append(key, value.toISOString());
        } else {
          formData.append(key, String(value));
        }
      }
    });

    try {
      await createPermintaan(formData);
    } catch (error) {
      alert("Something went wrong");
    }
  }

  return (
    <main className="m-auto max-w-5xl my-10 space-y-10">
      <div className="space-y-5 text-center">
        <H1>Tambah Permintaan</H1>
      </div>
      <Form {...form}>
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <FormField
            control={control}
            name="jumlah_pegawai"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jumlah Pegawai</FormLabel>
                <FormControl>
                  <Input {...field} type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="id_jabatan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job type</FormLabel>
                <FormControl>
                  <Select {...field} defaultValue="">
                    <option value="" hidden>
                      Pilih Jabatan
                    </option>
                    {jabatan.map((jab) => (
                      <option key={jab.id_jabatan} value={jab.id_jabatan}>
                        {jab.nama_jabatan}
                      </option>
                    ))}
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
    </main>
  );
};

export default NewPermintaanForm;
