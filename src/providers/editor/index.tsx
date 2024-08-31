"use client";

import { createContext, Dispatch, useContext, useReducer } from "react";
import { EditorAction, EditorProps, EditorState } from "./editor-types";
import { FunnelPage } from "@prisma/client";
import { EditorReducer, initialState } from "./reducer";

export const EditorContext = createContext<{
  state: EditorState;
  dispatch: Dispatch<EditorAction>;
  subaccountId: string;
  funnelId: string;
  pageDetails: FunnelPage | null;
}>({
  state: initialState,
  dispatch: () => {},
  subaccountId: "",
  funnelId: "",
  pageDetails: null,
});

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error(
      "Editor context hook must be used within the editor provider"
    );
  }
  return context;
};

const EditorProvider: React.FC<EditorProps> = ({
  children,
  funnelId,
  pageDetails,
  subaccountId,
}) => {
  const [state, dispatch] = useReducer(EditorReducer, initialState);

  return (
    <EditorContext.Provider
      value={{
        funnelId,
        subaccountId,
        pageDetails,
        dispatch,
        state,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

export default EditorProvider;
