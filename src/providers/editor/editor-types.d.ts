import { FunnelPage } from "@prisma/client";
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
  content: EditorElement[] | {};
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
  history: HistoryState;
  channel: RealtimeChannel | null;
};

export type EditorAction =
  | {
      type: "ADD_ELEMENT";
      payload: {
        containerId: string;
        elementDetails: EditorElement;
      };
    }
  | {
      type: "UPDATE_ELEMENT";
      payload: {
        elementDetails: EditorElement;
      };
    }
  | {
      type: "DELETE_ELEMENT";
      payload: {
        elementDetails: EditorElement;
      };
    }
  | {
      type: "CHANGE_CLICKED_ELEMENT";
      payload: {
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
    }
  | {
      type: "CHANGE_DEVICE";
      payload: {
        device: DevicesType;
      };
    }
  | {
      type: "TOGGLE_PREVIEW_MODE";
    }
  | {
      type: "TOGGLE_LIVE_MODE";
      payload?: {
        value: boolean;
      };
    }
  | { type: "REDO" }
  | { type: "UNDO" }
  | {
      type: "LOAD_DATA";
      payload: {
        elements: EditorElement[];
        withLive: boolean;
      };
    }
  | {
      type: "SET_FUNNELPAGE_ID";
      payload: {
        funnelPageId: string;
      };
    }
  | {
      type: "LOAD_HISTORY";
      payload: {
        funnelPageId: string;
      };
    }
  | {
      type: "SET_CHANNEL";
      payload: {
        channel: WritableDraft<RealtimeChannel> | null;
      };
    };

export type EditorContextData = {
  device: DevicesType;
  previewMode: boolean;
  setPreviewMode: (mode: boolean) => void;
  setDevice: (device: DevicesType) => void;
};

export type EditorProps = {
  children: React.ReactNode;
  funnelId: string;
  subaccountId: string;
  pageDetails: FunnelPage;
};
