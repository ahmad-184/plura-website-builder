"use client";

import { v4 as uuid4 } from "uuid";
import { useServerAction } from "zsa-react";
import { Agency } from "@prisma/client";
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
import { useEffect, useState } from "react";
import { Switch } from "../ui/switch";
import ButtonWithLoaderAndProgress from "../ButtonWithLoaderAndProgress";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { NumberInput } from "@tremor/react";

import { Separator } from "../ui/Separator";
import DeleteAgency from "./delete-agency";
import { cn } from "@/lib/utils";
import { PhoneInput } from "../custom/phone-input";
import {
  createAgencyAction,
  initUserAction,
  updateAgencyAction,
  updateGoalAction,
} from "@/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { agencyDetailFormSchema } from "@/zod";

type formSchemaType = z.infer<typeof agencyDetailFormSchema>;

export default function AgencyDetails({ data }: { data: Partial<Agency> }) {
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);

  const form = useForm<formSchemaType>({
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
  }, [data]);

  const getUploadedLogoUrl = async (url: string) => {
    if (url) setValue("agencyLogo", url);
  };

  const { execute: createAgency } = useServerAction(createAgencyAction, {
    onSuccess: () => toast.success("Agency created"),
    onError: () => toast.error("Could not create agency"),
  });

  const { execute: updateGoal, isPending: updateGoalPending } = useServerAction(
    updateGoalAction,
    {
      onSuccess: () => toast.success("Agency goal updated"),
      onError: () => toast.error("Could not update agency goal"),
      retry: {
        maxAttempts: 3,
      },
    }
  );

  const { execute: updateAgency } = useServerAction(updateAgencyAction, {
    onSuccess: () => toast.success("Agency information updated"),
    onError: () => toast.error("Could not update agency information"),
    retry: {
      maxAttempts: 3,
    },
  });

  const handleSubmitForm = async (formData: formSchemaType) => {
    try {
      setLoading(true);
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

        const [newUser, err] = await initUserAction({
          role: "AGENCY_OWNER",
          agencyId,
        });

        if (!newUser || err) return toast.error("Something went wrong");

        const [agencyRes, agenyErr] = await createAgency({
          ...formData,
          customerId: custId,
          id: agencyId,
        });

        if (!agencyRes || agenyErr) return toast.error("Something went wrong");

        router.refresh();
      } else if (data?.id) {
        await updateAgency({ ...formData, id: data.id });
      }

      window.location.reload();
    } catch (err) {
      console.log(err);
      toast.error("Somthing went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeGoal = async (e: number) => {
    if (!data?.id) return;
    await updateGoal({ agencyId: data.id, goal: e });
  };

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
            render={() => (
              <FormItem className="">
                <FormLabel>Agency logo</FormLabel>
                <FormControl>
                  <DropzoneComponent
                    maxSize={1}
                    max_file={1}
                    getValue={getUploadedLogoUrl}
                  />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full flex-1 flex-col md:flex-row md:gap-3 flex gap-2">
            <FormInput
              control={form.control}
              name="name"
              className="flex-1"
              placeholder="Your agency name"
              label="Agency Name"
            />
            <FormInput
              control={form.control}
              name="companyEmail"
              className="flex-1"
              placeholder="Email"
              label="Agency Email"
              readOnly={true}
            />
          </div>
          <FormField
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
            control={form.control}
            name="address"
            className="flex-1"
            placeholder="123 st..."
            label="Address"
          />
          <div className="w-full flex-1 flex-col md:flex-row md:gap-3 flex gap-2">
            <FormInput
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
            />
            <FormInput
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
          />
          {data?.id ? (
            <>
              <FormField
                control={form.control}
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
                        disabled={updateGoalPending}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </>
          ) : null}
          <ButtonWithLoaderAndProgress
            type="submit"
            className={cn("mt-2")}
            variant={"default"}
            loading={isLoading}
          >
            {data?.id ? "Save agency Informations" : "Create Agency"}
          </ButtonWithLoaderAndProgress>
        </form>
      </Form>
      {data?.id ? (
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
