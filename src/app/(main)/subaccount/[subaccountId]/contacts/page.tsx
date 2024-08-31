import { protectSubaccountRoute } from "@/actions/auth";
import PageWrapper from "@/components/page-wrapper";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import Contacts from "./contacts";
import CreateContactButton from "./_components/create-contact-button";

export const revalidate = 60;

export default async function Page({
  params,
}: {
  params: { subaccountId: string };
}) {
  const user = await protectSubaccountRoute(params.subaccountId);

  return (
    <PageWrapper>
      <div className="flex w-full flex-col gap-5">
        <div className="flex justify-between ap-4 items-start">
          <h1 className="text-3xl font-semibold tracking-tight">Contacts</h1>
          {user.role === "AGENCY_OWNER" ||
          user.role === "AGENCY_ADMIN" ||
          user.role === "SUBACCOUNT_ADMIN" ? (
            <CreateContactButton subaccountId={params.subaccountId} />
          ) : null}
        </div>
        <Suspense
          fallback={<Skeleton className="w-full h-[400px] rounded-lg" />}
        >
          <Contacts subaccountId={params.subaccountId} />
        </Suspense>
      </div>
    </PageWrapper>
  );
}
