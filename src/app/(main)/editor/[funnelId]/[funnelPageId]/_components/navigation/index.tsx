"use client";

import { updateFunnelPageDetails } from "@/actions/funnel";
import ButtonWithLoaderAndProgress from "@/components/ButtonWithLoaderAndProgress";
import CustomAvatar from "@/components/custom/custom-avatar";
import CustomTooltip from "@/components/custom/custom-tooltip";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { fDate } from "@/lib/formatTime";
import { cn } from "@/lib/utils";
import { useEditor } from "@/providers/editor-store-provider";
import { DevicesType } from "@/stores/editor-store/editor-type";
import { useMutation } from "@tanstack/react-query";
import {
  ArrowLeftCircleIcon,
  EyeIcon,
  LaptopIcon,
  RedoIcon,
  SaveIcon,
  SmartphoneIcon,
  TabletIcon,
  UndoIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Navigation() {
  const router = useRouter();
  const pageDetails = useEditor((store) => store.pageDetails);
  const elements = useEditor((store) => store.editor.elements);
  const previewMode = useEditor((store) => store.editor.previewMode);
  const subaccountId = useEditor((store) => store.subaccountId);
  const device = useEditor((store) => store.editor.device);
  const changeDevice = useEditor((store) => store.changeDevice);
  const toggleLiveMode = useEditor((store) => store.toggleLiveMode);
  const togglePreviewMode = useEditor((store) => store.togglePreviewMode);
  const redo = useEditor((store) => store.redo);
  const undo = useEditor((store) => store.undo);
  const channel = useEditor((store) => store.channel);
  const onlineUsers = useEditor((store) => store.onlineUsers);
  const history = useEditor((store) => store.history);

  const [nameInput, setNameInput] = useState(pageDetails?.name || "");
  const [published, setPublished] = useState(pageDetails?.published || false);

  useEffect(() => {
    if (!pageDetails) return;
    setNameInput(pageDetails?.name || "");
    setPublished(pageDetails?.published || false);
  }, [pageDetails]);

  const { mutate: updatePage, isPending } = useMutation({
    mutationFn: updateFunnelPageDetails,
    retry: 3,
    onSuccess: (e) => {
      if (e) {
        toast.success("Success", {});
        router.refresh();
        if (channel) {
          channel.send({ type: "broadcast", event: "page_details:updated" });
        }
      }
    },
    onError: (e) => {
      toast.error("Error", { description: e.message, icon: "🛑" });
    },
  });

  const handleBlurInput: React.FocusEventHandler<HTMLInputElement> = (
    event
  ) => {
    if (pageDetails?.name === event.target.value || !pageDetails?.id) return;
    updatePage({ id: pageDetails.id, name: event.target.value });
  };

  const handleChangeDevice = (value: string) => {
    changeDevice({ device: value as DevicesType });
  };

  const handleClickPreviwe = () => {
    togglePreviewMode();
    toggleLiveMode();
  };

  const handleUndo = () => undo();
  const handleRedo = () => redo();

  const changePublishSatus = (e: boolean) => {
    if (!pageDetails?.id) return;
    setPublished(e);
    updatePage({ id: pageDetails.id, published: e });
  };

  const handleSave = () => {
    if (!pageDetails?.id) return;
    updatePage({ id: pageDetails.id, content: JSON.stringify(elements) });
  };

  if (!pageDetails) return <></>;
  return (
    <TooltipProvider>
      <nav
        className={cn(
          "w-full h-fit border-b-[1px] bg-background fixed top-0 left-0 right-0 z-10 flex items-center justify-between p-6 gap-2 transition-all",
          {
            "!overflow-hidden !h-0 !p-0": previewMode,
          }
        )}
      >
        <aside className="flex items-center gap-4 min-w-[260px] w-[300px]">
          <Link
            href={`/subaccount/${subaccountId}/funnels/${pageDetails.funnelId}`}
          >
            <ArrowLeftCircleIcon />
          </Link>
          <div className="flex flex-col flex-1">
            <Tooltip>
              <TooltipTrigger asChild type="button">
                <Input
                  type="text"
                  className={"border-none h-6 m-0 text-lg p-0 w-fit"}
                  onBlur={handleBlurInput}
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                />
              </TooltipTrigger>
              <TooltipContent>Click to change</TooltipContent>
            </Tooltip>
            <span className="text-sm text-muted-foreground">
              Path: /{pageDetails.pathName}
            </span>
          </div>
        </aside>
        <aside>
          <Tabs
            defaultValue="Desktop"
            className="w-fit"
            value={device}
            onValueChange={handleChangeDevice}
          >
            <TabsList>
              <CustomTooltip content="Desktop">
                <TabsTrigger value="Desktop">
                  <LaptopIcon />
                </TabsTrigger>
              </CustomTooltip>
              <CustomTooltip content="Tablet">
                <TabsTrigger value="Tablet">
                  <TabletIcon />
                </TabsTrigger>
              </CustomTooltip>
              <CustomTooltip content="Mobile">
                <TabsTrigger value="Mobile">
                  <SmartphoneIcon />
                </TabsTrigger>
              </CustomTooltip>
            </TabsList>
          </Tabs>
        </aside>
        <aside className="flex items-center gap-2">
          <CustomTooltip content="Preview">
            <Button
              size={"icon"}
              variant={"ghost"}
              className="dark:hover:bg-slate-800"
              onClick={handleClickPreviwe}
            >
              <EyeIcon size={20} />
            </Button>
          </CustomTooltip>
          <div>
            <CustomTooltip content="Undo">
              <Button
                size={"icon"}
                variant={"ghost"}
                className="dark:hover:bg-slate-800"
                onClick={handleUndo}
                disabled={history.currentIndex <= 0}
              >
                <UndoIcon size={20} />
              </Button>
            </CustomTooltip>
            <CustomTooltip content="Redo">
              <Button
                size={"icon"}
                variant={"ghost"}
                onClick={handleRedo}
                className="dark:hover:bg-slate-800"
                disabled={history.currentIndex === history.history.length - 1}
              >
                <RedoIcon size={20} />
              </Button>
            </CustomTooltip>
          </div>
          <div className="flex ml-4 flex-col mr-4">
            <div className="flex flex-row items-center gap-4 mb-[2px] text-sm">
              Draft
              <Switch
                checked={published}
                onCheckedChange={changePublishSatus}
              />
              Publish
            </div>
            <span className="text-muted-foreground text-xs">
              Last update at {fDate(new Date(pageDetails.updatedAt))}
            </span>
          </div>
          <div className="flex items-center w-fit">
            {onlineUsers.map((e, i) => (
              <div
                key={e.id}
                className={cn("flex relative z-10 hover:z-20", {
                  "-ml-6 left-6": onlineUsers.length !== i + 1,
                })}
              >
                <CustomTooltip
                  content={
                    <div className="items-start flex gap-2">
                      <div className="p-1 rounded-full bg-green-500 mt-[6px] animate-pulse"></div>
                      <div className="flex flex-col">
                        <p className="text-sm dark:text-gray-200">{e.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {e.email}
                        </p>
                      </div>
                    </div>
                  }
                >
                  <CustomAvatar
                    className="w-9 h-9 outline-[0.5px] outline-double outline-offset-1 outline-green-500 dark:outline-green-400"
                    user={{ name: e.name, avatarUrl: e.avatarUrl }}
                  />
                </CustomTooltip>
              </div>
            ))}
          </div>
          <CustomTooltip content="Save">
            <ButtonWithLoaderAndProgress
              size={"icon"}
              variant={"default"}
              onClick={handleSave}
              loading={isPending}
              disabled={isPending}
            >
              <SaveIcon size={22} strokeWidth={1.5} />
            </ButtonWithLoaderAndProgress>
          </CustomTooltip>
          {!previewMode && <ModeToggle />}
        </aside>
      </nav>
    </TooltipProvider>
  );
}
