"use server";

import { handleError } from "@/lib/utils";
import { createBiodataSchema } from "@/lib/validation";
import prisma from "@/lib/prisma";
import { nanoid } from "nanoid";
import { put } from "@vercel/blob";
import path from "path";

export async function createBiodata(formData: FormData, id_user: string) {
  try {
    const values = Object.fromEntries(formData.entries());

    const { umur, pendidikan, status_pernikahan, alamat, jenis_kelamin, cv } =
      createBiodataSchema.parse(values);

    const pdf_name = `cv-${nanoid()}`;
    let cvUrl: string | undefined = undefined;
    if (cv) {
      const blog = await put(`cv/${pdf_name}${path.extname(cv.name)}`, cv, {
        access: "public",
        addRandomSuffix: false,
      });

      cvUrl = blog.url;
    }

    const newBiodata = await prisma.user.update({
      where: {
        id: id_user,
      },
      data: {
        umur: parseInt(umur),
        pendidikan: pendidikan,
        status_pernikahan: status_pernikahan,
        alamat: alamat,
        jenis_kelamin: jenis_kelamin,
        cv: cvUrl,
      },
    });
    if (newBiodata) {
      return {
        message: `Berhasil Menambahkan Biodata`,
        code: 201,
      };
    }
  } catch (error) {
    return {
      error: handleError(error),
    };
  }
}
