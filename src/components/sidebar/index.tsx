import SidebarSheet from "./sidebar-sheet";
import SidebarContent from "./sidebar-content";

export default function Sidebar({
  id,
  type,
}: {
  id: string;
  type: "agency" | "subaccount";
}) {
  return (
    <>
      <SidebarSheet>
        <SidebarContent id={id} type={type} />
      </SidebarSheet>
      <SidebarSheet defaultOpen={true}>
        <SidebarContent id={id} type={type} />
      </SidebarSheet>
    </>
  );
}
