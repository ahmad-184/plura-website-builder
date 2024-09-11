"use client";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Tabs } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useEditor } from "@/providers/editor-store-provider";
import TabsList from "./tabs/tabs-list";
import SettingsTab from "./tabs/settings-tab";
import { useEffect } from "react";
import MediaBucketTab from "./tabs/media-bucket-tab";
import ComponentsTab from "./tabs/components-tab";
import LayersTab from "./tabs/layers-tab";

export default function EditorSidebar() {
  const previewMode = useEditor((store) => store.editor.previewMode);
  const history = useEditor((store) => store.history);

  useEffect(() => {
    console.log(history);
  }, [history]);

  return (
    <Sheet open={!previewMode} modal={false}>
      <Tabs className="w-fit" defaultValue="settings">
        <SheetContent
          side={"right"}
          className={cn(
            "mt-[93px] hidden lg:block w-16 z-50 shadow-none p-0 transition-all overflow-hidden",
            {
              hidden: previewMode,
            }
          )}
        >
          <TabsList />
        </SheetContent>
        <SheetContent
          side={"right"}
          className={cn(
            "mt-[93px] hidden lg:block w-80 pt-0 z-40 mr-16 shadow-none h-full p-0 transition-all overflow-hidden",
            {
              hidden: previewMode,
            }
          )}
        >
          <div className="grid gap-4 h-full pt-0 pb-36 overflow-auto">
            <SettingsTab />
            <MediaBucketTab />
            <ComponentsTab />
            <LayersTab />
          </div>
        </SheetContent>
      </Tabs>
    </Sheet>
  );
}
