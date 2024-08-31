"use client";

import { useModal } from "@/providers/model-providers";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
} from "../ui/alert-dialog";
import {
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

interface CustomDialogProps {
  header?: string;
  description?: string;
  content?: React.ReactNode;
  children?: React.ReactNode;
}

const CustomAlertDialog: React.FC<CustomDialogProps> = ({
  header,
  content,
  description,
  children,
}) => {
  const { setClose, isOpen } = useModal();

  return (
    <AlertDialog
      onOpenChange={(e) => {
        if (!e) {
          setClose();
        }
      }}
      open={isOpen}
    >
      {children ? (
        <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      ) : null}
      <AlertDialogContent className="overflow-auto max-h-[95vh] z-[400]">
        <AlertDialogHeader>
          <AlertDialogTitle className="dark:text-gray-200">
            {header}
          </AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {content}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CustomAlertDialog;
