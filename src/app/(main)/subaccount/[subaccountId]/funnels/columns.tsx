"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Prisma } from "@prisma/client";
import { getSubaccountFunnel, updateFunnelDetails } from "@/actions/funnel";
import { ExternalLinkIcon } from "lucide-react";
import { fDate } from "@/lib/formatTime";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useState } from "react";
import { getCurrentUser } from "@/actions/auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export type FunnlesColumnsProps = Prisma.PromiseReturnType<
  typeof getSubaccountFunnel
>;

export const columns: ColumnDef<FunnlesColumnsProps>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const data = row.original;

      return (
        <Link
          href={`/subaccount/${data?.subAccountId}/funnels/${data?.id}`}
          className="flex items-center gap-2"
        >
          <p>{data?.name}</p>
          <ExternalLinkIcon size={15} />
        </Link>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Last Update",
    cell: ({ row }) => {
      const data = row.original;
      return (
        <span className="text-muted-foreground select-none">
          {fDate(data?.updatedAt || new Date(Date.now()))}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const data = row.original;
      const router = useRouter();

      const [published, setPublished] = useState(data?.published);

      const { data: currentUser, isPending } = useQuery({
        queryKey: ["current-user"],
        queryFn: () => getCurrentUser(),
        retry: 3,
      });

      const { mutate: updateFunnel, isPending: updatePending } = useMutation({
        mutationFn: updateFunnelDetails,
        retry: 3,
        onSuccess: (e) => {
          if (e) {
            setPublished(e.published);
            toast.success("Success", {});
            router.refresh();
          }
        },
        onError: (e) => {
          toast.error("Error", { description: e.message, icon: "🛑" });
        },
      });

      const handleChangeStatus = (e: boolean) => {
        if (!data?.id) return;
        updateFunnel({ id: data.id, published: e });
      };

      if (!currentUser || isPending)
        return <Skeleton className="w-14 h-6 rounded-xl" />;
      if (
        currentUser.role === "SUBACCOUNT_GUEST" ||
        currentUser.role === "SUBACCOUNT_USER"
      )
        return (
          <Badge
            className="select-none"
            variant={published ? "default" : "secondary"}
          >
            {published ? "Published" : "Draft"}
          </Badge>
        );
      else
        return (
          <div className="flex w-full items-center gap-2">
            <Badge
              className="select-none"
              variant={published ? "default" : "secondary"}
            >
              {published ? "Published" : "Draft"}
            </Badge>
            <Switch
              defaultChecked={data?.published}
              onCheckedChange={(e) => {
                setPublished(e);
                handleChangeStatus(e);
              }}
              disabled={updatePending}
              checked={published}
            />
          </div>
        );
    },
  },
];
