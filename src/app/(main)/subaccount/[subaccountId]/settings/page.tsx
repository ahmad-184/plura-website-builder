import { protectSubaccountRoute } from "@/actions/auth";
import UserSettings from "@/app/(main)/agency/[agencyId]/settings/user-settings";
import PageWrapper from "@/components/page-wrapper";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import SubaccountSettings from "./subaccount-settings";

export const revalidate = 60;

export default async function Page({
  params,
}: {
  params: { subaccountId: string };
}) {
  const user = await protectSubaccountRoute(params.subaccountId);

  return (
    <PageWrapper>
      <div className="w-full flex lg:justify-between lg:gap-4 flex-col gap-9 pb-5">
        {user?.role === "AGENCY_OWNER" ||
        user?.role === "AGENCY_ADMIN" ||
        user?.role === "SUBACCOUNT_ADMIN" ? (
          <Suspense fallback={<Skeleton className="w-full h-[800px]" />}>
            {/* <AgencySettings agencyId={params.agencyId} /> */}
            <SubaccountSettings subaccountId={params.subaccountId} />
          </Suspense>
        ) : null}
        <Suspense fallback={<Skeleton className="w-full h-[800px]" />}>
          <UserSettings type="subaccount" />
        </Suspense>
      </div>
    </PageWrapper>
  );
}
