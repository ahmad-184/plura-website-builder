"use client";

import { Accordion } from "@/components/ui/accordion";
import {
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { TabsContent } from "@/components/ui/tabs";
import { useEditor } from "@/providers/editor-store-provider";
import Layer from "./Layer";

export default function LayersTab() {
  const elements = useEditor((store) => store.editor.elements);

  return (
    <TabsContent
      value="layers"
      className="focus-visible:ring-transparent ring-transparent overflow-visible"
    >
      <SheetHeader className="text-left p-4">
        <SheetTitle>Layers</SheetTitle>
        <SheetDescription>
          View the editor in tree like structure.
        </SheetDescription>
      </SheetHeader>
      <div className="px-2 h-full">
        <Accordion type="multiple">
          {elements.map((e, i) => (
            <Layer element={e} key={e.id + i} />
          ))}
        </Accordion>
      </div>
    </TabsContent>
  );
}
