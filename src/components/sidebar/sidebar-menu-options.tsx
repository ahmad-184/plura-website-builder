import { getSidebarOptions } from "@/actions/global-use-case";
import { SidebarType } from "@/types";
import { Separator } from "../ui/Separator";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { icons } from "@/lib/constants";
import Link from "next/link";
import { SheetClose } from "../ui/sheet";
import { redirect } from "next/navigation";

export default async function SidebarMenuOptions({
  type,
  id,
}: {
  type: SidebarType;
  id: string;
}) {
  const options = await getSidebarOptions(type, id);
  if (!options?.length) return redirect("/agency");

  return (
    <div>
      <p className="text-muted-foreground text-xs mb-2">MENU LINKS</p>
      <Separator className="mb-4" />
      <nav className="relative pb-3">
        <Command className="rounded-lg overflow-visible bg-transparent">
          <CommandInput
            placeholder="Search..."
            searchDivClassName="bg-secondary border-none rounded-md"
          />
          <CommandList className="px-0 overflow-visible">
            <CommandEmpty>No results found</CommandEmpty>
            <CommandGroup className="px-0 overflow-visible">
              {options.map((op) => {
                let val;
                const icon = icons.find((i) => i.value === op.icon);

                if (icon) val = <icon.path />;

                return (
                  <Link href={op.link} key={op.id} className="w-full">
                    <SheetClose className="w-full">
                      <CommandItem
                        className="md:w-[320px] w-full
                    aria-selected:bg-primary/70 aria-selected:text-white
                    "
                      >
                        <div
                          className="
                          hover:bg-transparent flex items-center gap-2 rounded-md transition-all lg:w-[320px]
                      "
                        >
                          {val} <span>{op.name}</span>
                        </div>
                      </CommandItem>
                    </SheetClose>
                  </Link>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </nav>
    </div>
  );
}
