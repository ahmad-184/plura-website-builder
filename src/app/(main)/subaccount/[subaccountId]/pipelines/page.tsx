import { protectSubaccountRoute } from "@/actions/auth";
import {
  createPipeline,
  findFirstPipelineBysubaccountId,
} from "@/actions/pipeline";
import { redirect } from "next/navigation";

export const revalidate = 60;

export default async function Page({
  params,
}: {
  params: { subaccountId: string };
}) {
  await protectSubaccountRoute();

  const pipeline = await findFirstPipelineBysubaccountId(params.subaccountId);

  if (pipeline)
    return redirect(
      `/subaccount/${params.subaccountId}/pipelines/${pipeline.id}`
    );

  const new_pipeline = await createPipeline({
    name: "First Pipeline",
    subAccountId: params.subaccountId,
  });

  if (!new_pipeline) return redirect(`/subaccount/${params.subaccountId}/`);

  return redirect(
    `/subaccount/${params.subaccountId}/pipelines/${new_pipeline.id}`
  );
}
