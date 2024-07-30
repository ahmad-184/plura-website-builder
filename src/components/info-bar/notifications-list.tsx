"use client";

import { NotificationsType } from "@/actions/notification";
import { SidebarType } from "@/types";
import { SheetDescription } from "../ui/sheet";
import { Switch } from "../ui/switch";
import { Card } from "../ui/card";
import CustomAvatar from "../custom/custom-avatar";

export default function NotificationsList({
  data,
  type,
  role,
}: {
  data: NotificationsType;
  type: SidebarType;
  role: string;
}) {
  return (
    <>
      {type === "subaccount" &&
      (role === "AGENCY_OWNER" || role === "AGENCY_ADMIN") ? (
        <>
          <SheetDescription>
            <Card className="p-4 flex items-center justify-between">
              <p>Current Subaccount</p>
              <Switch defaultChecked={false} />
            </Card>
          </SheetDescription>
        </>
      ) : null}
      <div className="w-full flex-col gap-2">
        {data.map((not) => (
          <div
            className="w-full p-3 flex flex-col gap-y-2 overflow-x-auto text-ellipsis"
            key={not.id}
          >
            <div className="flex gap-2">
              <CustomAvatar user={not.User} />
              <div className="flex flex-col">
                <p>
                  <span className="font-bold">
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
                  {new Date(not.createdAt).toLocaleDateString()}
                </small>
              </div>
            </div>
          </div>
        ))}
        {!data.length && (
          <div className="w-full text-center mt-5">
            <p className="text-muted-foreground text-sm">
              ...There's no notifications...
            </p>
          </div>
        )}
      </div>
    </>
  );
}
