import { cn } from "@/lib/utils";
import { EditorElement } from "@/stores/editor-store/editor-type";
import Link from "next/link";

export default function LinkElement({ element }: { element: EditorElement }) {
  return (
    <div
      style={element.styles}
      className={cn("p-[2px] w-full relative text-[16px] transition-all", {
        "my-[5px]": element.type !== "__body",
      })}
    >
      {!Array.isArray(element.content) && (
        <>
          <Link href={element.content?.href || "#"}>
            {element.content.innerText}
          </Link>
        </>
      )}
    </div>
  );
}
