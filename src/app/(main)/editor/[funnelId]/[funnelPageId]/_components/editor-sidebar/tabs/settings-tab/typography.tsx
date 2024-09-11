import CustomTooltip from "@/components/custom/custom-tooltip";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEditor } from "@/providers/editor-store-provider";
import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function Typography({
  handleOnChange,
}: {
  handleOnChange: (e: any) => void;
}) {
  const selectedElement = useEditor((store) => store.editor.selectedElement);

  const [textAlign, setTextAlign] = useState(
    selectedElement.styles.textAlign || ""
  );
  const [fontFamily, setFontFamily] = useState(
    selectedElement.styles.fontFamily || ""
  );
  const [color, setColor] = useState(selectedElement.styles.color || "");
  const [weight, setWeight] = useState(selectedElement.styles.fontWeight || "");
  const [fontSize, setFontSize] = useState(
    selectedElement.styles.fontSize || ""
  );

  useEffect(() => {
    setTextAlign(selectedElement.styles.textAlign || "");
    setFontFamily(selectedElement.styles.fontFamily || "");
    setColor(selectedElement.styles.color || "");
    setWeight(selectedElement.styles.fontWeight || "");
    setFontSize(selectedElement.styles.fontSize || "");
  }, [selectedElement.styles]);

  return (
    <div className="gap-3 flex w-full flex-col">
      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground">Text Align</p>
        <Tabs
          className="w-full"
          onValueChange={(e) => {
            setTextAlign(e);
            handleOnChange({
              target: {
                value: e,
                id: "textAlign",
              },
            });
          }}
          value={textAlign}
        >
          <TabsList className="justify-between w-full bg-transparent border">
            <TabsTrigger
              value="left"
              className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-800"
            >
              <CustomTooltip content="Left">
                <AlignLeftIcon size={20} />
              </CustomTooltip>
            </TabsTrigger>
            <TabsTrigger
              value="center"
              className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-800"
            >
              <CustomTooltip content="Center">
                <AlignCenterIcon size={20} />
              </CustomTooltip>
            </TabsTrigger>
            <TabsTrigger
              value="justify"
              className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-800"
            >
              <CustomTooltip content="Justify">
                <AlignJustifyIcon size={20} />
              </CustomTooltip>
            </TabsTrigger>
            <TabsTrigger
              value="right"
              className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-800"
            >
              <CustomTooltip content="Right">
                <AlignRightIcon size={20} />
              </CustomTooltip>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground">Font Family</p>
        <Input
          value={fontFamily}
          id="fontFamily"
          onChange={(e) => {
            setFontFamily(e.target.value);
            handleOnChange(e);
          }}
          placeholder="Dm sans"
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground">Color</p>
        <Input
          id="color"
          onChange={(e) => {
            setColor(e.target.value);
            handleOnChange(e);
          }}
          type="color"
          value={color}
        />
      </div>
      <div className="flex flex-row gap-3">
        <div className="flex flex-col gap-2 flex-grow">
          <p className="text-muted-foreground">Weight</p>
          <Select
            onValueChange={(e) => {
              setWeight(e);
              handleOnChange({
                target: {
                  value: e,
                  id: "fontWeight",
                },
              });
            }}
            value={(weight as string) || ""}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a Weight" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Font Weights</SelectLabel>
                <SelectItem value="lighter">Lighter</SelectItem>
                <SelectItem value="normal">Regular</SelectItem>
                <SelectItem value="bold">Bold</SelectItem>
                <SelectItem value="bolder">Bolder</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground">Size</p>
          <Input
            value={fontSize}
            onChange={(e) => {
              setFontSize(e.target.value);
              handleOnChange({
                target: {
                  id: "fontSize",
                  value: e.target.value,
                },
              });
            }}
            className="w-16"
            placeholder="16px"
          />
        </div>
      </div>
    </div>
  );
}
