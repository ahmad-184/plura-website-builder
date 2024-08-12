"use client";

import CreateUpdatePipeline from "@/components/create-update-pipeline";
import { Pipeline } from "@prisma/client";
import DeletePipeline from "./delete-pipeline";

export default function PipelineSettings({
  subaccountId,
  pipelineId,
  pipeline,
}: {
  subaccountId: string;
  pipelineId: string;
  pipeline: Pipeline;
}) {
  return (
    <div className="w-full flex flex-col gap-5">
      <CreateUpdatePipeline
        subaccountId={subaccountId}
        pipelineDetails={pipeline}
      />
      <DeletePipeline pipelineId={pipelineId} subaccountId={subaccountId} />
    </div>
  );
}
