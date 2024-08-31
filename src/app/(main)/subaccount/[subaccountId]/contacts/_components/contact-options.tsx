"use client";

import { deleteContactAction } from "@/actions";
import ButtonWithLoaderAndProgress from "@/components/ButtonWithLoaderAndProgress";
import ContactDetails from "@/components/contact-details";
import CustomAlertDialog from "@/components/custom/custom-alert-dialog";
import CustomDialog from "@/components/custom/custom-dialog";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/providers/model-providers";
import { Contact } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { EditIcon, MoreVerticalIcon, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function ContactOptions({ contact }: { contact: Contact }) {
  const router = useRouter();
  const { setOpen: setOpenModal, setClose } = useModal();

  const [open, setOpen] = useState(false);

  const open_edit_modal = () => {
    setOpenModal({
      modal: (
        <CustomDialog
          header="Update Contact Information"
          content={
            <ContactDetails
              contact={contact}
              subaccountId={contact.subAccountId}
            />
          }
        />
      ),
    });
  };

  const { mutate: deleteContact, isPending } = useMutation({
    mutationFn: deleteContactAction,
    onSuccess: (e) => {
      if (e) {
        toast.success("Success", {
          description: "Contact deleted",
          icon: "🎉",
        });
        router.refresh();
        setClose();
      }
    },
    onError: (e) => {
      toast.error("Error", { description: e.message, icon: "🛑" });
    },
    retry: 3,
  });

  const handleDeleteContact = () => {
    if (!contact.id || !contact.subAccountId) return;
    deleteContact({ id: contact.id, subaccountId: contact.subAccountId });
  };

  return (
    <AlertDialog onOpenChange={setOpen} open={open}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <MoreVerticalIcon
            size={18}
            className="text-muted-foreground cursor-pointer"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent side="left">
          <DropdownMenuLabel>Options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={open_edit_modal} className="gap-2">
            <EditIcon size={15} />
            Edit
          </DropdownMenuItem>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem className="gap-2">
              <Trash2Icon size={15} />
              Delete
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Contact</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            contact and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <ButtonWithLoaderAndProgress
            onClick={handleDeleteContact}
            variant={"destructive"}
            disabled={isPending}
            loading={isPending}
            className="relative"
          >
            Delete
          </ButtonWithLoaderAndProgress>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
