"use client";

import LaneDetails from "@/components/lane-details";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

const AddLaneButton = ({
  pipelineId,
  subaccountId,
}: {
  pipelineId: string;
  subaccountId: string;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <Button className="flex items-center gap-1">
          <div>
            <PlusIcon size={15} />
          </div>
          Add Lane
        </Button>
      </PopoverTrigger>
      <PopoverContent side="bottom" className="w-[340px] md:w-[420px]">
        <div className="mb-3">
          <h1 className="text-xl font-semibold">Create New Lane</h1>
          <p className="text-muted-foreground text-sm">
            Pipelines allows you to group tickets into lanes and track your
            business processes all in one place.
          </p>
        </div>
        <LaneDetails
          setOpen={setOpen}
          pipelineId={pipelineId}
          subaccountId={subaccountId}
        />
      </PopoverContent>
    </Popover>
  );
};

export default AddLaneButton;
