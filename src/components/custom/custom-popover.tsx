"use client";

import { useModal } from "@/providers/model-providers";
import { Popover, PopoverContent } from "../ui/popover";

interface CustomPopoverProps {
  header?: string;
  description?: string;
  content?: React.ReactNode;
  children?: React.ReactNode;
}

const CustomPopover: React.FC<CustomPopoverProps> = ({
  header,
  content,
  description,
}) => {
  const { setClose, isOpen } = useModal();

  return (
    <Popover
      open={isOpen}
      onOpenChange={(e) => {
        if (!e) {
          setClose();
        }
      }}
    >
      <PopoverContent className="w-[340px] z-[500]">
        <div className="mb-3">
          <h1 className="text-xl font-semibold">{header}</h1>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
        {content}
      </PopoverContent>
    </Popover>
  );
};

export default CustomPopover;
