import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { HomeIcon } from "lucide-react";

export default function PageNotFound() {
  return (
    <div className="p-4 text-center h-screen w-screen flex justify-center items-center flex-col">
      <h1 className="mb-2 text-3xl md:text-6xl dark:text-gray-200">
        Page not found!
      </h1>
      <p className="mb-5 dark:text-gray-500">
        Page you looking for dos not exist or maby deleted
      </p>
      <Link
        href="/"
        className={buttonVariants({ variant: "default", className: "gap-2" })}
      >
        Back to home
        <HomeIcon size={20} />
      </Link>
    </div>
  );
}
