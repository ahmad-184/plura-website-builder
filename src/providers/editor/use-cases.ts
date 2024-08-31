import type { EditorAction, EditorElement } from "./editor-types";

export const addOneElement = (
  elements: EditorElement[],
  action: EditorAction
): EditorElement[] | [] => {
  if (action.type === "ADD_ELEMENT") {
    const updatedElements = elements.map((el) => {
      if (el.id === action.payload.containerId && Array.isArray(el.content)) {
        return {
          ...el,
          content: [...el.content, action.payload.elementDetails],
        };
      } else if (el.content && Array.isArray(el.content)) {
        return {
          ...el,
          content: addOneElement(el.content, action),
        };
      } else return el;
    });

    return updatedElements;
  } else return [];
};

export const updateOneElement = (
  elements: EditorElement[],
  action: EditorAction
): EditorElement[] | [] => {
  if (action.type === "UPDATE_ELEMENT") {
    const updatedElements = elements.map((el) => {
      if (el.id === action.payload.elementDetails.id) {
        return { ...el, ...action.payload.elementDetails };
      } else if (el.content && Array.isArray(el.content)) {
        return {
          ...el,
          content: updateOneElement(el.content, action),
        };
      } else return el;
    });

    return updatedElements;
  } else return [];
};

export const deleteOneElement = (
  elements: EditorElement[],
  action: EditorAction
): EditorElement[] | [] => {
  if (action.type === "DELETE_ELEMENT") {
    const updatedElements = elements.filter((el) => {
      if (el.id === action.payload.elementDetails.id) {
        return false;
      } else if (el.content && Array.isArray(el.content)) {
        el.content = deleteOneElement(el.content, action);
      } else return true;
    });

    return updatedElements;
  } else return [];
};
