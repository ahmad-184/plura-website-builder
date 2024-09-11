"use client";

import { EditorElement } from "@/stores/editor-store/editor-type";
import TextElement from "./text-element";
import ContainerElement from "./container-element";
import VideoElement from "./video-element";
import LinkElement from "./link-element";

export default function Recursive({ element }: { element: EditorElement }) {
  switch (element.type) {
    case "__body":
      return <ContainerElement element={element} />;
    case "container":
      return <ContainerElement element={element} />;
    case "2Col":
      return <ContainerElement element={element} />;
    case "3Col":
      return <ContainerElement element={element} />;
    case "text":
      return <TextElement element={element} />;
    case "video":
      return <VideoElement element={element} />;
    case "link":
      return <LinkElement element={element} />;
    default:
      null;
  }
}
