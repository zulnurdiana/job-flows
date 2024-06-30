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
  jenisKelaminPelamar,
  pendidikanList,
  statusPernikahanPelamar,
} from "@/lib/persyaratan-list";
import { Textarea } from "@/components/ui/textarea";
import { CalendarDays } from "lucide-react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface NewBiodataFormProps {
  user: User;
}

const NewBiodataForm = ({
  user: {
    id,
    tanggal_lahir,
    pendidikan,
    status_pernikahan,
    alamat,
    jenis_kelamin,
  },
}: NewBiodataFormProps) => {
  const form = useForm<createBiodataValues>({
    resolver: zodResolver(createBiodataSchema),
    defaultValues: {
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
          className="space-y-6 max-w-2xl mx-auto"
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="pendidikan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pendidikan Terakhir</FormLabel>
                <FormControl>
                  <Select {...field} className="select-input">
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
            name="status_pernikahan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status Pernikahan</FormLabel>
                <FormControl>
                  <Select {...field} className="select-input">
                    <option value="" hidden>
                      Pilih Status Pernikahan
                    </option>
                    {statusPernikahanPelamar.map((pernikahan) => (
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
                  <Select {...field} className="select-input">
                    <option value="" hidden>
                      Pilih Jenis Kelamin
                    </option>
                    {jenisKelaminPelamar.map((kelamin) => (
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
            control={form.control}
            name="tanggal_lahir"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Tanggal Lahir</FormLabel>
                <div className="flex items-center gap-2 border border-gray-300 rounded-md px-4 py-2">
                  <CalendarDays width={24} height={24} />
                  <div className="w-full">
                    <ReactDatePicker
                      selected={field.value ? new Date(field.value) : null}
                      onChange={(date) => field.onChange(date?.toISOString())}
                      dateFormat="MM/dd/yyyy"
                      wrapperClassName="datePicker"
                      className="w-full border-0 focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-md px-2 py-1"
                      showYearDropdown
                      scrollableYearDropdown
                      yearDropdownItemNumber={100} // Menampilkan 10 tahun per halaman
                      minDate={new Date("1900-01-01")} // Tanggal minimum
                      maxDate={new Date()} // Tanggal maksimum (saat ini)
                    />
                  </div>
                </div>
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
                    className="file-input"
                  />
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
                  <Textarea
                    placeholder="Isi Alamat lengkap"
                    {...field}
                    className="textarea-input"
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
