import CustomTooltip from "@/components/custom/custom-tooltip";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEditor } from "@/providers/editor-store-provider";
import {
  AlignCenterVerticalIcon,
  AlignEndHorizontalIcon,
  AlignEndVerticalIcon,
  AlignStartHorizontalIcon,
  AlignStartVerticalIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function Decorations({
  handleOnChange,
}: {
  handleOnChange: (e: any) => void;
}) {
  const selectedElement = useEditor((store) => store.editor.selectedElement);

  const [opacity, setOpacity] = useState(
    parseFloat((selectedElement.styles.opacity as string)?.split("%")[0]) || 0
  );
  const [borderRadius, setBorderRadius] = useState(
    (selectedElement.styles.opacity as string)?.split("px")[0] || "0"
  );
  const [bgColor, setBgColor] = useState(
    selectedElement.styles.backgroundColor || ""
  );
  const [bgImage, setBgImage] = useState(
    selectedElement.styles.backgroundImage || "url()"
  );
  const [imagePosition, setImagePosition] = useState(
    (selectedElement.styles.backgroundPosition as string) || ""
  );

  useEffect(() => {
    setOpacity(
      parseFloat((selectedElement.styles?.opacity as string)?.split("%")[0]) ||
        0
    );
    setBorderRadius(
      (selectedElement.styles?.borderRadius as string)?.split("px")[0] || "0"
    );
    setBgColor(selectedElement.styles.backgroundColor || "");
    setBgImage(selectedElement.styles.backgroundImage || "");
    setImagePosition(
      (selectedElement.styles.backgroundPosition as string) || ""
    );
  }, [selectedElement.styles]);

  return (
    <div className="gap-3 flex w-full flex-col">
      <div className="flex flex-col gap-2 mb-2">
        <p className="text-muted-foreground">Opacity</p>
        <div className="flex flex-col gap-1">
          <p className="text-xs self-end">{opacity}%</p>
          <Slider
            onValueChange={(e) => {
              setOpacity(e[0]);
              handleOnChange({
                target: {
                  id: "opacity",
                  value: `${e[0]}%`,
                },
              });
            }}
            value={[opacity]}
            max={100}
            step={1}
            className={"w-full"}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 mb-2">
        <p className="text-muted-foreground">Border Radius</p>
        <div className="flex flex-col gap-1">
          <p className="text-xs self-end">{borderRadius}px</p>
          <Slider
            onValueChange={(e) => {
              setBorderRadius(String(e[0]));
              handleOnChange({
                target: {
                  id: "borderRadius",
                  value: `${e[0]}px`,
                },
              });
            }}
            value={[parseFloat(borderRadius)]}
            max={100}
            step={1}
            className={"w-full"}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground">Background Color</p>
        <div className="flex gap-1">
          <div
            className="w-12 rounded-md border-[1px]"
            style={{
              backgroundColor: bgColor,
            }}
          />
          <Input
            id="backgroundColor"
            value={bgColor}
            placeholder="#FFFF"
            onChange={(e) => {
              setBgColor(e.target.value);
              handleOnChange(e);
            }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground">Background Image</p>
        <div className="flex gap-1">
          <div
            className="w-12 rounded-md border-[1px]"
            style={{
              backgroundImage: bgImage,
            }}
          />
          <Input
            id="backgroundImage"
            value={bgImage}
            placeholder="url()"
            onChange={(e) => {
              setBgImage(e.target.value);
              handleOnChange(e);
            }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground">Background Position</p>
        <Tabs
          className="w-full"
          onValueChange={(e) => {
            setImagePosition(e);
            handleOnChange({
              target: {
                value: e,
                id: "backgroundPosition",
              },
            });
          }}
          value={imagePosition}
        >
          <TabsList className="justify-between w-full bg-transparent border">
            <TabsTrigger
              value="left"
              className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-800"
            >
              <CustomTooltip content="Left">
                <AlignStartVerticalIcon size={20} />
              </CustomTooltip>
            </TabsTrigger>

            <TabsTrigger
              value="top"
              className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-800"
            >
              <CustomTooltip content="Top">
                <AlignStartHorizontalIcon size={20} />
              </CustomTooltip>
            </TabsTrigger>

            <TabsTrigger
              value="center"
              className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-800"
            >
              <CustomTooltip content="Center">
                <AlignCenterVerticalIcon size={20} />
              </CustomTooltip>
            </TabsTrigger>

            <TabsTrigger
              value="bottom"
              className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-800"
            >
              <CustomTooltip content="Bottom">
                <AlignEndHorizontalIcon size={20} />
              </CustomTooltip>
            </TabsTrigger>

            <TabsTrigger
              value="right"
              className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-800"
            >
              <CustomTooltip content="Right">
                <AlignEndVerticalIcon size={20} />
              </CustomTooltip>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
