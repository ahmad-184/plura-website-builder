"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Prisma } from "@prisma/client";
import { getSubaccountFunnel } from "@/actions/funnel";
import { ExternalLinkIcon } from "lucide-react";
import { fDate } from "@/lib/formatTime";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

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

      if (data?.published)
        return (
          <Badge className="select-none">Live - {data.subDomainName}</Badge>
        );
      else
        return (
          <Badge className="select-none" variant={"secondary"}>
            Draft
          </Badge>
        );
    },
  },
];
