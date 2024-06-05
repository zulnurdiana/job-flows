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
  const status = session.status;

  return (
    <header className="shadow-sm max-w-5xl m-auto py-3 px-4 flex items-center justify-between border-b">
      <Link href={"/"} className="flex items-center gap-3">
        <Image src={logo} alt="logo" width={150} height={150} />
      </Link>
      <div className="flex items-center gap-3">
        <span className="text-sm"> {user?.name}</span>

        {status === "unauthenticated" && logginButton()}
        {user && <UserButton user={user} />}
      </div>
    </header>
  );

  function logginButton() {
    return <Button onClick={() => signIn()}>Sign in</Button>;
  }
};

export default Header;
