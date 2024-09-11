import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useEditor } from "@/providers/editor-store-provider";
import { EditorElement } from "@/stores/editor-store/editor-type";
import { Trash2Icon } from "lucide-react";
import Link from "next/link";

export default function LinkElement({ element }: { element: EditorElement }) {
  const selectedElement = useEditor((store) => store.editor.selectedElement);
  const previewMode = useEditor((store) => store.editor.previewMode);
  const updateElement = useEditor((store) => store.updateElement);
  const deleteElement = useEditor((store) => store.deleteElement);
  const changeClickedElement = useEditor((store) => store.changeClickedElement);

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
      onDragOver={handleDragOver}
      onDragStart={handleDragStart}
      className={cn("p-[2px] w-full relative text-[16px] transition-all", {
        "!border-blue-500": selectedElement.id === element.id && !previewMode,
        "!border-solid": selectedElement.id === element.id && !previewMode,
        "border-dashed border-[1px] dark:border-slate-300 border-slate-400":
          !previewMode,
        "my-[5px]": element.type !== "__body",
      })}
    >
      {selectedElement.id === element.id && !previewMode && (
        <Badge className="absolute -top-[23px] -left-[1px] rounded-t-lg rounded-b-none">
          {element.name}
        </Badge>
      )}
      {!Array.isArray(element.content) && (
        <>
          {!previewMode ? (
            <span
              contentEditable={!previewMode}
              onBlur={(e) => {
                e.stopPropagation();
                updateElement({
                  elementDetails: {
                    ...element,
                    content: {
                      ...element.content,
                      innerText: e.target.innerText,
                    },
                  },
                });
              }}
            >
              {!Array.isArray(element.content)
                ? element.content.innerText
                : null}
            </span>
          ) : null}
          {previewMode ? (
            <Link href={element.content?.href || "#"}>
              {element.content.innerText}
            </Link>
          ) : null}
        </>
      )}
      {selectedElement.id === element.id && !previewMode && (
        <Badge
          onClick={(e) => {
            e.stopPropagation();
            deleteElement({
              elementDetails: element,
            });
          }}
          className="absolute cursor-pointer -top-[23px] -right-[2px] rounded-t-lg rounded-b-none"
        >
          <Trash2Icon size={16} />
        </Badge>
      )}
    </div>
  );
}
