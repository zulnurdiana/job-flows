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
import { createBiodataSchema, createBiodataValues } from "@/lib/validation";
import { cn } from "@/lib/utils";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { toast } from "@/components/ui/use-toast";
import { createBiodata } from "./action";
import { User } from "@prisma/client";
import {
  jenisKelamin,
  pendidikanList,
  statusPernikahanList,
} from "@/lib/persyaratan-list";
import { Textarea } from "@/components/ui/textarea";

interface NewBiodataFormProps {
  user: User;
}

const NewBiodataForm = ({
  user: { id, umur, pendidikan, status_pernikahan, alamat, jenis_kelamin },
}: NewBiodataFormProps) => {
  const form = useForm<createBiodataValues>({
    resolver: zodResolver(createBiodataSchema),
    defaultValues: {
      umur: umur !== null ? umur.toString() : undefined,
      pendidikan: pendidikan || undefined,
      status_pernikahan: status_pernikahan || undefined,
      alamat: alamat || undefined,
      jenis_kelamin: jenis_kelamin || undefined,
    },
  });

  const {
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting },
  } = form;

  async function onSubmit(values: createBiodataValues) {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value);
      }
    });
    try {
      const result = await createBiodata(formData, id);
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
            <BreadcrumbPage>Biodata Pelamar</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <H1 className="text-center text-2xl font-bold">
        Formulir Tambah <br /> Biodata Pelamar
      </H1>
      <Form {...form}>
        <form
          className="space-y-6 max-w-3xl m-auto"
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormField
            control={control}
            name="umur"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Umur</FormLabel>
                <FormControl>
                  <Input {...field} type="number" />
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
                <FormLabel>Pendidikan Terakhir</FormLabel>
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
            control={form.control}
            name="alamat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alamat</FormLabel>
                <FormControl>
                  <Textarea placeholder="Isi Alamat lengkap" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
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
          <FormField
            control={form.control}
            name="jenis_kelamin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jenis Kelamin</FormLabel>
                <FormControl>
                  <Select {...field} defaultValue="">
                    <option value="" hidden>
                      Pilih Jenis Kelamin
                    </option>
                    {jenisKelamin.map((kelamin) => (
                      <option key={kelamin} value={kelamin}>
                        {kelamin}
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
            name="cv"
            render={({ field: { value, ...fieldValues } }) => (
              <FormItem>
                <FormLabel>CV</FormLabel>
                <FormControl>
                  <Input
                    {...fieldValues}
                    type="file"
                    accept=""
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      fieldValues.onChange(file);
                    }}
                  />
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

export default NewBiodataForm;
