"use client";

import CreateUpdatePipeline from "@/components/create-update-pipeline";
import CustomDialog from "@/components/custom/custom-dialog";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useModal } from "@/providers/model-providers";
import { Pipeline } from "@prisma/client";
import { CheckIcon, ChevronsUpDownIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

export default function PipelineInfoBar({
  subaccountId,
  pipelineId,
  pipelines,
}: {
  subaccountId: string;
  pipelineId: string;
  pipelines: Pipeline[];
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(pipelineId);

  const { setOpen: setOpenModal, setClose } = useModal();

  const currentPipelien = useMemo(
    () => pipelines.find((e) => e.id === pipelineId),
    [pipelineId, pipelines]
  );

  return (
    <div className="flex items-end gap-2">
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            //   aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {currentPipelien?.name}
            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandList>
              <CommandEmpty>No results found</CommandEmpty>
              <CommandGroup heading="Pipelines">
                {pipelines.map((e) => (
                  <Link
                    key={e.id}
                    href={`/subaccount/${subaccountId}/pipelines/${e.id}`}
                  >
                    <CommandItem
                      key={e.id}
                      value={e.id}
                      onSelect={(currentValue) => {
                        setValue(currentValue);
                        setOpen(false);
                      }}
                    >
                      <CheckIcon
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === e.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {e.name}
                    </CommandItem>
                  </Link>
                ))}
                <Button
                  variant="secondary"
                  className="flex gap-2 w-full mt-4"
                  onClick={() => {
                    setOpenModal({
                      modal: (
                        <CustomDialog
                          header="Create A Pipeline"
                          description="Pipelines allows you to group tickets into lanes and track your business processes all in one place."
                          content={
                            <CreateUpdatePipeline
                              subaccountId={subaccountId}
                              setClose={setClose}
                            />
                          }
                        />
                      ),
                    });
                  }}
                >
                  <PlusIcon size={15} />
                  Create Pipeline
                </Button>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
