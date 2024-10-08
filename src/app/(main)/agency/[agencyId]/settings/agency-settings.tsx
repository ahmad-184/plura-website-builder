import { getAgency } from "@/actions/agency";
import { protectAgencyRoute } from "@/actions/auth";
import AgencyDetails from "@/components/agency-details";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { redirect } from "next/navigation";

export default async function AgencySettings({
  agencyId,
}: {
  agencyId: string;
}) {
  const agenycData = await getAgency(agencyId);
  const user = await protectAgencyRoute();

  if (!agenycData) return redirect("/");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agency Settings</CardTitle>
        <CardDescription>
          Update your agency business information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AgencyDetails
          data={agenycData}
          user={JSON.parse(JSON.stringify(user))}
        />
      </CardContent>
    </Card>
  );
}
