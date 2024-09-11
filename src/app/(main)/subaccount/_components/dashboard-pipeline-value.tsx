"use client";
import { Prisma } from "@prisma/client";
import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getPipelinesWithAllDataWithSubaccountId } from "@/actions/pipeline";
import { Progress } from "@/components/ui/progress";

type Props = {
  pipelines: Prisma.PromiseReturnType<
    typeof getPipelinesWithAllDataWithSubaccountId
  >;
};

const DashboardPipelineValue = ({ pipelines }: Props) => {
  const [selectedPipelineId, setselectedPipelineId] = useState("");
  const [pipelineClosedValue, setPipelineClosedValue] = useState(0);

  useEffect(() => {
    if (pipelines?.length) setselectedPipelineId(pipelines[0]?.id);
  }, [pipelines]);

  const totalPipelineValue = useMemo(() => {
    console.log(pipelines);
    if (pipelines?.length) {
      const pipeline = pipelines.find(
        (pipeline) => pipeline.id === selectedPipelineId
      );

      if (!pipeline?.Lane.length) {
        setPipelineClosedValue(0);
        return 0;
      }

      const total =
        pipeline.Lane?.reduce((totalLanes, lane, currentLaneIndex, array) => {
          const laneTicketsTotal = lane.Tickets.reduce(
            (totalTickets, ticket) => totalTickets + Number(ticket?.value),
            0
          );
          if (currentLaneIndex === array.length - 1) {
            setPipelineClosedValue(laneTicketsTotal || 0);
            return totalLanes;
          }

          return totalLanes + laneTicketsTotal;
        }, 0) || 0;

      return total;
    } else {
      setPipelineClosedValue(0);
      return 0;
    }
  }, [selectedPipelineId, pipelines]);

  const pipelineRate = useMemo(
    () =>
      (pipelineClosedValue / (totalPipelineValue + pipelineClosedValue)) * 100,
    [pipelineClosedValue, totalPipelineValue]
  );

  return (
    <Card className="relative w-full xl:w-[350px]">
      <CardHeader>
        <CardTitle>Pipeline Value</CardTitle>
        <CardDescription className="text-muted-foreground pb-2">
          Pipeline Progress
        </CardDescription>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">
              Closed ${pipelineClosedValue}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              Total ${totalPipelineValue + pipelineClosedValue}
            </p>
          </div>
        </div>
        <Progress color="green" value={pipelineRate} className="h-2" />
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        <p className="mb-2">
          Total value of all tickets in the given pipeline except the last lane.
          Your last lane is considered your closing lane in every pipeline.
        </p>
        <Select
          value={selectedPipelineId}
          onValueChange={setselectedPipelineId}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a pipeline" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Pipelines</SelectLabel>
              {pipelines?.map((pipeline) => (
                <SelectItem value={pipeline.id} key={pipeline.id}>
                  {pipeline.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};

export default DashboardPipelineValue;
