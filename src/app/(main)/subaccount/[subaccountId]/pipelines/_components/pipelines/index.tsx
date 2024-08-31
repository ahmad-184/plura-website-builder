import { findSubaccountPipeline } from "@/actions/pipeline";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { redirect } from "next/navigation";
import PipelineInfoBar from "./pipeline-infobar";
import PipelineSettings from "./pipeline-settings";
import PipelineView from "./pipeline-view";
import { getCurrentUser } from "@/actions/auth";
import { getPipelineLanesWithAllData } from "@/actions/lane";
import PipelineRealtime from "./pipeline-realtime";

export default async function Pipelines({
  subaccountId,
  pipelineId,
}: {
  subaccountId: string;
  pipelineId: string;
}) {
  const allPipelines = await findSubaccountPipeline(subaccountId);
  const user = await getCurrentUser();

  if (!allPipelines?.length)
    return redirect(`/subaccount/${subaccountId}/pipelines`);

  const pipelineDetails = allPipelines.find((e) => e.id === pipelineId);

  if (!pipelineDetails)
    return redirect(
      `/subaccount/${subaccountId}/pipelines/${allPipelines[0].id}`
    );

  const lanes = await getPipelineLanesWithAllData(pipelineId);

  return (
    <PipelineRealtime
      pipelineId={pipelineDetails.id}
      lanes={lanes || []}
      pipelines={allPipelines}
      subaccountId={subaccountId}
    >
      <Tabs className="w-full" defaultValue="view">
        <TabsList className="w-full bg-transparent border-b-0 h-16 justify-between mb-4">
          <PipelineInfoBar
            pipelineId={pipelineId}
            subaccountId={subaccountId}
            user={user}
          />
          <div>
            <TabsTrigger value="view">Pipeline View</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </div>
        </TabsList>
        <TabsContent value="settings">
          <PipelineSettings
            subaccountId={subaccountId}
            pipelineId={pipelineId}
            pipeline={pipelineDetails}
            user={user}
          />
        </TabsContent>
        <TabsContent value="view">
          <PipelineView
            pipelineId={pipelineId}
            subaccountId={subaccountId}
            pipelineDetails={pipelineDetails}
          />
        </TabsContent>
      </Tabs>
    </PipelineRealtime>
  );
}
