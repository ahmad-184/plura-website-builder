import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEditor } from "@/providers/editor-store-provider";
import { EditorElement } from "@/stores/editor-store/editor-type";
import { Link2Icon, TypeIcon, YoutubeIcon } from "lucide-react";

const Icon = ({ element }: { element: EditorElement }) => {
  return (
    <>
      {element.type === "container" ||
      element.type === "__body" ||
      element.type === "2Col" ||
      element.type === "3Col" ? (
        <div className="p-2 border-dashed border-[1px] border-muted-foreground" />
      ) : null}
      {element.type === "text" ? (
        <div className="text-muted-foreground">
          <TypeIcon size={19} />
        </div>
      ) : null}
      {element.type === "video" ? (
        <div className="text-muted-foreground">
          <YoutubeIcon size={19} />
        </div>
      ) : null}
      {element.type === "link" ? (
        <div className="text-muted-foreground">
          <Link2Icon size={19} />
        </div>
      ) : null}
    </>
  );
};

export default function Layer({ element }: { element: EditorElement }) {
  const selectedElement = useEditor((store) => store.editor.selectedElement);
  const changeClickedElement = useEditor((store) => store.changeClickedElement);

  if (Array.isArray(element.content) && element.content.length)
    return (
      <AccordionItem value={element.id} className="border-b-0">
        <AccordionTrigger
          className={`!no-underline py-2 border-t border-b hover:bg-muted px-2 rounded-md ${
            selectedElement.id === element.id && "bg-muted"
          }`}
          onClick={() => {
            changeClickedElement({ elementDetails: element });
          }}
        >
          <div className="flex items-center justify-start gap-3">
            <Icon element={element} />
            {element.name}
          </div>
        </AccordionTrigger>
        <AccordionContent className="pl-1 pb-2">
          {element.content.map((e, i) => (
            <Layer element={e} key={e.id + i} />
          ))}
        </AccordionContent>
      </AccordionItem>
    );

  return (
    <div
      className={`py-1 cursor-pointer hover:bg-muted px-2 rounded-md ${
        selectedElement.id === element.id && "bg-muted"
      }`}
      onClick={() => {
        changeClickedElement({ elementDetails: element });
      }}
    >
      <div className="flex gap-3 items-center !text-[16px] text-lg">
        <Icon element={element} />
        {element.name}
      </div>
    </div>
  );
}
