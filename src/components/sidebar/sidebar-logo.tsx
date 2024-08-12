import Image from "next/image";
import { AspectRatio } from "../ui/aspect-ratio";
import { SidebarType } from "@/types";

export default async function SidebarLogo({
  id,
  type,
  logo,
}: {
  id: string;
  type: SidebarType;
  logo: string;
}) {
  return (
    <div className="w-full">
      <AspectRatio ratio={16 / 5}>
        <Image
          fill
          src={logo || "/assets/plura-logo.svg"}
          alt={type === "agency" ? "agency logo" : "subaccount logo"}
          className="rounded-md object-contain select-none"
        />
      </AspectRatio>
    </div>
  );
}
