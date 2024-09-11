import { createStore } from "zustand/vanilla";
import { produce } from "immer";
import { EditorActions, EditorState, HistoryState } from "./editor-type";
import { addOneElement, deleteOneElement, updateOneElement } from "./use-cases";

export type EditorStore = EditorState & EditorActions;

const initilEditorState: EditorState["editor"] = {
  device: "Desktop",
  liveMode: false,
  previewMode: false,
  funnelPageId: "",
  elements: [
    {
      type: "__body",
      content: [],
      id: "__body",
      name: "Body",
      styles: {},
      classnames: "",
    },
  ],
  selectedElement: {
    type: null,
    content: [],
    id: "",
    name: "",
    styles: {},
    classnames: "",
  },
};

const initialHistoryState: HistoryState = {
  currentIndex: 0,
  history: [initilEditorState],
};

export const initialState: EditorState = {
  editor: initilEditorState,
  subaccountId: "",
  funnelId: "",
  pageDetails: null,
  history: initialHistoryState,
  channel: null,
  onlineUsers: [],
};

export const createEditorStore = (initState: EditorState = initialState) => {
  return createStore<EditorStore>()((set) => ({
    ...initialState,
    addElement: (payload) =>
      set(
        produce((state: EditorState) => {
          state.editor.elements = addOneElement(state.editor.elements, payload);
          state.history.history = [
            ...state.history.history.slice(0, state.history.currentIndex + 1),
            { ...state.editor },
          ];
          state.history.currentIndex = state.history.history.length - 1;
        })
      ),
    updateElement: (payload) =>
      set(
        produce((state: EditorState) => {
          const isSelectedElement = Boolean(
            state.editor.selectedElement.id === payload.elementDetails.id
          );
          state.editor.selectedElement = isSelectedElement
            ? payload.elementDetails
            : {
                classnames: "",
                content: [],
                id: "",
                name: "",
                styles: {},
                type: null,
              };
          state.editor.elements = updateOneElement(
            state.editor.elements,
            payload
          );
          state.history.history = [
            ...state.history.history.slice(0, state.history.currentIndex + 1),
            { ...state.editor },
          ];
          state.history.currentIndex = state.history.history.length - 1;
        })
      ),
    deleteElement: (payload) =>
      set(
        produce((state: EditorState) => {
          const isSelectedElement = Boolean(
            state.editor.selectedElement.id === payload.elementDetails.id
          );
          state.editor.selectedElement = isSelectedElement
            ? {
                classnames: "",
                content: [],
                id: "",
                name: "",
                styles: {},
                type: null,
              }
            : state.editor.selectedElement;
          const filteredElements = deleteOneElement(
            state.editor.elements,
            payload
          );
          state.editor.elements = filteredElements;
          state.history.history = [
            ...state.history.history.slice(0, state.history.currentIndex + 1),
            { ...state.editor },
          ];
          state.history.currentIndex = state.history.history.length - 1;
        })
      ),
    loadData: (payload) =>
      set(
        produce((state: EditorState) => {
          state.editor.elements =
            payload.elements || initilEditorState.elements;
          state.subaccountId = payload?.subaccountId || state.subaccountId;
          state.pageDetails = payload?.pageDetails || state.pageDetails;
          state.funnelId = payload?.funnelId || state.funnelId;
          state.editor.liveMode = Boolean(payload.withLive);
        })
      ),
    toggleLiveMode: (payload) =>
      set(
        produce((state: EditorState) => {
          state.editor.liveMode = payload?.value
            ? payload.value
            : state.editor.liveMode;
        })
      ),
    togglePreviewMode: () =>
      set(
        produce((state: EditorState) => {
          state.editor.previewMode = !state.editor.previewMode;
        })
      ),
    changeClickedElement: (payload) =>
      set(
        produce((state: EditorState) => {
          state.editor.selectedElement = payload.elementDetails
            ? payload.elementDetails
            : {
                classnames: "",
                content: [],
                id: "",
                name: "",
                styles: {},
                type: null,
              };
        })
      ),
    changeDevice: (payload) =>
      set(
        produce((state: EditorState) => {
          state.editor.device = payload.device;
        })
      ),
    redo: () =>
      set(
        produce((state: EditorState) => {
          const isThereNextHistory = Boolean(
            state.history.currentIndex < state.history.history.length - 1
          );
          if (isThereNextHistory) {
            const nextIndex = state.history.currentIndex + 1;
            const getEditor = state.history.history[nextIndex];
            state.editor = getEditor;
            state.history.currentIndex = nextIndex;
          }
        })
      ),
    undo: () =>
      set(
        produce((state: EditorState) => {
          const isTherePrevHistory = Boolean(state.history.currentIndex > 0);
          if (isTherePrevHistory) {
            const prevIndex = state.history.currentIndex - 1;
            const getEditor = state.history.history[prevIndex];
            state.editor = getEditor;
            state.history.currentIndex = prevIndex;
          }
        })
      ),
    setChannel: (payload) =>
      set(
        produce((state: EditorState) => {
          state.channel = payload.channel;
        })
      ),
    setFunnelPageId: (payload) =>
      set(
        produce((state: EditorState) => {
          state.editor.funnelPageId = payload.funnelPageId;
          state.history.history = [
            ...state.history.history.slice(0, state.history.currentIndex + 1),
            { ...state.editor },
          ];
          state.history.currentIndex = state.history.history.length - 1;
        })
      ),
    setOnlineUsers: (payload) =>
      set(
        produce((state: EditorState) => {
          state.onlineUsers = payload.users;
        })
      ),
  }));
};
