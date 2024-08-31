import { cn } from "@/lib/utils";

export default function PageWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="w-full h-full flex justify-center">
      <div className={cn("w-full max-w-[1000px]", className)}>{children}</div>
    </div>
  );
}
