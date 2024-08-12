import { SidebarType } from "@/types";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { ChevronsUpDownIcon, Compass } from "lucide-react";
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
import CreateSubaccountButton from "./create-subaccount-button";
import { Agency, SubAccount, User } from "@prisma/client";

export default async function SidebarAccountsMenu({
  type,
  details,
  user,
  agencyDetails,
  subaccounts,
}: {
  type: SidebarType;
  details: Agency | SubAccount | null | undefined;
  subaccounts: SubAccount[] | [];
  user: User;
  agencyDetails: Agency;
}) {
  if (!details) return redirect("/");

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
              {details.name}
              <span className="text-muted-foreground truncate">
                {details.address}
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
            {(user.role === "AGENCY_OWNER" || user.role === "AGENCY_ADMIN") &&
            agencyDetails ? (
              <CommandGroup heading="Agency">
                <CommandItem>
                  <SheetClose asChild className="w-full truncate">
                    <Link
                      href={`/agency/${agencyDetails.id}`}
                      className="flex gap-4 h-full w-full"
                    >
                      <div className="relative w-16">
                        <Image
                          src={
                            agencyDetails.agencyLogo || "/assets/plura-logo.svg"
                          }
                          alt="agency logo"
                          fill
                          className="rounded-md object-contain"
                        />
                      </div>
                      <div className="flex flex-col flex-1 truncate">
                        {agencyDetails.name}
                        <span className="text-muted-foreground truncate">
                          {agencyDetails.address}
                        </span>
                      </div>
                    </Link>
                  </SheetClose>
                </CommandItem>
              </CommandGroup>
            ) : null}
            <CommandGroup heading="Accounts">
              {subaccounts?.length ? (
                subaccounts.map((sub) => (
                  <CommandItem key={sub.id}>
                    <SheetClose asChild className="w-full truncate">
                      <Link
                        href={`/subaccount/${sub?.id}`}
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
              ) : (
                <div className="flex w-full text-center mt-5 justify-center">
                  <small className="text-muted-foreground">No Accounts</small>
                </div>
              )}
            </CommandGroup>
          </CommandList>
          {type === "agency" && user.role === "AGENCY_OWNER" ? (
            <CreateSubaccountButton agencyId={agencyDetails.id} />
          ) : null}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
