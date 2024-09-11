import CustomTooltip from "@/components/custom/custom-tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEditor } from "@/providers/editor-store-provider";
import {
  AlignCenterHorizontalIcon,
  AlignCenterVerticalIcon,
  AlignEndVerticalIcon,
  AlignHorizontalSpaceAroundIcon,
  AlignHorizontalSpaceBetweenIcon,
  AlignStartVerticalIcon,
  AlignVerticalJustifyEndIcon,
  AlignVerticalJustifyStartIcon,
  BaselineIcon,
  Columns3Icon,
  Rows3Icon,
  StretchHorizontalIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function Flexbox({
  handleOnChange,
}: {
  handleOnChange: (e: any) => void;
}) {
  const selectedElement = useEditor((store) => store.editor.selectedElement);

  const [flexbox, setFlexbox] = useState(
    (selectedElement.styles.display as string) === "flex" ? true : false
  );
  const [justifyContent, setJustifyContent] = useState(
    (selectedElement.styles.justifyContent as string) || ""
  );
  const [alignItems, setAlignItems] = useState(
    (selectedElement.styles.alignItems as string) || ""
  );
  const [direction, setDirection] = useState(
    (selectedElement.styles.flexDirection as string) || ""
  );
  const [gap, setGap] = useState((selectedElement.styles.gap as string) || "");

  useEffect(() => {
    setFlexbox(
      (selectedElement.styles.display as string) === "flex" ? true : false
    );
    setJustifyContent((selectedElement.styles.justifyContent as string) || "");
    setAlignItems((selectedElement.styles.alignItems as string) || "");
    setDirection((selectedElement.styles.flexDirection as string) || "");
    setGap((selectedElement.styles.gap as string) || "");
  }, [selectedElement.styles]);

  return (
    <div className="gap-3 flex w-full flex-col">
      <div className="flex flex-col gap-2 mb-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="flexbox"
            checked={flexbox}
            onCheckedChange={(e) => {
              setFlexbox(Boolean(e));
              handleOnChange({
                target: {
                  value: Boolean(e) === true ? "flex" : undefined,
                  id: "display",
                },
              });
            }}
          />
          <label
            htmlFor="flexbox"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Use Flexbox
          </label>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex flex-col gap-2 flex-grow">
          <p className="text-muted-foreground">Direction</p>
          <Tabs
            className="w-full"
            onValueChange={(e) => {
              setDirection(e);
              handleOnChange({
                target: {
                  value: e,
                  id: "flexDirection",
                },
              });
            }}
            value={direction}
          >
            <TabsList className="justify-between w-full bg-transparent border">
              <TabsTrigger
                value="column"
                className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-800"
              >
                <CustomTooltip content="Column">
                  <Rows3Icon size={20} />
                </CustomTooltip>
              </TabsTrigger>
              <TabsTrigger
                value="row"
                className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-800"
              >
                <CustomTooltip content="Row">
                  <Columns3Icon size={20} />
                </CustomTooltip>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground">Gap</p>
          <Input
            value={gap}
            onChange={(e) => {
              setGap(e.target.value);
              handleOnChange({
                target: {
                  id: "gap",
                  value: e.target.value,
                },
              });
            }}
            className="w-16"
            placeholder="px"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground">Justify Content</p>
        <Tabs
          className="w-full"
          onValueChange={(e) => {
            setJustifyContent(e);
            handleOnChange({
              target: {
                value: e,
                id: "justifyContent",
              },
            });
          }}
          value={justifyContent}
        >
          <TabsList className="justify-between w-full bg-transparent border">
            <TabsTrigger
              value="start"
              className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-800"
            >
              <CustomTooltip content="Start">
                <AlignStartVerticalIcon size={20} />
              </CustomTooltip>
            </TabsTrigger>

            <TabsTrigger
              value="end"
              className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-800"
            >
              <CustomTooltip content="End">
                <AlignEndVerticalIcon size={20} />
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
              value="space-between"
              className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-800"
            >
              <CustomTooltip content="Space Between">
                <AlignHorizontalSpaceBetweenIcon size={20} />
              </CustomTooltip>
            </TabsTrigger>

            <TabsTrigger
              value="space-around"
              className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-800"
            >
              <CustomTooltip content="Space Around">
                <AlignHorizontalSpaceAroundIcon size={20} />
              </CustomTooltip>
            </TabsTrigger>

            <TabsTrigger
              value="stretch"
              className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-800"
            >
              <CustomTooltip content="Stretch">
                <StretchHorizontalIcon size={20} />
              </CustomTooltip>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground">Align Items</p>
        <Tabs
          className="w-full"
          onValueChange={(e) => {
            setAlignItems(e);
            handleOnChange({
              target: {
                value: e,
                id: "alignItems",
              },
            });
          }}
          value={alignItems}
        >
          <TabsList className="justify-between w-full bg-transparent border">
            <TabsTrigger
              value="start"
              className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-800"
            >
              <CustomTooltip content="Start">
                <AlignVerticalJustifyStartIcon size={20} />
              </CustomTooltip>
            </TabsTrigger>
            <TabsTrigger
              value="center"
              className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-800"
            >
              <CustomTooltip content="Center">
                <AlignCenterHorizontalIcon size={20} />
              </CustomTooltip>
            </TabsTrigger>
            <TabsTrigger
              value="end"
              className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-800"
            >
              <CustomTooltip content="End">
                <AlignVerticalJustifyEndIcon size={20} />
              </CustomTooltip>
            </TabsTrigger>
            <TabsTrigger
              value="stretch"
              className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-800"
            >
              <CustomTooltip content="Stretch">
                <StretchHorizontalIcon size={20} />
              </CustomTooltip>
            </TabsTrigger>
            <TabsTrigger
              value="baseline"
              className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-800"
            >
              <CustomTooltip content="Baseline">
                <BaselineIcon size={20} />
              </CustomTooltip>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
