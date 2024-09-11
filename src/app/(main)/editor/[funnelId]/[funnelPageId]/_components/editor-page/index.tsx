"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEditor } from "@/providers/editor-store-provider";
import { EyeOffIcon } from "lucide-react";
import Recursive from "./elements/recursive";

export default function EditorPage() {
  const liveMode = useEditor((store) => store.editor.liveMode);
  const device = useEditor((store) => store.editor.device);
  const previewMode = useEditor((store) => store.editor.previewMode);
  const toggleLiveMode = useEditor((store) => store.toggleLiveMode);
  const togglePreviewMode = useEditor((store) => store.togglePreviewMode);
  const elements = useEditor((store) => store.editor.elements);

  const handleChangePreview = () => {
    toggleLiveMode({ value: false });
    togglePreviewMode();
  };

  return (
    <div
      style={{
        width: liveMode || previewMode ? "100%" : "calc(100% - 384px)",
        paddingTop: !previewMode ? 93 : 0,
      }}
      className="flex h-screen bg-background w-full justify-center"
    >
      <Button
        className={cn("w-6 h-6 rounded-none absolute top-0 left-0 z-20", {
          hidden: !previewMode,
        })}
        variant="secondary"
        size={"icon"}
        onClick={handleChangePreview}
      >
        <EyeOffIcon size={20} />
      </Button>
      <div
        className={cn(
          "dark:bg-gray-900 scroll-smooth p-[5px] bg-gray-50 w-full max-w-full max-h-full transition-all duration-300 use-automation-zoom-in",
          {
            "w-full": device === "Desktop",
            "w-[850px]": device === "Tablet",
            "w-[420px]": device === "Mobile",
            "w-full !p-0 !m-0": previewMode || liveMode,
          }
        )}
      >
        {elements.map((e) => (
          <Recursive key={e.id} element={e} />
        ))}
      </div>
    </div>
  );
}
