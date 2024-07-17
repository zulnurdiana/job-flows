"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { del } from "@vercel/blob";
import { redirect } from "next/navigation";
import getSession from "@/lib/getSession";
import { handleError } from "@/lib/utils";

export async function approvedSubmission(formData: FormData) {
  try {
    const jobId = parseInt(formData.get("jobId") as string);

    let user = await getSession();

    if (!user || user.user.role?.toLocaleLowerCase() !== "direktur") {
      throw new Error("Not Unauthorized");
    }

    const job = await prisma.job.update({
      where: {
        id: jobId,
      },
      data: {
        approved: true,
      },
    });

    if (job) {
      return {
        message: `Berhasil Approve Lowongan Untuk ${job.title}`,
      };
    }
    revalidatePath("/");
  } catch (error) {
    return {
      error: handleError(error),
    };
  }
}

export async function deleteJob(formData: FormData) {
  try {
    const jobId = parseInt(formData.get("jobId") as string);
    const alasan = formData.get("alasan") as string;

    let user = await getSession();

    if (!user || user.user.role?.toLowerCase() !== "direktur") {
      throw new Error("Not Unauthorized");
    }

    if (alasan || alasan === "") {
      const job = await prisma.job.findUnique({
        where: {
          id: jobId,
        },
      });

      if (job?.companyLogoUrl) {
        del(job.companyLogoUrl);
      }

      const jobDeleted = await prisma.job.delete({
        where: {
          id: jobId,
        },
      });
      revalidatePath("/");
      if (jobDeleted) {
        return {
          message: `Berhasil Deleted Lowongan ${jobDeleted.title}`,
        };
      }
    }
  } catch (error) {
    return {
      error: handleError(error),
    };
  }

  redirect("/direktur/job");
}
