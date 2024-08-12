"use client";

import { deletePipelineAction } from "@/actions";
import ButtonWithLoaderAndProgress from "@/components/ButtonWithLoaderAndProgress";
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
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function DeletePipeline({
  pipelineId,
  subaccountId,
}: {
  pipelineId: string;
  subaccountId: string;
}) {
  const router = useRouter();

  const { mutate: deletePipeline, isPending } = useMutation({
    mutationFn: deletePipelineAction,
    onSuccess: (e) => {
      toast.success("Pipeline deleted");
      router.push(`/subaccount/${subaccountId}/pipelines`);
    },
    onError: (e) => toast.error("Could not delete pipeline"),
    retry: 3,
  });

  const handleDelete = async () => {
    if (!pipelineId || !subaccountId) return;
    deletePipeline({ pipelineId, subaccountId });
  };

  return (
    <div className="w-full flex">
      <AlertDialog>
        <AlertDialogTrigger>
          <Button variant={"destructive"} className="w-[200px]">
            Delete Pipeline
          </Button>
        </AlertDialogTrigger>
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
    </div>
  );
}
