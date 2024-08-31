"use client";

import { getCurrentUser } from "@/actions/auth";
import { getPipelineLanesWithAllData } from "@/actions/lane";
import { findSubaccountPipeline } from "@/actions/pipeline";
import { supabase } from "@/lib/supabase";
import { usePipelineStore } from "@/providers/pipeline-store-provider";
import { LaneFullDataType, TicketWithAllRelatedDataType } from "@/types";
import { Pipeline, User } from "@prisma/client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export default function PipelineRealtime({
  children,
  pipelineId,
  lanes,
  pipelines,
  subaccountId,
}: {
  children: React.ReactNode;
  pipelineId: string;
  lanes: LaneFullDataType[];
  pipelines: Pipeline[];
  subaccountId: string;
}) {
  const {
    setAllLanes,
    setAllTickets,
    setChannel,
    channel,
    removeChannel,
    setOnlineUsers,
    setAllPipelines,
    setCurrentPipeline,
  } = usePipelineStore((store) => store);

  const { data: dataLanes, refetch: refetchLanes } = useQuery({
    queryFn: () => getPipelineLanesWithAllData(pipelineId),
    queryKey: ["all-lanes"],
    initialData: lanes,
  });

  const { data: dataPipelines, refetch: refetchPipelines } = useQuery({
    queryFn: () => findSubaccountPipeline(subaccountId),
    queryKey: ["all-pipelines"],
    retry: 3,
    initialData: pipelines,
  });

  useEffect(() => {
    setAllLanes(lanes || []);
    let allTs: TicketWithAllRelatedDataType[] = [];
    for (let t of lanes || []) {
      allTs = [...allTs, ...t.Tickets];
    }
    setAllTickets(allTs);
  }, [lanes]);

  useEffect(() => {
    setAllPipelines(pipelines || []);
    const current_pip = pipelines?.find((e) => e.id === pipelineId);
    if (current_pip) setCurrentPipeline(current_pip);
  }, [pipelines, pipelineId]);

  useEffect(() => {
    setAllPipelines(dataPipelines || []);
    const current_pip = dataPipelines?.find((e) => e.id === pipelineId);
    if (current_pip) setCurrentPipeline(current_pip);
  }, [dataPipelines, pipelineId]);

  useEffect(() => {
    if (!pipelineId) return;
    let new_channel: RealtimeChannel | null = null;
    if (new_channel) {
      supabase.removeChannel(new_channel);
      if (channel) supabase.removeChannel(channel);
      removeChannel();
      new_channel = supabase.channel(String(pipelineId));
    } else {
      new_channel = supabase.channel(String(pipelineId));
    }

    if (new_channel) {
      new_channel.subscribe(async (status) => {
        if (status !== "SUBSCRIBED") {
          return;
        }

        setChannel(new_channel);
        const currentUser = await getCurrentUser();

        if (currentUser) {
          new_channel.track({
            id: currentUser.id,
            email: currentUser.email,
            name: currentUser.name,
            avatarUrl: currentUser.avatarUrl,
          });
        }

        new_channel.on("presence", { event: "sync" }, async () => {
          const currentUser = await getCurrentUser();
          if (currentUser) {
            const newState = new_channel.presenceState();
            const newOnlineUsers = Object.values(newState).flat() as any;
            const otherColls = newOnlineUsers.filter(
              (e: User) => e.id !== currentUser.id
            );
            setOnlineUsers(otherColls);
          }
        });

        new_channel.on(
          "broadcast",
          { event: "lanes:updated" },
          async (payload) => {
            const res = await refetchLanes();
            setAllLanes(res.data || []);
            let allTs: TicketWithAllRelatedDataType[] = [];
            for (let t of res.data || []) {
              allTs = [...allTs, ...t.Tickets];
            }
            setAllTickets(allTs);
          }
        );

        new_channel.on(
          "broadcast",
          { event: "pipeline:updated" },
          (payload) => {
            refetchPipelines();
          }
        );

        new_channel.on(
          "broadcast",
          { event: "pipeline:deleted" },
          (payload) => {
            refetchPipelines();
          }
        );
      });
    }

    return () => {
      if (new_channel) {
        supabase.removeChannel(new_channel);
        if (channel) {
          supabase.removeChannel(channel);
          removeChannel();
        }
      }
    };
  }, [pipelineId]);

  return <>{children}</>;
}
