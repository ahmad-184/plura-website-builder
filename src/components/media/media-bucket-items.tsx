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
        searchDivClassName="flex-grow bg-gray-200/70 dark:bg-secondary border-b-0 rounded-lg"
        placeholder="Search for media name..."
      />
      <CommandList className="overflow-visible max-h-none">
        <CommandEmpty>No Media found</CommandEmpty>
        <CommandGroup className="mt-2 overflow-visible">
          <div className="w-full flex flex-wrap py-4 gap-4">
            {data?.Media.map((e) => (
              <CommandItem
                className="p-0 w-full sm:w-[279px] rounded-lg !bg-transparent !font-medium
            !text-white
            "
                key={e.id}
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
