import { getNotificationsByType } from "@/actions/notification";
import { SidebarType } from "@/types";
import { getCurrentUser } from "@/actions/user";
import NotificationsSheet from "./notifications-sheet";
import { redirect } from "next/navigation";

export default async function Notifications({
  type,
  id,
}: {
  type: SidebarType;
  id: string;
}) {
  const notifs = await getNotificationsByType(type, id);
  if (notifs === null) return redirect("/agency");
  const user = await getCurrentUser();
  const role = user?.privateMetadata.role as string;

  return (
    <NotificationsSheet
      data={JSON.parse(JSON.stringify(notifs))}
      type={type}
      role={role}
      notifs_length={notifs.length}
      id={id}
    />
  );
}
