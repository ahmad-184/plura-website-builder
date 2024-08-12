import PageWrapper from "@/components/page-wrapper";
import Pipelines from "../../../_components/pipelines";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import AnimateFadeIn from "@/components/animate/animate-fade-in";

export const revalidate = 0;

export default async function Page({
  params,
}: {
  params: { subaccountId: string; pipelineId: string };
}) {
  return (
    <PageWrapper>
      <AnimateFadeIn>
        <Suspense
          fallback={<Skeleton className="w-full h-[500px] rounded-lg" />}
        >
          <Pipelines
            subaccountId={params.subaccountId}
            pipelineId={params.pipelineId}
          />
        </Suspense>
      </AnimateFadeIn>
    </PageWrapper>
  );
}
