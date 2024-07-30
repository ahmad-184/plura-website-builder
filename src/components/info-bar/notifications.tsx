import {
  getNotificationsByType,
  NotificationsType,
} from "@/actions/notification";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { BellIcon } from "lucide-react";
import { SidebarType } from "@/types";
import { currentUser } from "@clerk/nextjs/server";
import NotificationsList from "./notifications-list";

export default async function Notifications({
  type,
  id,
}: {
  type: SidebarType;
  id: string;
}) {
  const notifs = await getNotificationsByType(type, id);
  const user = await currentUser();
  const role = user?.privateMetadata.role as string;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size={"icon"} className="rounded-full w-[33px] h-[33px]">
          <BellIcon className="text-white" size={18} fill="white" />
        </Button>
      </SheetTrigger>
      <SheetContent side={"right"} className="w-[300px]">
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
        </SheetHeader>
        <NotificationsList data={notifs} type={type} role={role} />
      </SheetContent>
    </Sheet>
  );
}
