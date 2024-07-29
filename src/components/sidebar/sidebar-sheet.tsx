import { MenuIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { cn } from "@/lib/utils";

export default function SidebarSheet({
  children,
  defaultOpen,
}: {
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <div
      className={cn({
        "hidden md:block": defaultOpen,
        "block md:hidden": !defaultOpen,
      })}
    >
      <Sheet
        modal={false}
        defaultOpen={defaultOpen}
        {...(defaultOpen && { open: true })}
      >
        <SheetTrigger
          asChild
          className="absolute left-4 top-4 z-[100] md:!hidden flex"
        >
          <Button variant={"outline"} size={"icon"}>
            <MenuIcon />
          </Button>
        </SheetTrigger>
        <SheetContent
          side={"left"}
          showX={!defaultOpen}
          className={cn(
            "bg-background/80 backdrop-blur-xl fixed top-0 border-r-[1px] p-6",
            {
              "hidden md:inline-block z-0 w-[300px]": defaultOpen,
              "inline-block md:hidden z-[101] w-full": !defaultOpen,
            }
          )}
        >
          {children}
        </SheetContent>
      </Sheet>
    </div>
  );
}
