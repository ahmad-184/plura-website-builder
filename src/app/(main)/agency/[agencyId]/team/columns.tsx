"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Prisma, User } from "@prisma/client";
import { getAgencyTeamMember } from "@/actions/user";
import UserAvatar from "@/components/user-avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  CopyIcon,
  EditIcon,
  EllipsisVerticalIcon,
  TrashIcon,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Loader from "@/components/loader";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useModal } from "@/providers/model-providers";
import CustomDialog from "@/components/custom/custom-dialog";
import UserDetails from "@/components/user-details";
import { getCurrentUserSubaccounts } from "@/actions/subaccount";
import { useMutation } from "@tanstack/react-query";
import { getCurrentUser } from "@/actions/auth";
import { removeUserAccessToAgencyAction } from "@/actions";

export type TeamMemberscolumnsProps = Prisma.PromiseReturnType<
  typeof getAgencyTeamMember
>;

export const columns: ColumnDef<TeamMemberscolumnsProps>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const data = row.original;

      return (
        <div className="flex items-center gap-2 ">
          <UserAvatar
            alt={`${data?.name} profile picture`}
            src={data?.avatarUrl || ""}
            className="w-8 h-8"
          />
          <p className="capitalize">{data?.name}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "Permissions",
    header: "Owner Accounts",
    cell: ({ row }) => {
      const data = row.original;
      const isAgencyOwner = data?.role === "AGENCY_OWNER";

      if (isAgencyOwner)
        return (
          <div>
            <Badge className="bg-slate-600 whitespace-nowrap text-gray-200">
              Agency Owner
            </Badge>
          </div>
        );

      const permissions_with_true_access = data?.Permissions?.filter(
        (per) => per.access === true
      );

      return (
        <div className="flex flex-col items-start">
          <div className="flex flex-col gap-2">
            {permissions_with_true_access?.length ? (
              permissions_with_true_access?.map((per) => (
                <Badge
                  key={per.SubAccount.id}
                  className="bg-slate-600 text-gray-200 w-fit whitespace-nowrap"
                >
                  Sub Account - {per.SubAccount.name}
                </Badge>
              ))
            ) : (
              <div className="text-muted-foreground">No Access Yet</div>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.original?.role;

      return (
        <Badge
          className={cn({
            "bg-emerald-500": role === "AGENCY_OWNER",
            "bg-orange-400": role === "AGENCY_ADMIN",
            "bg-primary": role === "SUBACCOUNT_USER",
            "bg-secondary text-gray-200": role === "SUBACCOUNT_GUEST",
          })}
        >
          {role}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

const CellAction = ({ data }: { data: TeamMemberscolumnsProps }) => {
  const [open, setOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const router = useRouter();

  const { setOpen: openModal } = useModal();

  const { mutate: removeUser, isPending } = useMutation({
    mutationFn: removeUserAccessToAgencyAction,
    onSuccess: () => {
      toast.success("Success", {
        description: "User deleted successfully",
        icon: "🎉",
      });
      router.refresh();
      setOpen(false);
    },
    onError: (e) => {
      toast.error("Error", { description: e.message, icon: "🛑" });
    },
  });

  useEffect(() => {
    (async () => {
      const res = await getCurrentUser();
      if (res) setCurrentUser(res);
    })();
  }, []);

  const handleDeleteUser = async () => {
    if (!data?.id) return;
    removeUser({
      userId: data.id,
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <EllipsisVerticalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            className="flex gap-2"
            onClick={() => {
              if (data?.email) window.navigator.clipboard.writeText(data.email);
            }}
          >
            <CopyIcon size={15} />
            Copy email
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {(currentUser?.role !== "AGENCY_OWNER" &&
            data?.role === "AGENCY_OWNER") ||
          currentUser?.id === data?.id ||
          (currentUser?.role === "AGENCY_ADMIN" &&
            data?.role === "AGENCY_ADMIN") ? null : (
            <DropdownMenuItem
              className="flex gap-2"
              onClick={() => {
                openModal({
                  modal: (
                    <>
                      <CustomDialog
                        description="You can change permissions only when the user has an owned subaccount"
                        header="Edit User Details"
                        content={
                          <>
                            <UserDetails
                              user={data}
                              type="agency"
                              have_permission={
                                currentUser?.role === "AGENCY_OWNER"
                              }
                            />
                          </>
                        }
                      />
                    </>
                  ),
                  fetchData: async () => {
                    if (
                      currentUser?.role === "AGENCY_OWNER" &&
                      currentUser.id !== data?.id
                    ) {
                      return {
                        subaccounts: await getCurrentUserSubaccounts(),
                      };
                    } else {
                      return null;
                    }
                  },
                });
              }}
            >
              <EditIcon size={15} />
              Edit details
            </DropdownMenuItem>
          )}
          {currentUser?.role === "AGENCY_OWNER" &&
          currentUser?.id !== data?.id ? (
            <>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem className="flex gap-2">
                  <div className="w-full flex items-center gap-2">
                    <TrashIcon size={15} />
                    Delete user
                  </div>
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deleted User</AlertDialogTitle>
          <AlertDialogDescription>
            The user has been deleted from this agency they no longer have
            access to the agency
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex items-center">
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <Button
            onClick={handleDeleteUser}
            disabled={isPending}
            className="bg-destructive hover:bg-destructive/80"
          >
            {isPending ? (
              <div className="w-full flex h-full items-center justify-center">
                <Loader className="w-5 h-5" />
              </div>
            ) : (
              "Delete"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
