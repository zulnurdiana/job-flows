"use server";

import getSession from "@/lib/getSession";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function lamarLowongan(formData: FormData) {
  try {
    const id_job = parseInt(formData.get("id_job") as string);

    const session = await getSession();
    const user = session?.user;

    if (!user || user.role?.toLocaleLowerCase() !== "pelamar") {
      throw new Error("Not Unauthorized");
    }

    await prisma.user.update({
      data: {
        id_job: id_job,
      },
      where: {
        id: user.id,
      },
    });
    revalidatePath("/");
    return {
      success: true,
      message: "Anda telah berhasil melamar pekerjaan ini.",
    };
  } catch (error) {
    return {
      success: false,
      message: "Terjadi kesalahan saat melamar pekerjaan.",
    };
  }
}
