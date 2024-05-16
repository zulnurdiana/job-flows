"use client";

import { Button } from "@/components/ui/button";
import { useClerk } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";

const AdminNavbar = () => {
  const { user, signOut } = useClerk();
  const router = useRouter();
  return (
    <div className="max-w-5xl my-3 m-auto p-5 flex items-center justify-between space-x-2">
      <Link href={"/admin"} className="text-lg font-bold underline">
        Admin Page
      </Link>
      <div className="flex items-center gap-3">
        <h3>{user?.primaryEmailAddress?.emailAddress}</h3>
        <Button
          onClick={async () => {
            await signOut();
            router.push("/");
          }}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default AdminNavbar;
