import AgencySettings from "./agency-settings";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import UserSettings from "./user-settings";
import PageWrapper from "@/components/page-wrapper";
import { protectAgencyRoute } from "@/actions/auth";
import AnimateFadeIn from "@/components/animate/animate-fade-in";

export const revalidate = 60;

export default async function Page({
  params,
}: {
  params: { agencyId: string };
}) {
  await protectAgencyRoute();

  return (
    <PageWrapper className="lg:max-w-[90vw]">
      <div className="w-full flex lg:justify-between lg:flex-row lg:gap-4 flex-col gap-9">
        <div className="lg:w-[49%]">
          <AnimateFadeIn>
            <Suspense fallback={<Skeleton className="w-full h-[800px]" />}>
              <AgencySettings agencyId={params.agencyId} />
            </Suspense>
          </AnimateFadeIn>
        </div>
        <div className="lg:w-[49%]">
          <AnimateFadeIn>
            <Suspense fallback={<Skeleton className="w-full h-[800px]" />}>
              <UserSettings type="agency" />
            </Suspense>
          </AnimateFadeIn>
        </div>
      </div>
    </PageWrapper>
  );
}
