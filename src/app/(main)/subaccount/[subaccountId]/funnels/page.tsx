import { protectSubaccountRoute } from "@/actions/auth";
import PageWrapper from "@/components/page-wrapper";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import GetTableData from "./get-table-data";

export const revalidate = 60;

export default async function Page({
  params,
}: {
  params: { subaccountId: string };
}) {
  await protectSubaccountRoute(params.subaccountId);

  return (
    <PageWrapper>
      <Suspense fallback={<Skeleton className="w-full h-[400px] rounded-lg" />}>
        <GetTableData subaccountId={params.subaccountId} />
      </Suspense>
    </PageWrapper>
  );
}
