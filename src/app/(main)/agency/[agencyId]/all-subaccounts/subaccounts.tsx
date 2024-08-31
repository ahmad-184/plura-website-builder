import { getAgencySubAccounts } from "@/actions/subaccount";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import Image from "next/image";
import Link from "next/link";
import DeleteSubaccountButton from "../../_components/delete-subaccount-button";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserPermissions } from "@/actions/user";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";
import { protectAgencyRoute } from "@/actions/auth";
import { User } from "@prisma/client";

export const SubaccountsSkeleton = () => {
  return (
    <div className="flex w-full flex-col gap-3">
      <Skeleton className="w-full h-12 rounded-lg" />
      <Skeleton className="w-full h-32 rounded-lg" />
      <Skeleton className="w-full h-32 rounded-lg" />
    </div>
  );
};

export default async function Subaccounts({
  agencyId,
  user,
}: {
  agencyId: string;
  user: User;
}) {
  const subaccounts = await getAgencySubAccounts(agencyId);

  if (!user) return redirect("/agency");

  const user_permissions = await getUserPermissions(user.email);
  if (!user_permissions) return redirect("/agency");

  if (!user || !user.id) return redirect("/");

  return (
    <Command className="rounded-lg bg-transparent">
      <CommandInput
        searchDivClassName="bg-gray-200/70 dark:bg-secondary border-b-0 rounded-lg"
        placeholder="Search for Accounts..."
      />
      <CommandList className="overflow-visible px-0">
        <CommandEmpty>No Results Found</CommandEmpty>
        <CommandGroup className="px-0">
          {subaccounts?.map((sub) => {
            const have_permission = user_permissions.find(
              (e) => e.subAccountId === sub.id
            )?.access
              ? false
              : true;

            return (
              <CommandItem
                key={sub.id}
                disabled={have_permission}
                className={cn(
                  "h-32 my-2 text-primary !bg-background border-[1px] border-border rounded-lg",
                  {
                    "opacity-50 select-none": have_permission,
                    "hover:!bg-transparent cursor-pointer transition-all":
                      !have_permission,
                  }
                )}
              >
                <Link
                  href={have_permission ? "" : `/subaccount/${sub.id}`}
                  className={cn("p-4 flex gap-4 w-full h-full", {
                    "select-none cursor-default": have_permission,
                  })}
                >
                  <div className="relative w-32">
                    <Image
                      src={sub.subAccountLogo}
                      alt="subaccount logo"
                      fill
                      className="rounded-md object-contain bg-muted/50 p-4"
                    />
                  </div>
                  <div className="flex flex-col justify-between">
                    <div className="flex flex-col dark:!text-gray-50 !text-black font-medium">
                      {sub.name}
                      <span className="text-muted-foreground font-normal text-xs">
                        {sub.address}
                      </span>
                    </div>
                  </div>
                </Link>
                {user.role === "AGENCY_OWNER" ? (
                  <div className="pr-3">
                    <DeleteSubaccountButton subaccountId={sub.id} />
                  </div>
                ) : null}
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
