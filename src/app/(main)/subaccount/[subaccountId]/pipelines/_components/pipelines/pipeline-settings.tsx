"use client";

import CreateUpdatePipeline from "@/components/create-update-pipeline";
import { Pipeline, User } from "@prisma/client";
import DeletePipeline from "./delete-pipeline";
import { usePipelineStore } from "@/providers/pipeline-store-provider";

export default function PipelineSettings({
  subaccountId,
  pipelineId,
  pipeline,
  user,
}: {
  subaccountId: string;
  pipelineId: string;
  pipeline: Pipeline;
  user: User | null | undefined;
}) {
  const { channel, updateOnePipline } = usePipelineStore((store) => store);

  return (
    <div className="w-full flex flex-col gap-5">
      {user?.role === "SUBACCOUNT_GUEST" ||
      user?.role === "SUBACCOUNT_USER" ? null : (
        <>
          <CreateUpdatePipeline
            subaccountId={subaccountId}
            pipelineDetails={pipeline}
            channel={channel}
            updateOnePipline={updateOnePipline}
          />
          <DeletePipeline pipelineId={pipelineId} subaccountId={subaccountId} />
        </>
      )}
    </div>
  );
}
