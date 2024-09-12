import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { TabsContent } from "@/components/ui/tabs";
import { useEditor } from "@/providers/editor-store-provider";
import { useRef } from "react";
import Typography from "./typography";
import Dimensions from "./dimensions";
import Decorations from "./decorations";
import Flexbox from "./flexbox";
import { TooltipProvider } from "@/components/ui/tooltip";
import Customs from "./customs";

export default function SettingsTab() {
  const selectedElement = useEditor((store) => store.editor.selectedElement);
  const updateElement = useEditor((store) => store.updateElement);

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChangeCustomValues = (e: any) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const settingProperty = e.target.id;
      let value = e.target.value;
      const styleObj = {
        [settingProperty]: value,
      };

      updateElement({
        elementDetails: {
          ...selectedElement,
          content: {
            ...selectedElement.content,
            ...styleObj,
          },
        },
      });
    }, 850);
  };

  const handleOnChange = (e: any) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const styleSetting = e.target.id;
      let value = e.target.value;
      const styleObj = {
        [styleSetting]: value,
      };

      updateElement({
        elementDetails: {
          ...selectedElement,
          styles: {
            ...selectedElement.styles,
            ...styleObj,
          },
        },
      });
    }, 850);
  };

  return (
    <TooltipProvider>
      <TabsContent
        value="settings"
        className="focus-visible:ring-transparent ring-transparent relative"
      >
        <SheetHeader className="text-left p-4">
          <SheetTitle>Styles</SheetTitle>
          <SheetDescription>
            Show your creativity! You can customize every component as you like.
          </SheetDescription>
        </SheetHeader>
        <Accordion
          type="multiple"
          className="w-full"
          defaultValue={["typography", "dimensions", "decorations", "flexbox"]}
        >
          <AccordionItem value="custom" className="py-0">
            <AccordionTrigger className="!no-underline px-4 text-sm">
              Custom
            </AccordionTrigger>
            <AccordionContent className="px-4">
              <Customs handleChangeCustomValues={handleChangeCustomValues} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="typography" className="py-0">
            <AccordionTrigger className="!no-underline px-4  text-sm">
              Typography
            </AccordionTrigger>
            <AccordionContent className="px-4">
              <Typography handleOnChange={handleOnChange} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="dimensions" className="py-0">
            <AccordionTrigger className="!no-underline px-4  text-sm">
              Dimensions
            </AccordionTrigger>
            <AccordionContent className="px-4">
              <Dimensions handleOnChange={handleOnChange} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="decorations" className="py-0">
            <AccordionTrigger className="!no-underline px-4  text-sm">
              Decorations
            </AccordionTrigger>
            <AccordionContent className="px-4">
              <Decorations handleOnChange={handleOnChange} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="flexbox" className="py-0">
            <AccordionTrigger className="!no-underline px-4  text-sm">
              Flexbox
            </AccordionTrigger>
            <AccordionContent className="px-4">
              <Flexbox handleOnChange={handleOnChange} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </TabsContent>
    </TooltipProvider>
  );
}
