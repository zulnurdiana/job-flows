import { PrismaClient } from "@prisma/client";

const PrimsaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prisma: undefined | ReturnType<typeof PrimsaClientSingleton>;
}

const prisma = globalThis.prisma ?? PrimsaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
