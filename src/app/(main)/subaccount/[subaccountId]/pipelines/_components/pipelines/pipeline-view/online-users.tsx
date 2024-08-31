"use client";

import CustomAvatar from "@/components/custom/custom-avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { usePipelineStore } from "@/providers/pipeline-store-provider";

export default function OnlieUsers() {
  const { online_users } = usePipelineStore((store) => store);
  return (
    <div className="flex gap-1 items-center">
      {online_users.map((e, i) => (
        <div
          key={e.id}
          className={cn("flex relative z-10 hover:z-20", {
            "left-4": online_users.length !== i + 1,
          })}
        >
          <Tooltip>
            <TooltipTrigger>
              <CustomAvatar
                className="w-9 h-9 outline-dashed outline-[1.5px] outline-offset-1 outline-green-500 dark:outline-green-400"
                user={{ name: e.name, avatarUrl: e.avatarUrl }}
              />
            </TooltipTrigger>
            <TooltipContent>
              <div className="items-start flex gap-2">
                <div className="p-1 rounded-full bg-green-500 mt-[6px] animate-pulse"></div>
                <div className="flex flex-col">
                  <p className="text-sm dark:text-gray-200">{e.name}</p>
                  <p className="text-xs text-muted-foreground">{e.email}</p>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>
      ))}
    </div>
  );
}
