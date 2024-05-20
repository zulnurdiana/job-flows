"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { del } from "@vercel/blob";
import { redirect } from "next/navigation";
import getSession from "@/lib/getSession";

export async function approvedSubmission(formData: FormData) {
  try {
    const jobId = parseInt(formData.get("jobId") as string);

    let user = await getSession();

    if (!user || user.user.role !== "admin") {
      throw new Error("Not Unauthorized");
    }

    await prisma.job.update({
      where: {
        id: jobId,
      },
      data: {
        approved: true,
      },
    });

    revalidatePath("/");
  } catch (error) {
    console.log(error);
  }
}

export async function deleteJob(formData: FormData) {
  try {
    const jobId = parseInt(formData.get("jobId") as string);

    let user = await getSession();

    if (!user || user.user.role !== "admin") {
      throw new Error("Not Unauthorized");
    }

    const job = await prisma.job.findUnique({
      where: {
        id: jobId,
      },
    });

    if (job?.companyLogoUrl) {
      del(job.companyLogoUrl);
    }

    await prisma.job.delete({
      where: {
        id: jobId,
      },
    });
    revalidatePath("/");
  } catch (error) {
    console.log(error);
  }

  redirect("/admin");
}
