import { getPipelineLanesWithAllData } from "@/actions/lane";
import { findSubaccountPipeline } from "@/actions/pipeline";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { redirect } from "next/navigation";
import PipelineInfoBar from "./pipeline-infobar";
import PipelineSettings from "./pipeline-settings";

export default async function Pipelines({
  subaccountId,
  pipelineId,
}: {
  subaccountId: string;
  pipelineId: string;
}) {
  const allPipelines = await findSubaccountPipeline(subaccountId);

  if (!allPipelines?.length)
    return redirect(`/subaccount/${subaccountId}/pipelines`);

  const pipelineDetails = allPipelines.find((e) => e.id === pipelineId);

  if (!pipelineDetails)
    return redirect(`/subaccount/${subaccountId}/pipelines`);

  const lanes = await getPipelineLanesWithAllData(pipelineId);

  return (
    <Tabs className="w-full" defaultValue="view">
      <TabsList className="w-full bg-transparent border-b-2 h-16 justify-between mb-4">
        <PipelineInfoBar
          pipelineId={pipelineId}
          pipelines={allPipelines}
          subaccountId={subaccountId}
        />
        <div>
          <TabsTrigger value="view">View</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </div>
      </TabsList>
      <TabsContent value="settings">
        <PipelineSettings
          subaccountId={subaccountId}
          pipelineId={pipelineId}
          pipeline={pipelineDetails}
        />
      </TabsContent>
    </Tabs>
  );
}
