"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";
import { createEditorStore, EditorStore } from "@/stores/editor-store";

export type EditorStoreApi = ReturnType<typeof createEditorStore>;

export const EditorStoreContext = createContext<EditorStoreApi | undefined>(
  undefined
);

export interface EditorStoreProviderProps {
  children: ReactNode;
}

export const EditorStoreProvider = ({ children }: EditorStoreProviderProps) => {
  const storeRef = useRef<EditorStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createEditorStore();
  }

  return (
    <EditorStoreContext.Provider value={storeRef.current}>
      {children}
    </EditorStoreContext.Provider>
  );
};

export const useEditor = <T,>(selector: (store: EditorStore) => T): T => {
  const editorStoreContext = useContext(EditorStoreContext);

  if (!editorStoreContext) {
    throw new Error(`useEditor must be used within PipelineStoreProvider`);
  }

  return useStore(editorStoreContext, selector);
};
