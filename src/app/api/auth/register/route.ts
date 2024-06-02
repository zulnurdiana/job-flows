import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    const checkedEmail = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (checkedEmail) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 409 },
      );
    } else {
      const hashedPassword = await hash(password, 10);

      await prisma.user.create({
        data: {
          name: name,
          email: email,
          password: hashedPassword,
        },
      });

      // Hanya kirim respons sukses jika pengguna berhasil dibuat
      return NextResponse.json({ message: "success" });
    }
  } catch (e: unknown) {
    console.log({ e });
    if (e instanceof Error) {
      return NextResponse.json(
        { message: "An error occurred", error: e.message },
        { status: 500 },
      );
    }
    return NextResponse.json(
      { message: "An unknown error occurred" },
      { status: 500 },
    );
  }
}
