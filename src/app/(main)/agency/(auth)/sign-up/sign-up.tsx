"use client";

import ButtonWithLoaderAndProgress from "@/components/ButtonWithLoaderAndProgress";
import FormInput from "@/components/custom/form-input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { signUpFormSchemaType } from "@/types";
import { signUpFormSchema } from "@/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useForm } from "react-hook-form";
import GoogleSignIn from "../../_components/google-sign-in";
import { registerUserAction } from "@/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const router = useRouter();

  const form = useForm<signUpFormSchemaType>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const { mutate: register, isPending } = useMutation({
    mutationFn: registerUserAction,
    onSuccess: (e) => {
      if (e) {
        toast.success("Success", {
          description: "Verification code sent to your email",
          icon: "🎉",
        });
        if (window) window.localStorage.setItem("userId", e.id);
        router.push("/agency/verify-email");
      }
    },
    onError: (e) => {
      toast.error("Error", { description: e.message, icon: "🛑" });
    },
  });

  const onSubmit = async (values: signUpFormSchemaType) => {
    register(values);
  };

  return (
    <Card className="w-[340px] sm:w-[400px] bg-transparent border-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-4xl text-center">Sign Up</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="flex w-full flex-col gap-2"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormInput
              name="name"
              control={form.control}
              label="Name"
              disabled={isPending}
              placeholder="Your name"
              className="flex-1"
            />
            <div className="w-full flex flex-col gap-2">
              <FormInput
                name="email"
                control={form.control}
                label="Email"
                disabled={isPending}
                placeholder="Email"
              />
            </div>
            <div className="w-full flex flex-col gap-2">
              <div className="flex gap-2">
                <FormInput
                  name="password"
                  control={form.control}
                  label="Password"
                  disabled={isPending}
                  placeholder="Strong password"
                  className="flex-1"
                  type="password"
                />
                <FormInput
                  name="passwordConfirmation"
                  control={form.control}
                  label="Confirm password"
                  disabled={isPending}
                  placeholder="Confirm password"
                  className="flex-1"
                  type="password"
                />
              </div>
              <Link href={"/agency/sign-in"} className="text-sm text-blue-600">
                Already have an account? sign in
              </Link>
            </div>
            <ButtonWithLoaderAndProgress
              className="mt-3"
              loading={isPending}
              disabled={isPending}
            >
              Register
            </ButtonWithLoaderAndProgress>
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
