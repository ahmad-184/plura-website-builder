"use client";

import { deleteFunnelAction } from "@/actions";
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
import { useMutation } from "@tanstack/react-query";
import { OctagonAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function DeleteFunnel({
  funnelId,
  subaccountId,
}: {
  funnelId: string;
  subaccountId: string;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const { mutate: deleteFunnel, isPending } = useMutation({
    mutationFn: deleteFunnelAction,
    onSuccess: (e) => {
      if (e) {
        toast.success("Success", {
          description: "Funnel deleted successfully",
          icon: "🎉",
        });
        router.push(`/subaccount/${subaccountId}/funnels`);
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
    if (!funnelId || !subaccountId) return;
    deleteFunnel({ funnelId, subaccountId });
  };

  return (
    <AlertDialog onOpenChange={setOpen} open={open}>
      <div className="w-full flex flex-col gap-5 max-w-[400px] pb-6">
        <h1 className="text-xl">Delete Funnel</h1>
        <Alert variant={"destructive"} className="bg-rose-800/20">
          <OctagonAlert className="!text-rose-600" />
          <AlertTitle className="dark:text-gray-200 text-black">
            Warning
          </AlertTitle>
          <AlertDescription className="text-rose-600">
            This will permanently delete the funnel and remove all the related
            data to the funnel from our servers.
          </AlertDescription>
          <AlertDialogTrigger asChild>
            <Button
              variant={"ghost"}
              className="w-[200px] mt-3 bg-rose-500/20 hover:bg-rose-700/35 text-rose-600 hover:text-rose-600"
            >
              Delete Funnel
            </Button>
          </AlertDialogTrigger>
        </Alert>
      </div>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            funnel and remove all the related data to the funnel from our
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
