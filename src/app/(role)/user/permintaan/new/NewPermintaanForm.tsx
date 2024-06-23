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
import { Divisi, Jabatan, Pegawai, User } from "@prisma/client";
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

interface IPegawai {
  id_pegawai: number;
  nama_pegawai: string;
  email?: string | null;
  status_pegawai: string;
  tanggal_gabung?: Date | null;
  id_jabatan: number;
  jabatan: IJabatan;
  user?: IUser | null;
}

interface IJabatan {
  id_jabatan: number;
  id_divisi: number;
  nama_jabatan: string;
  deskripsi_jabatan?: string | null;
  divisi: IDivisi;
  createdAt: Date;
  updatedAt: Date;
}

interface IDivisi {
  id_divisi: number;
  nama_divisi: string;
  deskripsi_divisi?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface IUser {
  id: string;
  name?: string | null;
  password?: string | null;
  email: string;
  emailVerified?: Date | null;
  image?: string | null;
  umur?: number | null;
  pendidikan?: string | null;
  alamat?: string | null;
  jenis_kelamin?: string | null;
  status_pernikahan?: string | null;
  cv?: string | null;
  role?: string | null;
  screening_approved?: boolean | null;
  pegawai?: IPegawai | null; // Perbarui ini
  createdAt: Date;
  updatedAt: Date;
}

interface NewPermintaanFormProps {
  jabatan: IJabatan[];
  divisi: IDivisi[];
  user: IUser;
  pegawai: IPegawai[];
}

const NewPermintaanForm = ({
  jabatan,
  divisi,
  user,
  pegawai,
}: NewPermintaanFormProps) => {
  const id_divisi = user.pegawai?.jabatan.id_divisi;
  const id_jabatan = user.pegawai?.jabatan.id_jabatan;

  // Filter pegawai berdasarkan id_divisi
  const filteredPegawai = pegawai.filter(
    (p) => p.jabatan.id_jabatan === id_jabatan,
  );

  const form = useForm<createPermintaanValues>({
    resolver: zodResolver(createPermintaanSchema),
    defaultValues: {
      jumlah_pegawai: "0",
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

  const filteredJabatan = id_divisi
    ? jabatan.filter((jab) => jab.id_divisi === id_divisi)
    : [];

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
