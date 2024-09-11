import { protectEditorRoute } from "@/actions/auth";
import { getFunnel } from "@/actions/funnel";
import PageNotFound from "@/components/page-not-found";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    funnelId: string;
  };
}) {
  const funnel = await getFunnel(params.funnelId);
  if (!funnel) return <PageNotFound />;
  await protectEditorRoute(funnel.subAccountId);

  return <>{children}</>;
}
