import GoogleIcon from "@/components/icons/google-icon";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function GoogleSignIn() {
  return (
    <Link
      href="/api/login/google"
      className={cn(
        buttonVariants({
          variant: "secondary",
        }),
        "w-full"
      )}
    >
      <GoogleIcon className="mr-2 h-5 w-5" />
      Sign in with Google
    </Link>
  );
}
