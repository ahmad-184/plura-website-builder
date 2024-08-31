"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LogOutIcon } from "lucide-react";
import { logoutUser } from "@/actions/auth";

const AuthUserAvatar = ({
  alt,
  src,
  className,
}: {
  alt: string;
  src: string;
  className?: string;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className={cn("h-8 w-8 relative flex-none", className)}>
          <Image
            src={src}
            fill
            className={"rounded-full object-cover"}
            alt={alt}
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={async () => {
            await logoutUser();
          }}
          className="flex items-center gap-1"
        >
          <LogOutIcon size={19} /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default AuthUserAvatar;
