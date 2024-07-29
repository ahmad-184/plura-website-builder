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

export default async function SidebarMenuOptions({
  type,
  id,
}: {
  type: SidebarType;
  id: string;
}) {
  const options = await getSidebarOptions(type, id);

  return (
    <div>
      <p className="text-muted-foreground text-xs mb-2">MENU LINKS</p>
      <Separator className="mb-4" />
      <nav className="relative">
        <Command className="rounded-lg overflow-visible bg-transparent">
          <CommandInput
            placeholder="Search..."
            searchDivClass="bg-secondary border-none rounded-md"
          />
          <CommandList className="overflow-visible px-0">
            <CommandEmpty>No results found</CommandEmpty>
            <CommandGroup className="overflow-visible px-0">
              {options.map((op) => {
                let val;
                const icon = icons.find((i) => i.value === op.icon);

                if (icon) val = <icon.path />;

                return (
                  <CommandItem
                    key={op.id}
                    className="md:w-[320px] w-full
                    aria-selected:bg-primary/90 aria-selected:text-white
                  "
                  >
                    <Link
                      href={op.link}
                      className="
                            hover:bg-transparent flex items-center gap-2 rounded-md transition-all md:w-full w-[320px]
                        "
                    >
                      {val} <span>{op.name}</span>
                    </Link>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </nav>
    </div>
  );
}
