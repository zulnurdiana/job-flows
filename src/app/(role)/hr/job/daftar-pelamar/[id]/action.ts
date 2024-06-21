"use server";

import getSession from "@/lib/getSession";
import prisma from "@/lib/prisma";
import { handleError } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function approvedScreening(formData: FormData) {
  try {
    const id_user = formData.get("id_user") as string;
    const session = await getSession();
    if (!session || session.user.role?.toLowerCase() !== "hr") {
      throw new Error("Not Authorized");
    }

    const approved = await prisma.user.update({
      data: {
        screening_approved: true,
      },
      where: {
        id: id_user,
      },
    });

    const jabatan = await prisma.job.findUnique({
      where: {
        id: approved.id_job || 0,
      },
    });

    revalidatePath("/");

    if (approved) {
      return {
        message: `Berhasil Approve Screening Untuk ${approved.name} pada jabatan ${jabatan?.title}`,
        code: 200,
      };
    }
  } catch (error) {
    return {
      error: handleError(error),
    };
  }
}

export async function rejectedScreening(formData: FormData) {
  try {
    const id_user = formData.get("id_user") as string;
    const session = await getSession();
    if (!session || session.user.role?.toLowerCase() !== "hr") {
      throw new Error("Not Authorized");
    }

    const rejected = await prisma.user.update({
      data: {
        screening_approved: false,
      },
      where: {
        id: id_user,
      },
    });

    const jabatan = await prisma.job.findUnique({
      where: {
        id: rejected.id_job || 0,
      },
    });

    revalidatePath("/");

    if (rejected) {
      return {
        message: `Berhasil Reject Screening Untuk ${rejected.name} pada jabatan ${jabatan?.title}`,
      };
    }
  } catch (error) {
    return {
      error: handleError(error),
    };
  }
}
