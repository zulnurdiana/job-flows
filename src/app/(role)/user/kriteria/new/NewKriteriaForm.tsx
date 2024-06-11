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
import { createKriteriaSchema, createKriteriaValues } from "@/lib/validation";
import { createKriteria } from "../actions";
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
    <div className="max-w-5xl mx-auto my-4 space-y-4 rounded-lg min-h-[400px] px-4">
      <Breadcrumb className="bg-gray-100 p-4 rounded-lg">
        <BreadcrumbList className="flex space-x-2 text-gray-600">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/user/kriteria/daftar-kriteria">
              Daftar Kriteria
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Formulir Kriteria Penilaian</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <H1 className="text-center text-2xl font-bold">
        Formulir Tambah <br /> Kriteria Penilaian
      </H1>
      <Form {...form}>
        <form
          className="space-y-6 max-w-3xl m-auto"
          onSubmit={handleSubmit(onSubmit)}
        >
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
                  <Input placeholder="Isi Deskripsi Kriteria" {...field} />
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
                  <Select {...field} defaultValue="">
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

export default NewKriteriaForm;
