import { redirect } from "next/navigation";

import FormPage from "./form";
import getSession from "@/lib/getSession";

export default async function RegisterPage() {
  const session = await getSession();

  if (session) {
    redirect("/");
  }

  return (
    <section className="max-w-5xl m-auto my-10 space-y-6">
      <FormPage />
    </section>
  );
}
