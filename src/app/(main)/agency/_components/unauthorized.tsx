import { buttonVariants } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {};

const Unauthorized = (props: Props) => {
  return (
    <div className="p-4 text-center h-screen w-screen flex justify-center items-center flex-col">
      <h1 className="text-3xl md:text-6xl dark:text-gray-200">
        Unauthorized acccess!
      </h1>
      <p className="mb-5 dark:text-gray-500">
        Please contact support or your agency owner to get access
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
};

export default Unauthorized;
