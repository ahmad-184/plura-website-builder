"use client";

import { NotificationsType } from "@/actions/notification";
import { SeenedNotifsType, SidebarType } from "@/types";
import { SheetDescription } from "../../ui/sheet";
import { Switch } from "../../ui/switch";
import { Card } from "../../ui/card";
import CustomAvatar from "../../custom/custom-avatar";
import { format, isThisWeek, isThisYear, isToday, isYesterday } from "date-fns";
import { fTimestamp } from "@/lib/formatTime";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect, useState } from "react";
import { packNotificationsByDate } from "@/lib/use-case";

type DataType = { date: string; data: NotificationsType }[];

export default function NotificationsList({
  data,
  type,
  role,
  notifs_length,
  setLength,
  id,
  setCurrentAgencyNotfs,
  currentAgencyNotfs,
}: {
  data: NotificationsType;
  type: SidebarType;
  role: string;
  notifs_length: number;
  setLength: (num: number) => void;
  id: string;
  setCurrentAgencyNotfs: (e: boolean) => void;
  currentAgencyNotfs: boolean;
}) {
  const [notifications, setNotifications] = useState<DataType | []>([]);

  useEffect(() => {
    setNotifications(packNotificationsByDate(data));
  }, [data]);

  useEffect(() => {
    if (window) {
      setLength(0);
      const getNotifs = window.localStorage.getItem("seened_notifs") as string;
      let parsedData = JSON.parse(getNotifs || "{}") as SeenedNotifsType;
      let new_obj: SeenedNotifsType = parsedData;
      new_obj[id] = {
        account_id: id,
        amount: notifs_length.toString(),
      };

      window.localStorage.setItem("seened_notifs", JSON.stringify(new_obj));
    }
  }, [window, notifs_length]);

  return (
    <>
      {type === "agency" &&
      (role === "AGENCY_OWNER" || role === "AGENCY_ADMIN") ? (
        <>
          <SheetDescription>
            <Card className="p-4 flex items-center justify-between">
              <p>Agency notifications</p>
              <Switch
                onCheckedChange={setCurrentAgencyNotfs}
                checked={currentAgencyNotfs}
              />
            </Card>
          </SheetDescription>
        </>
      ) : null}
      {notifications.length ? (
        <Accordion
          type="multiple"
          defaultValue={notifications.map((d) => d.date)}
          className="w-full"
        >
          <div className="w-full flex-col gap-2 h-fit overflow-auto mt-3">
            {notifications.map((d, index) => {
              const date = d.data[0].createdAt.toString();
              const isDateForToday = date ? isToday(fTimestamp(date)) : false;
              const isDateForYesterday = date
                ? isYesterday(fTimestamp(date))
                : false;
              const isDateForThisWeek = date
                ? isThisWeek(fTimestamp(date))
                : false;
              const isDateForThisYear = date
                ? isThisYear(fTimestamp(date))
                : false;

              const HM = date ? format(fTimestamp(date), "p") : "";
              const day = date ? format(fTimestamp(date), "dd") : "";
              const weekDay = date ? format(fTimestamp(date), "EE") : "";
              const month = date ? format(fTimestamp(date), "MMM") : "";
              const year = date ? format(fTimestamp(date), "yyyy") : "";

              const time = (
                <>
                  {`${
                    isDateForToday
                      ? "Today"
                      : isDateForYesterday
                      ? "Yesterday"
                      : ""
                  } `}
                  {`${
                    !isDateForToday && !isDateForYesterday && isDateForThisWeek
                      ? weekDay
                      : ""
                  } `}
                  {`${
                    !isDateForToday &&
                    !isDateForYesterday &&
                    !isDateForThisWeek &&
                    isDateForThisYear
                      ? `${day} ${month}`
                      : ""
                  } `}
                  {`${
                    !isDateForToday && !isDateForThisWeek && !isDateForThisYear
                      ? `${day} ${month} ${year}`
                      : ""
                  } `}
                </>
              );

              return (
                <div className="flex w-full flex-col gap-2" key={index}>
                  <AccordionItem className="border-b-0" value={d.date}>
                    <AccordionTrigger className="hover:no-underline">
                      <p className="text-xs fond-bold text-muted-foreground">
                        {time}
                      </p>
                    </AccordionTrigger>
                    <AccordionContent>
                      {d.data.map((not) => (
                        <div
                          className="w-full dark:bg-muted/40 bg-muted/60 relative mb-2 rounded-lg p-3 flex flex-col gap-y-2 overflow-x-auto text-ellipsis"
                          key={not.id}
                        >
                          <div className="flex gap-2">
                            <CustomAvatar user={not.User} />
                            <div className="flex flex-col gap-[1px] flex-1">
                              <p>
                                <span className="font-bold dark:text-gray-200">
                                  {not.notification.split("|")[0]}
                                </span>
                                <span className="text-muted-foreground">
                                  {not.notification.split("|")[1]}
                                </span>
                                <span className="font-bold">
                                  {not.notification.split("|")[2]}
                                </span>
                              </p>
                              <small className="text-xs text-muted-foreground">
                                {format(
                                  fTimestamp(not.createdAt.toString()),
                                  "p"
                                )}
                              </small>
                            </div>
                          </div>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </div>
              );
            })}
            {!data.length && (
              <div className="w-full text-center mt-5">
                <p className="text-muted-foreground text-sm">
                  ...There's no notifications...
                </p>
              </div>
            )}
          </div>
        </Accordion>
      ) : null}
    </>
  );
}
