"use client";

import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { z } from "zod";
import { uploadMediaFormSchema } from "@/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { createMediaAction } from "@/actions";
import { toast } from "sonner";
import UploadImageWithPreview from "../dropzone/UploadImageWithPreview";
import FormInput from "../custom/form-input";
import ButtonWithLoaderAndProgress from "../ButtonWithLoaderAndProgress";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

type uploadMediaFormSchemaType = z.infer<typeof uploadMediaFormSchema>;

export default function UploadMediaForm({
  subaccountId,
}: {
  subaccountId: string;
}) {
  const router = useRouter();
  const form = useForm<uploadMediaFormSchemaType>({
    defaultValues: {
      name: "",
      link: "",
      subaccountId: subaccountId || "",
    },
    resolver: zodResolver(uploadMediaFormSchema),
    mode: "onSubmit",
  });

  const { mutate: createMedia, isPending } = useMutation({
    mutationFn: createMediaAction,
    onSuccess: () => {
      toast.success("Media created");
      form.reset();
      router.refresh();
    },
    onError: () => toast.error("Could not create media"),
  });

  const onSubmit = async (values: uploadMediaFormSchemaType) => {
    try {
      if (!subaccountId) return;
      createMedia(values);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Media Information</CardTitle>
        <CardDescription>
          Please enter the details for your file
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full flex flex-col gap-3"
          >
            <FormField
              control={form.control}
              disabled={isPending}
              name={"link"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Picture</FormLabel>
                  <FormControl>
                    <div className="flex w-full justify-center items-center flex-col gap-2">
                      <UploadImageWithPreview
                        maxSize={3}
                        max_file={1}
                        getValue={(url: string, files) => {
                          form.setValue("link", url);
                        }}
                        value={field.value}
                        className="w-full h-[300px] rounded-lg"
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormInput
              control={form.control}
              name="name"
              disabled={isPending}
              label="Media name"
              placeholder="Name..."
            />
            <ButtonWithLoaderAndProgress
              loading={isPending}
              disabled={isPending}
            >
              Create Media
            </ButtonWithLoaderAndProgress>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
