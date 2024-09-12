"use client";

import { deletePipelineAction } from "@/actions";
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
import { usePipelineStore } from "@/providers/pipeline-store-provider";
import { useMutation } from "@tanstack/react-query";
import { OctagonAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function DeletePipeline({
  pipelineId,
  subaccountId,
}: {
  pipelineId: string;
  subaccountId: string;
}) {
  const router = useRouter();
  const { channel } = usePipelineStore((store) => store);

  const [open, setOpen] = useState(false);

  const { mutate: deletePipeline, isPending } = useMutation({
    mutationFn: deletePipelineAction,
    onSuccess: (e) => {
      if (e.error)
        return toast.error("Error", { description: e.error, icon: "🛑" });
      if (e.data) {
        toast.success("Success", {
          description: "Pipeline deleted successfully",
          icon: "🎉",
        });
        if (channel) {
          channel.send({
            type: "broadcast",
            event: "pipeline:deleted",
            payload: { pipelineId: e.data.id },
          });
        }
        router.push(`/subaccount/${subaccountId}/pipelines`);
        router.refresh();
        setOpen(false);
      }
    },
    retry: 3,
  });

  const handleDelete = async () => {
    if (!pipelineId || !subaccountId) return;
    deletePipeline({ pipelineId, subaccountId });
  };

  return (
    <AlertDialog onOpenChange={setOpen} open={open}>
      <div className="w-full flex flex-col gap-5 max-w-[400px] pb-6">
        <h1 className="text-xl">Delete Pipeline</h1>
        <Alert variant={"destructive"} className="bg-rose-800/20">
          <OctagonAlert className="!text-rose-600" />
          <AlertTitle className="dark:text-gray-200 text-black">
            Warning
          </AlertTitle>
          <AlertDescription className="text-rose-600">
            This will permanently delete the pipeline and remove all the related
            data to the pipeline from our servers.
          </AlertDescription>
          <AlertDialogTrigger asChild>
            <Button
              variant={"ghost"}
              className="w-[200px] mt-3 bg-rose-500/20 hover:bg-rose-700/35 text-rose-600 hover:text-rose-600"
            >
              Delete Pipeline
            </Button>
          </AlertDialogTrigger>
        </Alert>
      </div>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            pipeline and remove all the related data to the pipeline from our
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
