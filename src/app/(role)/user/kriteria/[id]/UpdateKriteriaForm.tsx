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
import { updateKriteria } from "../actions";
import { Kriteria } from "@prisma/client";
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

interface UpdateKriteriaPageProps {
  kriteria: Kriteria;
}

const UpdateKriteriaForm = ({
  kriteria: {
    id_kriteria,
    nama_kriteria,
    deskripsi_kriteria,
    bobot,
    jenis_kriteria,
  },
}: UpdateKriteriaPageProps) => {
  const form = useForm<createKriteriaValues>({
    resolver: zodResolver(createKriteriaSchema),
    defaultValues: {
      nama_kriteria: nama_kriteria,
      deskripsi_kriteria: deskripsi_kriteria,
      bobot: bobot.toString(),
      jenis_kriteria: jenis_kriteria || "BENEFIT",
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
      const result = await updateKriteria(formData, id_kriteria);
      if (!result?.error) {
        toast({
          className: cn(""),
          title: "Sukses",
          description: `${result.message}`,
        });
      }
    } catch (error) {
      toast({
        title: "Gagal",
        description: `${error}`,
      });
    }
  }

  return (
    <div className="max-w-5xl mx-auto my-4 rounded-lg">
      <Breadcrumb>
        <BreadcrumbList>
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
            <BreadcrumbPage>{nama_kriteria}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <H1 className="text-center text-2xl font-bold mb-6">
        Formulir Ubah <br /> Kriteria Penilaian
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
                  <Select {...field}>
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

export default UpdateKriteriaForm;
