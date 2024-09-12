"use client";

import ButtonWithLoaderAndProgress from "@/components/ButtonWithLoaderAndProgress";
import FormInput from "@/components/custom/form-input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { resetPasswordFormSchemaType } from "@/types";
import { resetPasswordFormSchema } from "@/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { resetPasswordUserAction } from "@/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ResetPassword({ token }: { token: string }) {
  const router = useRouter();

  const form = useForm<resetPasswordFormSchemaType>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      password: "",
      passwordConfirmation: "",
      token: token,
    },
  });

  useEffect(() => {
    form.reset({ token });
  }, [token]);

  const { mutate: resetPassword, isPending } = useMutation({
    mutationFn: resetPasswordUserAction,
    onSuccess: (e) => {
      if (e.error)
        return toast.error("Error", { description: e.error, icon: "🛑" });
      if (e.data) {
        toast.success("Success", {
          description: "Your password changed successfully",
          icon: "🎉",
        });
        router.replace("/agency/sign-in");
      }
    },
  });

  const onSubmit = async (values: resetPasswordFormSchemaType) => {
    resetPassword(values);
  };

  return (
    <Card className="w-[340px] sm:w-[400px] bg-transparent border-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-4xl text-left">Reset password</CardTitle>
        <CardDescription>
          Now you can reset your password here, good luck
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="flex w-full flex-col gap-2"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="w-full flex flex-col gap-2">
              <FormInput
                name="password"
                control={form.control}
                label="New Email"
                disabled={isPending}
                placeholder="Your new password"
                type="password"
              />
              <FormInput
                name="passwordConfirmation"
                control={form.control}
                label="Confirm Password"
                disabled={isPending}
                placeholder="Repeat password"
                type="password"
              />
            </div>
            <ButtonWithLoaderAndProgress
              className="mt-3"
              loading={isPending}
              disabled={isPending}
            >
              Send
            </ButtonWithLoaderAndProgress>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
