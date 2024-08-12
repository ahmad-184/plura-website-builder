import CreateSubaccountButton from "@/components/sidebar/create-subaccount-button";
import Subaccounts, { SubaccountsSkeleton } from "./subaccounts";
import { Suspense } from "react";
import PageWrapper from "@/components/page-wrapper";
import { protectAgencyRoute } from "@/actions/auth";
import AnimateFadeIn from "@/components/animate/animate-fade-in";

export const revalidate = 60;

export default async function Page({
  params,
}: {
  params: { agencyId: string };
}) {
  const user = await protectAgencyRoute();

  return (
    <PageWrapper>
      <div className="flex w-full flex-col gap-3">
        <AnimateFadeIn>
          <div className="flex w-full justify-between items-start gap-4">
            <h1 className="text-3xl font-semibold tracking-tight">
              Sub Accounts
            </h1>
            {user?.role === "AGENCY_OWNER" ? (
              <CreateSubaccountButton
                agencyId={params.agencyId}
                className="w-[200px]"
              />
            ) : null}
          </div>
        </AnimateFadeIn>
        <Suspense fallback={<SubaccountsSkeleton />}>
          <AnimateFadeIn>
            <Subaccounts agencyId={params.agencyId} />
          </AnimateFadeIn>
        </Suspense>
      </div>
    </PageWrapper>
  );
}
