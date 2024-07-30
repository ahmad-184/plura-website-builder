import { Suspense } from "react";
import SidebarLogo from "./sidebar-logo";
import { SidebarType } from "@/types";
import SidebarAccountsMenu from "./sidebar-accounts-menu";
import { AccountsSkeleton, SidebarOptionsSkeleton } from "./loading-fallbacks";
import SidebarMenuOptions from "./sidebar-menu-options";
import { Agency, SubAccount } from "@prisma/client";
import { getAgencyOrSubAccount } from "@/actions/global-use-case";
import { redirect } from "next/navigation";

export default async function SidebarContent({
  id,
  type,
}: {
  id: string;
  type: SidebarType;
}) {
  const details: Agency | SubAccount | null | undefined =
    await getAgencyOrSubAccount(type, id);

  if (!details) return redirect("/");

  // @ts-ignore
  const logo = type === "agency" ? details.agencyLogo : details.subAccountLogo;

  return (
    <div>
      <SidebarLogo id={id} type={type} logo={logo} />
      <Suspense fallback={<AccountsSkeleton />}>
        <SidebarAccountsMenu type={type} details={details} />
      </Suspense>
      <Suspense fallback={<SidebarOptionsSkeleton />}>
        <SidebarMenuOptions type={type} id={id} />
      </Suspense>
    </div>
  );
}
