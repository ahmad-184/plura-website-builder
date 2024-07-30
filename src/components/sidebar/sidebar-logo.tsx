import Image from "next/image";
import { AspectRatio } from "../ui/aspect-ratio";
import { db } from "@/lib/db";
import { SidebarType } from "@/types";
import { getAgency } from "@/actions/agency";
import { getSubAccount } from "@/actions/subaccount";

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
    <div>
      <AspectRatio ratio={16 / 5}>
        <Image
          fill
          src={logo || "/assets/plura-logo.svg"}
          alt={type === "agency" ? "agency logo" : "subaccount logo"}
          className="rounded-md object-contain"
        />
      </AspectRatio>
    </div>
  );
}
