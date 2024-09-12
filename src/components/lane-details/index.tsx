"use client";
import { createLaneAction, updateLaneAction } from "@/actions";
import ButtonWithLoaderAndProgress from "@/components/ButtonWithLoaderAndProgress";
import FormInput from "@/components/custom/form-input";
import { Form } from "@/components/ui/form";
import { usePipelineStore } from "@/providers/pipeline-store-provider";
import { createLineFormSchemaType } from "@/types";
import { createLineFormSchema } from "@/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lane } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

const LaneDetails = ({
  pipelineId,
  subaccountId,
  lane,
  setOpen,
}: {
  pipelineId: string;
  subaccountId: string;
  lane?: Lane;
  setOpen?: (e: boolean) => void;
}) => {
  const router = useRouter();
  const form = useForm<createLineFormSchemaType>({
    resolver: zodResolver(createLineFormSchema),
    defaultValues: {
      name: lane?.name || "",
      pipelineId,
      subaccountId,
    },
  });

  const { setNewLane, updateOneLane, channel } = usePipelineStore(
    (store) => store
  );

  useEffect(() => {
    form.reset({ pipelineId, subaccountId });
  }, [pipelineId]);

  const { mutate: createLane, isPending: createLanePending } = useMutation({
    mutationFn: createLaneAction,
    onSuccess: (e) => {
      if (e.error)
        return toast.error("Error", { description: e.error, icon: "🛑" });
      if (e.data) {
        toast.success("Success", {
          description: "New lane created",
          icon: "🎉",
        });
        if (setOpen) setOpen(false);
        setNewLane(e.data);
        router.refresh();
        form.reset({ name: "", pipelineId });
        if (channel) {
          channel.send({
            type: "broadcast",
            event: "lanes:updated",
            payload: { message: "update lanes details" },
          });
        }
      }
    },
  });

  const { mutate: updateLane, isPending: updateLanePending } = useMutation({
    mutationFn: updateLaneAction,
    onSuccess: (e) => {
      if (e.error)
        return toast.error("Error", { description: e.error, icon: "🛑" });
      if (e.data) {
        toast.success("Success", {
          description: "Lane details updated",
          icon: "🎉",
        });
        updateOneLane(e.data);
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
  });

  const isLoading = useMemo(() => {
    if (createLanePending || updateLanePending) return true;
    else return false;
  }, [createLanePending, updateLanePending]);

  const onSubmit = (values: createLineFormSchemaType) => {
    if (lane?.id) {
      updateLane({ laneId: lane.id, name: values.name, subaccountId });
    } else {
      createLane(values);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lane details</CardTitle>
        <CardDescription>Fill in lane details</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="w-full flex flex-col gap-3">
              <FormInput
                control={form.control}
                name="name"
                disabled={isLoading}
                label="Lane Name"
                placeholder="Lane name..."
              />
              <ButtonWithLoaderAndProgress
                loading={isLoading}
                disabled={isLoading}
              >
                Create Lane
              </ButtonWithLoaderAndProgress>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default LaneDetails;
