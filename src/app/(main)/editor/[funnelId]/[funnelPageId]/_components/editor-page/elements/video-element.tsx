import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useEditor } from "@/providers/editor-store-provider";
import { EditorElement } from "@/stores/editor-store/editor-type";
import { Trash2Icon } from "lucide-react";

export default function VideoElement({ element }: { element: EditorElement }) {
  const selectedElement = useEditor((store) => store.editor.selectedElement);
  const previewMode = useEditor((store) => store.editor.previewMode);
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
          <iframe
            width={element.styles.width || "560"}
            // onClick={(e) => {
            //   e.stopPropagation();
            //   console.log("clicked");
            // }}
            height={element.styles.height || "315"}
            className="bg-black"
            src={element.content?.src || ""}
            allowFullScreen={true}
            title="Video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          />
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
