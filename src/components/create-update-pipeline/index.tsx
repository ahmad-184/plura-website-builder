import { useForm } from "react-hook-form";
import { Form } from "../ui/form";
import FormInput from "../custom/form-input";
import ButtonWithLoaderAndProgress from "../ButtonWithLoaderAndProgress";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPipelineSchema } from "@/zod";
import { createPipelineAction, updatePipelineAction } from "@/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pipeline } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useMutation } from "@tanstack/react-query";
import { createPipelineSchemaType } from "@/types";
import { useMemo } from "react";
import { RealtimeChannel } from "@supabase/supabase-js";

const CreateUpdatePipeline = ({
  subaccountId,
  setClose,
  pipelineDetails,
  channel,
  updateOnePipline,
}: {
  subaccountId: string;
  setClose?: (e: boolean) => void;
  pipelineDetails?: Pipeline;
  channel: RealtimeChannel | null;
  updateOnePipline: (pipeline: Partial<Pipeline>) => void;
}) => {
  const router = useRouter();
  const form = useForm<createPipelineSchemaType>({
    resolver: zodResolver(createPipelineSchema),
    defaultValues: {
      name: pipelineDetails?.name || "",
      subaccountId,
    },
  });

  const { mutate: createPipeline, isPending: createLoading } = useMutation({
    mutationFn: createPipelineAction,
    onSuccess: (e) => {
      if (e.error)
        return toast.error("Error", { description: e.error, icon: "🛑" });
      if (e.data) {
        toast.success("Success", {
          description: "New pipeline created",
          icon: "🎉",
        });
        if (setClose) setClose(false);
        if (channel) {
          channel.send({
            type: "broadcast",
            event: "pipeline:updated",
            payload: "pipelines details updated",
          });
        }
        router.refresh();
        router.push(`/subaccount/${subaccountId}/pipelines/${e.data.id}`);
      }
    },
  });

  const { mutate: updatePipeline, isPending: updateLoading } = useMutation({
    mutationFn: updatePipelineAction,
    onSuccess: (e) => {
      if (e.error)
        return toast.error("Error", { description: e.error, icon: "🛑" });
      if (e.data) {
        toast.success("Success", {
          description: "Pipeline information updated",
          icon: "🎉",
        });
        updateOnePipline(e.data);
        if (setClose) setClose(false);
        if (channel) {
          channel.send({
            type: "broadcast",
            event: "pipeline:updated",
            payload: "pipelines details updated",
          });
        }
        router.refresh();
      }
    },
  });

  const onSubmit = async (values: createPipelineSchemaType) => {
    if (!subaccountId) return;

    if (pipelineDetails?.id) {
      updatePipeline({
        ...values,
        id: pipelineDetails.id,
      });
    } else {
      createPipeline(values);
    }
  };

  const isLoading = useMemo(() => {
    if (updateLoading || createLoading) return true;
    else return false;
  }, [updateLoading, createLoading]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Pipeline Details</CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            className="flex w-full flex-col gap-3"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormInput
              control={form.control}
              name="name"
              disabled={isLoading}
              label="Pipeline Name"
              placeholder="name"
            />

            <ButtonWithLoaderAndProgress
              loading={isLoading}
              disabled={isLoading}
              className="w-fit"
            >
              {pipelineDetails?.id ? "Update Information" : "Create Pipeline"}
            </ButtonWithLoaderAndProgress>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateUpdatePipeline;
