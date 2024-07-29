import Image from "next/image";
import { AspectRatio } from "../ui/aspect-ratio";
import { db } from "@/lib/db";
import { SidebarType } from "@/types";
import { getAgency } from "@/actions/agency";
import { getSubAccount } from "@/actions/subaccount";

export default async function SidebarLogo({
  id,
  type,
}: {
  id: string;
  type: SidebarType;
}) {
  let logo = "";

  if (type === "agency")
    logo =
      (await getAgency(id).then((res) => res?.agencyLogo)) ||
      "/assets/plura-logo.svg";
  if (type === "subaccount")
    logo =
      (await getSubAccount(id).then((res) => res?.subAccountLogo)) ||
      "/assets/plura-logo.svg";

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
