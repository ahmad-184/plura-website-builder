import PageWrapper from "@/components/page-wrapper";
import Pipelines from "../_components/pipelines";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export const revalidate = 0;

export default async function Page({
  params,
}: {
  params: { subaccountId: string; pipelineId: string };
}) {
  return (
    <PageWrapper className="max-w-[1200px]">
      <Suspense fallback={<Skeleton className="w-full h-[500px] rounded-lg" />}>
        <Pipelines
          subaccountId={params.subaccountId}
          pipelineId={params.pipelineId}
        />
      </Suspense>
    </PageWrapper>
  );
}
