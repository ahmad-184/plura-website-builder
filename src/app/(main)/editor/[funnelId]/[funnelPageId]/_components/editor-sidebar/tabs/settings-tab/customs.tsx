import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { useEditor } from "@/providers/editor-store-provider";
import { useEffect, useState } from "react";

export default function Customs({
  handleChangeCustomValues,
}: {
  handleChangeCustomValues: (e: any) => void;
}) {
  const selectedElement = useEditor((store) => store.editor.selectedElement);
  const updateElement = useEditor((store) => store.updateElement);

  const [href, setHref] = useState(
    (!Array.isArray(selectedElement.content) && selectedElement.content.href) ||
      ""
  );
  const [src, setSrc] = useState(
    (!Array.isArray(selectedElement.content) && selectedElement.content.src) ||
      ""
  );

  useEffect(() => {
    setHref(
      (!Array.isArray(selectedElement.content) &&
        selectedElement.content.href) ||
        ""
    );
    setSrc(
      (!Array.isArray(selectedElement.content) &&
        selectedElement.content.src) ||
        ""
    );
  }, [selectedElement.content]);

  return (
    <>
      {selectedElement.type === "link" &&
        !Array.isArray(selectedElement.content) && (
          <div className="flex flex-col gap-2">
            <p className="text-muted-foreground">Link Path</p>
            <Input
              id="href"
              placeholder="http:domain.example.com/pathname"
              onChange={(e) => {
                setHref(e.target.value);
                handleChangeCustomValues(e);
              }}
              value={href}
            />
          </div>
        )}
      {selectedElement.type === "video" &&
        !Array.isArray(selectedElement.content) && (
          <div className="flex flex-col gap-2">
            <p className="text-muted-foreground">Video Link</p>
            <Input
              id="src"
              placeholder="https://static.cdn.asset.aparat.com/avt/60698787_15s.mp4"
              onChange={(e) => {
                setSrc(e.target.value);
                handleChangeCustomValues(e);
              }}
              value={src}
            />
          </div>
        )}
    </>
  );
}
