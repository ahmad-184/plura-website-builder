import { Suspense } from "react";
import SidebarLogo from "./sidebar-logo";
import { SidebarType } from "@/types";
import SidebarAccountsMenu from "./sidebar-accounts-menu";
import { AccountsSkeleton, SidebarOptionsSkeleton } from "./loading-fallbacks";
import SidebarMenuOptions from "./sidebar-menu-options";
import { Agency, SubAccount, User } from "@prisma/client";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/actions/auth";

export default async function SidebarContent({
  id,
  type,
}: {
  id: string;
  type: SidebarType;
}) {
  const user = await getCurrentUser();
  if (!user) return redirect("/");

  const getAllNeededData = await db.user.findUnique({
    where: {
      id: user.id,
    },
    include: {
      Agency: true,
      Permissions: {
        include: {
          SubAccount: true,
        },
      },
    },
  });

  if (!getAllNeededData) return redirect("/");

  const details: Agency | SubAccount | null | undefined =
    type === "agency"
      ? getAllNeededData.Agency
      : getAllNeededData.Permissions.filter((per) => per.access).find(
          (p) => p.subAccountId === id
        )?.SubAccount;

  if (!details) return redirect("/");

  const subaccounts = getAllNeededData.Permissions.filter(
    (per) => per.access
  ).map((p) => p.SubAccount);

  const agencyDetails = getAllNeededData.Agency;

  if (!agencyDetails) return redirect("/");

  let logo =
    type === "agency"
      ? (details as Agency).agencyLogo
      : (details as SubAccount).subAccountLogo;

  if (agencyDetails) {
    if (agencyDetails.whiteLabel) {
      logo = agencyDetails.agencyLogo;
    }
  }

  return (
    <div>
      <SidebarLogo id={id} type={type} logo={logo} />
      <Suspense fallback={<AccountsSkeleton />}>
        <SidebarAccountsMenu
          user={user}
          type={type}
          details={details}
          agencyDetails={agencyDetails}
          subaccounts={subaccounts}
        />
      </Suspense>
      <Suspense fallback={<SidebarOptionsSkeleton />}>
        <SidebarMenuOptions type={type} id={id} />
      </Suspense>
    </div>
  );
}
