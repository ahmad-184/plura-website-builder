import { cn } from "@/lib/utils";
import { SidebarType } from "@/types";
import { UserButton } from "@clerk/nextjs";
import { Suspense } from "react";
import Notifications from "./notifications";
import { Skeleton } from "../ui/skeleton";

const NotificationFallback = () => {
  return <Skeleton className="w-[33px] h-[33px] rounded-full" />;
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
  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-[12] md:ml-[300px] px-4 py-4 bg-background/80 backdrop-blur-md flex gap-4 items-center border-b-[1px]",
        className
      )}
    >
      <div className="flex items-center gap-2 ml-auto">
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "w-[33px] h-[33px]",
            },
          }}
        />
        <Suspense fallback={<NotificationFallback />}>
          <Notifications type={type} id={id} />
        </Suspense>
      </div>
    </div>
  );
}
