import { z } from "zod";
import { jobTypes, locationTypes } from "./job-types";
import prisma from "./prisma";

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

const dateISOString = z.string().refine((val) => !!Date.parse(val));

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
    tanggal_mulai: dateISOString,
    tanggal_selesai: dateISOString,
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
});

export const createPersyaratanSchema = z.object({
  pengalaman_kerja: requiredString,
  pendidikan: requiredString,
  umur_min: numericRequiredString.max(3, "Number cant be longer than 3 digits"),
  umur_max: numericRequiredString.max(3, "Number cant be longer than 3 digits"),
  status_pernikahan: requiredString,
  jenis_kelamin: requiredString,
  description: z.string().max(5000).optional(),
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

const cvSchema = z
  .custom<File | undefined>()
  .refine(
    (file) =>
      !file || (file instanceof File && file.type === "application/pdf"),
    "CV harus berupa file PDF yang valid",
  )
  .refine(
    (file) => !file || file.size < 1024 * 1024 * 5,
    "File harus lebih kecil dari 5MB",
  );

export const createBiodataSchema = z.object({
  tgl_lahir: dateISOString,
  pendidikan: requiredString,
  status_pernikahan: requiredString,
  alamat: z.string().max(5000).optional(),
  jenis_kelamin: requiredString,
  cv: cvSchema.optional(),
});

// Buat schema Zod secara dinamis
export const createPenilaianSchema = z.object({
  nama_pelamar: z.string(),
  pendidikan: z.string(),
  tes_tulis: numericRequiredString
    .max(3, "Number cant be longer than 3 digits")
    .refine(
      (val) => {
        const num = parseInt(val);

        return num >= 0 && num <= 100;
      },
      {
        message: "Number must be between 0 and 100",
      },
    ),
  tes_praktek: numericRequiredString
    .max(3, "Number cant be longer than 3 digits")
    .refine(
      (val) => {
        const num = parseInt(val);

        return num >= 0 && num <= 100;
      },
      {
        message: "Number must be between 0 and 100",
      },
    ),
  tes_teknis: numericRequiredString
    .max(3, "Number cant be longer than 3 digits")
    .refine(
      (val) => {
        const num = parseInt(val);

        return num >= 0 && num <= 100;
      },
      {
        message: "Number must be between 0 and 100",
      },
    ),
  tes_psikotes: numericRequiredString
    .max(3, "Number cant be longer than 3 digits")
    .refine(
      (val) => {
        const num = parseInt(val);

        return num >= 0 && num <= 100;
      },
      {
        message: "Number must be between 0 and 100",
      },
    ),
  pengalaman: numericRequiredString.max(
    3,
    "Number cant be longer than 3 digits",
  ),
  komunikasi: numericRequiredString.max(
    3,
    "Number cant be longer than 3 digits",
  ),
  minat: numericRequiredString.max(3, "Number cant be longer than 3 digits"),
  pengetahuan_organisasi: numericRequiredString.max(
    3,
    "Number cant be longer than 3 digits",
  ),
  kerja_sama: numericRequiredString.max(
    3,
    "Number cant be longer than 3 digits",
  ),
  inisiatif: numericRequiredString.max(
    3,
    "Number cant be longer than 3 digits",
  ),
  manajemen_waktu: numericRequiredString.max(
    3,
    "Number cant be longer than 3 digits",
  ),
});

export type createKriteriaValues = z.infer<typeof createKriteriaSchema>;
export type createPersyaratanValues = z.infer<typeof createPersyaratanSchema>;
export type createJobValue = z.infer<typeof createJobsSchema>;
export type JobFilterValues = z.infer<typeof jobFilterSchema>;
export type createPermintaanValues = z.infer<typeof createPermintaanSchema>;
export type createBiodataValues = z.infer<typeof createBiodataSchema>;
export type createPenilaianValues = z.infer<typeof createPenilaianSchema>;
