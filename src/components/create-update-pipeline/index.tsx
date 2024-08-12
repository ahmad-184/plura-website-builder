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

const CreateUpdatePipeline = ({
  subaccountId,
  setClose,
  pipelineDetails,
}: {
  subaccountId: string;
  setClose?: (e: boolean) => void;
  pipelineDetails?: Pipeline;
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
      if (e) {
        toast.success("New pipeline created");
        if (setClose) setClose(false);
        router.refresh();
        router.push(`/subaccount/${subaccountId}/pipelines/${e.id}`);
      }
    },
    onError: () => toast.error("Could not create pipeline"),
  });

  const { mutate: updatePipeline, isPending: updateLoading } = useMutation({
    mutationFn: updatePipelineAction,
    onSuccess: (e) => {
      if (e) {
        toast.success("Pipeline information updated");
        if (setClose) setClose(false);
        router.refresh();
      }
    },
    onError: () => toast.error("Could not update pipeline information"),
  });

  const onSubmit = async (values: createPipelineSchemaType) => {
    if (!subaccountId) return;

    try {
      if (pipelineDetails?.id) {
        updatePipeline({
          ...values,
          id: pipelineDetails.id,
        });
      } else {
        createPipeline(values);
      }
    } catch (err) {
      console.log(err);
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
