import { Badge } from "@/components/ui/badge";
import { defaultStyles } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useEditor } from "@/providers/editor-store-provider";
import { EditorBtns, EditorElement } from "@/stores/editor-store/editor-type";
import { Trash2Icon } from "lucide-react";
import React, { useRef } from "react";
import { uuid as uuid4 } from "short-uuid";
import Recursive from "./recursive";
import { useOnClickOutside } from "@/hooks/use-click-outside";

export default function ContainerElement({
  element,
}: {
  element: EditorElement;
}) {
  const selectedElement = useEditor((store) => store.editor.selectedElement);
  const previewMode = useEditor((store) => store.editor.previewMode);
  const addElement = useEditor((store) => store.addElement);
  const deleteElement = useEditor((store) => store.deleteElement);
  const changeClickedElement = useEditor((store) => store.changeClickedElement);

  const handleOnDrop = (e: React.DragEvent) => {
    e.stopPropagation();
    const componentType = e.dataTransfer.getData("componentType") as EditorBtns;
    let elementData;

    if (e.dataTransfer.getData("componentData"))
      elementData = JSON.parse(
        e.dataTransfer.getData("componentData")
      ) as EditorElement;

    switch (componentType) {
      case "text":
        addElement({
          containerId: element.id,
          elementDetails: elementData
            ? {
                ...elementData,
                id: uuid4(),
              }
            : {
                id: uuid4(),
                name: "Text",
                classnames: "",
                type: "text",
                styles: { color: "black", ...defaultStyles },
                content: { innerText: "Text Element" },
              },
        });
        break;
      case "container":
        addElement({
          containerId: element.id,
          elementDetails: elementData
            ? {
                ...elementData,
                id: uuid4(),
              }
            : {
                id: uuid4(),
                name: "Container",
                classnames: "",
                type: "container",
                styles: { ...defaultStyles },
                content: [],
              },
        });
        break;
      case "2Col":
        addElement({
          containerId: element.id,
          elementDetails: elementData
            ? {
                ...elementData,
                id: uuid4(),
                content: [
                  {
                    ...(element.content as EditorElement[])[0],
                    id: uuid4(),
                  },
                  {
                    ...(element.content as EditorElement[])[1],
                    id: uuid4(),
                  },
                ],
              }
            : {
                id: uuid4(),
                name: "2Column",
                classnames: "",
                type: "2Col",
                styles: { ...defaultStyles },
                content: [
                  {
                    id: uuid4(),
                    name: "Container",
                    classnames: "",
                    type: "container",
                    styles: { ...defaultStyles },
                    content: [],
                  },
                  {
                    id: uuid4(),
                    name: "Container",
                    classnames: "",
                    type: "container",
                    styles: { ...defaultStyles },
                    content: [],
                  },
                ],
              },
        });
        break;
      case "3Col":
        addElement({
          containerId: element.id,
          elementDetails: elementData
            ? {
                ...elementData,
                id: uuid4(),
                content: [
                  {
                    ...(element.content as EditorElement[])[0],
                    id: uuid4(),
                  },
                  {
                    ...(element.content as EditorElement[])[1],
                    id: uuid4(),
                  },
                  {
                    ...(element.content as EditorElement[])[3],
                    id: uuid4(),
                  },
                ],
              }
            : {
                id: uuid4(),
                name: "3Column",
                classnames: "",
                type: "3Col",
                styles: { ...defaultStyles },
                content: [
                  {
                    id: uuid4(),
                    name: "Container",
                    classnames: "",
                    type: "container",
                    styles: { ...defaultStyles },
                    content: [],
                  },
                  {
                    id: uuid4(),
                    name: "Container",
                    classnames: "",
                    type: "container",
                    styles: { ...defaultStyles },
                    content: [],
                  },
                  {
                    id: uuid4(),
                    name: "Container",
                    classnames: "",
                    type: "container",
                    styles: { ...defaultStyles },
                    content: [],
                  },
                ],
              },
        });
        break;
      case "video":
        addElement({
          containerId: element.id,
          elementDetails: elementData
            ? {
                ...elementData,
                id: uuid4(),
              }
            : {
                id: uuid4(),
                name: "Video",
                classnames: "",
                type: "video",
                styles: { ...defaultStyles },
                content: {
                  src: "",
                },
              },
        });
        break;
      case "link":
        addElement({
          containerId: element.id,
          elementDetails: elementData
            ? {
                ...elementData,
                id: uuid4(),
              }
            : {
                id: uuid4(),
                name: "Link",
                classnames: "",
                type: "link",
                styles: { ...defaultStyles },
                content: {
                  href: "#",
                  innerText: "Link Element",
                },
              },
        });
        break;

      default:
        break;
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragStart = (e: React.DragEvent) => {
    if (element.type === "__body") return;
    e.dataTransfer.setData("componentType", element.type || "");
    e.dataTransfer.setData("componentData", JSON.stringify(element));
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        changeClickedElement({
          elementDetails: element,
        });
      }}
      style={element.styles}
      draggable={element.type !== "__body"}
      onDrop={handleOnDrop}
      onDragOver={handleDragOver}
      onDragStart={handleDragStart}
      className={cn("relative p-4 transition-all group", {
        "max-w-full w-full":
          element.type === "container" ||
          element.type === "__body" ||
          element.type === "2Col" ||
          element.type === "3Col",
        "h-fit": element.type === "container",
        "h-full max-h-full overflow-x-hidden": element.type === "__body",
        "my-[5px]": element.type !== "__body",
        "flex flex-col md:flex-row gap-1":
          element.type === "2Col" || element.type === "3Col",
        "!border-blue-500": selectedElement.id === element.id && !previewMode,
        "!border-yellow-500 !border-2":
          element.type === "__body" &&
          selectedElement.id === element.id &&
          !previewMode,
        "!border-solid": selectedElement.id === element.id && !previewMode,
        "border-dashed border-[1px] dark:border-slate-300 border-slate-400":
          !previewMode,
      })}
    >
      {selectedElement.id === element.id && !previewMode && (
        <Badge
          className={cn(
            "absolute -top-[22px] -left-[1px] rounded-t-lg rounded-b-none",
            {
              "!top-0 rounded-b-lg rounded-t-none":
                element.type === "__body" && selectedElement.id === element.id,
            }
          )}
        >
          {element.name}
        </Badge>
      )}
      {Array.isArray(element.content) ? (
        <>
          {element.content.map((e) => (
            <Recursive key={e.id} element={e} />
          ))}
        </>
      ) : null}
      {selectedElement.id === element.id &&
        !previewMode &&
        element.type !== "__body" && (
          <Badge
            onClick={(e) => {
              e.stopPropagation();
              deleteElement({
                elementDetails: element,
              });
            }}
            className={cn(
              "absolute cursor-pointer -top-[22px] -right-[1px] rounded-t-lg rounded-b-none"
            )}
          >
            <Trash2Icon size={16} />
          </Badge>
        )}
    </div>
  );
}
