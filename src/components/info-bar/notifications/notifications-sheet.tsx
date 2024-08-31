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
import { useEffect, useMemo, useState } from "react";
import { SeenedNotifsType, SidebarType } from "@/types";
import {
  getNotificationsByType,
  NotificationsType,
} from "@/actions/notification";
import { useQuery } from "@tanstack/react-query";

export default function NotificationsSheet({
  data: initialData,
  type,
  role,
  id,
}: {
  data: NotificationsType;
  type: SidebarType;
  role: string;
  notifs_length: number;
  id: string;
}) {
  const [length, setLength] = useState(0);
  const [currentAgencyNotfs, setCurrentAgencyNotfs] = useState(false);

  const { data, isFetched } = useQuery({
    queryKey: ["notifs"],
    initialData,
    queryFn: async () => {
      const res = await getNotificationsByType(type, id);
      if (res?.length) {
        return res;
      } else return [];
    },
    refetchInterval: 15_000,
    networkMode: "online",
    retry: 3,
  });

  useEffect(() => {
    if (window) {
      const stored_num = window.localStorage.getItem("seened_notifs") as string;
      const parsedData = JSON.parse(stored_num || "{}") as SeenedNotifsType;
      let new_obj: SeenedNotifsType = parsedData;
      if (new_obj !== null && new_obj[id]) {
        const res =
          parseFloat(data.length.toString()) - parseFloat(new_obj[id].amount);
        setLength(res < 0 ? 0 : res);
      } else {
        setLength(data.length);
      }
    }
  }, [window, data.length]);

  const fetchedData = useMemo(() => {
    if (currentAgencyNotfs) {
      const filtered = initialData?.filter(
        (e) => e.agencyId && !e.subAccountId
      );
      return filtered;
    } else {
      return initialData;
    }
  }, [isFetched, initialData, currentAgencyNotfs]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size={"icon"} className="rounded-full w-9 h-9 relative p-0">
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
          data={fetchedData || []}
          type={type}
          role={role}
          id={id}
          notifs_length={data.length}
          setLength={setLength}
          setCurrentAgencyNotfs={setCurrentAgencyNotfs}
          currentAgencyNotfs={currentAgencyNotfs}
        />
      </SheetContent>
    </Sheet>
  );
}
