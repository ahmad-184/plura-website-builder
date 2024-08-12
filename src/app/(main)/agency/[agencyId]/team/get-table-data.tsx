import { getAgencyTeamMembers } from "@/actions/user";
import DataTable from "@/components/custom/table";
import { columns } from "./columns";
import SendInvitation from "../../_components/send-invitation";
import { redirect } from "next/navigation";

export default async function GetTableData({ agencyId }: { agencyId: string }) {
  const teamMembers = await getAgencyTeamMembers(agencyId);
  if (teamMembers === null) return redirect("/agency");

  return (
    <DataTable
      filterValue="name"
      data={teamMembers}
      columns={columns}
      header_action_btn={<SendInvitation />}
    />
  );
}
