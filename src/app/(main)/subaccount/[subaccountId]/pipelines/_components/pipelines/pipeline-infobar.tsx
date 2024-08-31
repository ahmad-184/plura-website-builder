"use client";

import { setPipelineIdInCookie } from "@/actions/pipeline";
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
import { usePipelineStore } from "@/providers/pipeline-store-provider";
import { User } from "@prisma/client";
import { CheckIcon, ChevronsUpDownIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function PipelineInfoBar({
  subaccountId,
  pipelineId,
  user,
}: {
  subaccountId: string;
  pipelineId: string;
  user: User | null | undefined;
}) {
  const [open, setOpen] = useState(false);
  const {
    current_pipeline,
    pipelines: allPipelines,
    channel,
    updateOnePipline,
  } = usePipelineStore((store) => store);

  const { setOpen: setOpenModal, setClose } = useModal();

  useEffect(() => {
    (async () => {
      if (pipelineId) {
        await setPipelineIdInCookie(pipelineId);
      }
    })();
  }, [pipelineId]);

  return (
    <div className="flex items-end gap-2">
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-[200px] justify-between"
          >
            {current_pipeline?.name}
            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandList>
              <CommandEmpty>No results found</CommandEmpty>
              <CommandGroup heading="Pipelines">
                {allPipelines.map((e) => (
                  <Link
                    key={e.id}
                    href={`/subaccount/${subaccountId}/pipelines/${e.id}`}
                  >
                    <CommandItem
                      key={e.id}
                      value={e.id}
                      onSelect={() => {
                        setOpen(false);
                      }}
                    >
                      <CheckIcon
                        className={cn(
                          "mr-2 h-4 w-4",
                          e.id === current_pipeline?.id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {e.name}
                    </CommandItem>
                  </Link>
                ))}
                {user?.role === "SUBACCOUNT_GUEST" ||
                user?.role === "SUBACCOUNT_USER" ? null : (
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
                                channel={channel}
                                updateOnePipline={updateOnePipline}
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
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
