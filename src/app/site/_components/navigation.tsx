import { getCurrentUser } from "@/actions/auth";
import AuthUserAvatar from "@/components/auth-user-avatar";
import { ModeToggle } from "@/components/mode-toggle";
import PluraLogo from "@/components/plura-logo";
import UserAvatar from "@/components/user-avatar";
import Image from "next/image";
import Link from "next/link";

export default async function Navigation() {
  const user = await getCurrentUser();

  return (
    <div className="p-4 flex items-center justify-between relative">
      <PluraLogo />
      <nav className="hidden md:block absolute left-[50%] right-[50%] transform translate-x-[-50%]">
        <ul className="flex items-center justify-center gap-8">
          <Link href={"#"}>Pricing</Link>
          <Link href={"#"}>About</Link>
          <Link href={"#"}>Documentation</Link>
          <Link href={"#"}>Features</Link>
        </ul>
      </nav>
      <aside className="flex gap-2 items-center">
        <ModeToggle />
        <Link
          href={"/agency"}
          className="inline-flex py-2 animate-background-shine
           items-center justify-center rounded-md border
            border-gray-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] 
             bg-[length:200%_100%] px-6 font-medium text-gray-300
              transition-colors focus:outline-none focus:ring-2
               focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-50"
        >
          {user?.id ? "Dashboard" : "Login"}
        </Link>
        {user?.id ? (
          <AuthUserAvatar
            className="w-10 h-10"
            alt="user avatar"
            src={user.avatarUrl}
          />
        ) : null}
      </aside>
    </div>
  );
}
