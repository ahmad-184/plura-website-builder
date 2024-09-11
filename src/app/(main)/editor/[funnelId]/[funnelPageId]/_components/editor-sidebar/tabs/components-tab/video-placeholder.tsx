import { YoutubeIcon } from "lucide-react";

export default function VideoPlaceholder() {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("componentType", "video");
  };

  return (
    <div
      draggable
      onDragOver={handleDragOver}
      onDragStart={handleDragStart}
      className="h-14 w-14 bg-muted rounded-lg flex items-center justify-center"
    >
      <YoutubeIcon size={40} className="text-muted-foreground" />
    </div>
  );
}
