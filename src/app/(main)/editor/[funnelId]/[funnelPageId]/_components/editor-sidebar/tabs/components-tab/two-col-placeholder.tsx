export default function TwoColPlaceholder() {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("componentType", "2Col");
  };

  return (
    <div
      draggable
      onDragOver={handleDragOver}
      onDragStart={handleDragStart}
      className="h-14 w-14 bg-muted rounded-lg gap-1 flex p-2 items-center justify-center"
    >
      <div className="border-dashed border-[1px]  h-full w-full rounded-sm bg-muted border-muted-foreground/50" />
      <div className="border-dashed border-[1px]  h-full w-full rounded-sm bg-muted border-muted-foreground/50" />
    </div>
  );
}
