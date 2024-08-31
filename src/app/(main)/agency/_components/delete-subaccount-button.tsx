"use client";

import { deleteSubaccountAction } from "@/actions";
import Loader from "@/components/loader";
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
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function DeleteSubaccountButton({
  subaccountId,
}: {
  subaccountId: string;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const { mutate: deleteSubaccount, isPending } = useMutation({
    mutationFn: deleteSubaccountAction,
    onSuccess: () => {
      toast.success("Success", {
        description: "Subaccount deleted successfully",
        icon: "🎉",
      });
      setOpen(false);
      router.refresh();
    },
    onError: (e) => {
      toast.error("Error", { description: e.message, icon: "🛑" });
    },
  });

  const handleDelete = async () => {
    if (!subaccountId) return;
    deleteSubaccount({
      subaccountId,
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger>
        <Button
          variant="outline"
          className="border-rose-600 text-rose-600 hover:text-rose-500"
          size={"icon"}
        >
          <Trash2 size={20} strokeWidth={1.75} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are You Absolutely Sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undon. This will delete the subaccount and all
            data related to the subaccount.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex items-center">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive hover:bg-destructive/80"
          >
            {isPending ? (
              <div className="w-full flex h-full items-center justify-center">
                <Loader className="w-5 h-5" />
              </div>
            ) : (
              "Delete"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
