import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const CustomTooltip = ({
  children,
  content,
  asChild,
}: {
  children: React.ReactNode;
  content: string | React.ReactNode;
  asChild?: boolean;
}) => {
  return (
    <Tooltip>
      <TooltipTrigger {...(asChild && { asChild })} type="button">
        {children}
      </TooltipTrigger>
      <TooltipContent>{content}</TooltipContent>
    </Tooltip>
  );
};

export default CustomTooltip;
