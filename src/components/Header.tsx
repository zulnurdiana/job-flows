"use client";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";
import logo from "@/assets/logo.png";
import { signIn, useSession } from "next-auth/react";
import UserButton from "./UserButton";

const Header = () => {
  const session = useSession();
  const user = session.data?.user;

  return (
    <header className="shadow-sm max-w-5xl m-auto py-3 px-4 flex items-center justify-between">
      <Link href={"/"} className="flex items-center gap-3">
        <Image src={logo} alt="logo" width={40} height={40} />
        <span className="font-bold tracking-tight text-xl">Job Flows</span>
      </Link>
      <div className="flex items-center gap-3">
        {!user && logginButton()}
        {user && <UserButton user={user} />}
        {user?.role === "admin" && (
          <Button asChild>
            <Link href={"/job/new"}>Post a job</Link>
          </Button>
        )}

        {user?.role === "admin" && (
          <Button asChild>
            <Link href={"/permintaan/new"}>Permintaan</Link>
          </Button>
        )}
      </div>
    </header>
  );

  function logginButton() {
    return <Button onClick={() => signIn()}>Sign in</Button>;
  }
};

export default Header;
