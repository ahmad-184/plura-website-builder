import { SidebarType } from "@/types";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { ChevronsUpDownIcon, Compass } from "lucide-react";
import { getUserAuthDetailsAction } from "@/actions";
import { redirect } from "next/navigation";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import Link from "next/link";
import Image from "next/image";
import { SheetClose } from "../ui/sheet";
import { useModal } from "@/providers/model-providers";
import CreateSubaccountButton from "./create-subaccount-button";

export default async function SidebarAccountsMenu({
  id,
  type,
}: {
  id: string;
  type: SidebarType;
}) {
  const [user, err] = await getUserAuthDetailsAction();

  if (!user || err) return redirect("/");

  const details =
    type === "agency"
      ? user.Agency
      : type === "subaccount"
      ? user.Agency?.SubAccount.find((sub) => sub.id === id)
      : null;

  if (!details) return redirect("/");

  const subaccounts = user.Agency?.SubAccount.filter((sub) =>
    user.Permissions.find((p) => p.subAccountId === sub.id)
  );

  const agencyId = user.agencyId;

  if (!agencyId) return redirect("/");

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"ghost"}
          className="w-full my-4 flex items-center justify-between py-8 gap-2"
        >
          <div className="flex items-center text-left flex-grow gap-2 truncate">
            <div>
              <Compass />
            </div>
            <div className="flex flex-col truncate">
              {details?.name}
              <span className="text-muted-foreground truncate">
                {details?.address}
              </span>
            </div>
          </div>
          <div>
            <ChevronsUpDownIcon size={16} className="text-muted-foreground" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 h-80 z-[200] md:translate-x-4">
        <Command className="rounded-lg w-full h-full">
          <CommandInput placeholder="Search accounts..." />
          <CommandList className="pb-16">
            <CommandEmpty>No result found</CommandEmpty>
            <CommandGroup heading="Agency">
              {type === "agency" &&
              (user.role === "AGENCY_OWNER" || user.role === "AGENCY_ADMIN") ? (
                <CommandItem>
                  <SheetClose asChild className="w-full truncate">
                    <Link
                      href={`/agency/${user?.Agency?.id}`}
                      className="flex gap-4 h-full w-full"
                    >
                      <div className="relative w-16">
                        <Image
                          src={
                            user.Agency?.agencyLogo || "/assets/plura-logo.svg"
                          }
                          alt="agency logo"
                          fill
                          className="rounded-md object-contain"
                        />
                      </div>
                      <div className="flex flex-col flex-1 truncate">
                        {user.Agency?.name}
                        <span className="text-muted-foreground truncate">
                          {user.Agency?.address}
                        </span>
                      </div>
                    </Link>
                  </SheetClose>
                </CommandItem>
              ) : null}
            </CommandGroup>
            <CommandGroup heading="Accounts">
              {subaccounts?.length
                ? subaccounts.map((sub) => (
                    <CommandItem>
                      <SheetClose asChild className="w-full truncate">
                        <Link
                          href={`/agency/${sub?.id}`}
                          className="flex gap-4 h-full w-full"
                        >
                          <div className="relative w-16">
                            <Image
                              src={
                                sub?.subAccountLogo || "/assets/plura-logo.svg"
                              }
                              alt="agency logo"
                              fill
                              className="rounded-md object-contain"
                            />
                          </div>
                          <div className="flex flex-col flex-1 truncate">
                            {sub?.name}
                            <span className="text-muted-foreground truncate">
                              {sub?.address}
                            </span>
                          </div>
                        </Link>
                      </SheetClose>
                    </CommandItem>
                  ))
                : null}
            </CommandGroup>
          </CommandList>
          {user.role === "AGENCY_OWNER" || user.role === "AGENCY_ADMIN" ? (
            <>
              <CreateSubaccountButton agencyId={agencyId} />
            </>
          ) : null}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
