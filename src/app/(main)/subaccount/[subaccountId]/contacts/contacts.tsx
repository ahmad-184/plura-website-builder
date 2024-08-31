import CustomAvatar from "@/components/custom/custom-avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/db";
import { fDate } from "@/lib/formatTime";
import { protectSubaccountRoute } from "@/actions/auth";
import ContactOptions from "./_components/contact-options";

const formatTotalValue = (tickets: { value: string | null }[]) => {
  const amt = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  });
  const total = tickets.reduce(
    (sum, ticket) => sum + (Number(ticket?.value) || 0),
    0
  );
  return `$${amt.format(total).split("$")[1]}`;
};

export default async function Contacts({
  subaccountId,
}: {
  subaccountId: string;
}) {
  const user = await protectSubaccountRoute(subaccountId);
  const subaccount = await db.subAccount.findUnique({
    where: {
      id: subaccountId,
    },
    include: {
      Contact: {
        orderBy: {
          createdAt: "asc",
        },
        include: {
          Ticket: {
            select: {
              value: true,
            },
          },
        },
      },
    },
  });

  return (
    <div className="w-full">
      <Table className="min-w-[840px]">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead className="w-[250px]">Email</TableHead>
            <TableHead className="w-[100px]">Active</TableHead>
            <TableHead className="min-w-[100px]">Created Date</TableHead>
            <TableHead className="text-right min-w-[100px]">
              Total Value
            </TableHead>
            {user.role === "AGENCY_OWNER" ||
            user.role === "AGENCY_ADMIN" ||
            user.role === "SUBACCOUNT_ADMIN" ? (
              <TableHead className="w-[50px]"></TableHead>
            ) : null}
          </TableRow>
        </TableHeader>
        <TableBody className="font-medium truncate">
          {subaccount?.Contact.map((c) => (
            <TableRow key={c.id}>
              <TableCell>
                <div className="w-full flex items-center gap-2 capitalize">
                  <CustomAvatar user={{ name: c.name }} />
                  {c.name}
                </div>
              </TableCell>
              <TableCell>{c.email}</TableCell>
              <TableCell>
                {formatTotalValue(c.Ticket) === "$0.00" ? (
                  <Badge variant={"destructive"}>Inactive</Badge>
                ) : (
                  <Badge className="bg-emerald-700 text-gray-50">Active</Badge>
                )}
              </TableCell>
              <TableCell>{fDate(c.createdAt)}</TableCell>
              <TableCell className="text-right">
                {formatTotalValue(c.Ticket)}
              </TableCell>
              {user.role === "AGENCY_OWNER" ||
              user.role === "AGENCY_ADMIN" ||
              user.role === "SUBACCOUNT_ADMIN" ? (
                <TableCell className="text-right">
                  <ContactOptions contact={JSON.parse(JSON.stringify(c))} />
                </TableCell>
              ) : null}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
