import type { ActionsTypes, EditorElement } from "./editor-type";

export const addOneElement = (
  elements: EditorElement[],
  payload: ActionsTypes["addElement"]
): EditorElement[] | [] => {
  const updatedElements = elements?.map((el) => {
    if (el.id === payload.containerId && Array.isArray(el.content)) {
      return {
        ...el,
        content: [...el.content, payload.elementDetails],
      };
    } else if (el.content && Array.isArray(el.content)) {
      return {
        ...el,
        content: addOneElement(el.content, payload),
      };
    } else return el;
  });

  return updatedElements;
};

export const updateOneElement = (
  elements: EditorElement[],
  payload: ActionsTypes["updateElement"]
): EditorElement[] | [] => {
  const updatedElements = elements?.map((el) => {
    if (el.id === payload.elementDetails.id) {
      return { ...el, ...payload.elementDetails };
    } else if (el.content && Array.isArray(el.content)) {
      return {
        ...el,
        content: updateOneElement(el.content, payload),
      };
    } else return el;
  });

  return updatedElements;
};

export const deleteOneElement = (
  elements: EditorElement[],
  payload: ActionsTypes["deleteElement"]
): EditorElement[] | [] => {
  const updatedElements = elements?.filter((el) => {
    if (el.id === payload.elementDetails.id) {
      return false;
    } else if (el.content && Array.isArray(el.content)) {
      console.log("checked");
      el.content = deleteOneElement(el.content, payload);
      return true;
    } else return true;
  });

  return updatedElements;
};
