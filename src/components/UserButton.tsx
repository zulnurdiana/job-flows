import { LogOut } from "lucide-react";
import { User } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { signOut } from "next-auth/react";
import {
  StickyNote,
  FileInput,
  CheckCheck,
  ListStart,
  UserRoundCheck,
  FilePen,
  BookUser,
  UserSearch,
  SmilePlus,
  Users,
} from "lucide-react";
import UserProfilePlaceHolder from "@/assets/profile.jpeg";

interface UserButtonProps {
  user: User;
}

export default function UserButton({ user }: UserButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" className="flex-none rounded-full">
          <Image
            src={user.image || UserProfilePlaceHolder}
            alt="User profile picture"
            width={50}
            height={50}
            className="aspect-square rounded-full bg-background object-cover"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>
          {user.name || "User"} as {user.role}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {/* <DropdownMenuItem asChild>
            <Link href="/settings">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem> */}

          {/* TODO: Show this only for HR */}
          {user.role?.toLocaleLowerCase() === "hr" && (
            <>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/hr/job/new">
                  <FilePen className="mr-2 h-4 w-4" />
                  Posting Lowongan
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/hr/persyaratan">
                  <BookUser className="mr-2 h-4 w-4" />
                  Daftar Persyaratan
                </Link>
              </DropdownMenuItem>
            </>
          )}

          {/* TODO: Show this only for Direktur */}
          {user.role?.toLocaleLowerCase() === "direktur" && (
            <>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/direktur/permintaan">
                  <UserRoundCheck className="mr-2 h-4 w-4" />
                  Approve Permintaan
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/direktur/job">
                  <UserSearch className="mr-2 h-4 w-4" />
                  Approve Lowongan
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/direktur/pegawai/daftar-pegawai">
                  <Users className="mr-2 h-4 w-4" />
                  Daftar Pegawai
                </Link>
              </DropdownMenuItem>
            </>
          )}

          {/* TODO: Show this only for User */}
          {user.role?.toLocaleLowerCase() === "user" && (
            <>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/user/permintaan/new">
                  <FileInput className="mr-2 h-4 w-4" />
                  Form Permintaan
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/user/permintaan/daftar-permintaan">
                  <ListStart className="mr-2 h-4 w-4" />
                  Daftar Permintaan
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/user/kriteria/daftar-kriteria">
                  <SmilePlus className="mr-2 h-4 w-4" />
                  Daftar Kriteria
                </Link>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex w-full items-center"
          >
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
