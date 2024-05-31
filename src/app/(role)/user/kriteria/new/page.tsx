import getSession from "@/lib/getSession";
import NewKriteriaForm from "./NewKriteriaForm";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Form Kriteria Baru",
};

const page = async () => {
  const session = await getSession();
  if (!session || session.user.role?.toLowerCase() !== "user")
    return redirect("/");
  return <NewKriteriaForm />;
};

export default page;
