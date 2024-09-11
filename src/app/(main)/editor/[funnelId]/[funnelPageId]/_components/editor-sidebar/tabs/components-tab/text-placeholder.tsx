import { TypeIcon } from "lucide-react";

export default function TextPlaceholder() {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("componentType", "text");
  };

  return (
    <div
      draggable
      onDragOver={handleDragOver}
      onDragStart={handleDragStart}
      className="h-14 w-14 bg-muted rounded-lg flex items-center justify-center"
    >
      <TypeIcon size={40} className="text-muted-foreground" />
    </div>
  );
}
