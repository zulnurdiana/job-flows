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

interface NewPermintaanFormProps {
  jabatan: Jabatan;
}

const NewPermintaanForm = () => {
  const form = useForm<createPermintaanValues>({
    resolver: zodResolver(createPermintaanSchema),
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

  return (
    <main className="m-auto max-w-5xl my-10 space-y-10">
      <div className="space-y-5 text-center">
        <H1>Tambah Permintaan</H1>
      </div>
      <Form {...form}>
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
                    Select jabatan
                  </option>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>
    </main>
  );
};

export default NewPermintaanForm;
