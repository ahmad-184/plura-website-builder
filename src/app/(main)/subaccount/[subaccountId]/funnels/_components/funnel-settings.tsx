import FunnelDetails from "@/components/funnel-details";
import { Funnel } from "@prisma/client";
import DeleteFunnel from "./delete-funnel";

export default function FunnelSettings({
  funnel,
  subaccountId,
  funnelId,
}: {
  funnel: Funnel;
  subaccountId: string;
  funnelId: string;
}) {
  return (
    <div className="mt-2 w-full flex flex-col gap-5">
      <FunnelDetails funnel={funnel} subaccountId={subaccountId} />
      <DeleteFunnel funnelId={funnelId} subaccountId={subaccountId} />
    </div>
  );
}
