"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import NotificationsList from "./notifications-list";
import { Button } from "@/components/ui/button";
import { BellIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { SeenedNotifsType, SidebarType } from "@/types";
import {
  getNotificationsByType,
  NotificationsType,
} from "@/actions/notification";
import { useQuery } from "@tanstack/react-query";

export default function NotificationsSheet({
  data,
  type,
  role,
  notifs_length,
  id,
}: {
  data: NotificationsType;
  type: SidebarType;
  role: string;
  notifs_length: number;
  id: string;
}) {
  const [length, setLength] = useState(0);

  useEffect(() => {
    if (window) {
      const stored_num = window.localStorage.getItem("seened_notifs") as string;
      const parsedData = JSON.parse(stored_num || "{}") as SeenedNotifsType;
      let new_obj: SeenedNotifsType = parsedData;
      if (new_obj !== null && new_obj[id]) {
        const res =
          parseFloat(notifs_length.toString()) - parseFloat(new_obj[id].amount);
        setLength(res < 0 ? 0 : res);
      } else {
        setLength(notifs_length);
      }
    }
  }, [window, notifs_length]);

  const { data: initialData } = useQuery({
    queryKey: ["notifs"],
    initialData: data,
    queryFn: async () => {
      const res = await getNotificationsByType(type, id);
      if (res?.length) return res;
      else return [];
    },
    refetchInterval: 15_000,
    networkMode: "online",
    retry: 3,
  });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size={"icon"}
          className="rounded-full w-[33px] h-[33px] relative"
        >
          <BellIcon className="text-white" size={18} fill="white" />
          {length === 0 ? null : (
            <Badge className="absolute flex items-center justify-center top-[-6px] right-[-6px] px-0 w-[22px] text-xs bg-blue-300 hover:bg-blue-300 text-black">
              {length}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent showX side={"right"} className="overflow-auto">
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
        </SheetHeader>
        <NotificationsList
          data={initialData || []}
          type={type}
          role={role}
          id={id}
          notifs_length={notifs_length}
          setLength={setLength}
        />
      </SheetContent>
    </Sheet>
  );
}
