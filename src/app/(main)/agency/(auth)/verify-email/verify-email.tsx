"use client";

import ButtonWithLoaderAndProgress from "@/components/ButtonWithLoaderAndProgress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { verifyEmailFormSchemaType } from "@/types";
import { verifyEmailFormSchema } from "@/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { verifyEmailAction } from "@/actions";
import { toast } from "sonner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { ChevronLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function VerifyEmail() {
  const router = useRouter();

  const form = useForm<verifyEmailFormSchemaType>({
    resolver: zodResolver(verifyEmailFormSchema),
    defaultValues: {
      otp: "",
      userId: "",
    },
  });

  const { mutate: verifyEmail, isPending } = useMutation({
    mutationFn: verifyEmailAction,
    onSuccess: (e) => {
      if (e.error)
        return toast.error("Error", { description: e.error, icon: "🛑" });
      if (e.data) {
        toast.success("Success", {
          description: "Your email successfully verified, please login now",
          icon: "🎉",
        });
        router.replace("/agency/sign-in");
      }
    },
  });

  const onSubmit = async (values: verifyEmailFormSchemaType) => {
    verifyEmail(values);
  };

  useEffect(() => {
    if (window) {
      const userId = window.localStorage.getItem("userId");
      form.setValue("userId", userId || "");
    }
  }, [window]);

  return (
    <Card className="max-w-[400px] w-full bg-transparent border-0 shadow-none">
      <div className="px-6">
        <p
          onClick={() => router.back()}
          className="text-sm cursor-pointer w-fit flex items-center gap-1 text-muted-foreground"
        >
          <ChevronLeftIcon size={17} /> Back
        </p>
      </div>
      <CardHeader>
        <CardTitle className="text-4xl">Verify Your Email</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="flex w-full flex-col gap-2"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSeparator />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription>
                    Please enter the one-time code sent to your email.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
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
