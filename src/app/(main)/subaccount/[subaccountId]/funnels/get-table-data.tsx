import DataTable from "@/components/custom/table";
import { columns } from "./columns";
import { getSubaccountFunnels } from "@/actions/funnel";
import { protectSubaccountRoute } from "@/actions/auth";
import CreateFunnelButton from "./_components/create-funnel-button";

export default async function GetTableData({
  subaccountId,
}: {
  subaccountId: string;
}) {
  const funnels = await getSubaccountFunnels(subaccountId);
  const user = await protectSubaccountRoute(subaccountId);

  return (
    <DataTable
      filterValue="name"
      data={funnels || []}
      columns={columns}
      header_action_btn={
        user.role === "AGENCY_ADMIN" ||
        user.role === "AGENCY_OWNER" ||
        user.role === "SUBACCOUNT_ADMIN" ? (
          <CreateFunnelButton subaccountId={subaccountId} />
        ) : null
      }
    />
  );
}
