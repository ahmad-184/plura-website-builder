"use client";

import { deleteFunnelAction, deleteFunnelPageAction } from "@/actions";
import ButtonWithLoaderAndProgress from "@/components/ButtonWithLoaderAndProgress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMutation } from "@tanstack/react-query";
import { OctagonAlert, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function DeleteFunnelPage({
  funnelPageId,
  subaccountId,
  funnelId,
}: {
  funnelPageId: string;
  subaccountId: string;
  funnelId: string;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const { mutate: deleteFunnelPage, isPending } = useMutation({
    mutationFn: deleteFunnelPageAction,
    onSuccess: (e) => {
      if (e) {
        toast.success("Success", {
          description: "Page deleted successfully",
          icon: "🎉",
        });
        router.push(`/subaccount/${subaccountId}/funnels/${funnelId}`);
        router.refresh();
        setOpen(false);
      }
    },
    onError: (e) => {
      toast.error("Error", { description: e.message, icon: "🛑" });
    },
    retry: 3,
  });

  const handleDelete = async () => {
    if (!funnelPageId || !subaccountId) return;
    deleteFunnelPage({ funnelPageId, subaccountId });
  };

  return (
    <AlertDialog onOpenChange={setOpen} open={open}>
      <div>
        <Tooltip>
          <TooltipTrigger type="button">
            <AlertDialogTrigger>
              <ButtonWithLoaderAndProgress
                variant={"outline"}
                className="self-end border-rose-700 text-rose-700 hover:bg-rose-600/55"
                disabled={isPending}
                type="button"
                size={"icon"}
                loading={isPending}
              >
                <Trash2Icon strokeWidth={1.2} />
              </ButtonWithLoaderAndProgress>
            </AlertDialogTrigger>
          </TooltipTrigger>
          <TooltipContent>Delete Page</TooltipContent>
        </Tooltip>
      </div>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            funnel page and remove all the related data to the funnel from our
            servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <ButtonWithLoaderAndProgress
            onClick={handleDelete}
            loading={isPending}
            disabled={isPending}
            variant={"destructive"}
          >
            Delete
          </ButtonWithLoaderAndProgress>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
