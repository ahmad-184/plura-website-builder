import { deleteTicketAction } from "@/actions";
import ButtonWithLoaderAndProgress from "@/components/ButtonWithLoaderAndProgress";
import CustomAvatar from "@/components/custom/custom-avatar";
import TicketDetails from "@/components/ticket-details";
import TagComponent from "@/components/ticket-details/tag";
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
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { fDateTime } from "@/lib/formatTime";
import { cn } from "@/lib/utils";
import { usePipelineStore } from "@/providers/pipeline-store-provider";
import { TicketWithAllRelatedDataType } from "@/types";
import { useMutation } from "@tanstack/react-query";
import {
  Contact2Icon,
  EditIcon,
  LinkIcon,
  MoreHorizontalIcon,
  TrashIcon,
} from "lucide-react";
import { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { toast } from "sonner";

export default function PipelineTicket({
  data,
  subaccountId,
  index,
}: {
  data: TicketWithAllRelatedDataType;
  subaccountId: string;
  index: number;
}) {
  const { removeOneTicket, updateOneTicket, channel } = usePipelineStore(
    (store) => store
  );
  const [open, setOpen] = useState(false);

  const { mutate: deleteTicket, isPending: deleteTicketPending } = useMutation({
    mutationFn: deleteTicketAction,
    onSuccess: (e) => {
      if (e.error)
        return toast.error("Error", { description: e.error, icon: "🛑" });
      if (e.data) {
        toast.success("Success", {
          description: "Ticket deleted",
        });
        setOpen(false);
        removeOneTicket(e.data);
        if (channel) {
          channel.send({
            type: "broadcast",
            event: "lanes:updated",
            payload: { message: "update lanes details" },
          });
        }
      }
    },
  });

  const handleDeleteTicket = () => {
    if (!subaccountId) return;
    deleteTicket({
      id: data.id,
      subaccountId,
    });
  };

  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided, snapshot) => {
        if (snapshot.isDragging) {
          const offset = { x: 300, y: 0 };
          //@ts-ignore
          const x = provided.draggableProps.style?.left - offset.x;
          //@ts-ignore
          const y = provided.draggableProps.style?.top - offset.y;
          //@ts-ignore
          provided.draggableProps.style = {
            ...provided.draggableProps.style,
            top: y,
            left: x,
          };
        }

        return (
          <div
            {...provided.dragHandleProps}
            {...provided.draggableProps}
            ref={provided.innerRef}
            // style={{
            //   order: data.order,
            // }}
          >
            <Dialog>
              <AlertDialog>
                <DropdownMenu>
                  <Card
                    className={cn(
                      "my-1 dark:bg-slate-900 bg-white shadow-none transition-all",
                      {
                        "mt-4": index === 0,
                      }
                    )}
                  >
                    <CardHeader className="p-[12px]">
                      <CardTitle className="flex items-center justify-between">
                        <span className="text-lg flex-1">{data.name}</span>
                        <DropdownMenuTrigger>
                          <MoreHorizontalIcon
                            size={20}
                            className="text-muted-foreground"
                          />
                        </DropdownMenuTrigger>
                      </CardTitle>
                      <span className="text-muted-foreground text-xs">
                        {fDateTime(data.createdAt)}
                      </span>
                      <div className="flex items-center flex-wrap gap-2">
                        {data.Tags.map((e) => (
                          <TagComponent key={e.id} tag={e} />
                        ))}
                      </div>
                      <CardDescription className="w-full">
                        {data.description}
                      </CardDescription>
                      {data.Customer?.id ? (
                        <HoverCard>
                          <HoverCardTrigger asChild>
                            <div className="p-2 text-muted-foreground flex gap-2 hover:bg-muted transition-all rounded-lg cursor-pointer items-center">
                              <LinkIcon />
                              <span className="text-xs font-bold">CONTACT</span>
                            </div>
                          </HoverCardTrigger>
                          <HoverCardContent className="w-72">
                            <div className="flex space-x-4">
                              <CustomAvatar
                                user={{ name: data.Customer.name }}
                              />
                              <div className="space-y-0">
                                <h4 className="text-sm font-semibold">
                                  {data.Customer.name}
                                </h4>
                                <p className="text-sm">{data.Customer.email}</p>
                                <div className="flex items-center pt-2">
                                  <Contact2Icon className="mr-2 h-4 w-4 opacity-70" />
                                  <span className="text-xs text-muted-foreground">
                                    Joined {fDateTime(data.Customer.createdAt)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                      ) : null}
                    </CardHeader>
                    <CardFooter
                      className="m-0 p-2 border-t-[1px] border-muted-foreground/20
                   flex items-center justify-between"
                    >
                      <div className="flex item-center gap-2">
                        <CustomAvatar
                          user={data.Assigned || {}}
                          className="w-9 h-9"
                        />
                        <div className="flex flex-col justify-center">
                          <span className="text-xs text-muted-foreground">
                            {data.assignedUserId
                              ? "Assigned to"
                              : "Not Assigned"}
                          </span>
                          {data.assignedUserId && (
                            <span className="text-sm w-28 overflow-ellipsis overflow-hidden whitespace-nowrap dark:text-gray-200">
                              {data.Assigned?.name}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-sm font-bold">
                        {!!data.value &&
                          new Intl.NumberFormat(undefined, {
                            style: "currency",
                            currency: "USD",
                          }).format(+data.value)}
                      </span>
                    </CardFooter>
                  </Card>

                  <DropdownMenuContent>
                    <DropdownMenuLabel>Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DialogTrigger asChild>
                      <DropdownMenuItem
                        className="flex items-center gap-2"
                        //   onClick={handleClickEdit}
                      >
                        <EditIcon size={15} />
                        Edit
                      </DropdownMenuItem>
                    </DialogTrigger>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem className="flex items-center gap-2">
                        <TrashIcon size={15} />
                        Delete
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                  </DropdownMenuContent>
                </DropdownMenu>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the ticket and remove it from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex items-center">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <ButtonWithLoaderAndProgress
                      variant={"destructive"}
                      loading={deleteTicketPending}
                      disabled={deleteTicketPending}
                      onClick={handleDeleteTicket}
                    >
                      Delete
                    </ButtonWithLoaderAndProgress>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <DialogContent className="overflow-auto max-h-[95vh] z-[400]">
                <DialogHeader>
                  <DialogTitle>Update Ticket Details</DialogTitle>
                </DialogHeader>
                <TicketDetails
                  laneId={data.laneId}
                  subaccountId={subaccountId}
                  updateOneTicket={updateOneTicket}
                  ticket={data}
                  channel={channel}
                />
              </DialogContent>
            </Dialog>
          </div>
        );
      }}
    </Draggable>
  );
}
