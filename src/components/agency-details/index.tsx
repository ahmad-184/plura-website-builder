"use client";

import { v4 as uuid4 } from "uuid";
import { Agency, User } from "@prisma/client";
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
import { useEffect, useMemo, useRef } from "react";
import { Switch } from "../ui/switch";
import ButtonWithLoaderAndProgress from "../ButtonWithLoaderAndProgress";
import { zodResolver } from "@hookform/resolvers/zod";
import { NumberInput } from "@tremor/react";

import { Separator } from "../ui/Separator";
import DeleteAgency from "./delete-agency";
import { cn } from "@/lib/utils";
import { PhoneInput } from "../custom/phone-input";
import {
  createAgencyAction,
  updateAgencyAction,
  updateGoalAction,
} from "@/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { agencyDetailFormSchema } from "@/zod";
import { agencyFormSchemaType } from "@/types";
import { useMutation } from "@tanstack/react-query";

export default function AgencyDetails({
  data,
  user,
}: {
  data: Partial<Agency>;
  user?: User;
}) {
  const router = useRouter();
  const timeOut = useRef<ReturnType<typeof setTimeout> | null>(null);

  const form = useForm<agencyFormSchemaType>({
    defaultValues: {
      agencyLogo: data?.agencyLogo,
      companyEmail: data?.companyEmail,
      companyPhone: data?.companyPhone,
      whiteLabel: data?.whiteLabel,
      address: data?.address,
      city: data?.address,
      zipCode: data?.zipCode,
      state: data?.state,
      country: data?.country,
      name: data?.name,
      goal: data?.goal || 1,
    },
    resolver: zodResolver(agencyDetailFormSchema),
    mode: "onChange",
  });

  const { setValue, reset } = form;

  useEffect(() => {
    if (data) reset({ ...data, goal: data.goal || 1 });
  }, [data, reset]);

  const getUploadedLogoUrl = async (url: string) => {
    if (url) setValue("agencyLogo", url);
  };

  const { mutate: createAgency, isPending: createAgencyPending } = useMutation({
    mutationFn: createAgencyAction,
    onSuccess: () => {
      toast.success("Success", {
        description: "Your agency successfully Created",
        icon: "🎉",
      });
      router.refresh();
    },
    onError: (e) =>
      toast.error("Error", { description: e.message, icon: "🛑" }),
  });

  const { mutate: updateGoal, isPending: updateGoalPending } = useMutation({
    mutationFn: updateGoalAction,
    onSuccess: () => {
      toast.success("Success", {
        description: "Goal updated",
        icon: "🎉",
      });
      router.refresh();
    },
    onError: (e) =>
      toast.error("Error", { description: e.message, icon: "🛑" }),
  });

  const { mutate: updateAgency, isPending: updateAgencyPending } = useMutation({
    mutationFn: updateAgencyAction,
    onSuccess: () => {
      toast.success("Success", {
        description: "Agency information updated",
        icon: "🎉",
      });
      router.refresh();
    },
    onError: (e) =>
      toast.error("Error", { description: e.message, icon: "🛑" }),
  });

  const handleSubmitForm = async (formData: agencyFormSchemaType) => {
    if (!data?.id) {
      const stripe_cust_data = {
        email: formData.companyEmail,
        name: formData.name,
        shipping: {
          address: {
            city: formData.city,
            country: formData.country,
            linel: formData.address,
            postal_code: formData.zipCode,
            state: formData.zipCode,
          },
          name: formData.name,
        },
        address: {
          city: formData.city,
          country: formData.country,
          linel: formData.address,
          postal_code: formData.zipCode,
          state: formData.zipCode,
        },
      };

      const custId = "fake-id-for-now";

      if (!custId) return;

      const agencyId = uuid4();

      createAgency({
        ...formData,
        customerId: custId,
        id: agencyId,
        user_role: "AGENCY_OWNER",
      });
    } else if (data?.id) {
      updateAgency({ ...formData, id: data.id });
      return;
    }
  };

  const handleChangeGoal = async (e: number) => {
    if (!data?.id) return;

    if (timeOut.current) clearTimeout(timeOut.current);
    timeOut.current = setTimeout(async () => {
      if (!data?.id) return;
      updateGoal({ agencyId: data.id, goal: e });
    }, 1000);
  };

  const isLoading = useMemo(() => {
    if (updateAgencyPending || createAgencyPending || updateGoalPending)
      return true;
    else return false;
  }, [updateAgencyPending, createAgencyPending, updateGoalPending]);

  return (
    <div className="w-full flex flex-col gap-7">
      <Form {...form}>
        <form
          className="w-full flex flex-col gap-2"
          onSubmit={form.handleSubmit(handleSubmitForm)}
        >
          <FormField
            control={form.control}
            name="agencyLogo"
            disabled={isLoading}
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Agency logo</FormLabel>
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
              placeholder="Your agency name"
              label="Agency Name"
            />
            <FormInput
              disabled={isLoading}
              control={form.control}
              name="companyEmail"
              className="flex-1"
              placeholder="Email"
              label="Agency Email"
              readOnly={true}
            />
          </div>
          <FormField
            disabled={isLoading}
            control={form.control}
            name={"companyPhone"}
            render={({ field }) => (
              <FormItem className={cn("")}>
                <FormLabel>Agency Phone Number</FormLabel>
                <FormControl>
                  <PhoneInput {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            disabled={isLoading}
            control={form.control}
            name={"whiteLabel"}
            render={({ field }) => (
              <FormItem className="border rounded-lg dark:border-gray-700 p-3">
                <div className="flex gap-6 justify-between items-center">
                  <div>
                    <FormLabel>Whitelabel Agency</FormLabel>
                    <FormDescription className="max-w-lg">
                      Turning on whilelabel mode will show your agency logo to
                      all sub accounts by default. You can overwrite this
                      functionality through sub account settings.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </div>
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
              disabled={isLoading}
              control={form.control}
              name="state"
              className="flex-1"
              placeholder="USA"
              label="State"
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
            control={form.control}
            name="country"
            className="flex-1"
            placeholder="America"
            label="Country"
            disabled={isLoading}
          />
          {data?.id ? (
            <>
              <FormField
                control={form.control}
                disabled={isLoading}
                name={"goal"}
                render={() => (
                  <FormItem>
                    <FormLabel>Create A Goal</FormLabel>
                    <FormDescription>
                      ✨ Create a goal for your agency. As your business grows
                      your goals grow too so dont forget to set the bar higher!
                    </FormDescription>
                    <FormControl>
                      <NumberInput
                        defaultValue={data?.goal || 1}
                        min={1}
                        className="!bg-background !border !border-input !rounded-md"
                        onValueChange={handleChangeGoal}
                        readOnly
                        disabled={isLoading || updateGoalPending}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </>
          ) : null}
          <ButtonWithLoaderAndProgress
            type="submit"
            className={cn("mt-2 w-fit")}
            variant={"default"}
            loading={isLoading}
            disabled={isLoading}
          >
            {data?.id ? "Save agency Informations" : "Create Agency"}
          </ButtonWithLoaderAndProgress>
        </form>
      </Form>
      {data?.id && user && user.role === "AGENCY_OWNER" ? (
        <div>
          <Separator className="mb-7" />
          <div className="w-full">
            <DeleteAgency data={data} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
