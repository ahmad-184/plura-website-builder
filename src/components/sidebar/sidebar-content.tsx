import { Suspense } from "react";
import SidebarLogo from "./sidebar-logo";
import { SidebarType } from "@/types";
import SidebarAccountsMenu from "./sidebar-accounts-menu";
import {
  AccountsSkeleton,
  LogoSkeleton,
  SidebarOptionsSkeleton,
} from "./loading-fallbacks";
import SidebarMenuOptions from "./sidebar-menu-options";

export default function SidebarContent({
  id,
  type,
}: {
  id: string;
  type: SidebarType;
}) {
  return (
    <div>
      <Suspense fallback={<LogoSkeleton />}>
        <SidebarLogo id={id} type={type} />
      </Suspense>
      <Suspense fallback={<AccountsSkeleton />}>
        <SidebarAccountsMenu id={id} type={type} />
      </Suspense>
      <Suspense fallback={<SidebarOptionsSkeleton />}>
        <SidebarMenuOptions type={type} id={id} />
      </Suspense>
      {/* <SidebarOptionsSkeleton /> */}
    </div>
  );
}
