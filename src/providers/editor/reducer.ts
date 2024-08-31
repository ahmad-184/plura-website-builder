import { produce } from "immer";
import { EditorAction, EditorState, HistoryState } from "./editor-types";
import { addOneElement, deleteOneElement, updateOneElement } from "./use-cases";

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
  history: initialHistoryState,
  channel: null,
};

export const EditorReducer = (
  state: EditorState = initialState,
  action: EditorAction
): EditorState =>
  produce(state, (draft) => {
    switch (action.type) {
      case "ADD_ELEMENT": {
        draft.editor.elements = addOneElement(draft.editor.elements, action);
        draft.history.history = [
          ...draft.history.history.slice(0, draft.history.currentIndex + 1),
          { ...draft.editor },
        ];
        draft.history.currentIndex = draft.history.history.length - 1;
        break;
      }
      case "UPDATE_ELEMENT": {
        const isSelectedElement = Boolean(
          draft.editor.selectedElement.id === action.payload.elementDetails.id
        );
        draft.editor.selectedElement = isSelectedElement
          ? action.payload.elementDetails
          : {
              classnames: "",
              content: [],
              id: "",
              name: "",
              styles: {},
              type: null,
            };
        draft.editor.elements = updateOneElement(draft.editor.elements, action);
        draft.history.history = [
          ...draft.history.history.slice(0, draft.history.currentIndex + 1),
          { ...draft.editor },
        ];
        draft.history.currentIndex = draft.history.history.length - 1;
        break;
      }
      case "DELETE_ELEMENT": {
        const isSelectedElement = Boolean(
          draft.editor.selectedElement.id === action.payload.elementDetails.id
        );
        draft.editor.selectedElement = isSelectedElement
          ? {
              classnames: "",
              content: [],
              id: "",
              name: "",
              styles: {},
              type: null,
            }
          : draft.editor.selectedElement;
        draft.editor.elements = deleteOneElement(draft.editor.elements, action);
        draft.history.history = [
          ...draft.history.history.slice(0, draft.history.currentIndex + 1),
          { ...draft.editor },
        ];
        draft.history.currentIndex = draft.history.history.length - 1;
        break;
      }
      case "CHANGE_CLICKED_ELEMENT": {
        draft.editor.selectedElement = action.payload.elementDetails
          ? action.payload.elementDetails
          : {
              classnames: "",
              content: [],
              id: "",
              name: "",
              styles: {},
              type: null,
            };
        break;
      }
      case "CHANGE_DEVICE": {
        draft.editor.device = action.payload.device;
        break;
      }
      case "TOGGLE_PREVIEW_MODE": {
        draft.editor.previewMode = !draft.editor.previewMode;
        break;
      }
      case "TOGGLE_LIVE_MODE": {
        draft.editor.liveMode = action.payload?.value
          ? action.payload.value
          : draft.editor.liveMode;
        break;
      }
      case "REDO": {
        const isThereNextHistory = Boolean(
          draft.history.currentIndex < draft.history.history.length - 1
        );
        if (isThereNextHistory) {
          const nextIndex = draft.history.currentIndex + 1;
          const getEditor = draft.history.history[nextIndex];
          draft.editor = getEditor;
          draft.history.currentIndex = nextIndex;
        }
        break;
      }
      case "UNDO": {
        const isTherePrevHistory = Boolean(draft.history.currentIndex > 0);
        if (isTherePrevHistory) {
          const prevIndex = draft.history.currentIndex - 1;
          const getEditor = draft.history.history[prevIndex];
          draft.editor = getEditor;
          draft.history.currentIndex = prevIndex;
        }
        break;
      }
      case "LOAD_DATA": {
        draft.editor.elements =
          action.payload.elements || initilEditorState.elements;
        draft.editor.liveMode = Boolean(action.payload.withLive);
        break;
      }
      case "SET_FUNNELPAGE_ID": {
        draft.editor.funnelPageId = action.payload.funnelPageId;
        draft.history.history = [
          ...draft.history.history.slice(0, draft.history.currentIndex + 1),
          { ...draft.editor },
        ];
        draft.history.currentIndex = draft.history.history.length - 1;
        break;
      }
      case "SET_CHANNEL": {
        draft.channel = action.payload.channel;
      }
      default:
        return draft;
    }
  });
