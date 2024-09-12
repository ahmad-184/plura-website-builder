import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { LaneFullDataType } from "@/types";
import { EditIcon, MoreVerticalIcon, TrashIcon } from "lucide-react";
import { useMemo } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import DeleteLane from "./delete-lane";
import UpdateLane from "./update-lane";
import CreateTicket from "./create-ticket";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import PipelineTicket from "./pipeline-ticket";

const amt = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "USD",
});

export default function PipelineLane({
  pipelineId,
  subaccountId,
  laneDetails,
  index,
}: {
  pipelineId: string;
  subaccountId: string;
  laneDetails: LaneFullDataType;
  index: number;
}) {
  const laneAmt = useMemo(() => {
    return laneDetails.Tickets.reduce(
      (sum, ticket) => sum + (Number(ticket?.value) || 0),
      0
    );
  }, [laneDetails.Tickets]);

  const randomColor = useMemo(
    () => `#${Math.random().toString(16).slice(2, 8)}`,
    [laneDetails.id]
  );

  return (
    <Draggable
      draggableId={String(laneDetails.id)}
      index={index}
      key={String(laneDetails.id)}
    >
      {(provided, snapshot) => {
        if (snapshot.isDragging) {
          //@ts-ignore
          const offset = { x: 300, y: 0 };
          //@ts-ignore
          const x = provided.draggableProps.style?.left - offset.x;
          //@ts-ignore
          const y = provided.draggableProps.style?.top - offset.y;
          // @ts-ignore
          provided.draggableProps.style = {
            ...provided.draggableProps.style,
            top: y,
            left: x,
          };
        }

        return (
          <div
            {...provided.draggableProps}
            ref={provided.innerRef}
            className="h-full"
          >
            <Dialog>
              <AlertDialog>
                <DropdownMenu>
                  <div className="bg-slate-200/30 pb-3 dark:bg-background/20 h-full min-h-[700px] w-[300px] px-4 relative overflow-visible flex-shrink-0 ">
                    <div
                      {...provided.dragHandleProps}
                      className="h-14
                      backdrop-blur-lg
                       dark:bg-background/40 bg-slate-200/60 z-10 absolute top-0 left-0 right-0"
                    >
                      <div className="h-full flex items-center p-4 justify-between cursor-grab border-b-[1px] ">
                        {/* {laneDetails.order} */}
                        <div className="flex items-center w-full gap-2">
                          <div
                            className={cn("w-4 h-4 rounded-full")}
                            style={{ background: randomColor }}
                          />
                          <span className="font-bold text-sm select-none">
                            {laneDetails.name}
                          </span>
                        </div>
                        <div className="flex items-center flex-row">
                          <Badge className="bg-white text-black  select-none">
                            {amt.format(laneAmt)}
                          </Badge>
                          <DropdownMenuTrigger>
                            <MoreVerticalIcon className="text-muted-foreground cursor-pointer" />
                          </DropdownMenuTrigger>
                        </div>
                      </div>
                    </div>
                    {/* render tickets */}
                    <Droppable
                      droppableId={laneDetails.id.toString()}
                      key={laneDetails.id}
                      type="tickets"
                    >
                      {(provided) => (
                        <div className="overflow-visible pt-12">
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="w-full flex flex-col gap-2 mt-2"
                          >
                            {laneDetails.Tickets.map((e, i) => (
                              <PipelineTicket
                                key={e.id}
                                data={e}
                                index={i}
                                subaccountId={subaccountId}
                              />
                            ))}
                            {provided.placeholder}
                          </div>
                        </div>
                      )}
                    </Droppable>
                  </div>

                  <DropdownMenuContent>
                    <DropdownMenuLabel>Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DialogTrigger asChild>
                      <DropdownMenuItem className="flex items-center gap-2 w-full h-full">
                        <EditIcon size={15} />
                        Edit
                      </DropdownMenuItem>
                    </DialogTrigger>

                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem>
                        <div className="flex items-center gap-2">
                          <TrashIcon size={15} />
                          Delete
                        </div>
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <DropdownMenuSeparator />
                    <CreateTicket
                      lane={laneDetails}
                      subaccountId={subaccountId}
                    />
                  </DropdownMenuContent>
                  <DeleteLane
                    subaccountId={subaccountId}
                    laneId={laneDetails.id}
                  />
                  <UpdateLane lane={laneDetails} subaccountId={subaccountId} />
                </DropdownMenu>
              </AlertDialog>
            </Dialog>
          </div>
        );
      }}
    </Draggable>
  );
}
