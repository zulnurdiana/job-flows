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

    const checkProfile = await prisma.profile.findFirst({
      where: {
        id_user: id_user,
      },
    });

    const nama_lengkap = await prisma.user.findUnique({
      where: {
        id: id_user,
      },
      select: {
        name: true,
      },
    });

    const {
      tgl_lahir,
      pendidikan,
      status_pernikahan,
      alamat,
      jenis_kelamin,
      cv,
    } = createBiodataSchema.parse(values);

    if (checkProfile) {
      const pdf_name = `cv-${nanoid()}`;
      let cvUrl: string | undefined = undefined;
      if (cv) {
        const blog = await put(`cv/${pdf_name}${path.extname(cv.name)}`, cv, {
          access: "public",
          addRandomSuffix: false,
        });

        cvUrl = blog.url;
      }

      const updateBiodata = await prisma.profile.update({
        where: {
          id_user: id_user,
        },
        data: {
          nama_lengkap: nama_lengkap?.name,
          tgl_lahir: new Date(tgl_lahir),
          pendidikan: pendidikan,
          status_pernikahan: status_pernikahan,
          alamat: alamat,
          jenis_kelamin: jenis_kelamin,
          cv: cvUrl,
        },
      });
      if (updateBiodata) {
        return {
          message: `Berhasil Update Biodata`,
          code: 201,
        };
      }
    } else {
      const pdf_name = `cv-${nanoid()}`;
      let cvUrl: string | undefined = undefined;
      if (cv) {
        const blog = await put(`cv/${pdf_name}${path.extname(cv.name)}`, cv, {
          access: "public",
          addRandomSuffix: false,
        });

        cvUrl = blog.url;
      }
      const newBiodata = await prisma.profile.create({
        data: {
          nama_lengkap: nama_lengkap?.name,
          tgl_lahir: new Date(tgl_lahir),
          pendidikan: pendidikan,
          status_pernikahan: status_pernikahan,
          alamat: alamat,
          jenis_kelamin: jenis_kelamin,
          cv: cvUrl,
          id_user: id_user,
        },
      });
      if (newBiodata) {
        return {
          message: `Berhasil Menambahkan Biodata`,
          code: 201,
        };
      }
    }
  } catch (error) {
    return {
      error: handleError(error),
    };
  }
}
