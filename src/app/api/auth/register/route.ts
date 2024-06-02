import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    // YOU MAY WANT TO ADD SOME VALIDATION HERE
    const hashedPassword = await hash(password, 10);
    console.log({ email, password });
    await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
      },
    });
  } catch (e) {
    console.log({ e });
  }

  return NextResponse.json({ message: "success" });
}
