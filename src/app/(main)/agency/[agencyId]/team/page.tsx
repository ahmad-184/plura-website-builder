import PageWrapper from "@/components/page-wrapper";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import GetTableData from "./get-table-data";
import { protectAgencyRoute } from "@/actions/auth";

export const revalidate = 60;

export default async function Page({
  params,
}: {
  params: { agencyId: string };
}) {
  await protectAgencyRoute();

  return (
    <PageWrapper>
      <Suspense fallback={<Skeleton className="w-full h-[400px] rounded-lg" />}>
        <GetTableData agencyId={params.agencyId} />
      </Suspense>
    </PageWrapper>
  );
}
