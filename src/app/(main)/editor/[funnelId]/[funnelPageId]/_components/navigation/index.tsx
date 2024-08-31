"use client";

import { updateFunnelPageDetails } from "@/actions/funnel";
import ButtonWithLoaderAndProgress from "@/components/ButtonWithLoaderAndProgress";
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
  Redo2,
  Redo2Icon,
  RedoIcon,
  SaveIcon,
  SmartphoneIcon,
  TabletIcon,
  Undo2,
  Undo2Icon,
  UndoIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

  const { mutate: updatePage, isPending } = useMutation({
    mutationFn: updateFunnelPageDetails,
    retry: 3,
    onSuccess: (e) => {
      if (e) {
        toast.success("Success", {
          // description: "Page details updated",
          // icon: "🎉",
        });
        router.refresh();
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
          "w-full h-fit border-b-[1px] flex items-center justify-between p-6 gap-2 transition-all",
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
                  defaultValue={pageDetails.name}
                  type="text"
                  className={"border-none h-5 m-0 p-0 text-lg w-fit"}
                  onBlur={handleBlurInput}
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
              <Tooltip>
                <TooltipTrigger>
                  <TabsTrigger value="Desktop">
                    <LaptopIcon />
                  </TabsTrigger>
                  <TooltipContent>
                    <p>Desktop</p>
                  </TooltipContent>
                </TooltipTrigger>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <TabsTrigger value="Tablet">
                    <TabletIcon />
                  </TabsTrigger>
                  <TooltipContent>
                    <p>Tablet</p>
                  </TooltipContent>
                </TooltipTrigger>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <TabsTrigger value="Mobile">
                    <SmartphoneIcon />
                  </TabsTrigger>
                  <TooltipContent>
                    <p>Mobile</p>
                  </TooltipContent>
                </TooltipTrigger>
              </Tooltip>
            </TabsList>
          </Tabs>
        </aside>
        <aside className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size={"icon"}
                variant={"ghost"}
                className="hover:bg-slate-800"
                onClick={handleClickPreviwe}
              >
                <EyeIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Preview Mode</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size={"icon"}
                variant={"ghost"}
                className="hover:bg-slate-800"
                onClick={handleUndo}
              >
                <UndoIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Undo</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size={"icon"}
                variant={"ghost"}
                onClick={handleRedo}
                className="hover:bg-slate-800"
              >
                <RedoIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Redo</TooltipContent>
          </Tooltip>
          <div className="flex ml-4 flex-col mr-4">
            <div className="flex flex-row items-center gap-4 mb-[2px] text-sm">
              Draft
              <Switch
                defaultChecked={pageDetails.published}
                onCheckedChange={changePublishSatus}
              />
              Publish
            </div>
            <span className="text-muted-foreground text-sm">
              Last update at {fDate(new Date(pageDetails.updatedAt))}
            </span>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <ButtonWithLoaderAndProgress
                size={"icon"}
                variant={"default"}
                onClick={handleSave}
                loading={isPending}
                disabled={isPending}
                // loaderColor="dark:fill-gray-400 !text-gray-700"
              >
                <SaveIcon />
              </ButtonWithLoaderAndProgress>
            </TooltipTrigger>
            <TooltipContent>Save</TooltipContent>
          </Tooltip>
        </aside>
      </nav>
    </TooltipProvider>
  );
}
