"use client";
import { deleteLaneAction } from "@/actions";
import ButtonWithLoaderAndProgress from "@/components/ButtonWithLoaderAndProgress";
import {
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { usePipelineStore } from "@/providers/pipeline-store-provider";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { toast } from "sonner";

const DeleteLane = ({
  subaccountId,
  laneId,
}: {
  subaccountId: string;
  laneId: string;
}) => {
  const router = useRouter();

  const { removeOneLane, channel } = usePipelineStore((store) => store);

  const [open, setOpen] = useState(true);

  const { mutate: deleteLane, isPending } = useMutation({
    mutationFn: deleteLaneAction,
    onSuccess: (e) => {
      if (e) {
        toast.success("Success", {
          description: "Lane deleted successfully",
          icon: "🎉",
        });
        setOpen(false);
        removeOneLane(e.id);
        router.refresh();
        if (channel) {
          channel.send({
            type: "broadcast",
            event: "lanes:updated",
            payload: { message: "update lanes details" },
          });
        }
      }
    },
    onError: (e) => {
      toast.error("Error", { description: e.message, icon: "🛑" });
    },
  });

  const onSubmit = () => {
    deleteLane({ subaccountId, laneId });
  };

  return (
    <>
      {!!open && (
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <ButtonWithLoaderAndProgress
              onClick={onSubmit}
              loading={isPending}
              disabled={isPending}
              variant={"destructive"}
            >
              Delete
            </ButtonWithLoaderAndProgress>
          </AlertDialogFooter>
        </AlertDialogContent>
      )}
    </>
  );
};

export default DeleteLane;
