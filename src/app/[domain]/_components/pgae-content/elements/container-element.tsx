import { cn } from "@/lib/utils";
import { EditorElement } from "@/stores/editor-store/editor-type";
import Recursive from "./recursive";

export default function ContainerElement({
  element,
}: {
  element: EditorElement;
}) {
  return (
    <div
      style={element.styles}
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
      })}
    >
      {Array.isArray(element.content) ? (
        <>
          {element.content.map((e) => (
            <Recursive key={e.id} element={e} />
          ))}
        </>
      ) : null}
    </div>
  );
}
