"use client";
import ButtonWithLoaderAndProgress from "@/components/ButtonWithLoaderAndProgress";
import FormInput from "@/components/custom/form-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { funnelFormSchemaType } from "@/types";
import { funnelFormSchema } from "@/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Funnel } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { createFunnelAction, updateFunnelAction } from "@/actions";
import { Textarea } from "../ui/text-area";
import DropzoneComponent from "../dropzone";
import { cn } from "@/lib/utils";

const FunnelDetails = ({
  subaccountId,
  setOpen,
  funnel,
}: {
  subaccountId: string;
  funnel?: Funnel;
  setOpen?: (e: boolean) => void;
}) => {
  const router = useRouter();
  const form = useForm<funnelFormSchemaType>({
    resolver: zodResolver(funnelFormSchema),
    defaultValues: {
      subaccountId,
      name: funnel?.name || "",
      description: funnel?.description || "",
      favicon: funnel?.favicon || "",
      subDomainName: funnel?.subDomainName || "",
    },
  });

  useEffect(() => {
    if (!funnel) form.reset({ subaccountId });
    if (funnel)
      form.reset({
        subaccountId,
        name: funnel.name,
        description: funnel.description,
        favicon: funnel.favicon,
        subDomainName: funnel?.subDomainName || "",
      });
  }, [subaccountId, funnel]);

  const { mutate: createFunnel, isPending: createFunnelPending } = useMutation({
    mutationFn: createFunnelAction,
    onSuccess: (e) => {
      if (e) {
        toast.success("Success", {
          description: "Funnel created",
          icon: "🎉",
        });
        if (setOpen) setOpen(false);
        router.refresh();
        form.reset({ subaccountId });
      }
    },
    onError: (e) => {
      toast.error("Error", { description: e.message, icon: "🛑" });
    },
  });

  const { mutate: updateFunnel, isPending: updateFunnelPending } = useMutation({
    mutationFn: updateFunnelAction,
    onSuccess: (e) => {
      if (e) {
        toast.success("Success", {
          description: "Funnel details updated",
          icon: "🎉",
        });
        router.refresh();
      }
    },
    onError: (e) => {
      toast.error("Error", { description: e.message, icon: "🛑" });
    },
  });

  const isLoading = useMemo(() => {
    if (updateFunnelPending || createFunnelPending) return true;
    else return false;
  }, [updateFunnelPending, createFunnelPending]);

  const onSubmit = (values: funnelFormSchemaType) => {
    console.log(values);
    if (funnel?.id) {
      updateFunnel({ ...values, id: funnel.id });
    } else {
      createFunnel(values);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Funnel Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="w-full flex flex-col gap-3">
              <FormInput
                control={form.control}
                name="name"
                disabled={isLoading}
                label="Funnel Name"
                placeholder="funnel name..."
              />
              <FormField
                control={form.control}
                disabled={isLoading}
                name={"description"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="description..." {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormInput
                control={form.control}
                name="subDomainName"
                disabled={isLoading}
                label="Sub domain"
                placeholder="Sub domain for funnel..."
              />
              <FormField
                control={form.control}
                disabled={isLoading}
                name={"favicon"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Favicon</FormLabel>
                    <FormControl>
                      <div className="flex w-full justify-center items-center flex-col gap-2">
                        <DropzoneComponent
                          maxSize={3}
                          max_file={1}
                          getValue={(url: string) => {
                            form.setValue("favicon", url);
                          }}
                          value={field.value}
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <ButtonWithLoaderAndProgress
                loading={isLoading}
                disabled={isLoading}
                className={cn({ "w-[150px] mt-2": funnel?.id })}
              >
                {funnel?.id ? "Save" : "Create"}
              </ButtonWithLoaderAndProgress>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default FunnelDetails;
