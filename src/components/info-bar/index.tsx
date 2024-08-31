import { cn } from "@/lib/utils";
import { SidebarType } from "@/types";
import { Suspense } from "react";
import Notifications from "./notifications";
import { Skeleton } from "../ui/skeleton";
import { ModeToggle } from "../mode-toggle";
import { getCurrentUser } from "@/actions/auth";
import { redirect } from "next/navigation";
import AuthUserAvatar from "../auth-user-avatar";

const NotificationFallback = () => {
  return <Skeleton className="w9 h-9 rounded-full" />;
};

export default async function InfoBar({
  type,
  id,
  className,
}: {
  type: SidebarType;
  id: string;
  className?: string;
}) {
  const user = await getCurrentUser();
  if (!user) return redirect("/sign-in");

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-[12] md:ml-[300px] px-6 py-4 bg-background/80 backdrop-blur-md flex gap-4 items-center border-b-[1px]",
        className
      )}
    >
      <div className="w-full h-full flex items-center justify-end">
        {/* <BackButton /> */}
        <div className="flex items-center gap-2">
          <AuthUserAvatar
            src={user.avatarUrl}
            className="w-9 h-9"
            alt="user avatar"
          />
          <Suspense fallback={<NotificationFallback />}>
            <Notifications type={type} id={id} />
          </Suspense>
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}
