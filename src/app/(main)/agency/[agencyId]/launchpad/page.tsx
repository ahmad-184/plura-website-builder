import { getAgency } from "@/actions/agency";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircleIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import SaveApp from "@/components/save-webapp";
import PageWrapper from "@/components/page-wrapper";
import { protectAgencyRoute } from "@/actions/auth";
import AnimateFadeIn from "@/components/animate/animate-fade-in";

export default async function Page({
  params,
  searchParams,
}: {
  params: { agencyId: string };
  searchParams: { code: string };
}) {
  await protectAgencyRoute();

  const agencyDetails = await getAgency(params.agencyId);

  if (!agencyDetails) return redirect("/");

  const allDetailsExist =
    agencyDetails.address &&
    agencyDetails.agencyLogo &&
    agencyDetails.city &&
    agencyDetails.companyEmail &&
    agencyDetails.companyPhone &&
    agencyDetails.country &&
    agencyDetails.name &&
    agencyDetails.state &&
    agencyDetails.zipCode;

  return (
    <AnimateFadeIn>
      <PageWrapper>
        <Card className="border-none">
          <CardHeader>
            <CardTitle>Lets get started</CardTitle>
            <CardDescription>
              Follow the step below to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <SaveApp />
            <div className="flex justify-between items-center w-full border p-4 rounded-lg gap-2">
              <div className="flex md:items-center gap-4 flex-col md:!flex-row">
                <Image
                  src={"/stripelogo.png"}
                  alt="stripe logo"
                  width={80}
                  height={80}
                  className="rounded-md object-contain"
                />
                <p>
                  Connect your stripe account to accept payments and see your
                  dashboard
                </p>
              </div>
              <Button>Start</Button>
            </div>

            <div className="flex justify-between items-center w-full border p-4 rounded-lg gap-2">
              <div className="flex md:items-center gap-4 flex-col md:!flex-row">
                <Image
                  src={agencyDetails.agencyLogo}
                  alt="app logo"
                  width={80}
                  height={80}
                  className="rounded-md object-contain"
                />
                <p>Fill in all your bussiness details</p>
              </div>
              {!allDetailsExist ? (
                <Link
                  className={buttonVariants({ variant: "default" })}
                  href={`/agency/${agencyDetails.id}/settings`}
                >
                  Start
                </Link>
              ) : (
                <CheckCircleIcon
                  className="text-primary p-2 flex-shrink-0"
                  size={50}
                />
              )}
            </div>
          </CardContent>
        </Card>
      </PageWrapper>
    </AnimateFadeIn>
  );
}
