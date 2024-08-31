import AgencySettings from "./agency-settings";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import UserSettings from "./user-settings";
import PageWrapper from "@/components/page-wrapper";
import { protectAgencyRoute } from "@/actions/auth";

export const revalidate = 60;

export default async function Page({
  params,
}: {
  params: { agencyId: string };
}) {
  const user = await protectAgencyRoute();

  return (
    <PageWrapper>
      <div className="w-full flex lg:justify-between lg:gap-4 flex-col gap-9 pb-5">
        {user?.role === "AGENCY_OWNER" && (
          <Suspense fallback={<Skeleton className="w-full h-[800px]" />}>
            <AgencySettings agencyId={params.agencyId} />
          </Suspense>
        )}
        <Suspense fallback={<Skeleton className="w-full h-[800px]" />}>
          <UserSettings type="agency" />
        </Suspense>
      </div>
    </PageWrapper>
  );
}
