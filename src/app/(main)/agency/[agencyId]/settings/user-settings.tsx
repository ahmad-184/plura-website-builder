import { SidebarType } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import UserDetails from "@/components/user-details";
import { validateUser } from "@/actions/auth";

export default async function UserSettings({ type }: { type: SidebarType }) {
  const user = await validateUser();

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
