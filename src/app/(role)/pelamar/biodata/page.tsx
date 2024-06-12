import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";
import NewBiodataForm from "./NewBiodataForm";
import prisma from "@/lib/prisma";

const page = async () => {
  const session = await getSession();
  const userLogin = session?.user;
  const role = session?.user.role;

  if (!session || role?.toLowerCase() !== "pelamar") redirect("/");
  const user = await prisma.user.findUnique({
    where: {
      id: userLogin?.id,
    },
  });

  if (!user) redirect("/");

  return (
    <div>
      <NewBiodataForm user={user} />
    </div>
  );
};

export default page;
