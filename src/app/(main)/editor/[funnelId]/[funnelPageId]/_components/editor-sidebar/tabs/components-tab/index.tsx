"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TabsContent } from "@/components/ui/tabs";
import { EditorBtns } from "@/stores/editor-store/editor-type";
import TextPlaceholder from "./text-placeholder";
import ContainerPlaceholder from "./container-placeholder";
import VideoPlaceholder from "./video-placeholder";
import LinkPlaceholder from "./link-placeholder";
import TwoColPlaceholder from "./two-col-placeholder";
import ThreeColPlaceholder from "./three-col-placeholder";
import {
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const elements: {
  Component: React.ReactNode;
  label: string;
  id: EditorBtns;
  group: "layout" | "element";
}[] = [
  {
    Component: <TextPlaceholder />,
    group: "element",
    id: "text",
    label: "Text",
  },
  {
    Component: <ContainerPlaceholder />,
    group: "layout",
    id: "container",
    label: "Container",
  },
  {
    Component: <VideoPlaceholder />,
    group: "element",
    id: "video",
    label: "Video",
  },
  {
    Component: <LinkPlaceholder />,
    group: "element",
    id: "link",
    label: "Link",
  },
  {
    Component: <TwoColPlaceholder />,
    group: "layout",
    id: "2Col",
    label: "2 Col",
  },
  {
    Component: <ThreeColPlaceholder />,
    group: "layout",
    id: "3Col",
    label: "3 Col",
  },
];

export default function ComponentsTab() {
  return (
    <TabsContent
      value="components"
      className="focus-visible:ring-transparent ring-transparent"
    >
      <SheetHeader className="text-left p-4">
        <SheetTitle>Components</SheetTitle>
        <SheetDescription>
          Drag and drop whatever component you need!
        </SheetDescription>
      </SheetHeader>
      <Accordion
        type="multiple"
        className="w-full"
        defaultValue={["layout", "element"]}
      >
        <AccordionItem value="layout" className="py-0">
          <AccordionTrigger className="!no-underline px-4 text-sm">
            Layout
          </AccordionTrigger>
          <AccordionContent className="px-4">
            <div className="flex flex-row gap-4 w-full">
              {elements
                .filter((e) => e.group === "layout")
                .map((e) => (
                  <div
                    className="flex flex-col items-center justify-center"
                    key={e.id}
                  >
                    {e.Component}
                    <span className="text-muted-foreground">{e.label}</span>
                  </div>
                ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="element" className="py-0">
          <AccordionTrigger className="!no-underline px-4 text-sm">
            Elements
          </AccordionTrigger>
          <AccordionContent className="px-4">
            <div className="flex flex-row gap-4 w-full">
              {elements
                .filter((e) => e.group === "element")
                .map((e) => (
                  <div
                    key={e.id}
                    className="flex flex-col items-center justify-center cursor-grab"
                  >
                    {e.Component}
                    <span className="text-muted-foreground">{e.label}</span>
                  </div>
                ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </TabsContent>
  );
}
