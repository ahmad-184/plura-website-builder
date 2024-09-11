import { protectEditorRoute } from "@/actions/auth";
import { getFunnel, getFunnelPage } from "@/actions/funnel";
import PageNotFound from "@/components/page-not-found";
import { Metadata } from "next";
import Navigation from "./_components/navigation";
import EditorRealtime from "./_components/editor-realtime";
import { EditorStoreProvider } from "@/providers/editor-store-provider";
import EditorSidebar from "./_components/editor-sidebar";
import EditorPage from "./_components/editor-page";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: { funnelId: string; funnelPageId: string };
}): Promise<Metadata> {
  const funnel = await getFunnel(params.funnelId);
  const pageDetails = await getFunnelPage(params.funnelPageId);

  return {
    title: `${funnel?.name || "Plura"} ${
      pageDetails?.name ? `- ${pageDetails?.name}` : ""
    }`,
    icons: {
      icon: {
        url: funnel?.favicon || "/favicon.ico",
      },
    },
  };
}

export default async function Layout({
  params,
  children,
}: {
  params: { funnelId: string; funnelPageId: string };
  children: React.ReactNode;
}) {
  const funnel = await getFunnel(params.funnelId);
  const pageDetails = await getFunnelPage(params.funnelPageId);
  if (!pageDetails || !funnel) return <PageNotFound />;

  await protectEditorRoute(funnel.subAccountId);

  return (
    <EditorStoreProvider>
      <EditorRealtime
        funnelId={funnel.id}
        pageDetails={pageDetails}
        subaccountId={funnel.subAccountId}
      >
        <div className="">
          <Navigation />
          <EditorSidebar />
          <EditorPage />
          {/* <div className="flex z-50 justify-center items-center absolute inset-0 top-0 left-0 bottom-0 right-0 lg:hidden dark:bg-slate-900 bg-gray-100">
            <p className="text-4xl text-center">
              Editor page not responsive for small screens
            </p>
          </div> */}
        </div>
      </EditorRealtime>
    </EditorStoreProvider>
  );
}
