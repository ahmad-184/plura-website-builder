"use client";

import ButtonWithLoaderAndProgress from "@/components/ButtonWithLoaderAndProgress";
import FormInput from "@/components/custom/form-input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { signInFormSchemaType } from "@/types";
import { signInFormSchema } from "@/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useForm } from "react-hook-form";
import GoogleSignIn from "../../_components/google-sign-in";
import { signInUserAction } from "@/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const router = useRouter();

  const form = useForm<signInFormSchemaType>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate: signIn, isPending } = useMutation({
    mutationFn: signInUserAction,
    onSuccess: (e) => {
      if (e) {
        toast.success("Success", {
          description: "Signed in successfully",
          icon: "🎉",
        });
        router.replace("/agency");
      }
    },
    onError: (e) => {
      toast.error("Error", { description: e.message, icon: "🛑" });
    },
  });

  const onSubmit = async (values: signInFormSchemaType) => {
    signIn(values);
  };

  return (
    <Card className="w-[340px] sm:w-[400px] bg-transparent border-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-4xl text-center">Sign In</CardTitle>
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
                label="Email"
                disabled={isPending}
                placeholder="Email"
              />
              <FormInput
                name="password"
                control={form.control}
                label="Password"
                disabled={isPending}
                placeholder="Password"
                type="password"
              />
              <Link
                href={"/agency/forgot-password"}
                className="text-sm text-blue-600"
              >
                Forgot your password?
              </Link>
            </div>
            <ButtonWithLoaderAndProgress
              className="mt-3"
              loading={isPending}
              disabled={isPending}
            >
              Sign In
            </ButtonWithLoaderAndProgress>
            <Link href={"/agency/sign-up"} className="text-sm text-blue-600">
              New here? sign up
            </Link>
            <p className="text-xs text-muted-foreground font-bold text-center my-2">
              Or
            </p>
            <GoogleSignIn />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
