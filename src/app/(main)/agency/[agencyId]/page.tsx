import { protectAgencyRoute } from "@/actions/auth";

export const revalidate = 60;

export default async function page({
  params,
}: {
  params: { agencyId: string };
}) {
  await protectAgencyRoute();

  return <div>{params.agencyId}</div>;
}
