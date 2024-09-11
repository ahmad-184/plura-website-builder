import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useEditor } from "@/providers/editor-store-provider";
import { EditorElement } from "@/stores/editor-store/editor-type";
import { Trash2Icon } from "lucide-react";

export default function VideoElement({ element }: { element: EditorElement }) {
  return (
    <div
      style={element.styles}
      className={cn("p-[2px] w-full relative text-[16px] transition-all", {
        "my-[5px]": element.type !== "__body",
      })}
    >
      {!Array.isArray(element.content) && (
        <>
          <iframe
            width={element.styles.width || "560"}
            height={element.styles.height || "315"}
            className="bg-black"
            src={element.content?.src || ""}
            allowFullScreen={true}
            title="Video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          />
        </>
      )}
    </div>
  );
}
