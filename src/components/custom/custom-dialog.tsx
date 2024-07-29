"use client";

import { useModal } from "@/providers/model-providers";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

interface CustomDialogProps {
  header?: string;
  description?: string;
  content?: React.ReactNode;
  children?: React.ReactNode;
}

const CustomDialog: React.FC<CustomDialogProps> = ({
  header,
  content,
  description,
  children,
}) => {
  const { setClose, isOpen } = useModal();

  return (
    <Dialog
      onOpenChange={(e) => {
        if (!e) {
          setClose();
        }
      }}
      open={isOpen}
    >
      {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
      <DialogContent className="overflow-auto max-h-[95vh] z-[400]">
        <DialogHeader>
          <DialogTitle className="dark:text-gray-200">{header}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
};

export default CustomDialog;
