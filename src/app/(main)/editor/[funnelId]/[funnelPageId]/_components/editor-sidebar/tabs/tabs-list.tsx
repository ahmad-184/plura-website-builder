import { TabsList as TabsListCom, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DatabaseIcon,
  PlusIcon,
  SettingsIcon,
  SquareStackIcon,
} from "lucide-react";

const tabsListData = [
  {
    icon: <SettingsIcon />,
    value: "settings",
    tooltip: "Settings",
  },
  {
    icon: <PlusIcon />,
    value: "components",
    tooltip: "Components",
  },
  {
    icon: <SquareStackIcon />,
    value: "layers",
    tooltip: "Layers",
  },
  {
    icon: <DatabaseIcon />,
    value: "media",
    tooltip: "Media",
  },
];

export default function TabsList() {
  return (
    <TabsListCom className="flex pt-3 items-center flex-col justify-evenly w-full bg-transparent h-fit gap-4">
      {tabsListData.map((t, i) => (
        <Tooltip key={i + t.value}>
          <TooltipTrigger>
            <TabsTrigger value={t.value}>{t.icon}</TabsTrigger>
          </TooltipTrigger>
          <TooltipContent>{t.tooltip}</TooltipContent>
        </Tooltip>
      ))}
    </TabsListCom>
  );
}
