"use client";

import { getSubaccountAndMedia } from "@/actions/global-use-case";
import { Prisma } from "@prisma/client";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import MediaCard from "./media-card";

export default function MediaBucketItems({
  data,
}: {
  data: Prisma.PromiseReturnType<typeof getSubaccountAndMedia>;
}) {
  return (
    <Command className="bg-transparent overflow-visible">
      <CommandInput
        searchDivClassName="bg-gray-200/70 dark:bg-secondary border-b-0 rounded-lg"
        placeholder="Search for file name..."
      />
      <CommandList className="overflow-visible">
        <CommandEmpty>No Media found</CommandEmpty>
        <CommandGroup className="mt-2">
          <div className="w-full flex flex-wrap justify-between py-4">
            {data?.Media.map((e) => (
              <CommandItem
                className="p-0 w-full sm:w-[49%] lg:w-[32%] mb-3 rounded-lg !bg-transparent !font-medium
            !text-white
            "
              >
                <MediaCard data={e} />
              </CommandItem>
            ))}
          </div>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
