"use client";

import AgencyDetails from "@/components/agency-details";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CreateNewAgecny({
  companyEmail,
}: {
  companyEmail: string;
}) {
  return (
    <Card className="border-none dark:bg-gray-900 bg-gray-50 shadow-md">
      <CardHeader>
        <CardTitle>Agency information</CardTitle>
        <CardDescription>
          Let's create an agency for your bussiness. You can edit agency
          settings later from agency setting tab
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AgencyDetails data={{ companyEmail }} />
      </CardContent>
    </Card>
  );
}
