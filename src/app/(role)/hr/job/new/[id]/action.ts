"use server";

import { nanoid } from "nanoid";

import { createJobsSchema } from "@/lib/validation";
import { createSlug } from "@/lib/utils";
import { put } from "@vercel/blob";
import path from "path";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function createJobPosting(
  formData: FormData,
  id_persyaratan: number,
) {
  const values = Object.fromEntries(formData.entries());
  const {
    title,
    type,
    companyLogo,
    companyName,
    locationType,
    location,
    applicationUrl,
    applicationEmail,
    description,
    salary,
    tanggal_mulai,
    tanggal_selesai,
  } = createJobsSchema.parse(values);

  const slug = `${createSlug(title)}-${nanoid(10)}`;

  let companyLogoUrl: string | undefined = undefined;

  if (companyLogo) {
    const blog = await put(
      `company_logos/${slug}${path.extname(companyLogo.name)}`,
      companyLogo,
      {
        access: "public",
        addRandomSuffix: false,
      },
    );

    companyLogoUrl = blog.url;
  }

  console.log(description);

  const newJob = await prisma.job.create({
    data: {
      title: title.trim(),
      slug,
      type,
      companyLogoUrl,
      companyName: companyName.trim(),
      locationType,
      location,
      applicationUrl: applicationUrl?.trim(),
      applicationEmail: applicationEmail?.trim(),
      description: description?.trim(),
      salary: parseInt(salary),
      tanggal_mulai: new Date(tanggal_mulai),
      tanggal_selesai: new Date(tanggal_selesai),
      // approved: true,
    },
  });

  await prisma.persyaratan.update({
    data: {
      id_job: newJob.id,
      status_persyaratan: true,
    },
    where: {
      id_persyaratan: id_persyaratan,
    },
  });

  redirect(`/hr/job/job-submitted`);
}
