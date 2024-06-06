"use server";

import getSession from "@/lib/getSession";
import prisma from "@/lib/prisma";
import { handleError } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function lamarLowongan(formData: FormData) {
  try {
    const id_job = parseInt(formData.get("id_job") as string);

    const session = await getSession();
    const user = session?.user;

    if (!user || user.role?.toLocaleLowerCase() !== "pelamar") {
      throw new Error("Not Unauthorized");
    }

    const userUpdate = await prisma.user.update({
      data: {
        id_job: id_job,
      },
      include: {
        job: true,
      },
      where: {
        id: user.id,
      },
    });
    
    revalidatePath("/");

    if (userUpdate) {
      return {
        success: true,
        message: `Anda telah berhasil melamar pada jabatan ${userUpdate.job?.title}`,
      };
    }
  } catch (error) {
    return {
      error: handleError(error),
    };
  }
}
