import { getCurrentUserData } from "@/actions/user";
import { SidebarType } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import UserDetails from "@/components/user-details";
import { redirect } from "next/navigation";

export default async function UserSettings({ type }: { type: SidebarType }) {
  const user = await getCurrentUserData();
  if (!user) return redirect("/");

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Details</CardTitle>
        <CardDescription>Change your account information</CardDescription>
      </CardHeader>
      <CardContent>
        <UserDetails type={type} user={user} />
      </CardContent>
    </Card>
  );
}
