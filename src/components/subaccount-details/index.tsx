"use client";

import { v4 as uuid4 } from "uuid";
import { SubAccount } from "@prisma/client";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import DropzoneComponent from "../dropzone";
import FormInput from "../custom/form-input";
import { useEffect, useMemo } from "react";
import ButtonWithLoaderAndProgress from "../ButtonWithLoaderAndProgress";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { cn } from "@/lib/utils";
import { PhoneInput } from "../custom/phone-input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { subAccountDetailFormSchema } from "@/zod";
import { createSubAccountAction, updateSubAccountAction } from "@/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useModal } from "@/providers/model-providers";
import { useMutation } from "@tanstack/react-query";

type formSchemaType = z.infer<typeof subAccountDetailFormSchema>;

export default function SubAccountDetails({
  data,
  agencyId,
}: {
  data: Partial<SubAccount>;
  agencyId: string;
}) {
  const router = useRouter();
  const { setClose, isOpen } = useModal();

  const form = useForm<formSchemaType>({
    defaultValues: {
      name: data?.name,
      companyEmail: data?.companyEmail,
      companyPhone: data?.companyPhone,
      address: data?.address,
      city: data?.city,
      zipCode: data?.zipCode,
      state: data?.state,
      country: data?.country,
      subAccountLogo: data?.subAccountLogo,
    },
    resolver: zodResolver(subAccountDetailFormSchema),
    mode: "onChange",
  });

  const { setValue, reset } = form;

  useEffect(() => {
    if (data) reset({ ...data });
  }, [data]);

  const getUploadedLogoUrl = async (url: string) => {
    if (url) setValue("subAccountLogo", url);
  };

  const { mutate: createSubAccount, isPending: createSubaccountPending } =
    useMutation({
      mutationFn: createSubAccountAction,
      onSuccess: () => {
        toast.success("Success", {
          description: "Account created successfully",
          icon: "🎉",
        });
        router.refresh();
        if (isOpen) setClose();
      },
      onError: (e) => {
        toast.error("Error", { description: e.message, icon: "🛑" });
      },
    });

  const { mutate: updateSubaccount, isPending: updateSubaccountPending } =
    useMutation({
      mutationFn: updateSubAccountAction,
      onSuccess: () => {
        toast.success("Success", {
          description: "Account information updated",
          icon: "🎉",
        });
        router.refresh();
        if (isOpen) setClose();
      },
      onError: (e) => {
        toast.error("Error", { description: e.message, icon: "🛑" });
      },
    });

  const isLoading = useMemo(() => {
    if (createSubaccountPending || updateSubaccountPending) return true;
    else return false;
  }, [createSubaccountPending, updateSubaccountPending]);

  const handleSubmitForm = async (formData: formSchemaType) => {
    console.log("clicked");
    if (!agencyId) return toast.success("Agency id required");
    if (!data?.id) {
      const subAccountId = uuid4();
      createSubAccount({
        ...formData,
        id: subAccountId,
        agencyId: agencyId,
      });
    }

    if (data?.id) {
      await updateSubaccount({
        ...formData,
        id: data.id,
        agencyId: agencyId,
      });
    }
  };

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Sub Account Details</CardTitle>
        <CardDescription>Please enter business details</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full flex flex-col gap-7">
          <Form {...form}>
            <form
              className="w-full flex flex-col gap-2"
              onSubmit={form.handleSubmit(handleSubmitForm)}
            >
              <FormField
                disabled={isLoading}
                control={form.control}
                name="subAccountLogo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account logo</FormLabel>
                    <FormControl>
                      <DropzoneComponent
                        maxSize={1}
                        max_file={1}
                        getValue={getUploadedLogoUrl}
                        value={field.value}
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="w-full flex-1 flex-col md:flex-row md:gap-3 flex gap-2">
                <FormInput
                  disabled={isLoading}
                  control={form.control}
                  name="name"
                  className="flex-1"
                  placeholder="Your Account name"
                  label="Account Name"
                />
                <FormInput
                  disabled={isLoading}
                  control={form.control}
                  name="companyEmail"
                  className="flex-1"
                  placeholder="Email"
                  label="Account Email"
                  readOnly={false}
                />
              </div>
              <FormField
                disabled={isLoading}
                control={form.control}
                name={"companyPhone"}
                render={({ field }) => (
                  <FormItem className={cn("")}>
                    <FormLabel>Account Phone Number</FormLabel>
                    <FormControl>
                      <PhoneInput {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormInput
                disabled={isLoading}
                control={form.control}
                name="address"
                className="flex-1"
                placeholder="123 st..."
                label="Address"
              />
              <div className="w-full flex-1 flex-col md:flex-row md:gap-3 flex gap-2">
                <FormInput
                  disabled={isLoading}
                  control={form.control}
                  name="city"
                  className="flex-1"
                  placeholder="california"
                  label="City"
                />
                <FormInput
                  control={form.control}
                  name="state"
                  className="flex-1"
                  placeholder="USA"
                  label="State"
                  disabled={isLoading}
                />
                <FormInput
                  disabled={isLoading}
                  control={form.control}
                  name="zipCode"
                  className="flex-1"
                  placeholder="123456"
                  label="Zipcode"
                />
              </div>
              <FormInput
                disabled={isLoading}
                control={form.control}
                name="country"
                className="flex-1"
                placeholder="America"
                label="Country"
              />
              <ButtonWithLoaderAndProgress
                type="submit"
                className={cn("mt-2 w-fit")}
                variant={"default"}
                disabled={isLoading}
                loading={isLoading}
              >
                {data?.id
                  ? "Save Sub Account Informations"
                  : "Create Sub Account"}
              </ButtonWithLoaderAndProgress>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
}
