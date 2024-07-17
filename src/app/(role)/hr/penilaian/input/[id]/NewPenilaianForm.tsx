"use client";
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
import H1 from "@/components/ui/h1";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPenilaianSchema, createPenilaianValues } from "@/lib/validation";

import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Kriteria, User } from "@prisma/client";
import {
  inisiatif,
  kerja_sama,
  komunikasi,
  manajemen_waktu,
  minat,
  pengalaman,
  pengetahuan_organisasi,
} from "@/lib/kriteria-list";
import { PenilaianPelamar } from "./action";

interface NewPenilaianFormProps {
  user: User;
  jabatan: String;
  pendidikan: string;
}

const NewPenilaianForm = ({
  user: { id, name, id_job },
  jabatan,
  pendidikan,
}: NewPenilaianFormProps) => {
  const form = useForm<createPenilaianValues>({
    resolver: zodResolver(createPenilaianSchema),
    defaultValues: {
      nama_pelamar: name || "",
      pendidikan: pendidikan || "",
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form;

  async function onSubmit(values: createPenilaianValues) {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value);
      }
    });
    try {
      const result = await PenilaianPelamar(formData, id);
      reset();
      if (result) {
        toast({
          className: cn(""),
          title: "Sukses",
          description: `${result?.message}`,
        });
      }
    } catch (error) {
      alert("Terjadi kesalahan");
    }
  }

  return (
    <div className="max-w-5xl mx-auto my-4 space-y-4 rounded-lg min-h-[400px] px-4">
      <Breadcrumb className="bg-gray-100 p-4 rounded-lg">
        <BreadcrumbList className="flex space-x-2 text-gray-600">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/hr/penilaian">
              Penilaian Pelamar
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/hr/penilaian/${id_job}`}>
              {jabatan}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <H1 className="text-center text-2xl font-bold">
        Formulir Penilaian <br /> Calon Pegawai
      </H1>
      <Form {...form}>
        <form
          className="space-y-6 max-w-3xl m-auto"
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="nama_pelamar"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Pelamar</FormLabel>
                <FormControl>
                  <Input disabled {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pendidikan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pendidikan</FormLabel>
                <FormControl>
                  <Input disabled {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tes_tulis"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nilai Tes Tulis</FormLabel>
                <FormControl>
                  <Input
                    placeholder={"Masukkan nilai 1-100"}
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
            name="tes_praktek"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nilai Tes Praktek</FormLabel>
                <FormControl>
                  <Input
                    placeholder={"Masukkan nilai 1-100"}
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
            name="tes_teknis"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nilai Tes Teknis</FormLabel>
                <FormControl>
                  <Input
                    placeholder={"Masukkan nilai 1-100"}
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
            name="tes_psikotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nilai Tes Psikotes</FormLabel>
                <FormControl>
                  <Input
                    placeholder={"Masukkan nilai 1-100"}
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
            name="pengalaman"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pengalaman</FormLabel>
                <FormControl>
                  <Select {...field} defaultValue="">
                    <option value="" hidden>
                      Pilih Pengalaman Kandidat
                    </option>
                    {pengalaman.map((pengalaman, index) => (
                      <option key={pengalaman} value={index + 1}>
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
            control={form.control}
            name="komunikasi"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Komunikasi</FormLabel>
                <FormControl>
                  <Select {...field} defaultValue="">
                    <option value="" hidden>
                      Pilih Komunikasi Kandidat
                    </option>
                    {komunikasi.map((komunikasi, index) => (
                      <option key={komunikasi} value={index + 1}>
                        {komunikasi}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="minat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minat</FormLabel>
                <FormControl>
                  <Select {...field} defaultValue="">
                    <option value="" hidden>
                      Pilih Minat Kandidat
                    </option>
                    {minat.map((minat, index) => (
                      <option key={minat} value={index + 1}>
                        {minat}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pengetahuan_organisasi"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pengetahuan Organisasi</FormLabel>
                <FormControl>
                  <Select {...field} defaultValue="">
                    <option value="" hidden>
                      Pilih Pengetahuan Organisasi Kandidat
                    </option>
                    {pengetahuan_organisasi.map((pengetahuan, index) => (
                      <option key={pengetahuan} value={index + 1}>
                        {pengetahuan}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="kerja_sama"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kerja Sama</FormLabel>
                <FormControl>
                  <Select {...field} defaultValue="">
                    <option value="" hidden>
                      Pilih Kerja Sama Kandidat
                    </option>
                    {kerja_sama.map((kerja, index) => (
                      <option key={kerja} value={index + 1}>
                        {kerja}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="inisiatif"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Inisiatif</FormLabel>
                <FormControl>
                  <Select {...field} defaultValue="">
                    <option value="" hidden>
                      Pilih Inisiatif Kandidat
                    </option>
                    {inisiatif.map((inisiatif, index) => (
                      <option key={inisiatif} value={index + 1}>
                        {inisiatif}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="manajemen_waktu"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Manajemen Waktu</FormLabel>
                <FormControl>
                  <Select {...field} defaultValue="">
                    <option value="" hidden>
                      Pilih Manajemen Waktu Kandidat
                    </option>
                    {manajemen_waktu.map((waktu, index) => (
                      <option key={waktu} value={index + 1}>
                        {waktu}
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
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            loading={isSubmitting}
          >
            Submit
          </LoadingButton>
        </form>
      </Form>
    </div>
  );
};

export default NewPenilaianForm;
