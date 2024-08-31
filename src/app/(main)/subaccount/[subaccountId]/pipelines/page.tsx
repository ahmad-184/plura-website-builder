import { protectSubaccountRoute } from "@/actions/auth";
import {
  createPipeline,
  findFirstPipelineBysubaccountId,
  getPipeline,
} from "@/actions/pipeline";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const revalidate = 60;

export default async function Page({
  params,
}: {
  params: { subaccountId: string };
}) {
  await protectSubaccountRoute(params.subaccountId);

  const cookieStore = cookies();

  const storedPipelineId = cookieStore.get("pipeline_id");

  if (storedPipelineId?.value) {
    const pipeline_exist = await getPipeline(storedPipelineId?.value!);
    if (pipeline_exist?.id) {
      return redirect(
        `/subaccount/${params.subaccountId}/pipelines/${pipeline_exist?.id}`
      );
    }
  }

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
