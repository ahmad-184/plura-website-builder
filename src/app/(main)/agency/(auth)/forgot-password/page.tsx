import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/auth";
import ForgotPassword from "./forgot-password";
import { verifyJwtToken } from "@/lib/use-case";
import ResetPassword from "../../_components/reset-password";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon } from "lucide-react";

export default async function Page({
  searchParams,
}: {
  searchParams: { token: string };
}) {
  const user = await getCurrentUser();
  if (user) return redirect("/");

  if (searchParams.token) {
    try {
      await verifyJwtToken(searchParams.token);

      return <ResetPassword token={searchParams.token} />;
    } catch (err) {
      console.log(err);

      return (
        <div className="w-[340px] md:w-[400px] py-6">
          <h1 className="text-4xl text-center mb-3 font-semibold">
            Oops, Something went wrong
          </h1>
          <p className="text-muted-foreground text-center">
            Your link is expired or invalid, please get new link
          </p>
          <div className="w-full flex justify-center mt-3">
            <Link
              href={"/"}
              className={cn(
                buttonVariants({ variant: "secondary" }),
                "flex items-center gap-1"
              )}
            >
              <ChevronLeftIcon size={19} />
              Back To Home
            </Link>
          </div>
        </div>
      );
    }
  }

  return <ForgotPassword />;
}
