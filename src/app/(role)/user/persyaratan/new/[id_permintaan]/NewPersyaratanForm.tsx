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
  jenisKelaminPersyaratan,
  pendidikanList,
  pengalamanKerjaList,
  statusPernikahanPersyaratan,
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
import RichTextEditor from "@/components/RichTextEditor";
import { draftToMarkdown } from "markdown-draft-js";
import { Label } from "@/components/ui/label";
import { NewPersyaratanProps } from "../../../../../../../types/NewPersyaratan/NewPerysratanProps";

const NewPersyaratanForm = ({
  permintaan: {
    id_permintaan,
    jabatan: { nama_jabatan },
  },
}: NewPersyaratanProps) => {
  const form = useForm<createPersyaratanValues>({
    resolver: zodResolver(createPersyaratanSchema),
    defaultValues: {
      pengalaman_kerja: "0",
      umur_min: "0",
      umur_max: "0",
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
    <main className="max-w-5xl mx-auto my-4 space-y-4 px-4">
      <Breadcrumb className="bg-gray-100 p-4 rounded-lg">
        <BreadcrumbList className="flex space-x-2 text-gray-600">
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

      <div className="text-center">
        <H1 className="text-3xl font-extrabold text-gray-800">
          Formulir Persyaratan <br /> {nama_jabatan}
        </H1>
      </div>

      <Form {...form}>
        <form
          className="space-y-6 max-w-3xl m-auto"
          onSubmit={handleSubmit(onSubmit)}
        >
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

          <div className="space-y-2">
            <div className="flex justify-between gap-x-4">
              <FormField
                control={control}
                name="umur_min"
                render={({ field }) => (
                  <FormItem className="flex-grow w-full">
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
                name="umur_max"
                render={({ field }) => (
                  <FormItem className="flex-grow w-full">
                    <FormLabel>Maksimal Umur</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

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
                    {statusPernikahanPersyaratan.map((pernikahan) => (
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
                    {jenisKelaminPersyaratan.map((kelamin) => (
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
            name="description"
            render={({ field }) => (
              <FormItem>
                <Label onClick={() => setFocus("description")}>
                  Description
                </Label>
                <FormControl>
                  <RichTextEditor
                    onChange={(draft) => field.onChange(draftToMarkdown(draft))}
                    ref={field.ref}
                  />
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
