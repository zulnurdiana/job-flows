import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";
import logo from "@/assets/logo.png";

const Header = () => {
  return (
    <header className="shadow-sm max-w-5xl m-auto py-3 px-4 flex items-center justify-between">
      <Link href={"/"} className="flex items-center gap-3">
        <Image src={logo} alt="logo" width={40} height={40} />
        <span className="font-bold tracking-tight text-xl">Job Flows</span>
      </Link>
      <Button asChild>
        <Link href={"/job/new"}>Post a job</Link>
      </Button>
    </header>
  );
};

export default Header;
