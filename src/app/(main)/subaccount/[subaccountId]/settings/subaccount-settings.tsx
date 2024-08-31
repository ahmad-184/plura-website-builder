import { getSubAccount } from "@/actions/subaccount";
import SubAccountDetails from "@/components/subaccount-details";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { redirect } from "next/navigation";

export default async function SubaccountSettings({
  subaccountId,
}: {
  subaccountId: string;
}) {
  const subaccountData = await getSubAccount(subaccountId);
  if (!subaccountData) return redirect("/");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
        <CardDescription>
          Update your account business information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SubAccountDetails
          data={subaccountData}
          agencyId={subaccountData.agencyId}
        />
      </CardContent>
    </Card>
  );
}
