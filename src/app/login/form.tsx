"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import logo from "@/assets/logo.png";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";
import Image from "next/image";

const FormSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

type FormData = z.infer<typeof FormSchema>;

export default function LoginForm() {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    const { email, password } = data;

    try {
      const response: any = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!response?.error) {
        toast({ title: "Login Successful" });
        router.push("/");
        router.refresh();
      } else {
        toast({ title: "Login Failed", description: "Password tidak cocok" });
      }
    } catch (error: any) {
      console.error("Login Failed:", error);
      toast({ title: "Login Failed", description: error.message });
    }
  };

  const handleOAuthSignIn = (provider: string) => async () => {
    try {
      const response = await signIn(provider, { redirect: false });

      if (!response?.error) {
        router.push("/");
        router.refresh();
      } else {
        toast({ title: "Login Failed", description: response.error });
      }
    } catch (error: any) {
      console.error("Login Failed:", error);
      toast({ title: "Login Failed", description: error.message });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <Link href="/" className="flex justify-center items-center gap-3 mb-6">
          <Image src={logo} alt="logo" width={200} height={200} />
        </Link>
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Login
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      className="text-black"
                      placeholder="Enter your email"
                      {...field}
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      className="text-black"
                      placeholder="Enter your password"
                      {...field}
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </form>
          <div className="flex items-center mt-4 mb-4">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-4 text-gray-600">or</span>
            <hr className="flex-grow border-gray-300" />
          </div>
          <div className="flex flex-col items-center gap-y-2">
            <Button
              type="button"
              className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition duration-200"
              onClick={handleOAuthSignIn("google")}
            >
              Sign in with Google
            </Button>
          </div>
          <div className="text-center text-sm text-gray-600 mt-6">
            <p>
              Belum mempunyai akun? <br />
              <Link href="/register" className="text-blue-600 hover:underline">
                Daftar sekarang
              </Link>
            </p>
          </div>
        </Form>
      </div>
    </div>
  );
}
