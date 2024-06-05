import { z } from "zod";
import { jobTypes, locationTypes } from "./job-types";

const requiredString = z.string().min(1, "Required");
const numericRequiredString = requiredString.regex(/^\d+$/, "Must be a number");

const companyLogoSchema = z
  .custom<File | undefined>()
  .refine(
    (file) => !file || (file instanceof File && file.type.startsWith("image/")),
    "Must be an image file",
  )
  .refine((file) => {
    return !file || file.size < 1024 * 1024 * 2;
  }, "File must be less than 2MB");

const applicationSchema = z
  .object({
    applicationEmail: z.string().max(100).email().optional().or(z.literal("")),
    applicationUrl: z.string().max(100).url().optional().or(z.literal("")),
  })
  .refine((data) => data.applicationEmail || data.applicationUrl, {
    message: "Email or url is required",
    path: ["applicationEmail"],
  });

const locationSchema = z
  .object({
    locationType: requiredString.refine(
      (value) => locationTypes.includes(value),
      "Invalid location type",
    ),
    location: z.string().max(100).optional(),
  })
  .refine(
    (data) =>
      !data.locationType || data.locationType === "Remote" || data.location,
    {
      message: "Location is required for on-site jobs",
      path: ["location"],
    },
  );

export const createJobsSchema = z
  .object({
    title: requiredString.max(100),
    type: requiredString.refine(
      (value) => jobTypes.includes(value),
      "Invalid job type",
    ),
    companyName: requiredString.max(100),
    companyLogo: companyLogoSchema,
    description: z.string().max(5000).optional(),
    salary: numericRequiredString.max(
      9,
      "Number can't be longer than 9 digits",
    ),
  })
  .and(applicationSchema)
  .and(locationSchema);

export const jobFilterSchema = z.object({
  q: z.string().optional(),
  type: z.string().optional(),
  location: z.string().optional(),
  remote: z.coerce.boolean().optional(),
});

export const createPermintaanSchema = z.object({
  jumlah_pegawai: numericRequiredString.max(
    1,
    "Number cant be longer than 1 digits",
  ),
  tanggal_permintaan: z.date().optional(),
  id_jabatan: z.string(),
  id_divisi: numericRequiredString,
});

export const createPersyaratanSchema = z.object({
  pengalaman_kerja: numericRequiredString.max(
    3,
    "Number cant be longer than 3 digits",
  ),
  pendidikan: requiredString,
  umur: numericRequiredString.max(3, "Number cant be longer than 3 digits"),
  status_pernikahan: requiredString,
});

export const createKriteriaSchema = z.object({
  nama_kriteria: requiredString.max(50, "Max length is 50 characters"),
  deskripsi_kriteria: requiredString.max(500, "Max length is 500 characters"),
  bobot: z.string().refine(
    (val) => {
      const num = parseFloat(val);
      return num >= 0 && num <= 1;
    },
    {
      message: "Bobot must be between 0.0 and 1.0",
    },
  ),
  jenis_kriteria: z.enum(["COST", "BENEFIT"]),
});

export type createKriteriaValues = z.infer<typeof createKriteriaSchema>;
export type createPersyaratanValues = z.infer<typeof createPersyaratanSchema>;
export type createJobValue = z.infer<typeof createJobsSchema>;
export type JobFilterValues = z.infer<typeof jobFilterSchema>;
export type createPermintaanValues = z.infer<typeof createPermintaanSchema>;
