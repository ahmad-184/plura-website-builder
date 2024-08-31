import { Pipeline } from "@prisma/client";
import AddLaneButton from "./pipeline-lanes/add-lane-button";
import PipelineLanes from "./pipeline-lanes";
import OnlieUsers from "./online-users";

export default async function PipelineView({
  pipelineId,
  subaccountId,
  pipelineDetails,
}: {
  pipelineId: string;
  subaccountId: string;
  pipelineDetails: Pipeline;
}) {
  return (
    <>
      <div className=" bg-white/60 dark:bg-background/60 rounded-xl p-4 pb-7 use-automation-zoom-in">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">{pipelineDetails?.name}</h1>
          <div className="flex items-center gap-7">
            <OnlieUsers />
            <AddLaneButton
              pipelineId={pipelineId}
              subaccountId={subaccountId}
            />
          </div>
        </div>
        <PipelineLanes
          pipelineDetails={pipelineDetails}
          pipelineId={pipelineId}
          subaccountId={subaccountId}
        />
      </div>
    </>
  );
}
