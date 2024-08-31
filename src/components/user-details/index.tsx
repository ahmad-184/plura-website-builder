"use client";

import { SidebarType } from "@/types";
import { Permissions, SubAccount, User } from "@prisma/client";
import { useForm } from "react-hook-form";
import { userDetailsFormSchema } from "@/zod";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "../ui/form";
import UploadImageWithPreview from "../dropzone/UploadImageWithPreview";
import FormInput from "../custom/form-input";
import { XIcon } from "lucide-react";
import ButtonWithLoaderAndProgress from "../ButtonWithLoaderAndProgress";
import { changeUserPermissionAction, updateUserAction } from "@/actions";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Separator } from "../ui/Separator";
import { Switch } from "../ui/switch";
import { TeamMemberscolumnsProps } from "@/app/(main)/agency/[agencyId]/team/columns";
import SelectRole from "../custom/select-role";
import { useModal } from "@/providers/model-providers";
import { useMutation } from "@tanstack/react-query";

type userDetailsFormType = z.infer<typeof userDetailsFormSchema>;

export default function UserDetails({
  type,
  user,
  have_permission,
}: {
  type: SidebarType;
  user: (User & { Permissions?: Permissions[] }) | TeamMemberscolumnsProps;
  have_permission?: boolean;
}) {
  const [subaccounts, setSubaccount] = useState<SubAccount[] | []>([]);

  const { isOpen, data, isfetching } = useModal();

  useEffect(() => {
    if (have_permission && type === "agency" && data.subaccounts?.length) {
      setSubaccount(data.subaccounts);
    }
  }, [type, have_permission, data]);

  const router = useRouter();

  const form = useForm<userDetailsFormType>({
    resolver: zodResolver(userDetailsFormSchema),
    mode: "onSubmit",
    defaultValues: {
      avatarUrl: user?.avatarUrl,
      email: user?.email,
      name: user?.name,
      role: user?.role!,
    },
  });

  const { mutate: updateUser, isPending: updateUserPending } = useMutation({
    mutationFn: async (e: userDetailsFormType) => {
      if (!user || !user.id) throw new Error("User id required");
      const res = await updateUserAction(e);
      if (!res) throw new Error("Could not update user information");
      return res;
    },
    onSuccess: () => {
      toast.success("Success", {
        description: "User information updated",
        icon: "🎉",
      });
      router.refresh();
    },
    onError: (e) => {
      toast.error("Error", { description: e.message, icon: "🛑" });
    },
  });

  const onSubmit = async (values: userDetailsFormType) => {
    if (!user) return;
    updateUser({
      email: values.email,
      name: values.name,
      avatarUrl: values.avatarUrl,
      role: values.role,
    });
  };

  const { mutate: changeUserPermission, isPending: changePermissionPending } =
    useMutation({
      mutationFn: changeUserPermissionAction,
      onSuccess: () => {
        toast.success("Success", {
          description: "Permission changed successfully",
          icon: "🎉",
        });
        return router.refresh();
      },
      onError: (e) => {
        toast.error("Error", { description: e.message, icon: "🛑" });
      },
    });

  const onPermisssionChange = async (
    subaccountId: string,
    access: boolean,
    subaccount_name: string,
    permissionId?: string
  ) => {
    if (
      !user ||
      !user.id ||
      type !== "agency" ||
      !user.agencyId ||
      !have_permission
    )
      return;
    changeUserPermission({
      email: user.email,
      subaccountId,
      access,
      permissionId,
      user_name: user.name,
      subaccount_name: subaccount_name,
      agenc_id: user.agencyId,
    });
  };

  const isLoading = useMemo(() => {
    if (updateUserPending || changePermissionPending) return true;
    else return false;
  }, [updateUserPending, changePermissionPending]);

  const disableRoleSelection = useMemo(() => {
    if (isLoading) return true;
    if (user?.role === "AGENCY_OWNER") return true;
    if (user?.role && !have_permission) return true;
    if (user?.role && have_permission) return false;
  }, [user?.role, have_permission, isLoading]);

  return (
    <div>
      <Form {...form}>
        <form
          className="w-full flex flex-col gap-2"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            disabled={isLoading}
            name={"avatarUrl"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile Picture</FormLabel>
                <FormControl>
                  <div className="flex w-full justify-center items-center flex-col gap-2">
                    <UploadImageWithPreview
                      maxSize={1}
                      max_file={1}
                      getValue={(url: string, files) => {
                        form.setValue("avatarUrl", url);
                      }}
                      value={field.value}
                      className="w-[200px] h-[200px] rounded-lg"
                    />
                    <div
                      onClick={() => {
                        form.setValue("avatarUrl", user?.avatarUrl);
                      }}
                      className="flex rounded-lg bg-muted text-muted-foreground text-sm items-center gap-1 p-1 cursor-pointer hover:underline"
                    >
                      <XIcon size={18} />
                      <p>Remove Picture</p>
                    </div>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          <FormInput
            disabled={isLoading}
            control={form.control}
            name="name"
            label="Your Name"
          />
          <FormInput
            disabled={isLoading}
            control={form.control}
            name="email"
            readOnly={user?.role === "AGENCY_OWNER" ? true : false}
            label="Email"
          />
          <SelectRole
            control={form.control}
            name="role"
            disabled={isLoading || disableRoleSelection}
            include_agency_owner={user?.role === "AGENCY_OWNER"}
          />
          <ButtonWithLoaderAndProgress
            className="mt-1 w-fit"
            disabled={isLoading}
            loading={isLoading}
          >
            Save Information
          </ButtonWithLoaderAndProgress>
        </form>
        {have_permission &&
        type === "agency" &&
        subaccounts?.length &&
        user?.role !== "AGENCY_OWNER" &&
        isOpen &&
        !isfetching ? (
          <div>
            <Separator className="my-4" />
            <FormLabel>User Permissions</FormLabel>
            <FormDescription className="mb-4">
              You can give Sub Account access to team member by turning on
              access control for each Sub Account. This is only visible to
              agency owners
            </FormDescription>
            <div className="w-full flex flex-col gap-4">
              {subaccounts.map((sub, index) => {
                const userPermission = user?.Permissions?.find(
                  (p) => p.subAccountId === sub.id
                );

                return (
                  <>
                    <div
                      key={sub.id}
                      className="flex items-center gap-3 justify-between dark:bg-muted/60 bg-muted rounded-lg p-3"
                    >
                      <p className="text-sm font-medium">{sub.name}</p>
                      <Switch
                        disabled={isLoading}
                        onCheckedChange={(e) => {
                          onPermisssionChange(
                            sub.id,
                            e,
                            sub.name,
                            userPermission?.id
                          );
                        }}
                        defaultChecked={userPermission?.access || false}
                      />
                    </div>
                    {subaccounts.length !== index + 1 && <Separator />}
                  </>
                );
              })}
            </div>
          </div>
        ) : null}
      </Form>
    </div>
  );
}
