import { redirect } from "next/navigation";

import FormPage from "./form";
import getSession from "@/lib/getSession";

export default async function RegisterPage() {
  const session = await getSession();

  if (session) {
    redirect("/");
  }

  return (
    <section>
      <FormPage />
    </section>
  );
}
