import { z } from "zod";
import { jobTypes, locationTypes } from "./job-types";

const requiredString = z.string().min(1, "Required");

// karena form semua nya string kita pura2 make number
const numericRequiredString = requiredString.regex(/^\d+$/, "Must be a number");

// custom file validation
const companyLogoSchema = z
  .custom<File | undefined>()
  .refine((file) => {
    !file || (file instanceof File && file.type.startsWith("image/"));
  }, "Must be an image file")
  .refine((file) => {
    !file || file.size > 1024 * 1024 * 2;
  }, "File must be less than 2MB");

// email validation
const applicationSchema = z
  .object({
    // menggunakan z.literal agar jalan optional nya
    applicationEmail: z.string().email().optional().or(z.literal("")),
    applicationUrl: z.string().email().optional().or(z.literal("")),
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
      message: "Location is required",
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
    salary: numericRequiredString.max(9, "Salary must be less than 9 digits"),
  })
  .and(applicationSchema)
  .and(locationSchema);

export type createJobValue = z.infer<typeof createJobsSchema>;

export const jobFilterSchema = z.object({
  q: z.string().optional(),
  type: z.string().optional(),
  location: z.string().optional(),
  remote: z.coerce.boolean().optional(),
});

export type jobFilterValue = z.infer<typeof jobFilterSchema>;
