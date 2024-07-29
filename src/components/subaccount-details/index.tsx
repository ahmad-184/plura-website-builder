"use client";

import { v4 as uuid4 } from "uuid";
import { useServerAction } from "zsa-react";
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
import { useEffect, useState } from "react";
import ButtonWithLoaderAndProgress from "../ButtonWithLoaderAndProgress";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { cn } from "@/lib/utils";
import { PhoneInput } from "../custom/phone-input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { agencyDetailFormSchema, subAccountDetailFormSchema } from "@/zod";
import { createSubAccountAction, updateSubAccountAction } from "@/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

type formSchemaType = z.infer<typeof subAccountDetailFormSchema>;

export default function SubAccountDetails({
  data,
  agencyId,
}: {
  data: Partial<SubAccount>;
  agencyId: string;
}) {
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);

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
    resolver: zodResolver(agencyDetailFormSchema),
    mode: "onChange",
  });

  const { setValue, reset } = form;

  useEffect(() => {
    if (data) reset({ ...data });
  }, [data]);

  const getUploadedLogoUrl = async (url: string) => {
    if (url) setValue("subAccountLogo", url);
  };

  const { execute: createSubAcnount } = useServerAction(
    createSubAccountAction,
    {
      onSuccess: () => toast.success("Account created"),
      onError: () => toast.error("Could not create Account"),
    }
  );

  const { execute: updateSubAccount } = useServerAction(
    updateSubAccountAction,
    {
      onSuccess: () => toast.success("Account information updated"),
      onError: () => toast.error("Could not update Account information"),
      retry: {
        maxAttempts: 3,
      },
    }
  );

  const handleSubmitForm = async (formData: formSchemaType) => {
    if (agencyId) return toast.success("agency id required");

    try {
      setLoading(true);
      if (!data?.id) {
        const subAccountId = uuid4();

        const [agencyRes, agenyErr] = await createSubAcnount({
          ...formData,
          id: subAccountId,
          agencyId: agencyId,
        });

        if (!agencyRes || agenyErr) return toast.error("Something went wrong");
      } else if (data?.id) {
        await updateSubAccount({
          ...formData,
          id: data.id,
          agencyId: agencyId,
        });
      }

      router.refresh();
    } catch (err) {
      console.log(err);
      toast.error("Somthing went wrong");
    } finally {
      setLoading(false);
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
                control={form.control}
                name="subAccountLogo"
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
                  placeholder="Your Account name"
                  label="Account Name"
                />
                <FormInput
                  control={form.control}
                  name="companyEmail"
                  className="flex-1"
                  placeholder="Email"
                  label="Account Email"
                  readOnly={false}
                />
              </div>
              <FormField
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
              <ButtonWithLoaderAndProgress
                type="submit"
                className={cn("mt-2")}
                variant={"default"}
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
