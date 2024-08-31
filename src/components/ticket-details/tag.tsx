import { Tag } from "@prisma/client";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

export default function TagComponent({ tag }: { tag: Tag }) {
  return (
    <Badge
      key={tag.id}
      className={cn("text-gray-100", {
        "bg-[#57acea]/30 hover:bg-[#57acea]/30 text-[#57acea]":
          tag.color === "BLUE",
        "bg-[#ffac7e]/30 hover:bg-[#ffac7e]/30 text-[#ffac7e]":
          tag.color === "ORANGE",
        "bg-rose-500/30 hover:bg-rose-500/30 text-rose-500":
          tag.color === "ROSE",
        "bg-emerald-400/30 hover:bg-emerald-400/30 text-emerald-400":
          tag.color === "GREEN",
        "bg-purple-400/30 hover:bg-purple-400/30 text-purple-400":
          tag.color === "PURPLE",
      })}
    >
      {tag.name}
    </Badge>
  );
}
