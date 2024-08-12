"use client";

import { sendInvitationAction } from "@/actions";
import ButtonWithLoaderAndProgress from "@/components/ButtonWithLoaderAndProgress";
import FormInput from "@/components/custom/form-input";
import SelectRole from "@/components/custom/select-role";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { sendInvitationSchemaType } from "@/types";
import { sendInvitationSchema } from "@/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { UserIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const SendInvitation = () => {
  const form = useForm<sendInvitationSchemaType>({
    resolver: zodResolver(sendInvitationSchema),
    defaultValues: {
      email: "",
      role: "SUBACCOUNT_USER",
    },
  });

  const { mutate: sendInvitation, isPending } = useMutation({
    mutationFn: sendInvitationAction,
    onSuccess: () => {
      toast.success("Invitation send");
      form.reset();
    },
    onError: () => toast.success("Could not send invitation"),
  });

  const handleSubmit = async (values: sendInvitationSchemaType) => {
    sendInvitation(values);
  };

  return (
    <>
      <Dialog>
        <DialogTrigger>
          <Button>
            <UserIcon size={20} />
            Send Invitation
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a team member</DialogTitle>
            <DialogDescription>Send an invitation</DialogDescription>
          </DialogHeader>
          <Card>
            <CardHeader>
              <CardTitle>Invitation</CardTitle>
              <CardDescription>
                An invitation will be sent to the user. Users who already have
                an invitation sent out to their email, will not receive another
                invitation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  className="w-full flex flex-col gap-3"
                  onSubmit={form.handleSubmit(handleSubmit)}
                >
                  <FormInput
                    control={form.control}
                    name="email"
                    disabled={isPending}
                    placeholder="Email"
                    label="Email"
                  />
                  <SelectRole
                    control={form.control}
                    disabled={isPending}
                    name="role"
                  />
                  <ButtonWithLoaderAndProgress loading={isPending}>
                    Send Invitation
                  </ButtonWithLoaderAndProgress>
                </form>
              </Form>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SendInvitation;
