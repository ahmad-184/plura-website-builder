import { Link2Icon } from "lucide-react";

export default function LinkPlaceholder() {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("componentType", "link");
  };

  return (
    <div
      draggable
      onDragOver={handleDragOver}
      onDragStart={handleDragStart}
      className="h-14 w-14 bg-muted rounded-lg flex items-center justify-center"
    >
      <Link2Icon size={40} className="text-muted-foreground" />
    </div>
  );
}
