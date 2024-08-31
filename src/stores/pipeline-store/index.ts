import { LaneFullDataType, TicketWithAllRelatedDataType } from "@/types";
import { Pipeline, Ticket, User } from "@prisma/client";
import { createStore } from "zustand/vanilla";
import { produce } from "immer";
import { RealtimeChannel } from "@supabase/supabase-js";

export type PipelineState = {
  online_users: User[];
  channel: RealtimeChannel | null;
  current_pipeline: Pipeline | Partial<Pipeline> | null;
  pipelines: Pipeline[] | [];
  lanes: LaneFullDataType[] | [];
  all_tickets: TicketWithAllRelatedDataType[] | [];
};

export type PipelineActions = {
  setChannel: (channel: RealtimeChannel) => void;
  setOnlineUsers: (users: User[]) => void;
  removeChannel: () => void;
  setCurrentPipeline: (pipelines: Pipeline) => void;
  setAllPipelines: (pipelines: Pipeline[]) => void;
  setAllLanes: (lanes: LaneFullDataType[]) => void;
  setAllTickets: (tickets: TicketWithAllRelatedDataType[]) => void;
  updateOnePipline: (pipeline: Partial<Pipeline>) => void;
  setNewLane: (lane: LaneFullDataType) => void;
  updateOneLane: (lane: Partial<LaneFullDataType>) => void;
  removeOneLane: (laneId: string) => void;
  setNewTicket: (ticket: TicketWithAllRelatedDataType) => void;
  updateOneTicket: (ticket: TicketWithAllRelatedDataType) => void;
  removeOneTicket: (ticket: Ticket) => void;
};

export type PipelineStore = PipelineState & PipelineActions;

export const defaultInitState: PipelineState = {
  channel: null,
  online_users: [],
  current_pipeline: null,
  pipelines: [],
  lanes: [],
  all_tickets: [],
};

export const createPipelineStore = (
  initState: PipelineState = defaultInitState
) => {
  return createStore<PipelineStore>()((set) => ({
    ...initState,
    setChannel: (channel) => set(() => ({ channel })),
    setOnlineUsers: (users) => set(() => ({ online_users: users })),
    removeChannel: () => set(() => ({ channel: null })),
    setCurrentPipeline: (data) => set(() => ({ current_pipeline: data })),
    setAllPipelines: (data) => set(() => ({ pipelines: data })),
    setAllLanes: (data) => set(() => ({ lanes: data })),
    setAllTickets: (data) => set(() => ({ all_tickets: data })),
    updateOnePipline: (data) =>
      set(
        produce((state: PipelineState) => {
          const index = state.pipelines.findIndex((e) => e.id === data.id);
          state.pipelines[index] = {
            ...state.pipelines[index],
            ...data,
          };
          if (state.current_pipeline?.id === data.id) {
            state.current_pipeline = {
              ...state.current_pipeline,
              ...data,
            };
          }
        })
      ),
    setNewLane: (data) =>
      set(
        produce((state: PipelineState) => {
          state.lanes = [...state.lanes, data];
        })
      ),
    updateOneLane: (lane) =>
      set(
        produce((state: PipelineState) => {
          const laneIndex = state.lanes.findIndex((e) => e.id === lane.id);
          state.lanes[laneIndex] = {
            ...state.lanes[laneIndex],
            ...lane,
          };
        })
      ),
    removeOneLane: (laneId) =>
      set((state) => ({ lanes: state.lanes.filter((e) => e.id !== laneId) })),
    setNewTicket: (data) =>
      set(
        produce((state: PipelineState) => {
          state.all_tickets = [...state.all_tickets, data];
          const laneIndex = state.lanes.findIndex((e) => e.id === data.laneId);
          state.lanes[laneIndex].Tickets = [
            ...state.lanes[laneIndex].Tickets,
            data,
          ];
        })
      ),
    updateOneTicket: (data) =>
      set(
        produce((state: PipelineState) => {
          const ticketIndex = state.all_tickets.findIndex(
            (e) => e.id === data.id
          );
          state.all_tickets[ticketIndex] = { ...data };

          const laneIndex = state.lanes.findIndex((e) => e.id === data.laneId);
          const ticketIndexInLane = state.lanes[laneIndex].Tickets.findIndex(
            (e) => e.id === data.id
          );
          state.lanes[laneIndex].Tickets[ticketIndexInLane] = data;
        })
      ),
    removeOneTicket: (data) =>
      set(
        produce((state: PipelineState) => {
          state.all_tickets = state.all_tickets.filter((e) => e.id !== data.id);
          const laneIndex = state.lanes.findIndex((e) => e.id === data.laneId);
          state.lanes[laneIndex].Tickets = state.lanes[
            laneIndex
          ].Tickets.filter((e) => e.id !== data.id);
        })
      ),
  }));
};
