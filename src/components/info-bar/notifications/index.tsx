import { getNotificationsByType } from "@/actions/notification";
import { SidebarType } from "@/types";
import NotificationsSheet from "./notifications-sheet";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/auth";

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

  if (!user) return redirect("/sign-in");
  if (!user.role) return redirect("/agency");

  return (
    <NotificationsSheet
      data={JSON.parse(JSON.stringify(notifs))}
      type={type}
      role={user.role}
      notifs_length={notifs.length}
      id={id}
    />
  );
}
