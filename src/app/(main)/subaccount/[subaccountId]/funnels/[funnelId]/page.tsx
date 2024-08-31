import { getFunnelWithPages } from "@/actions/funnel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import FunnelsSteps from "../_components/funnels-steps";
import FunnelSettings from "../_components/funnel-settings";

export const revalidate = 60;

export default async function Page({
  params,
}: {
  params: { subaccountId: string; funnelId: string };
}) {
  const funnel = await getFunnelWithPages(params.funnelId);
  if (!funnel?.id)
    return redirect(`/subaccount/${params.subaccountId}/funnels`);

  return (
    <div>
      <Link
        className="text-muted-foreground flex items-center mb-4 text-sm w-fit"
        href={`/subaccount/${params.subaccountId}/funnels`}
      >
        <ChevronLeftIcon size={16} />
        Back
      </Link>
      <h1 className="text-3xl mb-8">{funnel.name}</h1>
      <Tabs defaultValue="steps" className="w-full">
        <TabsList className="grid  grid-cols-2 w-[50%] bg-transparent ">
          <TabsTrigger value="steps">Steps</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="steps">
          <FunnelsSteps
            subaccountId={params.subaccountId}
            funnelId={params.funnelId}
            funnel={funnel}
            pages={funnel.FunnelPages}
          />
        </TabsContent>
        <TabsContent value="settings">
          <FunnelSettings
            subaccountId={params.subaccountId}
            funnelId={params.funnelId}
            funnel={funnel}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
