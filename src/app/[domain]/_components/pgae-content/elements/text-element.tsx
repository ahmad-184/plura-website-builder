import { cn } from "@/lib/utils";
import { EditorElement } from "@/stores/editor-store/editor-type";

export default function TextElement({ element }: { element: EditorElement }) {
  return (
    <div
      style={element.styles}
      className={cn("p-[2px] w-full relative text-[16px] transition-all", {
        "my-[5px]": element.type !== "__body",
      })}
    >
      <span>
        {!Array.isArray(element.content) ? element.content.innerText : null}
      </span>
    </div>
  );
}
