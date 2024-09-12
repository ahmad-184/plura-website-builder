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
import { forgotPasswordFormSchemaType } from "@/types";
import { forgotPasswordFormSchema } from "@/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { forgotPasswordUserAction } from "@/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const router = useRouter();

  const form = useForm<forgotPasswordFormSchemaType>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: forgotPasswordUserAction,
    onSuccess: (e) => {
      if (e.error)
        return toast.error("Error", { description: e.error, icon: "🛑" });
      if (e.data) {
        toast.success("Success", {
          description: "Reset password link sent to your email",
          icon: "🎉",
        });
        router.replace("/agency");
      }
    },
  });

  const onSubmit = async (values: forgotPasswordFormSchemaType) => {
    mutate(values);
  };

  return (
    <Card className="w-[340px] sm:w-[400px] bg-transparent border-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-4xl text-left">Forgot password</CardTitle>
        <CardDescription>
          Enter your email, then we send you an email that include a link to
          change pasword page
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
                name="email"
                control={form.control}
                label="Your Email"
                disabled={isPending}
                placeholder="Email"
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
