"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import H1 from "@/components/ui/h1";
import { createJobsSchema, createJobValue } from "@/lib/validation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import Select from "@/components/ui/select";
import { jobTypes, locationTypes } from "@/lib/job-types";
import LocationInput from "@/components/LocationInput";
import { X } from "lucide-react";
import { Label } from "@/components/ui/label";
import RichTextEditor from "@/components/RichTextEditor";
import { draftToMarkdown } from "markdown-draft-js";
import LoadingButton from "@/components/LoadingButton";
import { createJobPosting } from "./action";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Image from "next/image";
import { CalendarDays } from "lucide-react";

// Interface untuk model Jabatan
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
  persyaratan?: Persyaratan[]; // Buat properti persyaratan bersifat opsional
  createdAt: Date;
  updatedAt: Date;
}

// Interface untuk model Persyaratan
interface Persyaratan {
  id_persyaratan: number;
  pengalaman_kerja: string;
  pendidikan: string;
  umur_min: number;
  umur_max: number;
  status_pernikahan: string;
  description?: string | null;
  id_user: string;
  id_permintaan: number;
  permintaan: Permintaan;
  id_job?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

// Interface untuk props yang akan diterima oleh komponen NewJobForm
interface NewJobFormProps {
  persyaratan: Persyaratan;
}

const NewJobForm = ({
  persyaratan: {
    id_permintaan,
    id_persyaratan,
    pengalaman_kerja,
    pendidikan,
    umur_min,
    umur_max,
    status_pernikahan,
    description,
    permintaan: {
      jabatan: { nama_jabatan },
    },
  },
}: NewJobFormProps) => {
  const form = useForm<createJobValue>({
    resolver: zodResolver(createJobsSchema),
    defaultValues: {
      title: nama_jabatan,
      description: description || "",
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

  const [isDisabled, setIsDisabled] = useState(true);

  async function onSubmit(values: createJobValue) {
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        // Konversi nilai Date ke string
        if (value instanceof Date) {
          formData.append(key, value.toISOString());
        } else {
          formData.append(key, value);
        }
      }
    });

    try {
      await createJobPosting(formData, id_persyaratan);
    } catch (error) {
      alert("Something went wrong");
    }
  }

  //   const defaultDescription = `**Kualifikasi**:
  // Pengalaman Kerja: ${pengalaman_kerja}
  // Pendidikan: ${pendidikan}
  // Umur: ${umur} tahun
  // Status Pernikahan: ${status_pernikahan}`;

  return (
    <main className="m-auto my-4 max-w-5xl space-y-10">
      <Breadcrumb className="bg-gray-100 p-4 rounded-lg">
        <BreadcrumbList className="flex space-x-2 text-gray-600">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/hr/persyaratan">
              Daftar Persyaratan
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{nama_jabatan}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="space-y-5 text-center">
        <H1 className="text-3xl font-extrabold text-gray-800">
          Find your perfect developer
        </H1>
        <p className="text-muted-foreground">
          Get your job posting seen by thousands of job seekers.
        </p>
      </div>

      <div className="space-y-6 m-auto rounded-lg border p-4 max-w-3xl bg-white shadow-md">
        <div>
          <h2 className="font-semibold text-lg">Job details</h2>
          <p className="text-muted-foreground">
            Provide a job description and details
          </p>
        </div>

        <Form {...form}>
          <form
            className="space-y-4"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
          >
            <FormField
              control={control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Frontend Developer"
                      {...field}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job type</FormLabel>
                  <FormControl>
                    <Select {...field} defaultValue="">
                      <option value="" hidden>
                        Select an option
                      </option>
                      {jobTypes.map((jobType) => (
                        <option key={jobType} value={jobType}>
                          {jobType}
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
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="companyLogo"
              render={({ field: { value, ...fieldValues } }) => (
                <FormItem>
                  <FormLabel>Job Poster</FormLabel>
                  <FormControl>
                    <Input
                      {...fieldValues}
                      type="file"
                      accept="image/*"
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

            <FormField
              control={control}
              name="locationType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Select
                      {...field}
                      defaultValue=""
                      onChange={(e) => {
                        field.onChange(e);
                        if (e.currentTarget.value === "Remote")
                          trigger("location");
                      }}
                    >
                      <option value="" hidden>
                        Select an option
                      </option>
                      {locationTypes.map((locationType) => (
                        <option key={locationType} value={locationType}>
                          {locationType}
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
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Office location</FormLabel>
                  <FormControl>
                    <LocationInput
                      onLocationSelected={field.onChange}
                      ref={field.ref}
                    />
                  </FormControl>
                  {watch("location") && (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setValue("location", "", { shouldValidate: true });
                        }}
                      >
                        <X size={20} />
                      </button>
                      <span className="text-sm">{watch("location")}</span>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <Label htmlFor="applicationEmail">How to apply</Label>
              <div className="flex justify-between">
                <FormField
                  control={control}
                  name="applicationEmail"
                  render={({ field }) => (
                    <FormItem className="grow">
                      <FormControl>
                        <div className="flex items-center">
                          <Input
                            id="applicationEmail"
                            placeholder="Email"
                            type="email"
                            {...field}
                          />
                          <span className="mx-2">or</span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="applicationUrl"
                  render={({ field }) => (
                    <FormItem className="grow">
                      <FormControl>
                        <Input
                          placeholder="Website"
                          type="url"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            trigger("applicationEmail");
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex flex-col justify-between gap-5 md:flex-row">
              <FormField
                control={form.control}
                name="tanggal_mulai"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormLabel htmlFor="tanggal_mulai">Start Date</FormLabel>
                    <div className="flex items-center gap-2 border border-black rounded-full px-4 py-2">
                      <CalendarDays width={24} height={24} />
                      <DatePicker
                        selected={field.value ? new Date(field.value) : null}
                        onChange={(date) => field.onChange(date?.toISOString())}
                        showTimeSelect
                        timeInputLabel="Time:"
                        dateFormat={"MM/dd/yyyy h:mm aa"}
                        wrapperClassName="datePicker"
                        className="w-full border-0 focus:ring-0 focus:border-transparent"
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tanggal_selesai"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormLabel htmlFor="tanggal_selesai">End Date</FormLabel>
                    <div className="flex items-center gap-2 border border-black rounded-full px-4 py-2">
                      <CalendarDays width={24} height={24} />
                      <DatePicker
                        selected={field.value ? new Date(field.value) : null}
                        onChange={(date) => field.onChange(date?.toISOString())}
                        showTimeSelect
                        timeInputLabel="Time:"
                        dateFormat={"MM/dd/yyyy h:mm aa"}
                        wrapperClassName="datePicker"
                        className="w-full border-0 focus:ring-0 focus:border-transparent"
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                      defaultValue={description || ""}
                      onChange={(draft) =>
                        field.onChange(draftToMarkdown(draft))
                      }
                      ref={field.ref}
                      disabled={isDisabled} // Disable the editor if isDisabled is true
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="salary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salary</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <LoadingButton
              type="submit"
              loading={isSubmitting}
              className="w-full"
            >
              Submit
            </LoadingButton>
          </form>
        </Form>
      </div>
    </main>
  );
};

export default NewJobForm;
