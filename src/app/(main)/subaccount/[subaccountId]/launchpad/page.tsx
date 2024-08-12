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
import PageWrapper from "@/components/page-wrapper";
import { getCurrentUser } from "@/actions/user";
import { getSubAccount } from "@/actions/subaccount";
import SaveApp from "@/components/save-webapp";
import AnimateFadeIn from "@/components/animate/animate-fade-in";

export const revalidate = 60;

export default async function Page({
  params,
  searchParams,
}: {
  params: { subaccountId: string };
  searchParams: { code: string; state: string };
}) {
  const user = await getCurrentUser();
  if (!user) return redirect("/");

  const subaccountDetails = await getSubAccount(params.subaccountId);

  if (!subaccountDetails) return redirect("/");

  const allDetailsExist =
    subaccountDetails.address &&
    subaccountDetails.subAccountLogo &&
    subaccountDetails.city &&
    subaccountDetails.companyEmail &&
    subaccountDetails.companyPhone &&
    subaccountDetails.country &&
    subaccountDetails.name &&
    subaccountDetails.state &&
    subaccountDetails.zipCode;

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
                  src={subaccountDetails.subAccountLogo}
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
                  href={`/agency/${subaccountDetails.id}/settings`}
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
