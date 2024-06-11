import { redirect } from "next/navigation";
import LoginForm from "./form";
import getSession from "@/lib/getSession";

export default async function LoginPage() {
  const session = await getSession();

  if (session) {
    redirect("/");
  }

  return (
    <section className="min-h-[400px]">
      <LoginForm />
    </section>
  );
}
