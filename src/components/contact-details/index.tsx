"use client";

import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Form } from "../ui/form";
import { contactFormSchemaType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema } from "@/zod";
import { useEffect, useMemo } from "react";
import { Contact } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import FormInput from "../custom/form-input";
import ButtonWithLoaderAndProgress from "../ButtonWithLoaderAndProgress";
import { createContactAction, updateContactAction } from "@/actions";

const ContactDetails = ({
  subaccountId,
  contact,
}: {
  subaccountId: string;
  contact?: Partial<Contact>;
}) => {
  const router = useRouter();
  const form = useForm<contactFormSchemaType>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      subaccountId,
      name: contact?.name || "",
      email: contact?.email || "",
    },
  });

  useEffect(() => {
    if (subaccountId && !contact) {
      form.reset({ subaccountId });
    }
    if (contact?.id) {
      form.reset({
        name: contact?.name || "",
        email: contact?.email || "",
        subaccountId: contact.subAccountId,
      });
    }
  }, [subaccountId, contact]);

  const { mutate: createContact, isPending: createPending } = useMutation({
    mutationFn: createContactAction,
    onSuccess: (e) => {
      if (e.error)
        return toast.error("Error", { description: e.error, icon: "🛑" });
      if (e.data) {
        toast.success("Success", {
          description: "Contact created",
          icon: "🎉",
        });
        form.reset({ subaccountId });
        router.refresh();
      }
    },
    retry: 3,
  });

  const { mutate: updateContact, isPending: updatePending } = useMutation({
    mutationFn: updateContactAction,
    onSuccess: (e) => {
      if (e.error)
        return toast.error("Error", { description: e.error, icon: "🛑" });
      if (e.data) {
        toast.success("Success", {
          description: "Contact information updated",
          icon: "🎉",
        });
        router.refresh();
      }
    },
    retry: 3,
  });

  const onSubmit = async (values: contactFormSchemaType) => {
    if (contact?.id) updateContact({ ...values, id: contact.id });
    else createContact(values);
  };

  const isLoading = useMemo(() => {
    if (createPending || updatePending) return true;
    else return false;
  }, [createPending, updatePending]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact details</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full flex flex-col gap-2"
          >
            <FormInput
              control={form.control}
              name="name"
              placeholder="Contact name..."
              label={"Name"}
              disabled={isLoading}
            />
            <FormInput
              control={form.control}
              name="email"
              placeholder="Contact email..."
              label={"Email"}
              disabled={isLoading}
              type="email"
            />
            <ButtonWithLoaderAndProgress
              disabled={isLoading}
              loading={isLoading}
            >
              {contact?.id ? "Save" : "Create"}
            </ButtonWithLoaderAndProgress>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ContactDetails;
