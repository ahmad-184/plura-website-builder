import { FunnelPage, User } from "@prisma/client";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { WritableDraft } from "immer";

export type DevicesType = "Desktop" | "Mobile" | "Tablet";

export type EditorBtns =
  | "text"
  | "container"
  | "section"
  | "contactForm"
  | "paymentForm"
  | "link"
  | "2Col"
  | "video"
  | "__body"
  | "image"
  | "3Col"
  | null;

export type EditorElement = {
  id: string;
  styles: React.CSSProperties;
  classnames: string;
  name: string;
  type: EditorBtns;
  content:
    | EditorElement[]
    | {
        href?: string;
        innerText?: string;
        src?: string;
      };
};

export type Editor = {
  elements: EditorElement[];
  selectedElement: EditorElement;
  device: DevicesType;
  liveMode: boolean;
  previewMode: boolean;
  funnelPageId: string;
};

export type HistoryState = {
  history: Editor[];
  currentIndex: number;
};

export type EditorState = {
  editor: Editor;
  subaccountId: string;
  funnelId: string;
  pageDetails: FunnelPage | null;
  history: HistoryState;
  channel: RealtimeChannel | null;
  onlineUsers: User[];
};

export type ActionsTypes = {
  addElement: {
    containerId: string;
    elementDetails: EditorElement;
  };
  updateElement: { elementDetails: EditorElement };
  deleteElement: { elementDetails: Partial<EditorElement> };
  changeClickedElement: {
    elementDetails?:
      | EditorElement
      | {
          id: "";
          content: [];
          name: "";
          styles: {};
          type: null;
          classnames: string;
        };
  };
  changeDevice: { device: DevicesType };
  togglePreviewMode: void;
  toggleLiveMode: { value: boolean };
  redo: void;
  undo: void;
  loadData: Partial<{
    elements: EditorElement[];
    withLive: boolean;
    subaccountId: string;
    funnelId: string;
    pageDetails: FunnelPage | null;
  }>;
  setFunnelPageId: { funnelPageId: string };
  loadHistory: { funnelPageId: string };
  setChannel: {
    channel: RealtimeChannel | null;
  };
  setOnlineUsers: {
    users: User[];
  };
};

export type EditorActions = {
  addElement: (payload: ActionsTypes["addElement"]) => void;
  updateElement: (payload: ActionsTypes["updateElement"]) => void;
  deleteElement: (payload: ActionsTypes["deleteElement"]) => void;
  changeClickedElement: (payload: ActionsTypes["changeClickedElement"]) => void;
  changeDevice: (payload: ActionsTypes["changeDevice"]) => void;
  togglePreviewMode: () => void;
  toggleLiveMode: (payload?: ActionsTypes["toggleLiveMode"]) => void;
  redo: () => void;
  undo: () => void;
  loadData: (payload: ActionsTypes["loadData"]) => void;
  setFunnelPageId: (payload: ActionsTypes["setFunnelPageId"]) => void;
  // loadHistory: (payload: ActionsTypes["loadHistory"]) => void;
  setChannel: (payload: ActionsTypes["setChannel"]) => void;
  setOnlineUsers: (payload: ActionsTypes["setOnlineUsers"]) => void;
};
