import CustomDialog from "@/components/custom/custom-dialog";
import TicketDetails from "@/components/ticket-details";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useModal } from "@/providers/model-providers";
import { usePipelineStore } from "@/providers/pipeline-store-provider";
import { Lane } from "@prisma/client";
import { PlusCircleIcon } from "lucide-react";

export default function CreateTicket({
  lane,
  subaccountId,
}: {
  lane: Lane;
  subaccountId: string;
}) {
  const { setOpen } = useModal();

  const { setNewTicket, channel } = usePipelineStore((store) => store);

  return (
    <DropdownMenuItem
      className="flex items-center gap-2"
      onClick={() => {
        setOpen({
          modal: (
            <CustomDialog
              header="Create A Ticket"
              description="Tickets are a great way to keep track of tasks"
              content={
                <TicketDetails
                  laneId={lane.id}
                  subaccountId={subaccountId}
                  setNewTicket={setNewTicket}
                  channel={channel}
                />
              }
            />
          ),
        });
      }}
    >
      <PlusCircleIcon size={15} />
      Create Ticket
    </DropdownMenuItem>
  );
}
