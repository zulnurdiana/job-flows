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
import { Divisi, Jabatan } from "@prisma/client";
import LoadingButton from "@/components/LoadingButton";
import createPermintaan from "./actions";
import { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface NewPermintaanFormProps {
  jabatan: Jabatan[];
  divisi: Divisi[];
}

const NewPermintaanForm = ({ jabatan, divisi }: NewPermintaanFormProps) => {
  const [selectedDivisi, setSelectedDivisi] = useState<number | null>(null);
  const form = useForm<createPermintaanValues>({
    resolver: zodResolver(createPermintaanSchema),
    defaultValues: {
      jumlah_pegawai: "0",
      id_divisi: "0",
      id_jabatan: "0",
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

  const filteredJabatan = selectedDivisi
    ? jabatan.filter((jab) => jab.id_divisi === selectedDivisi)
    : [];

  const handleDivisiChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value; // Keep it as string
    setSelectedDivisi(parseInt(selectedId)); // Parse to number for local state
    setValue("id_divisi", selectedId); // Set value in the form state as string
    setValue("id_jabatan", ""); // Reset the job type when division changes
  };

  async function onSubmit(values: createPermintaanValues) {
    const formData = new FormData();
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
    <main className="m-auto max-w-5xl my-4 space-y-4 px-4">
      <Breadcrumb className="bg-gray-100 p-4 rounded-lg">
        <BreadcrumbList className="flex space-x-2 text-gray-600">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Formulir Permintaan</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="text-center">
        <H1 className="text-3xl font-extrabold text-gray-800">
          Formulir Tambah <br /> Permintaan Pegawai
        </H1>
      </div>
      <Form {...form}>
        <form
          className="space-y-6 max-w-3xl m-auto"
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormField
            control={control}
            name="jumlah_pegawai"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jumlah Pegawai</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    className="mt-1 p-2 border rounded-md"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="id_divisi"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Division</FormLabel>
                <FormControl>
                  <Select
                    {...field}
                    defaultValue=""
                    onChange={handleDivisiChange}
                    className="mt-1 p-2 border rounded-md"
                  >
                    <option value="" hidden>
                      Select Division
                    </option>
                    {divisi.map((div) => (
                      <option key={div.id_divisi} value={div.id_divisi}>
                        {div.nama_divisi}
                      </option>
                    ))}
                  </Select>
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
                  <Select
                    {...field}
                    defaultValue=""
                    className="mt-1 p-2 border rounded-md"
                  >
                    <option value="" hidden>
                      Select Job
                    </option>
                    {filteredJabatan.map((jab) => (
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
