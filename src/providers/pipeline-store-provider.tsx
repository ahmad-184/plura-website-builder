"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import {
  type PipelineStore,
  createPipelineStore,
} from "@/stores/pipeline-store";

export type PipelineStoreApi = ReturnType<typeof createPipelineStore>;

export const PipelineStoreContext = createContext<PipelineStoreApi | undefined>(
  undefined
);

export interface PipelineStoreProviderProps {
  children: ReactNode;
}

export const PipelineStoreProvider = ({
  children,
}: PipelineStoreProviderProps) => {
  const storeRef = useRef<PipelineStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createPipelineStore();
  }

  return (
    <PipelineStoreContext.Provider value={storeRef.current}>
      {children}
    </PipelineStoreContext.Provider>
  );
};

export const usePipelineStore = <T,>(
  selector: (store: PipelineStore) => T
): T => {
  const pipelineStoreContext = useContext(PipelineStoreContext);

  if (!pipelineStoreContext) {
    throw new Error(
      `usePipelineStore must be used within PipelineStoreProvider`
    );
  }

  return useStore(pipelineStoreContext, selector);
};
