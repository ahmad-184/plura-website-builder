"use client";

import { Media } from "@prisma/client";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import Image from "next/image";
import { CopyIcon, MoreHorizontalIcon, TrashIcon } from "lucide-react";
import { fDate } from "@/lib/formatTime";
import { toast } from "sonner";
import { deleteMediaAction } from "@/actions";
import ButtonWithLoaderAndProgress from "../ButtonWithLoaderAndProgress";
import { useMutation } from "@tanstack/react-query";

export default function MediaCard({ data }: { data: Media }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const { mutate: deleteMedia, isPending } = useMutation({
    mutationFn: deleteMediaAction,
    onSuccess: (e) => {
      if (e.error)
        return toast.error("Error", { description: e.error, icon: "🛑" });
      if (e.data) {
        toast.success("Success", {
          description: "Media deleted successfully",
          icon: "🎉",
        });
        setOpen(false);
        router.refresh();
      }
    },
  });

  const handleDelete = async () => {
    if (!data.id) return;
    deleteMedia({ id: data.id });
  };

  return (
    <AlertDialog onOpenChange={setOpen} open={open}>
      <DropdownMenu>
        <article className="border w-full rounded-lg dark:bg-slate-900 bg-white">
          <div className="relative w-full h-52">
            <Image
              src={data.link}
              alt="preview image"
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <p className="opacity-0 h-0 w-0 sr-only">{data.name}</p>
          <div className="p-4 relative">
            <p className="text-muted-foreground text-xs">
              {fDate(data.createdAt)}
            </p>
            <p className="text-gray-900 dark:text-gray-100 capitalize text-sm">
              {data.name}
            </p>
            <div className="absolute top-4 right-4 p-[1px] cursor-pointer ">
              <DropdownMenuTrigger>
                <MoreHorizontalIcon
                  className="text-muted-foreground"
                  size={19}
                />
              </DropdownMenuTrigger>
            </div>
          </div>
        </article>
        <DropdownMenuContent>
          <DropdownMenuLabel>Menu</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="gap-2"
            onClick={() => {
              window.navigator.clipboard.writeText(data.link);
              toast.success("Media link copied");
            }}
          >
            <CopyIcon size={15} /> Copy link
          </DropdownMenuItem>
          {pathname.startsWith("/editor") ? null : (
            <AlertDialogTrigger asChild>
              <DropdownMenuItem className="gap-2">
                <TrashIcon size={15} /> Delete File
              </DropdownMenuItem>
            </AlertDialogTrigger>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-left">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            Are you sure you want to delete this file? All subaccount using this
            file will no longer have access to it!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex items-center">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <ButtonWithLoaderAndProgress
            disabled={isPending}
            onClick={handleDelete}
            variant={"destructive"}
            loading={isPending}
          >
            Delete
          </ButtonWithLoaderAndProgress>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
