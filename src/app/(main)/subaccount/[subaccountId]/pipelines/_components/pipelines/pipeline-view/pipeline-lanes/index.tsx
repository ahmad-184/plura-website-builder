"use client";

import { updateLaneOrder } from "@/actions/lane";
import { Pipeline } from "@prisma/client";
import { updateTicketOrder } from "@/actions/ticket";
import { useCallback } from "react";
import { LaneFullDataType } from "@/types";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { FlagIcon } from "lucide-react";
import PipelineLane from "./pipeline-lane";
import { usePipelineStore } from "@/providers/pipeline-store-provider";
import { useRouter } from "next/navigation";

const PipelineLanes = ({
  pipelineId,
  subaccountId,
}: {
  pipelineId: string;
  subaccountId: string;
  pipelineDetails: Pipeline;
}) => {
  const router = useRouter();

  const {
    setAllLanes: setAllLanes,
    lanes: allLanes,
    channel,
  } = usePipelineStore((store) => store);

  const onDragEnd = useCallback(
    (dropResult: DropResult) => {
      // console.log(dropResult);
      const { type, source, destination, draggableId } = dropResult;
      if (
        !destination ||
        (destination.droppableId === source.droppableId &&
          destination.index === source.index)
      )
        return;

      switch (type) {
        case "lane": {
          (async () => {
            let newLanes = (
              JSON.parse(JSON.stringify([...allLanes])) as LaneFullDataType[]
            )
              .toSpliced(source.index, 1)
              .toSpliced(destination.index, 0, allLanes[source.index])
              .map((lane, idx) => {
                return { ...lane, order: idx };
              });

            setAllLanes(newLanes);
            await updateLaneOrder(newLanes);
            if (channel) {
              channel.send({
                type: "broadcast",
                event: "lanes:updated",
                payload: { message: "update lanes details" },
              });
            }
          })();
          break;
        }

        case "tickets": {
          (async () => {
            let newLanes = JSON.parse(
              JSON.stringify([...allLanes])
            ) as LaneFullDataType[];
            let originLane = newLanes.find((e) => e.id === source.droppableId);
            let destinationLane = newLanes.find(
              (e) => e.id === destination.droppableId
            );

            if (!originLane || !destinationLane) return;
            if (source.droppableId === destination.droppableId) {
              console.log(originLane.Tickets);
              const newOrderedTickets = [...originLane.Tickets]
                .toSpliced(source.index, 1)
                .toSpliced(
                  destination.index,
                  0,
                  originLane.Tickets[source.index]
                )
                .map((item, idx) => {
                  return { ...item, order: idx };
                });
              originLane.Tickets = newOrderedTickets;
              setAllLanes(newLanes);
              await updateTicketOrder(newOrderedTickets);
            } else {
              const [currentTicket] = originLane.Tickets.splice(
                source.index,
                1
              );

              originLane.Tickets.forEach((ticket, idx) => {
                ticket.order = idx;
              });

              destinationLane.Tickets.splice(destination.index, 0, {
                ...currentTicket,
                laneId: destination.droppableId,
              });

              destinationLane.Tickets.forEach((ticket, idx) => {
                ticket.order = idx;
              });

              setAllLanes(newLanes);

              await updateTicketOrder([
                ...destinationLane.Tickets,
                ...originLane.Tickets,
              ]);
            }
            if (channel) {
              channel.send({
                type: "broadcast",
                event: "lanes:updated",
                payload: { message: "update lanes details" },
              });
            }
          })();
          break;
        }
        default:
          break;
      }
    },
    [allLanes, channel, setAllLanes]
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable
        droppableId="lanes_1"
        type="lane"
        direction="horizontal"
        key="lanes"
      >
        {(provided) => (
          <div
            className="w-full flex items-center gap-x-2 overflow-auto"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            <div className="flex mt-4">
              {!!allLanes?.length &&
                allLanes?.map((e, i) => (
                  <PipelineLane
                    key={e.id}
                    pipelineId={pipelineId}
                    subaccountId={subaccountId}
                    laneDetails={e}
                    index={i}
                  />
                ))}
            </div>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      {!allLanes?.length && (
        <div className="flex items-center justify-center w-full flex-col">
          <div className="opacity-100">
            <FlagIcon
              width="100%"
              height="100%"
              className="text-muted-foreground"
            />
          </div>
        </div>
      )}
    </DragDropContext>
  );
};

export default PipelineLanes;
