"use client";
import H1 from "@/components/ui/h1";
import {
  createPersyaratanSchema,
  createPersyaratanValues,
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
import LoadingButton from "@/components/LoadingButton";
import {
  pendidikanList,
  pengalamanKerjaList,
  statusPernikahanList,
} from "@/lib/persyaratan-list";
import createPersyaratan from "./actions";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface Jabatan {
  id_jabatan: number;
  id_divisi: number;
  nama_jabatan: string;
  deskripsi_jabatan?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Interface untuk model Permintaan
interface Permintaan {
  id_permintaan: number;
  jumlah_pegawai: number;
  status_permintaan?: boolean | null;
  approved?: boolean | null;
  tanggal_permintaan: Date;
  id_jabatan: number;
  jabatan: Jabatan;
  id_user: string;
  createdAt: Date;
  updatedAt: Date;
}

// Interface untuk model Persyaratan

interface NewPersyaratanFormProps {
  permintaan: Permintaan;
}

const NewPersyaratanForm = ({
  permintaan: {
    id_permintaan,
    jabatan: { nama_jabatan },
  },
}: NewPersyaratanFormProps) => {
  const form = useForm<createPersyaratanValues>({
    resolver: zodResolver(createPersyaratanSchema),
    defaultValues: {
      pengalaman_kerja: "0",
      umur: "0",
    },
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = form;

  async function onSubmit(values: createPersyaratanValues) {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value);
      }
    });

    try {
      await createPersyaratan(formData, id_permintaan);
    } catch (error) {
      alert("Something went wrong");
    }
  }

  return (
    <main className="m-auto max-w-5xl my-4 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/user/permintaan/daftar-permintaan">
              Daftar Permintaan
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Formulir Persyaratan {nama_jabatan}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="space-y-5 text-center">
        <H1>
          Formulir Persyaratan <br /> {nama_jabatan}
        </H1>
      </div>
      <Form {...form}>
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <FormField
            control={control}
            name="pengalaman_kerja"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pengalaman Kerja</FormLabel>
                <FormControl>
                  <Select {...field} defaultValue="">
                    <option value="" hidden>
                      Pilih Pengalaman
                    </option>
                    {pengalamanKerjaList.map((pengalaman) => (
                      <option key={pengalaman} value={pengalaman}>
                        {pengalaman}
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
            name="pendidikan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pendidikan Minimal</FormLabel>
                <FormControl>
                  <Select {...field} defaultValue="">
                    <option value="" hidden>
                      Pilih Pendidikan
                    </option>
                    {pendidikanList.map((pendidikan) => (
                      <option key={pendidikan} value={pendidikan}>
                        {pendidikan}
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
            name="umur"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimal Umur</FormLabel>
                <FormControl>
                  <Input {...field} type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="status_pernikahan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status Pernikahan</FormLabel>
                <FormControl>
                  <Select {...field} defaultValue="">
                    <option value="" hidden>
                      Pilih Status Pernikahan
                    </option>
                    {statusPernikahanList.map((pernikahan) => (
                      <option key={pernikahan} value={pernikahan}>
                        {pernikahan}
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

export default NewPersyaratanForm;
