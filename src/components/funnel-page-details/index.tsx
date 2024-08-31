"use client";

import ButtonWithLoaderAndProgress from "@/components/ButtonWithLoaderAndProgress";
import FormInput from "@/components/custom/form-input";
import { Form } from "@/components/ui/form";
import { funnelPageFormSchemaType } from "@/types";
import { funnelPageFormSchema } from "@/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FunnelPage } from "@prisma/client";
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
import {
  createCopyFunnelPageAction,
  createFunnelPageAction,
  updateFunnelPageAction,
} from "@/actions";
import { cn } from "@/lib/utils";
import DeleteFunnelPage from "@/app/(main)/subaccount/[subaccountId]/funnels/_components/delete-funnel-page";
import { CopyPlusIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const FunnelPageDetails = ({
  funnelId,
  subaccountId,
  setClose,
  funnelPage,
}: {
  funnelId: string;
  subaccountId: string;
  funnelPage?: FunnelPage;
  setClose?: () => void;
}) => {
  const router = useRouter();

  const form = useForm<funnelPageFormSchemaType>({
    resolver: zodResolver(funnelPageFormSchema),
    defaultValues: {
      subaccountId,
      funnelId,
      name: funnelPage?.name || "",
      pathName: funnelPage?.pathName || "",
    },
  });

  useEffect(() => {
    if (!funnelPage) form.reset({ funnelId, subaccountId });
    if (funnelPage)
      form.reset({
        subaccountId,
        funnelId,
        name: funnelPage.name,
        pathName: funnelPage.pathName,
      });
  }, [funnelId, funnelPage, subaccountId]);

  const { mutate: createFunnelPage, isPending: createPending } = useMutation({
    mutationFn: createFunnelPageAction,
    onSuccess: (e) => {
      if (e) {
        toast.success("Success", {
          description: "Page created",
          icon: "🎉",
        });
        if (setClose) setClose();
        router.refresh();
        form.reset({ subaccountId, funnelId });
      }
    },
    onError: (e) => {
      toast.error("Error", { description: e.message, icon: "🛑" });
    },
  });

  const { mutate: updateFunnelPage, isPending: updatePending } = useMutation({
    mutationFn: updateFunnelPageAction,
    onSuccess: (e) => {
      if (e) {
        toast.success("Success", {
          description: "Page details updated",
          icon: "🎉",
        });
        router.refresh();
      }
    },
    onError: (e) => {
      toast.error("Error", { description: e.message, icon: "🛑" });
    },
  });

  const { mutate: createCopyFunnelPage, isPending: createCopyPending } =
    useMutation({
      mutationFn: createCopyFunnelPageAction,
      onSuccess: (e) => {
        if (e) {
          toast.success("Success", {
            description: "Page created",
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
    if (updatePending || createPending || createCopyPending) return true;
    else return false;
  }, [updatePending, createPending, createCopyPending]);

  const onSubmit = (values: funnelPageFormSchemaType) => {
    if (funnelPage?.id) {
      updateFunnelPage({
        ...values,
        id: funnelPage.id,
        order: funnelPage.order,
      });
    } else {
      createFunnelPage(values);
    }
  };

  const handleCreateCopy = () => {
    if (funnelPage?.id && subaccountId) {
      createCopyFunnelPage({ page_id: funnelPage.id, subaccountId });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Funnel Page</CardTitle>
        <CardDescription>
          Funnel pages are flow in the order they are created by default. You
          can move them around to change their order.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="w-full flex flex-col gap-3">
              <FormInput
                control={form.control}
                name="name"
                disabled={isLoading}
                label="Page Name"
                placeholder="page name..."
              />
              <FormInput
                control={form.control}
                name="pathName"
                disabled={isLoading}
                label="Path Name"
                placeholder="path name..."
              />
              <div className="flex items-center gap-3 justify-between">
                <ButtonWithLoaderAndProgress
                  loading={isLoading}
                  disabled={isLoading}
                  className={cn({
                    "w-full": !funnelPage?.id,
                    "w-[150px]": funnelPage?.id,
                  })}
                >
                  {funnelPage?.id ? "Save" : "Create"}
                </ButtonWithLoaderAndProgress>
                {funnelPage?.id ? (
                  <div className="flex items-center gap-2">
                    <Tooltip>
                      <TooltipTrigger type="button">
                        <ButtonWithLoaderAndProgress
                          variant={"outline"}
                          size={"icon"}
                          type="button"
                          onClick={handleCreateCopy}
                          loading={isLoading}
                          disabled={isLoading}
                        >
                          <CopyPlusIcon strokeWidth={1.2} />
                        </ButtonWithLoaderAndProgress>
                      </TooltipTrigger>
                      <TooltipContent>Create A Copy</TooltipContent>
                    </Tooltip>
                    <DeleteFunnelPage
                      subaccountId={subaccountId}
                      funnelPageId={funnelPage.id}
                      funnelId={funnelId}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default FunnelPageDetails;
