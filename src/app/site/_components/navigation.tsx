import { ModeToggle } from "@/components/mode-toggle";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

export default function Navigation() {
  const user_id = auth().userId;

  return (
    <div className="p-4 flex items-center justify-between relative">
      <aside className="flex items-center gap-2">
        <Image
          src={"./assets/plura-logo.svg"}
          alt="plura logo"
          width={40}
          height={40}
        />
        <span className="text-xl font-bold">Plura.</span>
      </aside>
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
          // className="bg-primary font-medium text-white p-2 px-4 rounded-md hover:bg-primary/80"
          className="inline-flex py-2 animate-background-shine
           items-center justify-center rounded-md border
            border-gray-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] 
             bg-[length:200%_100%] px-6 font-medium text-gray-300
              transition-colors focus:outline-none focus:ring-2
               focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-50"
        >
          {user_id ? "Dashboard" : "Login"}
        </Link>
        {user_id ? (
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-[34px] h-[34px]",
              },
            }}
          />
        ) : null}
      </aside>
    </div>
  );
}
